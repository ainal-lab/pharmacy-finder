from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
import random
import time

app = FastAPI(title="PharmaLocate API", description="Local Pharmacy Stock & 2-Hour Reservation API")

# --- 1. ENABLE CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. CONNECT TO LOCAL MONGODB ---
try:
    mongo_client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=2000)
    db = mongo_client["pharmalocate_db"]
    # Collections
    medicines_col = db["medicines"]
    pharmacies_col = db["pharmacies"]
    reservations_col = db["reservations"]
    restock_alerts_col = db["restock_alerts"]
    print("✅ Successfully connected to local MongoDB: pharmalocate_db")
except Exception as e:
    print("⚠️ MongoDB connection error:", e)

# --- 3. SEED INITIAL DATA (If MongoDB is empty) ---
INITIAL_MEDICINES = [
    {"id": "med-1", "name": "Paracetamol 650mg (Dolo / Calpol)", "category": "Fever & Pain Relief", "generic": "Paracetamol 650mg"},
    {"id": "med-2", "name": "Amoxicillin & Clavulanate (Augmentin 625)", "category": "Antibiotics", "generic": "Amoxicillin 500mg + Clavulanate 125mg"},
    {"id": "med-3", "name": "Human Insulin (Humalog 100 IU/ml)", "category": "Diabetes / Cold Chain", "generic": "Insulin Lispro", "coldChain": True},
    {"id": "med-4", "name": "Metformin 500mg SR (Glycomet)", "category": "Diabetes Care", "generic": "Metformin HCl 500mg"},
    {"id": "med-5", "name": "Ventolin Inhaler 100mcg", "category": "Asthma / Emergency", "generic": "Salbutamol 100mcg"},
    {"id": "med-6", "name": "Azithromycin 500mg (Azithral)", "category": "Antibiotics", "generic": "Azithromycin 500mg"}
]

INITIAL_PHARMACIES = [
    {
        "id": "store-1",
        "name": "Apollo Pharmacy 24/7",
        "address": "Ground Floor, Central Market Road",
        "distanceKm": 0.5,
        "phone": "+91 98765 43210",
        "timing": "Open 24 Hours",
        "is24Hours": True,
        "inventory": {
            "med-1": {"stock": 24, "price": 32},
            "med-2": {"stock": 8, "price": 185},
            "med-3": {"stock": 2, "price": 420},
            "med-4": {"stock": 40, "price": 54},
            "med-5": {"stock": 1, "price": 145},
            "med-6": {"stock": 0, "price": 110}  # Out of stock
        }
    },
    {
        "id": "store-2",
        "name": "MedPlus Health Mart",
        "address": "Near Metro Pillar 142, Main Commercial Ave",
        "distanceKm": 1.1,
        "phone": "+91 98450 11223",
        "timing": "8:00 AM - 11:00 PM",
        "is24Hours": False,
        "inventory": {
            "med-1": {"stock": 15, "price": 30},
            "med-2": {"stock": 2, "price": 180},
            "med-3": {"stock": 0, "price": 415},
            "med-4": {"stock": 25, "price": 52},
            "med-5": {"stock": 5, "price": 140},
            "med-6": {"stock": 12, "price": 108}
        }
    },
    {
        "id": "store-3",
        "name": "Care & Cure Chemist",
        "address": "12 Hospital Road, Opp. City General Clinic",
        "distanceKm": 1.8,
        "phone": "+91 98123 77889",
        "timing": "9:00 AM - 10:30 PM",
        "is24Hours": False,
        "inventory": {
            "med-1": {"stock": 30, "price": 31},
            "med-2": {"stock": 14, "price": 182},
            "med-3": {"stock": 6, "price": 425},
            "med-4": {"stock": 18, "price": 50},
            "med-5": {"stock": 0, "price": 142},
            "med-6": {"stock": 9, "price": 112}
        }
    }
]

def seed_database():
    try:
        if medicines_col.count_documents({}) == 0:
            medicines_col.insert_many(INITIAL_MEDICINES)
            print("🌱 Seeded medicines collection into MongoDB")
        if pharmacies_col.count_documents({}) == 0:
            pharmacies_col.insert_many(INITIAL_PHARMACIES)
            print("🌱 Seeded pharmacies collection into MongoDB")
    except Exception as e:
        print("Note: Seed check skipped or in-memory fallback:", e)

seed_database()

# --- 4. REQUEST SCHEMAS ---
class ReservationRequest(BaseModel):
    storeId: str
    medicineId: str
    patientName: str = "Online Patient"

class RestockAlertRequest(BaseModel):
    storeId: str
    medicineId: str

# --- 5. API ENDPOINTS (Connected to MongoDB) ---

@app.get("/")
def home():
    return {
        "status": "online",
        "message": "PharmaLocate Backend is running with MongoDB & FastAPI!"
    }

@app.get("/api/medicines")
def get_medicines():
    """Fetch medicines directly from MongoDB"""
    try:
        meds = list(medicines_col.find({}, {"_id": 0}))
        return meds if meds else INITIAL_MEDICINES
    except:
        return INITIAL_MEDICINES

@app.get("/api/pharmacies")
def get_pharmacies():
    """Fetch pharmacies and real-time inventory from MongoDB"""
    try:
        stores = list(pharmacies_col.find({}, {"_id": 0}))
        return stores if stores else INITIAL_PHARMACIES
    except:
        return INITIAL_PHARMACIES

@app.post("/api/reserve")
def create_reservation(req: ReservationRequest):
    """Holds stock and stores 2-hour reservation in MongoDB"""
    try:
        store = pharmacies_col.find_one({"id": req.storeId})
    except:
        store = None

    if not store:
        # Fallback to in-memory if MongoDB not running
        store = next((s for s in INITIAL_PHARMACIES if s["id"] == req.storeId), None)

    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    item = store["inventory"].get(req.medicineId)
    if not item or item["stock"] <= 0:
        raise HTTPException(status_code=400, detail="Medicine is out of stock")

    # 1. Decrement stock in MongoDB
    try:
        pharmacies_col.update_one(
            {"id": req.storeId},
            {"$inc": {f"inventory.{req.medicineId}.stock": -1}}
        )
    except Exception as e:
        print("DB update error, local fallback:", e)

    # 2. Create reservation document
    token = f"RX-{random.randint(1000, 9999)}"
    med = next((m for m in INITIAL_MEDICINES if m["id"] == req.medicineId), {"name": "Prescribed Medicine"})

    reservation = {
        "id": f"res-{int(time.time())}",
        "token": token,
        "storeId": req.storeId,
        "storeName": store["name"],
        "storeAddress": store["address"],
        "storePhone": store["phone"],
        "medicineName": med["name"],
        "price": item["price"],
        "patientName": req.patientName,
        "createdAt": int(time.time()),
        "expiresInSeconds": 7200 # 2-hour hold
    }

    # 3. Save reservation into MongoDB
    try:
        reservations_col.insert_one(reservation.copy())
    except:
        pass

    return {"success": True, "reservation": reservation}

@app.post("/api/restock-alert")
def trigger_restock_alert(req: RestockAlertRequest):
    """Stores out-of-stock restock demand in MongoDB"""
    med = next((m for m in INITIAL_MEDICINES if m["id"] == req.medicineId), None)
    store = next((s for s in INITIAL_PHARMACIES if s["id"] == req.storeId), None)

    alert = {
        "id": f"alert-{int(time.time())}",
        "storeId": req.storeId,
        "storeName": store["name"] if store else "Local Pharmacy",
        "medicineId": req.medicineId,
        "medicineName": med["name"] if med else "Medicine",
        "time": "Just now",
        "status": "pending"
    }

    try:
        restock_alerts_col.insert_one(alert.copy())
    except Exception as e:
        print("MongoDB alert error:", e)

    return {"success": True, "alert": alert, "message": "Pharmacy owner alerted to order restock!"}