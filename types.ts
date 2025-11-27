// PawTag India - Type Definitions

// Language Support
export type Language = 'en' | 'hi';

// Pet Types
export type PetType = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';

export type PetSize = 'small' | 'medium' | 'large';

export type PetGender = 'male' | 'female' | 'unknown';

// Tag Status
export type TagStatus = 'active' | 'inactive' | 'lost' | 'found';

// Notification Types
export type NotificationType = 'sms' | 'email' | 'whatsapp' | 'push';

// User Interface
export interface User {
  id: string;
  email: string;
  phone: string;
  password: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  preferredLanguage: Language;
  notificationPreferences: NotificationPreference;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreference {
  sms: boolean;
  email: boolean;
  whatsapp: boolean;
  push: boolean;
}

// Pet Profile Interface
export interface Pet {
  id: string;
  ownerId: string;
  tagId: string;

  // Basic Info
  name: string;
  type: PetType;
  breed: string;
  gender: PetGender;
  size: PetSize;
  color: string;
  dateOfBirth?: string;
  age?: string;

  // Photos
  photoUrl?: string;
  additionalPhotos?: string[];

  // Medical Info
  medicalInfo?: MedicalInfo;

  // Microchip
  microchipId?: string;

  // Personality & Special Notes
  personality?: string;
  specialNeeds?: string;

  // Emergency Contacts
  emergencyContacts: EmergencyContact[];

  // Vet Details
  vetInfo?: VetInfo;

  // Status
  status: TagStatus;
  isLost: boolean;
  lostDate?: string;
  lostLocation?: string;

  // Reward (if lost)
  rewardAmount?: number;

  // Multi-language descriptions
  descriptionEn?: string;
  descriptionHi?: string;

  createdAt: string;
  updatedAt: string;
}

export interface MedicalInfo {
  allergies?: string[];
  medications?: string[];
  conditions?: string[];
  vaccinations?: Vaccination[];
  bloodType?: string;
  spayedNeutered?: boolean;
  lastVetVisit?: string;
  notes?: string;
}

export interface Vaccination {
  name: string;
  date: string;
  nextDueDate?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export interface VetInfo {
  name: string;
  clinicName: string;
  phone: string;
  address?: string;
  email?: string;
}

// Tag Interface
export interface Tag {
  id: string;
  code: string;
  petId?: string;
  ownerId?: string;
  isActivated: boolean;
  activatedAt?: string;
  createdAt: string;
  tagType: 'basic' | 'premium' | 'nfc';
}

// Scan Event Interface
export interface ScanEvent {
  id: string;
  tagId: string;
  petId: string;
  scannedAt: string;

  // Finder Info (optional)
  finderName?: string;
  finderPhone?: string;
  finderEmail?: string;
  finderMessage?: string;

  // Location Data
  location?: GeoLocation;
  locationPermissionGranted: boolean;

  // Device Info
  userAgent?: string;
  ipAddress?: string;

  // Notification sent status
  notificationsSent: NotificationType[];
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

// Notification Log
export interface NotificationLog {
  id: string;
  userId: string;
  petId: string;
  scanId: string;
  type: NotificationType;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  message: string;
  sentAt: string;
  deliveredAt?: string;
  errorMessage?: string;
}

// Order (for e-commerce - future)
export interface Order {
  id: string;
  userId: string;
  tagIds: string[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

// Form Data Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  preferredLanguage: Language;
}

export interface PetFormData {
  name: string;
  type: PetType;
  breed: string;
  gender: PetGender;
  size: PetSize;
  color: string;
  dateOfBirth?: string;
  photoUrl?: string;
  microchipId?: string;
  personality?: string;
  specialNeeds?: string;
  descriptionEn?: string;
  descriptionHi?: string;
}

export interface ContactFinderFormData {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  allowCallback: boolean;
}

// Dashboard Statistics
export interface DashboardStats {
  totalPets: number;
  activeTags: number;
  totalScans: number;
  scansThisMonth: number;
  lostPets: number;
  foundPets: number;
}

// Toast Notification
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// Auth Context
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterFormData) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

// App Context
export interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  toasts: Toast[];
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}
