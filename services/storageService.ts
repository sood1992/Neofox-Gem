
import { User, Task, Project, Client, UserRole, Department, TaskStatus, Priority, TimeEntry, Badge, ShootEvent } from '../types';

const USERS_KEY = 'foxhole_users_v3';
const TASKS_KEY = 'foxhole_tasks_v3';
const PROJECTS_KEY = 'foxhole_projects_v3';
const CLIENTS_KEY = 'foxhole_clients_v3';
const TIME_ENTRIES_KEY = 'foxhole_time_entries_v3';
const BADGES_KEY = 'foxhole_badges_v3';
const SHOOT_EVENTS_KEY = 'foxhole_shoot_events_v3';

const SEED_BADGES: Badge[] = [
    { id: 'b1', name: 'First Steps', icon: '🏁', description: 'Complete your first task', xpValue: 50 },
    { id: 'b2', name: 'Speed Demon', icon: '⚡', description: 'Complete a task before the deadline', xpValue: 100 },
    { id: 'b3', name: 'Task Master', icon: '🏆', description: 'Complete 10 tasks', xpValue: 500 },
    { id: 'b4', name: 'Streak Master', icon: '🔥', description: 'Active for 7 days in a row', xpValue: 200 },
    { id: 'b5', name: 'Quality Guru', icon: '✨', description: 'Task approved without revisions', xpValue: 150 },
];

// Added XP/Level to seed users and updated Hourly Rates to INR
const SEED_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@neofox.com', role: UserRole.ADMIN, department: Department.MANAGEMENT, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', hourlyRate: 3000, skills: ['Admin'], jobTitle: 'System Admin', xp: 1200, level: 3, badges: ['b1'] },
  { id: '4', name: 'Rishabh Sood', email: 'sood1992@gmail.com', role: UserRole.ADMIN, department: Department.MANAGEMENT, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rishabh', hourlyRate: 3500, skills: ['Founder'], jobTitle: 'Founder', xp: 2500, level: 5, badges: ['b1', 'b3'] },
  { id: '5', name: 'Kailash Rajput', email: 'kailashrajputtt14@gmail.com', role: UserRole.PROJECT_MANAGER, department: Department.MANAGEMENT, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kailash', hourlyRate: 2000, skills: ['Ops'], jobTitle: 'Business Operations Manager', xp: 1800, level: 4, badges: ['b1'] },
  { id: '9', name: 'Abhay Santra', email: 'abhay.santra007@gmail.com', role: UserRole.EMPLOYEE, department: Department.VIDEO_EDITING, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abhay', hourlyRate: 800, skills: [], jobTitle: 'Video Editor', xp: 450, level: 1, badges: [] },
  { id: '10', name: 'Neil Sharma', email: 'neilagnisharma123@gmail.com', role: UserRole.EMPLOYEE, department: Department.STRATEGY, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neil', hourlyRate: 1000, skills: [], jobTitle: 'Creative Strategist', xp: 600, level: 2, badges: ['b1'] },
  { id: '11', name: 'Shannon Kujur', email: 'shannonkujur@gmail.com', role: UserRole.EMPLOYEE, department: Department.STRATEGY, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ShannonK', hourlyRate: 900, skills: [], jobTitle: 'Strategist', xp: 300, level: 1, badges: [] },
  { id: '12', name: 'Arnisha Barman', email: 'arnisha20032@gmail.com', role: UserRole.EMPLOYEE, department: Department.MANAGEMENT, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arnisha', hourlyRate: 800, skills: [], jobTitle: 'Management Associate', xp: 100, level: 1, badges: [] },
  { id: '13', name: 'Tanishq Kakkar', email: 'kakkartanishq9212@gmail.com', role: UserRole.EMPLOYEE, department: Department.VIDEO_EDITING, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tanishq', hourlyRate: 700, skills: [], jobTitle: 'Video Editor', xp: 950, level: 2, badges: ['b1', 'b2'] },
  { id: '14', name: 'Yash Bist', email: 'yashbish09@gmail.com', role: UserRole.EMPLOYEE, department: Department.VIDEO_EDITING, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yash', hourlyRate: 700, skills: [], jobTitle: 'Video Editor', xp: 200, level: 1, badges: [] },
  { id: '15', name: 'Shivam', email: 'vinshivam0506@gmail.com', role: UserRole.EMPLOYEE, department: Department.PHOTOGRAPHY, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shivam', hourlyRate: 600, skills: [], jobTitle: 'Photographer', xp: 0, level: 1, badges: [] },
  { id: '16', name: 'Kedar Gharat', email: 'Kedargharat10@gmail.com', role: UserRole.EMPLOYEE, department: Department.VIDEO_EDITING, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kedar', hourlyRate: 650, skills: [], jobTitle: 'Video Editor', xp: 150, level: 1, badges: [] },
  { id: '17', name: 'Sumeet Koneri', email: 'sumeet@neofoxmedia.com', role: UserRole.PROJECT_MANAGER, department: Department.MANAGEMENT, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sumeet', hourlyRate: 2200, skills: ['Ops Manager'], jobTitle: 'Operations Manager', xp: 3000, level: 6, badges: ['b1', 'b3', 'b4'] },
  { id: '18', name: 'Shannon', email: 'shannon@neofoxmedia.com', role: UserRole.PROJECT_MANAGER, department: Department.STRATEGY, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shannon', hourlyRate: 2100, skills: ['Creative Head'], jobTitle: 'Creative Head', xp: 2100, level: 5, badges: ['b1'] },
  { id: '19', name: 'Sunirmal Karan', email: 'sunirmal20051401@gmail.com', role: UserRole.EMPLOYEE, department: Department.VIDEO_EDITING, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sunirmal', hourlyRate: 500, skills: [], jobTitle: 'Junior Editor', xp: 50, level: 1, badges: [] },
  { id: '20', name: 'testr', email: 'testr@gmail.com', role: UserRole.EMPLOYEE, department: Department.MANAGEMENT, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testr', hourlyRate: 500, skills: [], jobTitle: 'Employee', xp: 0, level: 1, badges: [] },
  { id: '21', name: 'TestRi', email: 'tesst@gmail.com', role: UserRole.EMPLOYEE, department: Department.MANAGEMENT, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TestRi', hourlyRate: 500, skills: [], jobTitle: 'Employee', xp: 0, level: 1, badges: [] }
];

const SEED_CLIENTS: Client[] = [
  { id: 'c1', name: 'Acme Experience', logo: '', email: '', totalRevenue: 150000 },
  { id: 'c2', name: 'Sunburn Festival', logo: '', email: '', totalRevenue: 2500000 },
  { id: 'c3', name: 'Babur', logo: '', email: '', totalRevenue: 50000 },
  { id: 'c4', name: 'Hyundai', logo: '', email: '', totalRevenue: 1000000 },
  { id: 'c5', name: 'Shangri La Hotel and Resorts', logo: '', email: '', totalRevenue: 800000 },
  { id: 'c6', name: 'Laysyy Clothing', logo: '', email: '', totalRevenue: 200000 },
  { id: 'c7', name: 'Amogh Abhilasha', logo: '', email: '', totalRevenue: 400000 },
  { id: 'c8', name: 'Punnet Nishi', logo: '', email: '', totalRevenue: 350000 },
  { id: 'c9', name: 'Parimatch', logo: '', email: '', totalRevenue: 1200000 }
];

const SEED_PROJECTS: Project[] = [
  { id: '1', clientId: 'c1', title: 'Super Money - Launch', jobCode: 'SM-LNCH-001', description: 'Creating short-form comedy highlight edits from live stand-up performances.', managerId: '17', deadline: '2025-11-03T00:00:00Z', status: 'ACTIVE', budget: 500000, expenses: 25000, tags: ['Launch', 'Content'] },
  { id: '2', clientId: 'c2', title: 'Sunburn Festival 2025', jobCode: 'SB-2025-FEST', description: 'End-to-end video & content production pipeline for Sunburn Festival 2025.', managerId: '17', deadline: '2025-12-30T00:00:00Z', status: 'ACTIVE', budget: 5000000, expenses: 120000, tags: ['Event', 'Promo'] },
  { id: '3', clientId: 'c3', title: 'Babur and Parsha Wedding', jobCode: 'WED-BP-001', description: 'Kashmir Wedding deliverables including Teaser, Film, Album.', managerId: '5', deadline: '2025-11-30T00:00:00Z', status: 'ACTIVE', budget: 250000, expenses: 5000, tags: ['Wedding'] },
  { id: '5', clientId: 'c4', title: 'Afro Jack (Sunburn) x Hyundai', jobCode: 'HYU-SB-COLLAB', description: 'Collaboration content.', managerId: '5', deadline: '2025-12-01T00:00:00Z', status: 'ACTIVE', budget: 800000, expenses: 15000, tags: ['Brand'] },
  { id: '6', clientId: 'c5', title: 'Shangri La', jobCode: 'SHANG-RET', description: 'Ongoing hotel content.', managerId: '5', deadline: '2026-03-31T00:00:00Z', status: 'ACTIVE', budget: 1200000, expenses: 45000, tags: ['Hospitality'] },
  { id: '7', clientId: 'c6', title: 'Laysyy Clothing', jobCode: 'LACY-FASH', description: 'Fashion shoot edits.', managerId: '5', deadline: '2025-11-03T00:00:00Z', status: 'PLANNING', budget: 150000, expenses: 10000, tags: ['Fashion'] },
  { id: '8', clientId: 'c7', title: 'Amogh Abhilasha (Wedding)', jobCode: 'WED-AA-001', description: 'Wedding Project.', managerId: '5', deadline: '2025-11-26T00:00:00Z', status: 'ACTIVE', budget: 300000, expenses: 20000, tags: ['Wedding'] },
  { id: '9', clientId: 'c8', title: 'Punnet Nishi Long Film', jobCode: 'WED-PN-FILM', description: 'Long format edit.', managerId: '5', deadline: '2025-11-26T00:00:00Z', status: 'PLANNING', budget: 200000, expenses: 5000, tags: ['Wedding'] },
  { id: '10', clientId: 'c2', title: 'Neofox Projects', jobCode: 'NEO-INT-001', description: 'Internal work.', managerId: '5', deadline: '2080-12-31T00:00:00Z', status: 'PLANNING', budget: 0, expenses: 0, tags: ['Internal'] },
  { id: '12', clientId: 'c9', title: 'ParimatchSports_x_UFC', jobCode: 'PM-UFC-001', description: '2 fully edited episodes (16x9) + teasers + BTS.', managerId: '5', deadline: '2025-11-22T00:00:00Z', status: 'ACTIVE', budget: 1500000, expenses: 80000, tags: ['Sports'] }
];

const SEED_TASKS: Task[] = [
  { id: '1', projectId: '1', title: 'Work on Super Money - Launch', description: 'Initial task for Sumeet Koneri', status: TaskStatus.TODO, priority: Priority.HIGH, assigneeId: '17', reporterId: '17', department: Department.MANAGEMENT, dueDate: '2025-11-03T00:00:00Z', createdAt: '2025-11-01T07:26:37Z', subtasks: [], tags: [], timeSpentSeconds: 0, estimatedSeconds: 14400, dependencies: [], comments: [], assets: [] },
  { id: '2', projectId: '1', title: 'Work on Super Money - Launch (Tanishq)', description: 'Initial task for Tanishq', status: TaskStatus.DONE, priority: Priority.HIGH, assigneeId: '13', reporterId: '17', department: Department.VIDEO_EDITING, dueDate: '2025-11-03T00:00:00Z', createdAt: '2025-11-01T07:26:37Z', subtasks: [], tags: [], timeSpentSeconds: 177660, estimatedSeconds: 180000, dependencies: [], comments: [], assets: [] },
  { id: '4', projectId: '1', title: '1 Min set of each comic', description: 'EDIT NOTE — 1 MIN CUT (PER COMIC). Vertical 9:16 + Horizontal 16:9.', status: TaskStatus.TODO, priority: Priority.URGENT, assigneeId: '17', reporterId: '17', department: Department.VIDEO_EDITING, dueDate: '2025-11-01T00:00:00Z', createdAt: '2025-11-01T07:30:12Z', subtasks: [], tags: [], timeSpentSeconds: 0, estimatedSeconds: 18000, dependencies: [], comments: [], assets: [] },
  { id: '5', projectId: '1', title: '30 seconds asset of each comic', description: '30 SECOND CUT (PER COMIC). Format: Vertical (9:16).', status: TaskStatus.DONE, priority: Priority.HIGH, assigneeId: '13', reporterId: '17', department: Department.VIDEO_EDITING, dueDate: '2025-11-02T00:00:00Z', createdAt: '2025-11-01T07:32:44Z', subtasks: [], tags: [], timeSpentSeconds: 0, estimatedSeconds: 28800, dependencies: [], comments: [], assets: [] },
  { id: '6', projectId: '1', title: '45 seconder teaser montage', description: '45 SECOND TEASER (ALL 3 COMICS).', status: TaskStatus.TODO, priority: Priority.MEDIUM, assigneeId: '17', reporterId: '17', department: Department.VIDEO_EDITING, dueDate: '2025-11-01T00:00:00Z', createdAt: '2025-11-01T07:34:45Z', subtasks: [], tags: [], timeSpentSeconds: 0, estimatedSeconds: 21600, dependencies: [], comments: [], assets: [] },
  { id: '7', projectId: '1', title: '10 Min Set of each comic', description: 'Full performance edit.', status: TaskStatus.DONE, priority: Priority.MEDIUM, assigneeId: '13', reporterId: '17', department: Department.VIDEO_EDITING, dueDate: '2025-11-03T00:00:00Z', createdAt: '2025-11-01T07:38:14Z', subtasks: [], tags: [], timeSpentSeconds: 997560, estimatedSeconds: 32400, dependencies: ['5'], comments: [], assets: [] },
  { id: '8', projectId: '2', title: 'Work on Sunburn (Abhay)', description: 'Initial task for Abhay Santra', status: TaskStatus.IN_PROGRESS, priority: Priority.MEDIUM, assigneeId: '9', reporterId: '17', department: Department.VIDEO_EDITING, dueDate: '2025-12-30T00:00:00Z', createdAt: '2025-11-01T07:55:39Z', subtasks: [], tags: [], timeSpentSeconds: 166032, estimatedSeconds: 170000, dependencies: [], comments: [], assets: [] },
  { id: '9', projectId: '2', title: 'Work on Sunburn (Arnisha)', description: 'Initial task for Arnisha Barman', status: TaskStatus.IN_PROGRESS, priority: Priority.MEDIUM, assigneeId: '12', reporterId: '17', department: Department.MANAGEMENT, dueDate: '2025-12-30T00:00:00Z', createdAt: '2025-11-01T07:55:39Z', subtasks: [], tags: [], timeSpentSeconds: 45000, estimatedSeconds: 50000, dependencies: [], comments: [], assets: [] },
  { id: '14', projectId: '2', title: 'Work on Sunburn (Shannon)', description: 'Initial task for Shannon Kujur', status: TaskStatus.IN_PROGRESS, priority: Priority.MEDIUM, assigneeId: '11', reporterId: '17', department: Department.STRATEGY, dueDate: '2025-12-30T00:00:00Z', createdAt: '2025-11-01T07:55:39Z', subtasks: [], tags: [], timeSpentSeconds: 45612, estimatedSeconds: 48000, dependencies: [], comments: [], assets: [] },
  { id: '18', projectId: '2', title: 'Work on Sunburn (Tanishq)', description: 'Initial task for Tanishq Kakkar', status: TaskStatus.DONE, priority: Priority.MEDIUM, assigneeId: '13', reporterId: '17', department: Department.VIDEO_EDITING, dueDate: '2025-11-18T00:00:00Z', createdAt: '2025-11-01T07:55:39Z', subtasks: [], tags: [], timeSpentSeconds: 90072, estimatedSeconds: 95000, dependencies: [], comments: [], assets: [] },
  { id: '20', projectId: '2', title: '4 Headliners video with Richie Hawtin', description: 'Ref- https://www.instagram.com/reel/DO_lBqZDcdn', status: TaskStatus.TODO, priority: Priority.MEDIUM, assigneeId: '17', reporterId: '5', department: Department.MANAGEMENT, dueDate: '2025-11-03T00:00:00Z', createdAt: '2025-11-01T08:56:59Z', subtasks: [], tags: [], timeSpentSeconds: 0, estimatedSeconds: 0, dependencies: [], comments: [], assets: [] },
  { id: '21', projectId: '2', title: 'Axwell new promo', description: 'Extract the audio from this video', status: TaskStatus.TODO, priority: Priority.HIGH, assigneeId: '16', reporterId: '5', department: Department.VIDEO_EDITING, dueDate: '2025-11-03T00:00:00Z', createdAt: '2025-11-01T08:57:54Z', subtasks: [], tags: [], timeSpentSeconds: 0, estimatedSeconds: 0, dependencies: [], comments: [], assets: [] },
  { id: '24', projectId: '3', title: 'Babur Wedding Photo Album', description: 'Photo Album For Wedding', status: TaskStatus.IN_PROGRESS, priority: Priority.MEDIUM, assigneeId: '15', reporterId: '5', department: Department.PHOTOGRAPHY, dueDate: '2025-11-12T00:00:00Z', createdAt: '2025-11-01T09:03:30Z', subtasks: [], tags: [], timeSpentSeconds: 0, estimatedSeconds: 0, dependencies: [], comments: [], assets: [] },
  { id: '26', projectId: '3', title: 'Babur Wedding Full Length', description: 'Full Length Video for Wedding Shoot', status: TaskStatus.LOCKED, priority: Priority.HIGH, assigneeId: '14', reporterId: '5', department: Department.VIDEO_EDITING, dueDate: '2025-11-05T00:00:00Z', createdAt: '2025-11-01T09:05:27Z', subtasks: [], tags: [], timeSpentSeconds: 0, estimatedSeconds: 144000, dependencies: ['27'], comments: [], assets: [] },
  { id: '27', projectId: '3', title: 'Photo Album', description: 'Dependency for Full Length', status: TaskStatus.TODO, priority: Priority.MEDIUM, assigneeId: '15', reporterId: '5', department: Department.PHOTOGRAPHY, dueDate: '2025-11-05T00:00:00Z', createdAt: '2025-11-01T09:06:23Z', subtasks: [], tags: [], timeSpentSeconds: 0, estimatedSeconds: 0, dependencies: [], comments: [], assets: [] },
  { id: '30', projectId: '5', title: 'Shangri La Christmas Campaign', description: 'Work on Shangri-La Christmas Campaign', status: TaskStatus.IN_PROGRESS, priority: Priority.HIGH, assigneeId: '10', reporterId: '5', department: Department.STRATEGY, dueDate: '2025-12-06T00:00:00Z', createdAt: '2025-11-01T09:44:28Z', subtasks: [], tags: [], timeSpentSeconds: 135180, estimatedSeconds: 140000, dependencies: [], comments: [], assets: [] },
  { id: '31', projectId: '2', title: 'Hire Editor', description: 'Hire Editor ASAP', status: TaskStatus.IN_PROGRESS, priority: Priority.URGENT, assigneeId: '21', reporterId: '5', department: Department.MANAGEMENT, dueDate: '2025-11-05T00:00:00Z', createdAt: '2025-11-01T10:08:09Z', subtasks: [], tags: [], timeSpentSeconds: 159012, estimatedSeconds: 3600, dependencies: [], comments: [], assets: [] },
  { id: '33', projectId: '5', title: 'Hyundai X Sunburn', description: 'Task assigned for Shannon Kujur', status: TaskStatus.IN_PROGRESS, priority: Priority.MEDIUM, assigneeId: '11', reporterId: '5', department: Department.STRATEGY, dueDate: '2025-11-18T00:00:00Z', createdAt: '2025-11-03T08:27:38Z', subtasks: [], tags: [], timeSpentSeconds: 45072, estimatedSeconds: 48000, dependencies: [], comments: [], assets: [] },
  { id: '37', projectId: '7', title: 'Laysyy Clothing (Shannon)', description: 'Initial task for Shannon Kujur', status: TaskStatus.DONE, priority: Priority.URGENT, assigneeId: '11', reporterId: '5', department: Department.STRATEGY, dueDate: '2025-11-05T00:00:00Z', createdAt: '2025-11-03T08:33:04Z', subtasks: [], tags: [], timeSpentSeconds: 0, estimatedSeconds: 0, dependencies: [], comments: [], assets: [] },
  { id: '38', projectId: '7', title: 'Laysyy Clothing (Sumeet)', description: 'Initial task for Sumeet Koneri', status: TaskStatus.REVIEW, priority: Priority.URGENT, assigneeId: '17', reporterId: '5', department: Department.MANAGEMENT, dueDate: '2025-11-05T00:00:00Z', createdAt: '2025-11-03T08:33:04Z', subtasks: [], tags: [], timeSpentSeconds: 0, estimatedSeconds: 0, dependencies: [], comments: [], assets: [] },
  { id: '39', projectId: '8', title: 'Amogh Abhilasha (Tanishq)', description: 'Initial task for Tanishq', status: TaskStatus.IN_PROGRESS, priority: Priority.HIGH, assigneeId: '13', reporterId: '5', department: Department.VIDEO_EDITING, dueDate: '2025-11-18T00:00:00Z', createdAt: '2025-11-06T06:32:37Z', subtasks: [], tags: [], timeSpentSeconds: 90000, estimatedSeconds: 100000, dependencies: [], comments: [], assets: [] },
  { id: '41', projectId: '8', title: 'Long Film Shoot Changes', description: 'Long Film Shoot Changes', status: TaskStatus.IN_PROGRESS, priority: Priority.HIGH, assigneeId: '13', reporterId: '5', department: Department.VIDEO_EDITING, dueDate: '2025-11-26T00:00:00Z', createdAt: '2025-11-06T06:36:37Z', subtasks: [], tags: [], timeSpentSeconds: 0, estimatedSeconds: 84600, dependencies: [], comments: [], assets: [] },
  { id: '45', projectId: '2', title: 'Ideation for festival', description: 'Looking for references for after-movie', status: TaskStatus.IN_PROGRESS, priority: Priority.HIGH, assigneeId: '11', reporterId: '11', department: Department.STRATEGY, dueDate: '2025-11-17T00:00:00Z', createdAt: '2025-11-10T07:33:48Z', subtasks: [], tags: [], timeSpentSeconds: 232992, estimatedSeconds: 240000, dependencies: [], comments: [], assets: [] },
  { id: '54', projectId: '12', title: 'Ep 1 ~ full video edit (15 Min)', description: 'Lovekesh ~ Joginder', status: TaskStatus.REVIEW, priority: Priority.MEDIUM, assigneeId: '9', reporterId: '9', department: Department.VIDEO_EDITING, dueDate: '2025-11-19T00:00:00Z', createdAt: '2025-11-18T10:42:04Z', subtasks: [], tags: [], timeSpentSeconds: 53388, estimatedSeconds: 55000, dependencies: [], comments: [], assets: [] },
  { id: '55', projectId: '12', title: '2 teasers (vertical)', description: 'Up to 1.5 mins each', status: TaskStatus.TODO, priority: Priority.HIGH, assigneeId: '9', reporterId: '5', department: Department.VIDEO_EDITING, dueDate: '2025-11-22T00:00:00Z', createdAt: '2025-11-18T10:47:32Z', subtasks: [], tags: [], timeSpentSeconds: 0, estimatedSeconds: 0, dependencies: [], comments: [], assets: [] },
  { id: '56', projectId: '12', title: '3 teasers (horizontal)', description: 'Up to 1.5 mins each', status: TaskStatus.REVIEW, priority: Priority.HIGH, assigneeId: '9', reporterId: '5', department: Department.VIDEO_EDITING, dueDate: '2025-11-21T00:00:00Z', createdAt: '2025-11-18T10:48:16Z', subtasks: [], tags: [], timeSpentSeconds: 45900, estimatedSeconds: 50000, dependencies: [], comments: [], assets: [] },
  { id: '57', projectId: '12', title: '2-3 behind the scenes', description: 'Vertical + Horizontal', status: TaskStatus.IN_PROGRESS, priority: Priority.HIGH, assigneeId: '9', reporterId: '5', department: Department.VIDEO_EDITING, dueDate: '2025-11-21T00:00:00Z', createdAt: '2025-11-18T10:50:51Z', subtasks: [], tags: [], timeSpentSeconds: 0, estimatedSeconds: 0, dependencies: [], comments: [], assets: [] },
  { id: '58', projectId: '12', title: '3 best moments videos', description: 'Up to 3 mins each', status: TaskStatus.IN_PROGRESS, priority: Priority.HIGH, assigneeId: '9', reporterId: '5', department: Department.VIDEO_EDITING, dueDate: '2025-11-21T00:00:00Z', createdAt: '2025-11-18T10:51:24Z', subtasks: [], tags: [], timeSpentSeconds: 0, estimatedSeconds: 0, dependencies: [], comments: [], assets: [] },
  { id: '59', projectId: '12', title: '4 short videos announcing winners', description: 'Announcing winners videos', status: TaskStatus.IN_PROGRESS, priority: Priority.HIGH, assigneeId: '9', reporterId: '5', department: Department.VIDEO_EDITING, dueDate: '2025-11-21T00:00:00Z', createdAt: '2025-11-18T10:52:54Z', subtasks: [], tags: [], timeSpentSeconds: 0, estimatedSeconds: 0, dependencies: [], comments: [], assets: [] }
];

const SEED_TIME_ENTRIES: TimeEntry[] = [
    { id: '3', taskId: '2', userId: '13', startTime: '2025-11-04T17:32:21Z', endTime: '2025-11-05T17:51:31Z', durationSeconds: 87540, isBillable: true, description: '' },
    { id: '20', taskId: '7', userId: '13', startTime: '2025-11-07T02:12:08Z', endTime: '2025-11-18T02:48:18Z', durationSeconds: 952570, isBillable: true, description: '' },
    { id: '39', taskId: '54', userId: '9', startTime: '2025-11-18T03:42:24Z', endTime: '2025-11-18T06:01:57Z', durationSeconds: 8373, isBillable: true, description: 'Auto-tracked' },
    { id: '2', taskId: '31', userId: '21', startTime: '2025-11-03T11:24:12Z', endTime: '2025-11-04T18:38:12Z', durationSeconds: 112440, isBillable: true, description: '' },
    { id: '11', taskId: '17', userId: '19', startTime: '2025-11-05T11:10:14Z', endTime: '2025-11-05T13:19:40Z', durationSeconds: 7766, isBillable: true, description: '' },
    { id: '45', taskId: '45', userId: '11', startTime: '2025-11-10T00:33:57Z', endTime: '2025-11-11T03:47:11Z', durationSeconds: 97994, isBillable: true, description: '' }
];

export const StorageService = {
  init: () => {
    if (!localStorage.getItem(USERS_KEY)) localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
    if (!localStorage.getItem(PROJECTS_KEY)) localStorage.setItem(PROJECTS_KEY, JSON.stringify(SEED_PROJECTS));
    if (!localStorage.getItem(TASKS_KEY)) localStorage.setItem(TASKS_KEY, JSON.stringify(SEED_TASKS));
    if (!localStorage.getItem(CLIENTS_KEY)) localStorage.setItem(CLIENTS_KEY, JSON.stringify(SEED_CLIENTS));
    if (!localStorage.getItem(TIME_ENTRIES_KEY)) localStorage.setItem(TIME_ENTRIES_KEY, JSON.stringify(SEED_TIME_ENTRIES));
    if (!localStorage.getItem(BADGES_KEY)) localStorage.setItem(BADGES_KEY, JSON.stringify(SEED_BADGES));
  },

  getUsers: (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
  getProjects: (): Project[] => JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]'),
  getTasks: (): Task[] => JSON.parse(localStorage.getItem(TASKS_KEY) || '[]'),
  getClients: (): Client[] => JSON.parse(localStorage.getItem(CLIENTS_KEY) || '[]'),
  getTimeEntries: (): TimeEntry[] => JSON.parse(localStorage.getItem(TIME_ENTRIES_KEY) || '[]'),
  getBadges: (): Badge[] => JSON.parse(localStorage.getItem(BADGES_KEY) || '[]'),
  getShootEvents: (): ShootEvent[] => JSON.parse(localStorage.getItem(SHOOT_EVENTS_KEY) || '[]'),

  saveUser: (user: User) => {
    const users = StorageService.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) users[index] = user;
    else users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  deleteUser: (userId: string) => {
      const users = StorageService.getUsers().filter(u => u.id !== userId);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  saveTask: (task: Task) => {
    const tasks = StorageService.getTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index >= 0) tasks[index] = task;
    else tasks.push(task);
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  saveProject: (project: Project) => {
    const projects = StorageService.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    if (index >= 0) projects[index] = project;
    else projects.push(project);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  },

  saveShootEvent: (event: ShootEvent) => {
    const events = StorageService.getShootEvents();
    const index = events.findIndex(e => e.id === event.id);
    if (index >= 0) events[index] = event;
    else events.push(event);
    localStorage.setItem(SHOOT_EVENTS_KEY, JSON.stringify(events));
  },

  addPoints: (userId: string, points: number): { newLevel?: number, addedPoints: number } => {
      const users = StorageService.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) return { addedPoints: 0 };

      const user = users[userIndex];
      user.xp = (user.xp || 0) + points;
      
      // Level up logic: Level = floor(xp / 500) + 1
      const oldLevel = user.level || 1;
      const newLevel = Math.floor(user.xp / 500) + 1;
      
      if (newLevel > oldLevel) {
          user.level = newLevel;
      }
      
      users[userIndex] = user;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      return { newLevel: newLevel > oldLevel ? newLevel : undefined, addedPoints: points };
  },

  startTimer: (taskId: string, userId: string): TimeEntry => {
    const entries = StorageService.getTimeEntries();
    // Stop active
    const activeIndex = entries.findIndex(e => e.userId === userId && e.endTime === null);
    if (activeIndex >= 0) {
        const entry = entries[activeIndex];
        entry.endTime = new Date().toISOString();
        entry.durationSeconds = (new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime()) / 1000;
        entries[activeIndex] = entry;
        // Update task total
        const tasks = StorageService.getTasks();
        const tIdx = tasks.findIndex(t => t.id === entry.taskId);
        if(tIdx >= 0) {
            tasks[tIdx].timeSpentSeconds += entry.durationSeconds;
            localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
        }
    }
    const newEntry: TimeEntry = {
        id: Date.now().toString(),
        taskId,
        userId,
        startTime: new Date().toISOString(),
        endTime: null,
        durationSeconds: 0,
        isBillable: true
    };
    entries.push(newEntry);
    localStorage.setItem(TIME_ENTRIES_KEY, JSON.stringify(entries));
    return newEntry;
  },

  stopTimer: (userId: string) => {
    const entries = StorageService.getTimeEntries();
    const activeIndex = entries.findIndex(e => e.userId === userId && e.endTime === null);
    if (activeIndex >= 0) {
        const entry = entries[activeIndex];
        entry.endTime = new Date().toISOString();
        entry.durationSeconds = (new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime()) / 1000;
        entries[activeIndex] = entry;
        localStorage.setItem(TIME_ENTRIES_KEY, JSON.stringify(entries));
        const tasks = StorageService.getTasks();
        const tIdx = tasks.findIndex(t => t.id === entry.taskId);
        if(tIdx >= 0) {
            tasks[tIdx].timeSpentSeconds += entry.durationSeconds;
            localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
        }
    }
  },

  getActiveTimer: (userId: string): TimeEntry | undefined => {
    return StorageService.getTimeEntries().find(e => e.userId === userId && e.endTime === null);
  },

  exportData: () => {
      const data = {
          users: StorageService.getUsers(),
          projects: StorageService.getProjects(),
          tasks: StorageService.getTasks(),
          clients: StorageService.getClients(),
          timeEntries: StorageService.getTimeEntries(),
          badges: StorageService.getBadges()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `foxhole_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
  },

  importData: async (file: File) => {
      const text = await file.text();
      try {
          const data = JSON.parse(text);
          if(data.users) localStorage.setItem(USERS_KEY, JSON.stringify(data.users));
          if(data.projects) localStorage.setItem(PROJECTS_KEY, JSON.stringify(data.projects));
          if(data.tasks) localStorage.setItem(TASKS_KEY, JSON.stringify(data.tasks));
          if(data.clients) localStorage.setItem(CLIENTS_KEY, JSON.stringify(data.clients));
          if(data.timeEntries) localStorage.setItem(TIME_ENTRIES_KEY, JSON.stringify(data.timeEntries));
           if(data.badges) localStorage.setItem(BADGES_KEY, JSON.stringify(data.badges));
          window.location.reload();
      } catch(e) {
          alert('Invalid backup file');
      }
  }
};
