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

// ==================== NEW FEATURES ====================

// Pet Health Passport
export interface HealthPassport {
  id: string;
  petId: string;

  // Vaccination Records
  vaccinations: VaccinationRecord[];

  // Deworming Records
  dewormingRecords: DewormingRecord[];

  // Health Checkups
  checkups: HealthCheckup[];

  // Weight History
  weightHistory: WeightRecord[];

  // Documents
  documents: HealthDocument[];

  // Reminders
  reminders: HealthReminder[];

  createdAt: string;
  updatedAt: string;
}

export interface VaccinationRecord {
  id: string;
  name: string;
  date: string;
  nextDueDate?: string;
  batchNumber?: string;
  administeredBy?: string;
  clinicName?: string;
  notes?: string;
  documentUrl?: string;
}

export interface DewormingRecord {
  id: string;
  medicineName: string;
  date: string;
  nextDueDate?: string;
  dosage?: string;
  administeredBy?: string;
  notes?: string;
}

export interface HealthCheckup {
  id: string;
  date: string;
  vetName: string;
  clinicName: string;
  reason: 'routine' | 'illness' | 'injury' | 'follow-up' | 'other';
  diagnosis?: string;
  treatment?: string;
  prescriptions?: string[];
  followUpDate?: string;
  cost?: number;
  notes?: string;
  documentUrl?: string;
}

export interface WeightRecord {
  id: string;
  date: string;
  weight: number;
  unit: 'kg' | 'lbs';
  notes?: string;
}

export interface HealthDocument {
  id: string;
  name: string;
  type: 'vaccination' | 'prescription' | 'report' | 'certificate' | 'other';
  url: string;
  uploadedAt: string;
  notes?: string;
}

export interface HealthReminder {
  id: string;
  title: string;
  type: 'vaccination' | 'deworming' | 'checkup' | 'medication' | 'grooming' | 'other';
  dueDate: string;
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
  notifyBefore: number; // days before due date
}

// Finder Rewards System
export interface FinderProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;

  // Rewards
  totalPoints: number;
  level: number;
  badges: FinderBadge[];

  // Stats
  petsHelped: number;
  scansCount: number;

  createdAt: string;
  updatedAt: string;
}

export interface FinderBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: 'helper' | 'hero' | 'legend' | 'special';
}

export interface RewardTransaction {
  id: string;
  finderId: string;
  scanId: string;
  petId: string;
  points: number;
  type: 'scan' | 'reunion' | 'bonus' | 'referral';
  description: string;
  createdAt: string;
}

export const FINDER_BADGES: Omit<FinderBadge, 'id' | 'earnedAt'>[] = [
  { name: 'First Helper', description: 'Scanned your first PawTag', icon: '🌟', category: 'helper' },
  { name: 'Good Samaritan', description: 'Helped reunite 3 pets', icon: '💫', category: 'helper' },
  { name: 'Pet Hero', description: 'Helped reunite 10 pets', icon: '🦸', category: 'hero' },
  { name: 'Guardian Angel', description: 'Helped reunite 25 pets', icon: '👼', category: 'hero' },
  { name: 'Legend', description: 'Helped reunite 50 pets', icon: '🏆', category: 'legend' },
  { name: 'Night Owl', description: 'Scanned a tag after midnight', icon: '🦉', category: 'special' },
  { name: 'Quick Responder', description: 'Left contact info within 1 minute', icon: '⚡', category: 'special' },
  { name: 'Detailed Helper', description: 'Left a helpful message for owner', icon: '📝', category: 'special' },
];

export const FINDER_LEVELS = [
  { level: 1, name: 'Newcomer', minPoints: 0, maxPoints: 99 },
  { level: 2, name: 'Helper', minPoints: 100, maxPoints: 299 },
  { level: 3, name: 'Friend', minPoints: 300, maxPoints: 599 },
  { level: 4, name: 'Hero', minPoints: 600, maxPoints: 999 },
  { level: 5, name: 'Champion', minPoints: 1000, maxPoints: 1999 },
  { level: 6, name: 'Legend', minPoints: 2000, maxPoints: Infinity },
];

// Insurance Integration
export interface PetInsurance {
  id: string;
  petId: string;
  ownerId: string;

  // Provider Info
  providerName: string;
  providerLogo?: string;
  policyNumber: string;

  // Coverage
  coverageType: 'basic' | 'standard' | 'premium' | 'comprehensive';
  coverageAmount: number;
  deductible: number;

  // Dates
  startDate: string;
  endDate: string;
  renewalDate?: string;

  // Coverage Details
  coverageDetails: InsuranceCoverage[];

  // Claims
  claims: InsuranceClaim[];

  // Contact
  emergencyHotline?: string;
  claimEmail?: string;

  // Documents
  policyDocumentUrl?: string;

  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceCoverage {
  type: 'accident' | 'illness' | 'surgery' | 'hospitalization' | 'medication' | 'preventive' | 'theft' | 'death';
  covered: boolean;
  limit?: number;
  notes?: string;
}

export interface InsuranceClaim {
  id: string;
  date: string;
  type: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  description: string;
  documents?: string[];
  notes?: string;
  processedAt?: string;
}

export interface InsuranceProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  plans: InsurancePlan[];
  rating: number;
  reviewCount: number;
}

export interface InsurancePlan {
  id: string;
  name: string;
  type: 'basic' | 'standard' | 'premium' | 'comprehensive';
  monthlyPremium: number;
  annualPremium: number;
  coverageAmount: number;
  deductible: number;
  features: string[];
  exclusions: string[];
}

// NGO / Shelter Network
export interface NGO {
  id: string;
  name: string;
  type: 'shelter' | 'rescue' | 'hospital' | 'ngo' | 'adoption';
  logo?: string;

  // Contact
  phone: string;
  email?: string;
  website?: string;
  whatsapp?: string;

  // Location
  address: string;
  city: string;
  state: string;
  pincode: string;
  location?: GeoLocation;

  // Details
  description: string;
  services: NGOService[];
  operatingHours?: string;

  // Verification
  isVerified: boolean;
  registrationNumber?: string;

  // Stats
  petsRescued?: number;
  petsAdopted?: number;

  // Social
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };

  // Photos
  photos?: string[];

  // Rating
  rating: number;
  reviewCount: number;

  createdAt: string;
  updatedAt: string;
}

export type NGOService =
  | 'rescue'
  | 'shelter'
  | 'adoption'
  | 'medical'
  | 'vaccination'
  | 'sterilization'
  | 'foster'
  | 'burial'
  | 'ambulance'
  | 'lost-found'
  | 'training'
  | 'grooming';

export interface NGOReview {
  id: string;
  ngoId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Lost Pet Alert Network
export interface LostPetAlert {
  id: string;
  petId: string;
  ownerId: string;

  // Alert Details
  title: string;
  description: string;
  lastSeenLocation: GeoLocation;
  lastSeenDate: string;

  // Search Radius
  alertRadius: number; // in km

  // Status
  status: 'active' | 'found' | 'cancelled';

  // Reward
  rewardAmount?: number;

  // Responses
  sightings: PetSighting[];

  // Reach
  alertsSent: number;
  viewCount: number;

  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface PetSighting {
  id: string;
  alertId: string;
  reporterId: string;
  reporterName: string;
  reporterPhone: string;

  location: GeoLocation;
  sightingTime: string;
  description: string;
  photoUrl?: string;

  isVerified: boolean;

  createdAt: string;
}
