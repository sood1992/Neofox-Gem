// PawTag India - Storage Service
import {
  User, Pet, Tag, ScanEvent, NotificationLog, Language,
  HealthPassport, VaccinationRecord, DewormingRecord, HealthCheckup, WeightRecord, HealthDocument, HealthReminder,
  FinderProfile, FinderBadge, RewardTransaction, FINDER_BADGES, FINDER_LEVELS,
  PetInsurance, InsuranceProvider, InsurancePlan,
  NGO, NGOReview, NGOService,
  LostPetAlert, PetSighting
} from '../types';

const STORAGE_PREFIX = 'pawtag_';
const USERS_KEY = `${STORAGE_PREFIX}users_v1`;
const PETS_KEY = `${STORAGE_PREFIX}pets_v1`;
const TAGS_KEY = `${STORAGE_PREFIX}tags_v1`;
const SCANS_KEY = `${STORAGE_PREFIX}scans_v1`;
const NOTIFICATIONS_KEY = `${STORAGE_PREFIX}notifications_v1`;
const CURRENT_USER_KEY = `${STORAGE_PREFIX}current_user`;
const HEALTH_PASSPORTS_KEY = `${STORAGE_PREFIX}health_passports_v1`;
const FINDER_PROFILES_KEY = `${STORAGE_PREFIX}finder_profiles_v1`;
const REWARD_TRANSACTIONS_KEY = `${STORAGE_PREFIX}reward_transactions_v1`;
const INSURANCE_KEY = `${STORAGE_PREFIX}insurance_v1`;
const INSURANCE_PROVIDERS_KEY = `${STORAGE_PREFIX}insurance_providers_v1`;
const NGOS_KEY = `${STORAGE_PREFIX}ngos_v1`;
const NGO_REVIEWS_KEY = `${STORAGE_PREFIX}ngo_reviews_v1`;
const LOST_ALERTS_KEY = `${STORAGE_PREFIX}lost_alerts_v1`;

// Generate unique IDs
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Generate unique tag code (for QR)
const generateTagCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Sample seed data
const SEED_USERS: User[] = [
  {
    id: 'demo-user-1',
    email: 'demo@pawtag.in',
    phone: '+919876543210',
    password: 'demo123',
    name: 'Rahul Sharma',
    address: '123, MG Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    preferredLanguage: 'en',
    notificationPreferences: {
      sms: true,
      email: true,
      whatsapp: true,
      push: true
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const SEED_TAGS: Tag[] = [
  {
    id: 'tag-1',
    code: 'PWTG001A',
    petId: 'pet-1',
    ownerId: 'demo-user-1',
    isActivated: true,
    activatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    tagType: 'premium'
  },
  {
    id: 'tag-2',
    code: 'PWTG002B',
    petId: 'pet-2',
    ownerId: 'demo-user-1',
    isActivated: true,
    activatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    tagType: 'basic'
  },
  // Unassigned tags
  {
    id: 'tag-3',
    code: 'PWTG003C',
    isActivated: false,
    createdAt: new Date().toISOString(),
    tagType: 'basic'
  },
  {
    id: 'tag-4',
    code: 'PWTG004D',
    isActivated: false,
    createdAt: new Date().toISOString(),
    tagType: 'nfc'
  }
];

const SEED_PETS: Pet[] = [
  {
    id: 'pet-1',
    ownerId: 'demo-user-1',
    tagId: 'tag-1',
    name: 'Bruno',
    type: 'dog',
    breed: 'Golden Retriever',
    gender: 'male',
    size: 'large',
    color: 'Golden',
    dateOfBirth: '2021-03-15',
    age: '3 years',
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
    personality: 'Friendly, loves to play fetch, great with kids',
    specialNeeds: 'Needs daily exercise',
    emergencyContacts: [
      {
        id: 'ec-1',
        name: 'Priya Sharma',
        phone: '+919876543211',
        relationship: 'Wife',
        isPrimary: true
      },
      {
        id: 'ec-2',
        name: 'Amit Kumar',
        phone: '+919876543212',
        relationship: 'Neighbor',
        isPrimary: false
      }
    ],
    medicalInfo: {
      allergies: ['Chicken'],
      medications: [],
      conditions: [],
      vaccinations: [
        { name: 'Rabies', date: '2024-01-15', nextDueDate: '2025-01-15' },
        { name: 'DHPP', date: '2024-02-20', nextDueDate: '2025-02-20' }
      ],
      spayedNeutered: true,
      lastVetVisit: '2024-06-15',
      notes: 'Generally healthy, regular checkups every 6 months'
    },
    vetInfo: {
      name: 'Dr. Anjali Patel',
      clinicName: 'PetCare Clinic',
      phone: '+919876543213',
      address: '45, Linking Road, Bandra, Mumbai',
      email: 'petcare@email.com'
    },
    status: 'active',
    isLost: false,
    descriptionEn: 'Bruno is a friendly Golden Retriever who loves everyone. If found, please contact immediately.',
    descriptionHi: 'ब्रूनो एक मिलनसार गोल्डन रिट्रीवर है जो सबको प्यार करता है। मिलने पर कृपया तुरंत संपर्क करें।',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'pet-2',
    ownerId: 'demo-user-1',
    tagId: 'tag-2',
    name: 'Milo',
    type: 'cat',
    breed: 'Persian',
    gender: 'male',
    size: 'medium',
    color: 'White',
    dateOfBirth: '2022-06-10',
    age: '2 years',
    photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
    personality: 'Calm, loves sleeping in sunny spots',
    emergencyContacts: [
      {
        id: 'ec-3',
        name: 'Priya Sharma',
        phone: '+919876543211',
        relationship: 'Wife',
        isPrimary: true
      }
    ],
    medicalInfo: {
      allergies: [],
      medications: [],
      conditions: [],
      vaccinations: [
        { name: 'FVRCP', date: '2024-03-10' }
      ],
      spayedNeutered: true
    },
    vetInfo: {
      name: 'Dr. Anjali Patel',
      clinicName: 'PetCare Clinic',
      phone: '+919876543213'
    },
    status: 'active',
    isLost: false,
    descriptionEn: 'Milo is a calm Persian cat. He is shy but very affectionate.',
    descriptionHi: 'मिलो एक शांत पर्शियन बिल्ली है। वह शर्मीला है लेकिन बहुत प्यारा है।',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const SEED_SCANS: ScanEvent[] = [
  {
    id: 'scan-1',
    tagId: 'tag-1',
    petId: 'pet-1',
    scannedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      accuracy: 10,
      address: 'Near Bandra Station',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India'
    },
    locationPermissionGranted: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)',
    notificationsSent: ['sms', 'email', 'whatsapp']
  },
  {
    id: 'scan-2',
    tagId: 'tag-1',
    petId: 'pet-1',
    scannedAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
    finderName: 'Vikram Singh',
    finderPhone: '+919876543299',
    finderMessage: 'Found this dog near the park. He seems healthy and happy!',
    location: {
      latitude: 19.0825,
      longitude: 72.8890,
      accuracy: 15,
      address: 'Carter Road, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India'
    },
    locationPermissionGranted: true,
    notificationsSent: ['sms', 'email', 'whatsapp']
  }
];

// Health Passport Seed Data
const SEED_HEALTH_PASSPORTS: HealthPassport[] = [
  {
    id: 'hp-1',
    petId: 'pet-1',
    vaccinations: [
      {
        id: 'vac-1',
        name: 'Rabies',
        date: '2024-01-15',
        nextDueDate: '2025-01-15',
        batchNumber: 'RAB-2024-001',
        administeredBy: 'Dr. Anjali Patel',
        clinicName: 'PetCare Clinic'
      },
      {
        id: 'vac-2',
        name: 'DHPP',
        date: '2024-02-20',
        nextDueDate: '2025-02-20',
        administeredBy: 'Dr. Anjali Patel',
        clinicName: 'PetCare Clinic'
      }
    ],
    dewormingRecords: [
      {
        id: 'dew-1',
        medicineName: 'Drontal Plus',
        date: '2024-06-01',
        nextDueDate: '2024-09-01',
        dosage: '1 tablet',
        administeredBy: 'Self'
      }
    ],
    checkups: [
      {
        id: 'chk-1',
        date: '2024-06-15',
        vetName: 'Dr. Anjali Patel',
        clinicName: 'PetCare Clinic',
        reason: 'routine',
        diagnosis: 'Healthy, no issues found',
        cost: 800,
        notes: 'Next checkup in 6 months'
      }
    ],
    weightHistory: [
      { id: 'wt-1', date: '2024-01-15', weight: 28, unit: 'kg' },
      { id: 'wt-2', date: '2024-03-15', weight: 29, unit: 'kg' },
      { id: 'wt-3', date: '2024-06-15', weight: 30, unit: 'kg' }
    ],
    documents: [],
    reminders: [
      {
        id: 'rem-1',
        title: 'Rabies Vaccination Due',
        type: 'vaccination',
        dueDate: '2025-01-15',
        isCompleted: false,
        notifyBefore: 7
      },
      {
        id: 'rem-2',
        title: 'Deworming Due',
        type: 'deworming',
        dueDate: '2024-09-01',
        isCompleted: false,
        notifyBefore: 3
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// NGO Seed Data
const SEED_NGOS: NGO[] = [
  {
    id: 'ngo-1',
    name: 'Paws & Care Foundation',
    type: 'shelter',
    logo: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=100',
    phone: '+919876500001',
    email: 'contact@pawscare.org',
    website: 'https://pawscare.org',
    whatsapp: '+919876500001',
    address: '45, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400069',
    description: 'A no-kill shelter providing care and rehabilitation for abandoned dogs and cats. We have been serving since 2010.',
    services: ['shelter', 'adoption', 'medical', 'vaccination', 'sterilization', 'rescue'],
    operatingHours: '9:00 AM - 6:00 PM (Mon-Sat)',
    isVerified: true,
    registrationNumber: 'NGO-MH-2010-1234',
    petsRescued: 5000,
    petsAdopted: 3500,
    socialLinks: {
      facebook: 'https://facebook.com/pawscare',
      instagram: 'https://instagram.com/pawscare'
    },
    rating: 4.8,
    reviewCount: 245,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ngo-2',
    name: 'Stray Animal Welfare Trust',
    type: 'rescue',
    phone: '+919876500002',
    email: 'help@sawt.org',
    address: '123, Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
    description: 'Dedicated to rescuing and rehabilitating stray animals across Bangalore. 24/7 emergency rescue available.',
    services: ['rescue', 'ambulance', 'medical', 'sterilization', 'lost-found'],
    operatingHours: '24/7 Emergency, Office: 10:00 AM - 5:00 PM',
    isVerified: true,
    registrationNumber: 'NGO-KA-2015-5678',
    petsRescued: 8000,
    rating: 4.6,
    reviewCount: 189,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ngo-3',
    name: 'Happy Tails Adoption Center',
    type: 'adoption',
    phone: '+919876500003',
    email: 'adopt@happytails.in',
    website: 'https://happytails.in',
    address: '78, Sector 15',
    city: 'Gurgaon',
    state: 'Haryana',
    pincode: '122001',
    description: 'We find loving homes for rescued pets. All our animals are vaccinated, sterilized, and ready for adoption.',
    services: ['adoption', 'foster', 'vaccination', 'training'],
    operatingHours: '11:00 AM - 7:00 PM (All days)',
    isVerified: true,
    petsAdopted: 2000,
    rating: 4.9,
    reviewCount: 312,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ngo-4',
    name: 'Pet Emergency Hospital',
    type: 'hospital',
    phone: '+919876500004',
    email: 'emergency@pethospital.in',
    address: '56, Anna Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    description: 'Full-service veterinary hospital with emergency care, surgery, and ICU facilities for pets.',
    services: ['medical', 'ambulance'],
    operatingHours: '24/7',
    isVerified: true,
    rating: 4.7,
    reviewCount: 456,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ngo-5',
    name: 'Blue Cross of India',
    type: 'ngo',
    phone: '+919876500005',
    email: 'info@bluecross.org.in',
    website: 'https://bluecross.org.in',
    address: '1A, Eldams Road, Alwarpet',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600018',
    description: 'One of India\'s oldest and largest animal welfare organizations, providing comprehensive animal care services.',
    services: ['rescue', 'shelter', 'adoption', 'medical', 'ambulance', 'sterilization', 'burial'],
    operatingHours: '8:00 AM - 8:00 PM',
    isVerified: true,
    registrationNumber: 'NGO-TN-1964-0001',
    petsRescued: 50000,
    petsAdopted: 15000,
    rating: 4.5,
    reviewCount: 892,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Insurance Provider Seed Data
const SEED_INSURANCE_PROVIDERS: InsuranceProvider[] = [
  {
    id: 'ins-prov-1',
    name: 'PetSecure India',
    logo: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=100',
    description: 'India\'s leading pet insurance provider with comprehensive coverage options.',
    website: 'https://petsecure.in',
    phone: '+911800123456',
    email: 'support@petsecure.in',
    plans: [
      {
        id: 'plan-1',
        name: 'Basic Care',
        type: 'basic',
        monthlyPremium: 299,
        annualPremium: 2999,
        coverageAmount: 50000,
        deductible: 1000,
        features: ['Accident coverage', 'Emergency hospitalization', '24/7 helpline'],
        exclusions: ['Pre-existing conditions', 'Routine checkups', 'Dental care']
      },
      {
        id: 'plan-2',
        name: 'Standard Protection',
        type: 'standard',
        monthlyPremium: 599,
        annualPremium: 5999,
        coverageAmount: 100000,
        deductible: 500,
        features: ['Accident & illness', 'Surgery coverage', 'Hospitalization', 'Diagnostic tests', '24/7 helpline'],
        exclusions: ['Pre-existing conditions', 'Cosmetic procedures']
      },
      {
        id: 'plan-3',
        name: 'Premium Plus',
        type: 'premium',
        monthlyPremium: 999,
        annualPremium: 9999,
        coverageAmount: 200000,
        deductible: 0,
        features: ['Complete medical coverage', 'Preventive care', 'Vaccinations', 'Annual checkup', 'Lost pet reward', 'Third party liability'],
        exclusions: ['Experimental treatments']
      }
    ],
    rating: 4.4,
    reviewCount: 1250
  },
  {
    id: 'ins-prov-2',
    name: 'Bajaj Pet Insurance',
    logo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100',
    description: 'Trusted insurance from Bajaj Allianz with easy claim process.',
    website: 'https://bajajpetinsurance.in',
    phone: '+911800654321',
    email: 'pet@bajajinsurance.in',
    plans: [
      {
        id: 'plan-4',
        name: 'Pet Shield Basic',
        type: 'basic',
        monthlyPremium: 349,
        annualPremium: 3499,
        coverageAmount: 75000,
        deductible: 750,
        features: ['Accident coverage', 'OPD expenses', 'Online claims'],
        exclusions: ['Pre-existing conditions', 'Breeding costs']
      },
      {
        id: 'plan-5',
        name: 'Pet Shield Comprehensive',
        type: 'comprehensive',
        monthlyPremium: 1299,
        annualPremium: 12999,
        coverageAmount: 500000,
        deductible: 0,
        features: ['All medical expenses', 'Surgery', 'Cancer treatment', 'Theft coverage', 'Death benefit', 'International coverage', 'Grooming allowance'],
        exclusions: ['Intentional harm']
      }
    ],
    rating: 4.6,
    reviewCount: 890
  }
];

export const StorageService = {
  // Initialize storage with seed data
  init: () => {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem(PETS_KEY)) {
      localStorage.setItem(PETS_KEY, JSON.stringify(SEED_PETS));
    }
    if (!localStorage.getItem(TAGS_KEY)) {
      localStorage.setItem(TAGS_KEY, JSON.stringify(SEED_TAGS));
    }
    if (!localStorage.getItem(SCANS_KEY)) {
      localStorage.setItem(SCANS_KEY, JSON.stringify(SEED_SCANS));
    }
    if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
    }
    // New feature storage initialization
    if (!localStorage.getItem(HEALTH_PASSPORTS_KEY)) {
      localStorage.setItem(HEALTH_PASSPORTS_KEY, JSON.stringify(SEED_HEALTH_PASSPORTS));
    }
    if (!localStorage.getItem(FINDER_PROFILES_KEY)) {
      localStorage.setItem(FINDER_PROFILES_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(REWARD_TRANSACTIONS_KEY)) {
      localStorage.setItem(REWARD_TRANSACTIONS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(INSURANCE_KEY)) {
      localStorage.setItem(INSURANCE_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(INSURANCE_PROVIDERS_KEY)) {
      localStorage.setItem(INSURANCE_PROVIDERS_KEY, JSON.stringify(SEED_INSURANCE_PROVIDERS));
    }
    if (!localStorage.getItem(NGOS_KEY)) {
      localStorage.setItem(NGOS_KEY, JSON.stringify(SEED_NGOS));
    }
    if (!localStorage.getItem(NGO_REVIEWS_KEY)) {
      localStorage.setItem(NGO_REVIEWS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(LOST_ALERTS_KEY)) {
      localStorage.setItem(LOST_ALERTS_KEY, JSON.stringify([]));
    }
  },

  // User Operations
  getUsers: (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),

  getUserById: (id: string): User | undefined => {
    return StorageService.getUsers().find(u => u.id === id);
  },

  getUserByEmail: (email: string): User | undefined => {
    return StorageService.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  saveUser: (user: User): void => {
    const users = StorageService.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = { ...user, updatedAt: new Date().toISOString() };
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
    const newUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    StorageService.saveUser(newUser);
    return newUser;
  },

  // Current User (Auth)
  setCurrentUser: (userId: string): void => {
    localStorage.setItem(CURRENT_USER_KEY, userId);
  },

  getCurrentUser: (): User | null => {
    const userId = localStorage.getItem(CURRENT_USER_KEY);
    if (!userId) return null;
    return StorageService.getUserById(userId) || null;
  },

  clearCurrentUser: (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Pet Operations
  getPets: (): Pet[] => JSON.parse(localStorage.getItem(PETS_KEY) || '[]'),

  getPetById: (id: string): Pet | undefined => {
    return StorageService.getPets().find(p => p.id === id);
  },

  getPetByTagCode: (code: string): Pet | undefined => {
    const tags = StorageService.getTags();
    const tag = tags.find(t => t.code.toUpperCase() === code.toUpperCase());
    if (!tag || !tag.petId) return undefined;
    return StorageService.getPetById(tag.petId);
  },

  getPetsByOwnerId: (ownerId: string): Pet[] => {
    return StorageService.getPets().filter(p => p.ownerId === ownerId);
  },

  savePet: (pet: Pet): void => {
    const pets = StorageService.getPets();
    const index = pets.findIndex(p => p.id === pet.id);
    if (index >= 0) {
      pets[index] = { ...pet, updatedAt: new Date().toISOString() };
    } else {
      pets.push(pet);
    }
    localStorage.setItem(PETS_KEY, JSON.stringify(pets));
  },

  createPet: (petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Pet => {
    const newPet: Pet = {
      ...petData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    StorageService.savePet(newPet);
    return newPet;
  },

  deletePet: (petId: string): void => {
    const pets = StorageService.getPets().filter(p => p.id !== petId);
    localStorage.setItem(PETS_KEY, JSON.stringify(pets));

    // Also unlink the tag
    const tags = StorageService.getTags();
    const tagIndex = tags.findIndex(t => t.petId === petId);
    if (tagIndex >= 0) {
      tags[tagIndex].petId = undefined;
      tags[tagIndex].isActivated = false;
      localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
    }
  },

  // Tag Operations
  getTags: (): Tag[] => JSON.parse(localStorage.getItem(TAGS_KEY) || '[]'),

  getTagById: (id: string): Tag | undefined => {
    return StorageService.getTags().find(t => t.id === id);
  },

  getTagByCode: (code: string): Tag | undefined => {
    return StorageService.getTags().find(t => t.code.toUpperCase() === code.toUpperCase());
  },

  getTagsByOwnerId: (ownerId: string): Tag[] => {
    return StorageService.getTags().filter(t => t.ownerId === ownerId);
  },

  getUnassignedTags: (): Tag[] => {
    return StorageService.getTags().filter(t => !t.isActivated && !t.petId);
  },

  saveTag: (tag: Tag): void => {
    const tags = StorageService.getTags();
    const index = tags.findIndex(t => t.id === tag.id);
    if (index >= 0) {
      tags[index] = tag;
    } else {
      tags.push(tag);
    }
    localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  },

  createTag: (tagType: Tag['tagType'] = 'basic'): Tag => {
    const newTag: Tag = {
      id: generateId(),
      code: generateTagCode(),
      isActivated: false,
      createdAt: new Date().toISOString(),
      tagType
    };
    StorageService.saveTag(newTag);
    return newTag;
  },

  activateTag: (tagId: string, petId: string, ownerId: string): void => {
    const tags = StorageService.getTags();
    const index = tags.findIndex(t => t.id === tagId);
    if (index >= 0) {
      tags[index] = {
        ...tags[index],
        petId,
        ownerId,
        isActivated: true,
        activatedAt: new Date().toISOString()
      };
      localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
    }
  },

  // Scan Operations
  getScans: (): ScanEvent[] => JSON.parse(localStorage.getItem(SCANS_KEY) || '[]'),

  getScanById: (id: string): ScanEvent | undefined => {
    return StorageService.getScans().find(s => s.id === id);
  },

  getScansByPetId: (petId: string): ScanEvent[] => {
    return StorageService.getScans()
      .filter(s => s.petId === petId)
      .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime());
  },

  getScansByTagId: (tagId: string): ScanEvent[] => {
    return StorageService.getScans()
      .filter(s => s.tagId === tagId)
      .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime());
  },

  getRecentScans: (limit: number = 10): ScanEvent[] => {
    return StorageService.getScans()
      .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime())
      .slice(0, limit);
  },

  saveScan: (scan: ScanEvent): void => {
    const scans = StorageService.getScans();
    const index = scans.findIndex(s => s.id === scan.id);
    if (index >= 0) {
      scans[index] = scan;
    } else {
      scans.push(scan);
    }
    localStorage.setItem(SCANS_KEY, JSON.stringify(scans));
  },

  createScan: (scanData: Omit<ScanEvent, 'id' | 'scannedAt'>): ScanEvent => {
    const newScan: ScanEvent = {
      ...scanData,
      id: generateId(),
      scannedAt: new Date().toISOString()
    };
    StorageService.saveScan(newScan);
    return newScan;
  },

  // Notification Operations
  getNotifications: (): NotificationLog[] => JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]'),

  saveNotification: (notification: NotificationLog): void => {
    const notifications = StorageService.getNotifications();
    notifications.push(notification);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  },

  // Dashboard Stats
  getDashboardStats: (userId: string) => {
    const pets = StorageService.getPetsByOwnerId(userId);
    const tags = StorageService.getTagsByOwnerId(userId);
    const scans = StorageService.getScans().filter(s =>
      pets.some(p => p.id === s.petId)
    );

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const scansThisMonth = scans.filter(s =>
      new Date(s.scannedAt) >= startOfMonth
    ).length;

    return {
      totalPets: pets.length,
      activeTags: tags.filter(t => t.isActivated).length,
      totalScans: scans.length,
      scansThisMonth,
      lostPets: pets.filter(p => p.isLost).length,
      foundPets: pets.filter(p => p.status === 'found').length
    };
  },

  // Mark pet as lost/found
  markPetAsLost: (petId: string, location?: string): void => {
    const pet = StorageService.getPetById(petId);
    if (pet) {
      pet.isLost = true;
      pet.status = 'lost';
      pet.lostDate = new Date().toISOString();
      pet.lostLocation = location;
      StorageService.savePet(pet);
    }
  },

  markPetAsFound: (petId: string): void => {
    const pet = StorageService.getPetById(petId);
    if (pet) {
      pet.isLost = false;
      pet.status = 'found';
      pet.lostDate = undefined;
      pet.lostLocation = undefined;
      StorageService.savePet(pet);
    }
  },

  // Export/Import
  exportData: () => {
    const data = {
      users: StorageService.getUsers(),
      pets: StorageService.getPets(),
      tags: StorageService.getTags(),
      scans: StorageService.getScans(),
      notifications: StorageService.getNotifications()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pawtag_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  },

  clearAllData: () => {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(PETS_KEY);
    localStorage.removeItem(TAGS_KEY);
    localStorage.removeItem(SCANS_KEY);
    localStorage.removeItem(NOTIFICATIONS_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(HEALTH_PASSPORTS_KEY);
    localStorage.removeItem(FINDER_PROFILES_KEY);
    localStorage.removeItem(REWARD_TRANSACTIONS_KEY);
    localStorage.removeItem(INSURANCE_KEY);
    localStorage.removeItem(INSURANCE_PROVIDERS_KEY);
    localStorage.removeItem(NGOS_KEY);
    localStorage.removeItem(NGO_REVIEWS_KEY);
    localStorage.removeItem(LOST_ALERTS_KEY);
  },

  // ==================== HEALTH PASSPORT OPERATIONS ====================
  getHealthPassports: (): HealthPassport[] => JSON.parse(localStorage.getItem(HEALTH_PASSPORTS_KEY) || '[]'),

  getHealthPassportByPetId: (petId: string): HealthPassport | undefined => {
    return StorageService.getHealthPassports().find(hp => hp.petId === petId);
  },

  saveHealthPassport: (passport: HealthPassport): void => {
    const passports = StorageService.getHealthPassports();
    const index = passports.findIndex(hp => hp.id === passport.id);
    if (index >= 0) {
      passports[index] = { ...passport, updatedAt: new Date().toISOString() };
    } else {
      passports.push(passport);
    }
    localStorage.setItem(HEALTH_PASSPORTS_KEY, JSON.stringify(passports));
  },

  createHealthPassport: (petId: string): HealthPassport => {
    const newPassport: HealthPassport = {
      id: generateId(),
      petId,
      vaccinations: [],
      dewormingRecords: [],
      checkups: [],
      weightHistory: [],
      documents: [],
      reminders: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    StorageService.saveHealthPassport(newPassport);
    return newPassport;
  },

  addVaccination: (petId: string, vaccination: Omit<VaccinationRecord, 'id'>): void => {
    let passport = StorageService.getHealthPassportByPetId(petId);
    if (!passport) {
      passport = StorageService.createHealthPassport(petId);
    }
    passport.vaccinations.push({ ...vaccination, id: generateId() });
    StorageService.saveHealthPassport(passport);
  },

  addDeworming: (petId: string, record: Omit<DewormingRecord, 'id'>): void => {
    let passport = StorageService.getHealthPassportByPetId(petId);
    if (!passport) {
      passport = StorageService.createHealthPassport(petId);
    }
    passport.dewormingRecords.push({ ...record, id: generateId() });
    StorageService.saveHealthPassport(passport);
  },

  addCheckup: (petId: string, checkup: Omit<HealthCheckup, 'id'>): void => {
    let passport = StorageService.getHealthPassportByPetId(petId);
    if (!passport) {
      passport = StorageService.createHealthPassport(petId);
    }
    passport.checkups.push({ ...checkup, id: generateId() });
    StorageService.saveHealthPassport(passport);
  },

  addWeightRecord: (petId: string, record: Omit<WeightRecord, 'id'>): void => {
    let passport = StorageService.getHealthPassportByPetId(petId);
    if (!passport) {
      passport = StorageService.createHealthPassport(petId);
    }
    passport.weightHistory.push({ ...record, id: generateId() });
    StorageService.saveHealthPassport(passport);
  },

  addHealthReminder: (petId: string, reminder: Omit<HealthReminder, 'id'>): void => {
    let passport = StorageService.getHealthPassportByPetId(petId);
    if (!passport) {
      passport = StorageService.createHealthPassport(petId);
    }
    passport.reminders.push({ ...reminder, id: generateId() });
    StorageService.saveHealthPassport(passport);
  },

  completeReminder: (petId: string, reminderId: string): void => {
    const passport = StorageService.getHealthPassportByPetId(petId);
    if (passport) {
      const reminder = passport.reminders.find(r => r.id === reminderId);
      if (reminder) {
        reminder.isCompleted = true;
        reminder.completedAt = new Date().toISOString();
        StorageService.saveHealthPassport(passport);
      }
    }
  },

  getUpcomingReminders: (petId: string, days: number = 30): HealthReminder[] => {
    const passport = StorageService.getHealthPassportByPetId(petId);
    if (!passport) return [];
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return passport.reminders
      .filter(r => !r.isCompleted && new Date(r.dueDate) <= futureDate)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  },

  // ==================== FINDER REWARDS OPERATIONS ====================
  getFinderProfiles: (): FinderProfile[] => JSON.parse(localStorage.getItem(FINDER_PROFILES_KEY) || '[]'),

  getFinderProfileByPhone: (phone: string): FinderProfile | undefined => {
    return StorageService.getFinderProfiles().find(fp => fp.phone === phone);
  },

  getFinderProfileById: (id: string): FinderProfile | undefined => {
    return StorageService.getFinderProfiles().find(fp => fp.id === id);
  },

  saveFinderProfile: (profile: FinderProfile): void => {
    const profiles = StorageService.getFinderProfiles();
    const index = profiles.findIndex(fp => fp.id === profile.id);
    if (index >= 0) {
      profiles[index] = { ...profile, updatedAt: new Date().toISOString() };
    } else {
      profiles.push(profile);
    }
    localStorage.setItem(FINDER_PROFILES_KEY, JSON.stringify(profiles));
  },

  createFinderProfile: (data: { name: string; phone: string; email?: string; city?: string }): FinderProfile => {
    const newProfile: FinderProfile = {
      id: generateId(),
      name: data.name,
      phone: data.phone,
      email: data.email,
      city: data.city,
      totalPoints: 0,
      level: 1,
      badges: [],
      petsHelped: 0,
      scansCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    StorageService.saveFinderProfile(newProfile);
    return newProfile;
  },

  getRewardTransactions: (): RewardTransaction[] => JSON.parse(localStorage.getItem(REWARD_TRANSACTIONS_KEY) || '[]'),

  addRewardPoints: (finderId: string, points: number, scanId: string, petId: string, type: RewardTransaction['type'], description: string): void => {
    const profile = StorageService.getFinderProfileById(finderId);
    if (!profile) return;

    // Add points
    profile.totalPoints += points;
    profile.scansCount += 1;

    // Update level
    const newLevel = FINDER_LEVELS.find(l => profile.totalPoints >= l.minPoints && profile.totalPoints <= l.maxPoints);
    if (newLevel) {
      profile.level = newLevel.level;
    }

    StorageService.saveFinderProfile(profile);

    // Record transaction
    const transaction: RewardTransaction = {
      id: generateId(),
      finderId,
      scanId,
      petId,
      points,
      type,
      description,
      createdAt: new Date().toISOString()
    };
    const transactions = StorageService.getRewardTransactions();
    transactions.push(transaction);
    localStorage.setItem(REWARD_TRANSACTIONS_KEY, JSON.stringify(transactions));
  },

  awardBadge: (finderId: string, badgeIndex: number): void => {
    const profile = StorageService.getFinderProfileById(finderId);
    if (!profile) return;

    const badgeTemplate = FINDER_BADGES[badgeIndex];
    if (!badgeTemplate) return;

    // Check if already has this badge
    if (profile.badges.some(b => b.name === badgeTemplate.name)) return;

    const newBadge: FinderBadge = {
      id: generateId(),
      ...badgeTemplate,
      earnedAt: new Date().toISOString()
    };
    profile.badges.push(newBadge);
    StorageService.saveFinderProfile(profile);
  },

  incrementPetsHelped: (finderId: string): void => {
    const profile = StorageService.getFinderProfileById(finderId);
    if (profile) {
      profile.petsHelped += 1;
      StorageService.saveFinderProfile(profile);
    }
  },

  getTopFinders: (limit: number = 10): FinderProfile[] => {
    return StorageService.getFinderProfiles()
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, limit);
  },

  // ==================== INSURANCE OPERATIONS ====================
  getPetInsurances: (): PetInsurance[] => JSON.parse(localStorage.getItem(INSURANCE_KEY) || '[]'),

  getPetInsuranceByPetId: (petId: string): PetInsurance | undefined => {
    return StorageService.getPetInsurances().find(ins => ins.petId === petId && ins.isActive);
  },

  getInsurancesByOwnerId: (ownerId: string): PetInsurance[] => {
    return StorageService.getPetInsurances().filter(ins => ins.ownerId === ownerId);
  },

  savePetInsurance: (insurance: PetInsurance): void => {
    const insurances = StorageService.getPetInsurances();
    const index = insurances.findIndex(ins => ins.id === insurance.id);
    if (index >= 0) {
      insurances[index] = { ...insurance, updatedAt: new Date().toISOString() };
    } else {
      insurances.push(insurance);
    }
    localStorage.setItem(INSURANCE_KEY, JSON.stringify(insurances));
  },

  getInsuranceProviders: (): InsuranceProvider[] => JSON.parse(localStorage.getItem(INSURANCE_PROVIDERS_KEY) || '[]'),

  getInsuranceProviderById: (id: string): InsuranceProvider | undefined => {
    return StorageService.getInsuranceProviders().find(p => p.id === id);
  },

  // ==================== NGO OPERATIONS ====================
  getNGOs: (): NGO[] => JSON.parse(localStorage.getItem(NGOS_KEY) || '[]'),

  getNGOById: (id: string): NGO | undefined => {
    return StorageService.getNGOs().find(n => n.id === id);
  },

  getNGOsByCity: (city: string): NGO[] => {
    return StorageService.getNGOs().filter(n =>
      n.city.toLowerCase().includes(city.toLowerCase())
    );
  },

  getNGOsByService: (service: NGOService): NGO[] => {
    return StorageService.getNGOs().filter(n => n.services.includes(service));
  },

  getNGOsByType: (type: NGO['type']): NGO[] => {
    return StorageService.getNGOs().filter(n => n.type === type);
  },

  searchNGOs: (query: string): NGO[] => {
    const lowerQuery = query.toLowerCase();
    return StorageService.getNGOs().filter(n =>
      n.name.toLowerCase().includes(lowerQuery) ||
      n.city.toLowerCase().includes(lowerQuery) ||
      n.services.some(s => s.includes(lowerQuery))
    );
  },

  getNGOReviews: (ngoId: string): NGOReview[] => {
    const reviews: NGOReview[] = JSON.parse(localStorage.getItem(NGO_REVIEWS_KEY) || '[]');
    return reviews.filter(r => r.ngoId === ngoId);
  },

  addNGOReview: (review: Omit<NGOReview, 'id' | 'createdAt'>): void => {
    const reviews: NGOReview[] = JSON.parse(localStorage.getItem(NGO_REVIEWS_KEY) || '[]');
    reviews.push({
      ...review,
      id: generateId(),
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(NGO_REVIEWS_KEY, JSON.stringify(reviews));

    // Update NGO rating
    const ngo = StorageService.getNGOById(review.ngoId);
    if (ngo) {
      const ngoReviews = reviews.filter(r => r.ngoId === review.ngoId);
      const avgRating = ngoReviews.reduce((sum, r) => sum + r.rating, 0) / ngoReviews.length;
      ngo.rating = Math.round(avgRating * 10) / 10;
      ngo.reviewCount = ngoReviews.length;
      const ngos = StorageService.getNGOs();
      const index = ngos.findIndex(n => n.id === ngo.id);
      if (index >= 0) {
        ngos[index] = ngo;
        localStorage.setItem(NGOS_KEY, JSON.stringify(ngos));
      }
    }
  },

  // ==================== LOST PET ALERT OPERATIONS ====================
  getLostAlerts: (): LostPetAlert[] => JSON.parse(localStorage.getItem(LOST_ALERTS_KEY) || '[]'),

  getActiveAlerts: (): LostPetAlert[] => {
    return StorageService.getLostAlerts().filter(a => a.status === 'active');
  },

  getAlertsByPetId: (petId: string): LostPetAlert[] => {
    return StorageService.getLostAlerts().filter(a => a.petId === petId);
  },

  saveLostAlert: (alert: LostPetAlert): void => {
    const alerts = StorageService.getLostAlerts();
    const index = alerts.findIndex(a => a.id === alert.id);
    if (index >= 0) {
      alerts[index] = { ...alert, updatedAt: new Date().toISOString() };
    } else {
      alerts.push(alert);
    }
    localStorage.setItem(LOST_ALERTS_KEY, JSON.stringify(alerts));
  },

  createLostAlert: (data: Omit<LostPetAlert, 'id' | 'sightings' | 'alertsSent' | 'viewCount' | 'createdAt' | 'updatedAt'>): LostPetAlert => {
    const newAlert: LostPetAlert = {
      ...data,
      id: generateId(),
      sightings: [],
      alertsSent: 0,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    StorageService.saveLostAlert(newAlert);
    return newAlert;
  },

  addSighting: (alertId: string, sighting: Omit<PetSighting, 'id' | 'alertId' | 'createdAt'>): void => {
    const alerts = StorageService.getLostAlerts();
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.sightings.push({
        ...sighting,
        id: generateId(),
        alertId,
        createdAt: new Date().toISOString()
      });
      StorageService.saveLostAlert(alert);
    }
  },

  resolveAlert: (alertId: string, status: 'found' | 'cancelled'): void => {
    const alerts = StorageService.getLostAlerts();
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = status;
      alert.resolvedAt = new Date().toISOString();
      StorageService.saveLostAlert(alert);
    }
  }
};
