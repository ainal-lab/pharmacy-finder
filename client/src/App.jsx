import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Clock, Phone, CheckCircle, AlertCircle, 
  XCircle, Upload, ShieldCheck, X, Printer, Navigation, Store, BellRing, PackageCheck
} from 'lucide-react';
import { INITIAL_MEDICINES, INITIAL_PHARMACIES } from './mockData';

// --- 1. POPUP: 2-HOUR LIVE COUNTDOWN VOUCHER ---
function VoucherModal({ reservation, onClose, onCancel }) {
  if (!reservation) return null;

  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours = 7200s

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-black text-xs">
              Rx
            </span>
            <h3 className="font-bold text-base text-slate-900">2-Hour Reservation Voucher</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-center mb-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Counter Claim Token</p>
          <p className="font-mono text-3xl font-black text-slate-900 my-1">{reservation.token}</p>
          
          <div className="inline-flex items-center space-x-1.5 bg-white border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 shadow-sm mt-1">
            <Clock className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Stock Held For:</span>
            <span className="font-mono text-emerald-700">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-2 mb-4">
          <div className="flex justify-between font-bold text-slate-900 pb-1 border-b border-slate-200">
            <span>{reservation.medicineName}</span>
            <span>₹{reservation.price}</span>
          </div>
          <p className="text-slate-700 font-semibold">📍 {reservation.storeName}</p>
          <p className="text-slate-500">{reservation.storeAddress}</p>
          <p className="text-slate-500">📞 {reservation.storePhone}</p>
          <p className="text-slate-500">Reserved for: <strong>{reservation.patientName}</strong></p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 mb-4">
          <strong>Counter Pickup:</strong> Present Token Code <code className="bg-amber-100 font-mono px-1 rounded">{reservation.token}</code> and your paper prescription at the pharmacy counter.
        </div>

        <div className="flex items-center justify-between pt-1">
          <button onClick={onCancel} className="text-xs text-red-600 hover:text-red-800 font-semibold underline">
            Cancel Hold
          </button>
          <div className="flex space-x-2">
            <button 
              onClick={() => window.print()}
              className="flex items-center space-x-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button 
              onClick={onClose} 
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 2. POPUP: PRESCRIPTION UPLOAD (Option 1) ---
function PrescriptionModal({ isOpen, onClose, onSubmitPrescription }) {
  if (!isOpen) return null;

  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const sampleSlip = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800';

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitPrescription({
      id: 'req-' + Date.now(),
      patientName: patientName || 'Walk-in Patient',
      patientPhone: patientPhone || '+91 98765 43210',
      imageUrl: sampleSlip,
      time: 'Just now'
    });
    alert('Prescription sent to nearby pharmacies! A pharmacist will verify handwriting.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
        <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
          <h3 className="font-bold text-base text-slate-800">Upload Doctor's Prescription</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 mb-4 flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>100% Human Verified:</strong> A registered pharmacist reads the doctor's handwriting to avoid mistakes.
          </span>
        </div>

        <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 mb-4 text-center">
          <p className="text-xs text-slate-500 mb-2 font-medium">Prescription Slip Attached:</p>
          <img src={sampleSlip} alt="Prescription" className="w-full h-36 object-cover rounded-lg border border-slate-200 shadow-sm" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Your Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Phone Number</label>
            <input
              type="tel"
              required
              placeholder="e.g. 98765 43210"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm">
              Send to Chemists
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- 3. INTERACTIVE PHARMACY MAP ---
function MapView({ pharmacies, selectedMedicine, selectedStore, onSelectStore }) {
  const pinPositions = [
    { top: '25%', left: '30%' },
    { top: '22%', left: '72%' },
    { top: '72%', left: '35%' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[480px]">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 font-bold text-slate-700">
          <Navigation className="w-3.5 h-3.5 text-emerald-600" />
          <span>Interactive Pharmacy Map</span>
        </div>
        <div className="flex items-center space-x-2 text-[10px]">
          <span className="text-emerald-700 font-bold">● Stock</span>
          <span className="text-amber-600 font-bold">● Low</span>
          <span className="text-red-500 font-bold">● Out</span>
        </div>
      </div>

      <div className="flex-1 bg-slate-100 relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-70"></div>
        <div className="absolute top-1/3 left-0 right-0 h-3 bg-slate-200 rotate-2"></div>
        <div className="absolute top-2/3 left-0 right-0 h-3 bg-slate-200 -rotate-2"></div>
        <div className="absolute left-1/2 top-0 bottom-0 w-3 bg-slate-200"></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
          <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md mx-auto"></div>
          <span className="bg-blue-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow mt-1 inline-block">
            You
          </span>
        </div>

        {pharmacies.map((store, index) => {
          const item = store.inventory[selectedMedicine.id];
          const stock = item ? item.stock : 0;
          const isSelected = selectedStore?.id === store.id;
          const pos = pinPositions[index % pinPositions.length];

          return (
            <div
              key={store.id}
              onClick={() => onSelectStore(store)}
              style={{ top: pos.top, left: pos.left }}
              className={`absolute -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-200 z-20 ${
                isSelected ? 'scale-110 z-30' : 'hover:scale-105'
              }`}
            >
              <div className={`px-2 py-1 rounded-lg shadow-md border text-[11px] font-bold flex items-center space-x-1 ${
                isSelected ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-emerald-400' : 'bg-white text-slate-800 border-slate-200'
              }`}>
                <Store className="w-3 h-3 text-emerald-500" />
                <span>{store.name.split(' ')[0]}</span>
                <span className={`text-[10px] ${
                  stock > 3 ? 'text-emerald-400' : stock > 0 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  ({stock})
                </span>
              </div>
              <div className={`w-2.5 h-2.5 rotate-45 mx-auto -mt-1 ${
                isSelected ? 'bg-slate-900' : 'bg-white'
              }`}></div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-white border-t border-slate-200 text-xs flex justify-between items-center">
        <div>
          <span className="font-bold text-slate-800">{selectedStore?.name}</span>
          <span className="text-slate-500 ml-1">({selectedStore?.distanceKm} km away)</span>
        </div>
        <span className="text-emerald-600 font-semibold">Click pin to select</span>
      </div>
    </div>
  );
}

// --- 4. MAIN APP ---
export default function App() {
  const [medicines] = useState(INITIAL_MEDICINES);
  const [pharmacies, setPharmacies] = useState(INITIAL_PHARMACIES);
  const [selectedMedicine, setSelectedMedicine] = useState(INITIAL_MEDICINES[0]);
  const [selectedStore, setSelectedStore] = useState(INITIAL_PHARMACIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState('patient');
  
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeVoucher, setActiveVoucher] = useState(null);
  const [prescriptionRequests, setPrescriptionRequests] = useState([]);
  const [reservations, setReservations] = useState([]);

  // --- YOUR NEW FEATURE: Restock Alerts State ---
  const [restockAlerts, setRestockAlerts] = useState([
    {
      id: 'alert-sample-1',
      medicineId: 'med-6',
      medicineName: 'Azithromycin 500mg (Azithral)',
      storeId: 'store-1',
      storeName: 'Apollo Pharmacy 24/7',
      time: '5 mins ago',
      status: 'pending' // 'pending' or 'ordered'
    }
  ]);
  const [userRequestedRestock, setUserRequestedRestock] = useState({});

  const filteredMedicines = medicines.filter((med) =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reserve clicked
  const handleReserve = (store) => {
    const item = store.inventory[selectedMedicine.id];
    if (!item || item.stock <= 0) return;

    const token = 'RX-' + Math.floor(1000 + Math.random() * 9000);
    const newReservation = {
      id: 'res-' + Date.now(),
      token: token,
      storeName: store.name,
      storeAddress: store.address,
      storePhone: store.phone,
      medicineName: selectedMedicine.name,
      price: item.price,
      patientName: 'Self (Online Patient)'
    };

    setPharmacies(prev => prev.map(s => {
      if (s.id === store.id) {
        return {
          ...s,
          inventory: {
            ...s.inventory,
            [selectedMedicine.id]: {
              ...s.inventory[selectedMedicine.id],
              stock: Math.max(0, s.inventory[selectedMedicine.id].stock - 1)
            }
          }
        };
      }
      return s;
    }));

    setReservations([newReservation, ...reservations]);
    setActiveVoucher(newReservation);
  };

  const handleCancelReservation = (token) => {
    setReservations(reservations.filter(r => r.token !== token));
    setActiveVoucher(null);
  };

  const handlePharmacistAccept = (req, store) => {
    const token = 'RX-' + Math.floor(1000 + Math.random() * 9000);
    const newRes = {
      id: 'res-' + Date.now(),
      token: token,
      storeName: store.name,
      storeAddress: store.address,
      storePhone: store.phone,
      medicineName: 'Prescription Items (Bundle)',
      price: 215,
      patientName: req.patientName
    };

    setReservations([newRes, ...reservations]);
    setPrescriptionRequests(prescriptionRequests.filter(r => r.id !== req.id));
    setActiveVoucher(newRes);
  };

  // --- PATIENT CLICKS "NOTIFY PHARMACY TO RESTOCK" ---
  const handleRequestRestock = (store, medicine) => {
    const alertKey = `${store.id}-${medicine.id}`;
    setUserRequestedRestock({ ...userRequestedRestock, [alertKey]: true });

    const newAlert = {
      id: 'alert-' + Date.now(),
      medicineId: medicine.id,
      medicineName: medicine.name,
      storeId: store.id,
      storeName: store.name,
      time: 'Just now',
      status: 'pending'
    };

    setRestockAlerts([newAlert, ...restockAlerts]);
    alert(`We notified ${store.name} that you need ${medicine.name}! Estimated restock in ~2 hours.`);
  };

  // --- PHARMACIST CLICKS "ORDER FROM DISTRIBUTOR" ---
  const handleOrderRestock = (alertItem) => {
    // 1. Mark alert as ordered
    setRestockAlerts(restockAlerts.map(a => a.id === alertItem.id ? { ...a, status: 'ordered' } : a));

    // 2. Refill the store stock with fresh supply (e.g. 15 strips)!
    setPharmacies(prev => prev.map(s => {
      if (s.id === alertItem.storeId) {
        return {
          ...s,
          inventory: {
            ...s.inventory,
            [alertItem.medicineId]: {
              ...s.inventory[alertItem.medicineId],
              stock: 15
            }
          }
        };
      }
      return s;
    }));

    alert(`Order dispatched to distributor! ${alertItem.medicineName} is now restocked (+15 units) for patients.`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 font-sans">
      
      {/* Header */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💊</span>
            <h1 className="text-2xl font-bold text-slate-800">PharmaLocate</h1>
          </div>
          <p className="text-xs text-slate-500">
            Real-time local medicine availability & 2-hour stock reservation
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-200 p-1 rounded-xl">
          <button
            onClick={() => setCurrentView('patient')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              currentView === 'patient' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Patient Search {reservations.length > 0 && `(${reservations.length})`}
          </button>
          <button
            onClick={() => setCurrentView('pharmacist')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              currentView === 'pharmacist' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            Pharmacist Portal {
              (prescriptionRequests.length + restockAlerts.filter(a => a.status === 'pending').length) > 0 && 
              `(${prescriptionRequests.length + restockAlerts.filter(a => a.status === 'pending').length} Alerts)`
            }
          </button>
        </div>
      </header>

      {/* Active Hold Banner */}
      {reservations.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl mb-6 flex justify-between items-center shadow-sm">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              ⏱️ Active 2-Hour Reservation Hold
            </span>
            <p className="text-sm text-emerald-950 font-bold">
              {reservations[0].medicineName} at {reservations[0].storeName}
            </p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Claim Token: <strong className="font-mono bg-emerald-200 px-1 rounded">{reservations[0].token}</strong>
            </p>
          </div>
          <button 
            onClick={() => setActiveVoucher(reservations[0])}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm"
          >
            View Live Voucher
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. PATIENT SEARCH VIEW                                    */}
      {/* ========================================================= */}
      {currentView === 'patient' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-md">
            <div>
              <h2 className="font-bold text-base">Can't read the doctor's handwriting?</h2>
              <p className="text-xs text-emerald-100 mt-1">
                Upload your prescription slip. A local pharmacist will inspect the photo and hold your medicine.
              </p>
            </div>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 shrink-0 shadow-sm"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Upload Prescription Photo</span>
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search medicine name (e.g. Paracetamol, Insulin, Augmentin)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {filteredMedicines.map((med) => (
                <button
                  key={med.id}
                  onClick={() => setSelectedMedicine(med)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    selectedMedicine.id === med.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {med.name}
                </button>
              ))}
            </div>
          </div>

          {/* Grid: Stores List + Interactive Map */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-sm font-bold text-slate-700">
                Pharmacies stocking: <span className="text-emerald-600">{selectedMedicine.name}</span>
              </h2>

              {pharmacies.map((store) => {
                const item = store.inventory[selectedMedicine.id];
                const stock = item ? item.stock : 0;
                const price = item ? item.price : '--';
                const isSelected = selectedStore?.id === store.id;
                const alertKey = `${store.id}-${selectedMedicine.id}`;
                const alreadyRequested = userRequestedRestock[alertKey];

                return (
                  <div
                    key={store.id}
                    onClick={() => setSelectedStore(store)}
                    className={`bg-white p-4 rounded-xl border transition-all cursor-pointer shadow-sm ${
                      isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-slate-900 text-base">{store.name}</h3>
                          {store.is24Hours && (
                            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              24/7
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center space-x-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{store.address} ({store.distanceKm} km away)</span>
                        </p>
                        <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{store.timing} • 📞 {store.phone}</span>
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                        <div>
                          {stock > 3 ? (
                            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                              🟢 In Stock ({stock})
                            </span>
                          ) : stock > 0 ? (
                            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                              🟡 Low Stock ({stock} left!)
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
                              🔴 Out of Stock
                            </span>
                          )}
                          <span className="font-bold text-slate-900 text-sm ml-2">₹{price}</span>
                        </div>

                        {/* BUTTON: RESERVE OR NOTIFY RESTOCK */}
                        {stock > 0 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReserve(store);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                          >
                            Reserve for 2 Hours
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRequestRestock(store, selectedMedicine);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition ${
                              alreadyRequested 
                                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                            }`}
                          >
                            <BellRing className="w-3 h-3 text-amber-400" />
                            <span>{alreadyRequested ? '✓ Store Notified (~2h Restock)' : 'Notify Store to Restock (~2h)'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Out of Stock Notice banner inside card */}
                    {stock === 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-amber-800 bg-amber-50/70 px-2 py-1 rounded-md">
                        <span>⏳ Out of stock: Pharmacy owner will be notified to order supply. Restock in ~2 hours.</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-5 sticky top-6 self-start">
              <MapView 
                pharmacies={pharmacies}
                selectedMedicine={selectedMedicine}
                selectedStore={selectedStore}
                onSelectStore={setSelectedStore}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. PHARMACIST PORTAL VIEW                                 */}
      {/* ========================================================= */}
      {currentView === 'pharmacist' && (
        <div className="space-y-6">
          
          {/* Pharmacist Header */}
          <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white rounded-2xl p-6 shadow-md flex justify-between items-center">
            <div>
              <span className="text-teal-300 text-xs font-bold uppercase tracking-wider">Store Counter Portal</span>
              <h2 className="text-2xl font-black mt-1">Apollo Pharmacy 24/7</h2>
              <p className="text-xs text-slate-300">Ground Floor, Central Market Road</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-teal-300 block">Pending Demand Alerts</span>
              <span className="text-2xl font-black">{restockAlerts.filter(a => a.status === 'pending').length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* SECTION A: URGENT CUSTOMER RESTOCK DEMANDS (YOUR FEATURE) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <BellRing className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-slate-900 text-sm">Customer Restock Demands</h3>
                </div>
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  {restockAlerts.filter(a => a.status === 'pending').length} Items Needed
                </span>
              </div>

              {restockAlerts.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">No restock alerts right now.</p>
              ) : (
                <div className="space-y-3">
                  {restockAlerts.map((alertItem) => (
                    <div key={alertItem.id} className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-900 text-sm">{alertItem.medicineName}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                            alertItem.status === 'ordered' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-red-100 text-red-700 animate-pulse'
                          }`}>
                            {alertItem.status === 'ordered' ? 'In-Transit (~2h)' : 'Out of Stock!'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          At: <strong>{alertItem.storeName}</strong> • Patient inquiry {alertItem.time}
                        </p>
                      </div>

                      {alertItem.status === 'pending' ? (
                        <button
                          onClick={() => handleOrderRestock(alertItem)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm flex items-center space-x-1 shrink-0"
                        >
                          <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Order Restock (+15)</span>
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-700 font-bold flex items-center space-x-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Ordered</span>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION B: INCOMING PRESCRIPTION REQUESTS */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm">Prescription Verification Inquiries</h3>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  {prescriptionRequests.length} Pending
                </span>
              </div>

              {prescriptionRequests.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">No pending prescription photos.</p>
              ) : (
                <div className="space-y-3">
                  {prescriptionRequests.map((req) => (
                    <div key={req.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{req.patientName}</h4>
                          <p className="text-xs text-slate-500">📞 {req.patientPhone} • {req.time}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-slate-200">
                        <img src={req.imageUrl} alt="Prescription" className="w-14 h-12 object-cover rounded border" />
                        <span className="text-xs text-slate-600 font-medium">Prescription photo attached</span>
                      </div>

                      <div className="flex justify-end space-x-2 pt-1">
                        <button
                          onClick={() => setPrescriptionRequests(prescriptionRequests.filter(r => r.id !== req.id))}
                          className="px-3 py-1 text-xs font-bold text-slate-500"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handlePharmacistAccept(req, INITIAL_PHARMACIES[0])}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm"
                        >
                          Confirm & Hold 2h
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Modals */}
      <PrescriptionModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSubmitPrescription={(newReq) => {
          setPrescriptionRequests([newReq, ...prescriptionRequests]);
        }}
      />

      <VoucherModal
        reservation={activeVoucher}
        onClose={() => setActiveVoucher(null)}
        onCancel={() => handleCancelReservation(activeVoucher?.token)}
      />
    </div>
  );
}