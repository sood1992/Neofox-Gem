// PawTag India - Storage Service
import { User, Pet, Tag, ScanEvent, NotificationLog, Language } from '../types';

const STORAGE_PREFIX = 'pawtag_';
const USERS_KEY = `${STORAGE_PREFIX}users_v1`;
const PETS_KEY = `${STORAGE_PREFIX}pets_v1`;
const TAGS_KEY = `${STORAGE_PREFIX}tags_v1`;
const SCANS_KEY = `${STORAGE_PREFIX}scans_v1`;
const NOTIFICATIONS_KEY = `${STORAGE_PREFIX}notifications_v1`;
const CURRENT_USER_KEY = `${STORAGE_PREFIX}current_user`;

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
  }
};
