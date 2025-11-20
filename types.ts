
export enum UserRole {
  ADMIN = 'ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

export enum Department {
  PHOTOGRAPHY = 'Photography',
  VIDEOGRAPHY = 'Videography',
  VIDEO_EDITING = 'Video Editing',
  STRATEGY = 'Creative Strategy',
  MARKETING = 'Performance Marketing',
  MANAGEMENT = 'Management'
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  CHANGES_REQUESTED = 'CHANGES_REQUESTED',
  DONE = 'DONE',
  LOCKED = 'LOCKED' // Dependent on other tasks
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  xpValue: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  avatar: string;
  hourlyRate: number;
  skills: string[];
  jobTitle?: string; // Added jobTitle
  password?: string;
  xp?: number;
  level?: number;
  badges?: string[]; // Badge IDs
}

export interface Client {
  id: string;
  name: string;
  logo: string;
  email: string;
  totalRevenue: number;
}

export interface Asset {
  id: string;
  projectId: string;
  taskId?: string;
  name: string;
  url: string;
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  uploadedBy: string;
  createdAt: string;
  version: number;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  type?: 'GENERAL' | 'FEEDBACK' | 'APPROVAL';
}

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  startTime: string;
  endTime: string | null;
  durationSeconds: number;
  description?: string;
  isBillable: boolean;
}

export interface Expense {
  id: string;
  projectId: string;
  description: string;
  amount: number;
  category: 'Talent' | 'Location' | 'Equipment' | 'Software' | 'Other';
  date: string;
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  jobCode?: string;
  description: string;
  managerId: string;
  deadline: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'PLANNING';
  budget: number;
  expenses: number; // Calculated from Expense entries
  tags: string[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  reporterId: string;
  department: Department;
  dueDate: string;
  createdAt: string;
  completedDate?: string;
  subtasks: SubTask[];
  tags: string[];
  timeSpentSeconds: number;
  estimatedSeconds: number;
  dependencies: string[]; // IDs of tasks that must be completed before this one
  comments: Comment[];
  assets: Asset[];
}

export interface ShootEvent {
  id: string;
  projectId: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  location?: string;
  crewIds: string[];
  type: 'SHOOT' | 'MEETING' | 'RECCE' | 'TRAVEL';
  description?: string;
}
