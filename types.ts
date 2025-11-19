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
  DONE = 'DONE'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  avatar: string;
}

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  reporterId: string; // The PM who assigned it
  department: Department;
  dueDate: string;
  createdAt: string;
  subtasks: SubTask[];
  tags: string[];
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
}