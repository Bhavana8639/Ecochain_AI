import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { Supplier, EmissionRecord, UserProfile } from '../types';

// Mock Initial Data for immediate demo usage if empty
export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-101',
    name: 'Apex Metals & Manufacturing',
    code: 'SUP-APX-01',
    country: 'Germany',
    category: 'Raw Steel',
    tier: 'Tier 1',
    contactEmail: 'sustainability@apexmetals.de',
    contactPhone: '+49 30 123456',
    status: 'Active',
    riskLevel: 'High',
    totalEmissionsTons: 142.5,
    lastAuditDate: '2026-03-15',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z'
  },
  {
    id: 'sup-102',
    name: 'EcoPack Global Packaging',
    code: 'SUP-EPG-02',
    country: 'Netherlands',
    category: 'Paper & Cardboard',
    tier: 'Tier 1',
    contactEmail: 'info@ecopackglobal.nl',
    contactPhone: '+31 20 987654',
    status: 'Active',
    riskLevel: 'Low',
    totalEmissionsTons: 18.2,
    lastAuditDate: '2026-05-20',
    createdAt: '2026-01-12T09:30:00Z',
    updatedAt: '2026-05-20T11:00:00Z'
  },
  {
    id: 'sup-103',
    name: 'SinoTech Polymer Corp',
    code: 'SUP-STP-03',
    country: 'Vietnam',
    category: 'Plastics (PET/PP)',
    tier: 'Tier 2',
    contactEmail: 'contact@sinotechpoly.vn',
    contactPhone: '+84 28 333444',
    status: 'Under Audit',
    riskLevel: 'Critical',
    totalEmissionsTons: 215.8,
    lastAuditDate: '2026-02-10',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-06-15T14:00:00Z'
  },
  {
    id: 'sup-104',
    name: 'Nordic Clean Aluminum AB',
    code: 'SUP-NCA-04',
    country: 'Sweden',
    category: 'Aluminum',
    tier: 'Tier 1',
    contactEmail: 'esg@nordicaluminum.se',
    contactPhone: '+46 8 555666',
    status: 'Active',
    riskLevel: 'Low',
    totalEmissionsTons: 34.6,
    lastAuditDate: '2026-04-18',
    createdAt: '2026-02-15T11:20:00Z',
    updatedAt: '2026-04-18T16:00:00Z'
  },
  {
    id: 'sup-105',
    name: 'TransContinental Air Freight Logistics',
    code: 'SUP-TCA-05',
    country: 'Singapore',
    category: 'General Freight',
    tier: 'Tier 3',
    contactEmail: 'ops@transcontinental.sg',
    contactPhone: '+65 6789 0123',
    status: 'Active',
    riskLevel: 'High',
    totalEmissionsTons: 88.4,
    lastAuditDate: '2026-01-25',
    createdAt: '2026-03-01T08:15:00Z',
    updatedAt: '2026-06-10T12:00:00Z'
  }
];

export const INITIAL_EMISSIONS: EmissionRecord[] = [
  {
    id: 'em-001',
    supplierId: 'sup-101',
    supplierName: 'Apex Metals & Manufacturing',
    materialCategory: 'Raw Steel',
    category: 'Category 1: Purchased Goods & Services',
    quantityKg: 50000,
    weightTons: 50,
    transportMode: 'Road Freight (Truck)',
    distanceKm: 850,
    date: '2026-07-05',
    co2EmissionsTons: 96.96, // (50000*1.85 + 50*850*0.105)/1000 = 92.5 + 4.46 = 96.96
    notes: 'Q3 Structural steel shipment for automotive chassis line.',
    flaggedHighEmission: true,
    createdAt: '2026-07-05T10:00:00Z'
  },
  {
    id: 'em-002',
    supplierId: 'sup-102',
    supplierName: 'EcoPack Global Packaging',
    materialCategory: 'Paper & Cardboard',
    category: 'Category 1: Purchased Goods & Services',
    quantityKg: 12000,
    weightTons: 12,
    transportMode: 'Rail Freight',
    distanceKm: 420,
    date: '2026-07-12',
    co2EmissionsTons: 11.54,
    notes: 'FSC certified corrugated boxes for export shipment packaging.',
    flaggedHighEmission: false,
    createdAt: '2026-07-12T14:20:00Z'
  },
  {
    id: 'em-003',
    supplierId: 'sup-103',
    supplierName: 'SinoTech Polymer Corp',
    materialCategory: 'Plastics (PET/PP)',
    category: 'Category 4: Upstream Transportation & Distribution',
    quantityKg: 35000,
    weightTons: 35,
    transportMode: 'Sea Freight (Container)',
    distanceKm: 9800,
    date: '2026-07-18',
    co2EmissionsTons: 92.99,
    notes: 'Polypropylene resin pellets shipped via ocean container.',
    flaggedHighEmission: true,
    createdAt: '2026-07-18T09:10:00Z'
  },
  {
    id: 'em-004',
    supplierId: 'sup-104',
    supplierName: 'Nordic Clean Aluminum AB',
    materialCategory: 'Aluminum',
    category: 'Category 1: Purchased Goods & Services',
    quantityKg: 8000,
    weightTons: 8,
    transportMode: 'Rail Freight',
    distanceKm: 1200,
    date: '2026-07-22',
    co2EmissionsTons: 71.47,
    notes: 'Hydro-powered recycled aluminum extrusion billets.',
    flaggedHighEmission: true,
    createdAt: '2026-07-22T11:45:00Z'
  },
  {
    id: 'em-005',
    supplierId: 'sup-105',
    supplierName: 'TransContinental Air Freight Logistics',
    materialCategory: 'Electronics',
    category: 'Category 4: Upstream Transportation & Distribution',
    quantityKg: 2500,
    weightTons: 2.5,
    transportMode: 'Air Freight',
    distanceKm: 6500,
    date: '2026-07-28',
    co2EmissionsTons: 50.36, // (2500*12.8 + 2.5*6500*1.13)/1000 = 32.0 + 18.36 = 50.36
    notes: 'Urgent micro-controller PCB components via air freight.',
    flaggedHighEmission: true,
    createdAt: '2026-07-28T16:30:00Z'
  },
  {
    id: 'em-006',
    supplierId: 'sup-101',
    supplierName: 'Apex Metals & Manufacturing',
    materialCategory: 'Raw Steel',
    category: 'Category 1: Purchased Goods & Services',
    quantityKg: 22000,
    weightTons: 22,
    transportMode: 'Road Freight (Truck)',
    distanceKm: 600,
    date: '2026-08-02',
    co2EmissionsTons: 42.09,
    notes: 'August baseline steel coil batch.',
    flaggedHighEmission: true,
    createdAt: '2026-08-02T08:00:00Z'
  }
];

// Helper functions for LocalStorage fallback
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from LocalStorage:`, err);
    return defaultValue;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error setting ${key} in LocalStorage:`, err);
  }
};

/* ================= SUPPLIERS SERVICE ================= */
export const supplierService = {
  async getAll(): Promise<Supplier[]> {
    if (isFirebaseConfigured) {
      try {
        const querySnapshot = await getDocs(collection(db, 'suppliers'));
        if (!querySnapshot.empty) {
          return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Supplier));
        }
      } catch (e) {
        console.warn('Firestore fetch suppliers failed, using fallback storage:', e);
      }
    }
    return getStorageItem<Supplier[]>('ecochain_suppliers', INITIAL_SUPPLIERS);
  },

  async add(supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supplier> {
    const newId = 'sup-' + Date.now().toString().slice(-6);
    const now = new Date().toISOString();
    const newSupplier: Supplier = {
      ...supplier,
      id: newId,
      createdAt: now,
      updatedAt: now,
      totalEmissionsTons: supplier.totalEmissionsTons || 0,
    };

    if (isFirebaseConfigured) {
      try {
        const docRef = await addDoc(collection(db, 'suppliers'), newSupplier);
        newSupplier.id = docRef.id;
      } catch (e) {
        console.warn('Firestore add supplier failed, using storage:', e);
      }
    }

    const current = getStorageItem<Supplier[]>('ecochain_suppliers', INITIAL_SUPPLIERS);
    setStorageItem('ecochain_suppliers', [newSupplier, ...current]);
    return newSupplier;
  },

  async update(id: string, updates: Partial<Supplier>): Promise<void> {
    const now = new Date().toISOString();
    if (isFirebaseConfigured) {
      try {
        const docRef = doc(db, 'suppliers', id);
        await updateDoc(docRef, { ...updates, updatedAt: now });
      } catch (e) {
        console.warn('Firestore update supplier failed:', e);
      }
    }

    const current = getStorageItem<Supplier[]>('ecochain_suppliers', INITIAL_SUPPLIERS);
    const updatedList = current.map(item => item.id === id ? { ...item, ...updates, updatedAt: now } : item);
    setStorageItem('ecochain_suppliers', updatedList);
  },

  async delete(id: string): Promise<void> {
    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'suppliers', id));
      } catch (e) {
        console.warn('Firestore delete supplier failed:', e);
      }
    }

    const current = getStorageItem<Supplier[]>('ecochain_suppliers', INITIAL_SUPPLIERS);
    const filtered = current.filter(item => item.id !== id);
    setStorageItem('ecochain_suppliers', filtered);
  }
};

/* ================= EMISSIONS SERVICE ================= */
export const emissionService = {
  async getAll(): Promise<EmissionRecord[]> {
    if (isFirebaseConfigured) {
      try {
        const querySnapshot = await getDocs(collection(db, 'emissions'));
        if (!querySnapshot.empty) {
          return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmissionRecord));
        }
      } catch (e) {
        console.warn('Firestore fetch emissions failed, using fallback storage:', e);
      }
    }
    return getStorageItem<EmissionRecord[]>('ecochain_emissions', INITIAL_EMISSIONS);
  },

  async add(record: Omit<EmissionRecord, 'id' | 'createdAt'>): Promise<EmissionRecord> {
    const newId = 'em-' + Date.now().toString().slice(-6);
    const now = new Date().toISOString();
    const newRecord: EmissionRecord = {
      ...record,
      id: newId,
      createdAt: now,
    };

    if (isFirebaseConfigured) {
      try {
        const docRef = await addDoc(collection(db, 'emissions'), newRecord);
        newRecord.id = docRef.id;
      } catch (e) {
        console.warn('Firestore add emission record failed, using storage:', e);
      }
    }

    const current = getStorageItem<EmissionRecord[]>('ecochain_emissions', INITIAL_EMISSIONS);
    const updatedEmissions = [newRecord, ...current];
    setStorageItem('ecochain_emissions', updatedEmissions);

    // Automatically recalculate supplier total emissions
    const suppliers = getStorageItem<Supplier[]>('ecochain_suppliers', INITIAL_SUPPLIERS);
    const supplierToUpdate = suppliers.find(s => s.id === record.supplierId);
    if (supplierToUpdate) {
      const supplierEmissionsTotal = updatedEmissions
        .filter(e => e.supplierId === record.supplierId)
        .reduce((sum, e) => sum + e.co2EmissionsTons, 0);

      await supplierService.update(record.supplierId, {
        totalEmissionsTons: Math.round(supplierEmissionsTotal * 100) / 100
      });
    }

    return newRecord;
  },

  async delete(id: string): Promise<void> {
    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'emissions', id));
      } catch (e) {
        console.warn('Firestore delete emission failed:', e);
      }
    }

    const current = getStorageItem<EmissionRecord[]>('ecochain_emissions', INITIAL_EMISSIONS);
    const filtered = current.filter(item => item.id !== id);
    setStorageItem('ecochain_emissions', filtered);
  }
};

/* ================= USER PROFILE SERVICE ================= */
export const userProfileService = {
  async getProfile(uid: string): Promise<UserProfile | null> {
    if (isFirebaseConfigured) {
      try {
        const docSnap = await getDoc(doc(db, 'users', uid));
        if (docSnap.exists()) {
          return docSnap.data() as UserProfile;
        }
      } catch (e) {
        console.warn('Firestore get profile failed:', e);
      }
    }
    return getStorageItem<UserProfile | null>(`ecochain_profile_${uid}`, {
      uid,
      email: 'demo.sme@ecochain.io',
      displayName: 'Alex Morgan',
      companyName: 'GreenTech Solutions Ltd',
      role: 'Sustainability & Supply Chain Manager',
      targetReductionPercent: 35,
      netZeroTargetYear: 2030,
      highEmissionThresholdTons: 15,
      createdAt: new Date().toISOString()
    });
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
      } catch (e) {
        console.warn('Firestore save profile failed:', e);
      }
    }
    setStorageItem(`ecochain_profile_${profile.uid}`, profile);
  }
};
