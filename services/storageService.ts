import { User, Task, UserRole, Department, TaskStatus, TaskPriority } from '../types';

const USERS_KEY = 'neofox_users';
const TASKS_KEY = 'neofox_tasks';

// Seed data to make the app usable immediately
const SEED_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Admin',
    email: 'alex@neofox.media',
    role: UserRole.ADMIN,
    department: Department.MANAGEMENT,
    avatar: 'https://picsum.photos/id/1005/100/100'
  },
  {
    id: 'u2',
    name: 'Sarah PM',
    email: 'sarah@neofox.media',
    role: UserRole.PROJECT_MANAGER,
    department: Department.MANAGEMENT,
    avatar: 'https://picsum.photos/id/1011/100/100'
  },
  {
    id: 'u3',
    name: 'Davide Editor',
    email: 'davide@neofox.media',
    role: UserRole.EMPLOYEE,
    department: Department.VIDEO_EDITING,
    avatar: 'https://picsum.photos/id/1025/100/100'
  },
  {
    id: 'u4',
    name: 'Priya Strategist',
    email: 'priya@neofox.media',
    role: UserRole.EMPLOYEE,
    department: Department.STRATEGY,
    avatar: 'https://picsum.photos/id/1027/100/100'
  },
  {
    id: 'u5',
    name: 'Mike Shooter',
    email: 'mike@neofox.media',
    role: UserRole.EMPLOYEE,
    department: Department.PHOTOGRAPHY,
    avatar: 'https://picsum.photos/id/1003/100/100'
  }
];

const SEED_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Nike Campaign - Video Cut',
    description: 'Initial rough cut for the Q4 Nike social campaign. Focus on energy and transitions.',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    assigneeId: 'u3',
    reporterId: 'u2',
    department: Department.VIDEO_EDITING,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 'st1', title: 'Sync Audio', isCompleted: true },
      { id: 'st2', title: 'Select A-Roll', isCompleted: false }
    ],
    tags: ['Social', 'High Energy']
  },
  {
    id: 't2',
    title: 'Brand Strategy Deck',
    description: 'Competitor analysis for the new client onboarding.',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    assigneeId: 'u4',
    reporterId: 'u2',
    department: Department.STRATEGY,
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date().toISOString(),
    subtasks: [],
    tags: ['Research', 'Internal']
  }
];

export const StorageService = {
  init: () => {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem(TASKS_KEY)) {
      localStorage.setItem(TASKS_KEY, JSON.stringify(SEED_TASKS));
    }
  },

  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getTasks: (): Task[] => {
    const data = localStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveTask: (task: Task) => {
    const tasks = StorageService.getTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index >= 0) {
      tasks[index] = task;
    } else {
      tasks.push(task);
    }
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  deleteTask: (taskId: string) => {
    const tasks = StorageService.getTasks();
    const filtered = tasks.filter(t => t.id !== taskId);
    localStorage.setItem(TASKS_KEY, JSON.stringify(filtered));
  }
};