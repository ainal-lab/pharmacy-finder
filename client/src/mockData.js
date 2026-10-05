export const INITIAL_MEDICINES = [
  {
    id: 'med-1',
    name: 'Paracetamol 650mg (Dolo / Calpol)',
    category: 'Fever & Pain Relief',
    form: 'Strip of 15 Tablets',
    genericName: 'Paracetamol 650mg'
  },
  {
    id: 'med-2',
    name: 'Amoxicillin & Clavulanate (Augmentin 625 Duo)',
    category: 'Antibiotics',
    form: 'Strip of 10 Tablets',
    genericName: 'Amoxicillin 500mg + Clavulanic Acid 125mg'
  },
  {
    id: 'med-3',
    name: 'Human Insulin (Humalog 100 IU/ml)',
    category: 'Diabetes / Cold Storage',
    form: 'Cartridge (3ml)',
    genericName: 'Insulin Lispro',
    coldChain: true
  },
  {
    id: 'med-4',
    name: 'Metformin 500mg SR (Glycomet)',
    category: 'Diabetes Care',
    form: 'Strip of 20 Tablets',
    genericName: 'Metformin Hydrochloride 500mg'
  },
  {
    id: 'med-5',
    name: 'Ventolin Inhaler 100mcg',
    category: 'Emergency Respiratory / Asthma',
    form: 'Inhaler (200 actuations)',
    genericName: 'Salbutamol 100mcg'
  },
  {
    id: 'med-6',
    name: 'Azithromycin 500mg (Azithral)',
    category: 'Antibiotics',
    form: 'Strip of 5 Tablets',
    genericName: 'Azithromycin 500mg'
  }
];

export const INITIAL_PHARMACIES = [
  {
    id: 'store-1',
    name: 'Apollo Pharmacy 24/7',
    address: 'Ground Floor, Central Market Road',
    distanceKm: 0.5,
    phone: '+91 98765 43210',
    timing: 'Open 24 Hours',
    is24Hours: true,
    inventory: {
      'med-1': { stock: 24, price: 32 },
      'med-2': { stock: 8, price: 185 },
      'med-3': { stock: 2, price: 420 }, // Low Stock!
      'med-4': { stock: 40, price: 54 },
      'med-5': { stock: 1, price: 145 }, // Low Stock!
      'med-6': { stock: 0, price: 110 }  // Out of Stock!
    }
  },
  {
    id: 'store-2',
    name: 'MedPlus Health Mart',
    address: 'Near Metro Pillar 142, Main Commercial Ave',
    distanceKm: 1.1,
    phone: '+91 98450 11223',
    timing: '8:00 AM - 11:00 PM',
    is24Hours: false,
    inventory: {
      'med-1': { stock: 15, price: 30 },
      'med-2': { stock: 2, price: 180 }, // Low Stock
      'med-3': { stock: 0, price: 415 }, // Out of Stock
      'med-4': { stock: 25, price: 52 },
      'med-5': { stock: 5, price: 140 },
      'med-6': { stock: 12, price: 108 }
    }
  },
  {
    id: 'store-3',
    name: 'Care & Cure Chemist',
    address: '12 Hospital Road, Opp. City General Clinic',
    distanceKm: 1.8,
    phone: '+91 98123 77889',
    timing: '9:00 AM - 10:30 PM',
    is24Hours: false,
    inventory: {
      'med-1': { stock: 30, price: 31 },
      'med-2': { stock: 14, price: 182 },
      'med-3': { stock: 6, price: 425 },
      'med-4': { stock: 18, price: 50 },
      'med-5': { stock: 0, price: 142 }, // Out of Stock
      'med-6': { stock: 9, price: 112 }
    }
  }
];