import { v4 as uuidv4 } from 'uuid';

// ===== TYPES =====
export type ProjectStatus = 'planning' | 'in-progress' | 'at-risk' | 'completed' | 'on-hold';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  dueDate: string;
  teamMembers: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  assigneeId: string;
  createdAt: string;
  completedAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  status: 'active' | 'away' | 'offline';
}

export interface ActivityEvent {
  id: string;
  type: 'project-created' | 'task-added' | 'task-completed' | 'project-status-changed' | 'due-date-updated' | 'task-reassigned';
  description: string;
  timestamp: string;
  projectId?: string;
  taskId?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
}

export interface AppearanceSettings {
  blurIntensity: number;
  surfaceOpacity: number;
  accentColor: string;
  atmosphere: 'default' | 'violet' | 'cyan' | 'warm';
}

// ===== SAMPLE TEAM =====
export const sampleTeam: TeamMember[] = [
  { id: 'tm-1', name: 'Alex Chen', role: 'Product Designer', avatarColor: '#7765F7', status: 'active' },
  { id: 'tm-2', name: 'Maya Johnson', role: 'Frontend Engineer', avatarColor: '#65DDF2', status: 'active' },
  { id: 'tm-3', name: 'Sam Rivera', role: 'Project Manager', avatarColor: '#87E8D0', status: 'away' },
  { id: 'tm-4', name: 'Jordan Lee', role: 'UX Researcher', avatarColor: '#B6AEFF', status: 'active' },
  { id: 'tm-5', name: 'Taylor Kim', role: 'Backend Engineer', avatarColor: '#f97316', status: 'offline' },
  { id: 'tm-6', name: 'Casey Morgan', role: 'QA Engineer', avatarColor: '#ec4899', status: 'active' },
];

// ===== SAMPLE PROJECTS =====
export const sampleProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Website Refresh',
    description: 'Complete redesign of the company website with modern glassmorphism aesthetics and improved user experience.',
    status: 'in-progress',
    progress: 65,
    startDate: '2026-01-15',
    dueDate: '2026-03-30',
    teamMembers: ['tm-1', 'tm-2', 'tm-4'],
    createdAt: '2026-01-10',
  },
  {
    id: 'proj-2',
    name: 'Product Launch',
    description: 'Coordinate the Q2 product launch including marketing materials, landing pages, and launch event planning.',
    status: 'in-progress',
    progress: 40,
    startDate: '2026-02-01',
    dueDate: '2026-04-15',
    teamMembers: ['tm-3', 'tm-1', 'tm-5'],
    createdAt: '2026-01-25',
  },
  {
    id: 'proj-3',
    name: 'Brand Sprint',
    description: 'Two-week intensive brand identity exploration including visual language, messaging, and tone of voice.',
    status: 'completed',
    progress: 100,
    startDate: '2026-01-05',
    dueDate: '2026-01-19',
    teamMembers: ['tm-1', 'tm-4'],
    createdAt: '2026-01-02',
  },
  {
    id: 'proj-4',
    name: 'Client Onboarding',
    description: 'Streamline the client onboarding process with automated workflows and self-service documentation.',
    status: 'planning',
    progress: 15,
    startDate: '2026-03-01',
    dueDate: '2026-05-01',
    teamMembers: ['tm-3', 'tm-5', 'tm-6'],
    createdAt: '2026-02-15',
  },
  {
    id: 'proj-5',
    name: 'Research Initiative',
    description: 'Comprehensive user research program including interviews, surveys, and competitive analysis.',
    status: 'at-risk',
    progress: 30,
    startDate: '2026-01-20',
    dueDate: '2026-02-28',
    teamMembers: ['tm-4', 'tm-6'],
    createdAt: '2026-01-18',
  },
  {
    id: 'proj-6',
    name: 'Design System Update',
    description: 'Update the component library with new glassmorphism tokens, accessibility improvements, and documentation.',
    status: 'in-progress',
    progress: 55,
    startDate: '2026-02-10',
    dueDate: '2026-04-01',
    teamMembers: ['tm-1', 'tm-2', 'tm-6'],
    createdAt: '2026-02-05',
  },
];

// ===== SAMPLE TASKS =====
export const sampleTasks: Task[] = [
  // Website Refresh tasks
  { id: 'task-1', title: 'Design homepage mockup', description: 'Create high-fidelity mockup for the new homepage layout', projectId: 'proj-1', status: 'done', priority: 'high', dueDate: '2026-02-15', assigneeId: 'tm-1', createdAt: '2026-01-16', completedAt: '2026-02-14' },
  { id: 'task-2', title: 'Implement responsive navigation', description: 'Build mobile-first navigation with glassmorphism effects', projectId: 'proj-1', status: 'in-progress', priority: 'high', dueDate: '2026-03-01', assigneeId: 'tm-2', createdAt: '2026-01-20' },
  { id: 'task-3', title: 'User testing round 1', description: 'Conduct usability testing with 5 participants', projectId: 'proj-1', status: 'todo', priority: 'medium', dueDate: '2026-03-10', assigneeId: 'tm-4', createdAt: '2026-02-01' },
  { id: 'task-4', title: 'Content migration plan', description: 'Plan content structure and migration strategy', projectId: 'proj-1', status: 'done', priority: 'medium', dueDate: '2026-02-20', assigneeId: 'tm-3', createdAt: '2026-01-25', completedAt: '2026-02-18' },
  // Product Launch tasks
  { id: 'task-5', title: 'Create launch landing page', description: 'Design and develop the product launch landing page', projectId: 'proj-2', status: 'in-progress', priority: 'high', dueDate: '2026-03-15', assigneeId: 'tm-1', createdAt: '2026-02-05' },
  { id: 'task-6', title: 'Write press release', description: 'Draft press release for product announcement', projectId: 'proj-2', status: 'todo', priority: 'medium', dueDate: '2026-03-20', assigneeId: 'tm-3', createdAt: '2026-02-10' },
  { id: 'task-7', title: 'Set up analytics tracking', description: 'Configure event tracking for launch metrics', projectId: 'proj-2', status: 'todo', priority: 'low', dueDate: '2026-04-01', assigneeId: 'tm-5', createdAt: '2026-02-12' },
  // Brand Sprint tasks
  { id: 'task-8', title: 'Competitive analysis', description: 'Analyze competitor brand positioning', projectId: 'proj-3', status: 'done', priority: 'high', dueDate: '2026-01-10', assigneeId: 'tm-4', createdAt: '2026-01-06', completedAt: '2026-01-09' },
  { id: 'task-9', title: 'Visual identity exploration', description: 'Create mood boards and visual directions', projectId: 'proj-3', status: 'done', priority: 'high', dueDate: '2026-01-15', assigneeId: 'tm-1', createdAt: '2026-01-06', completedAt: '2026-01-14' },
  // Client Onboarding tasks
  { id: 'task-10', title: 'Map current onboarding flow', description: 'Document the existing client onboarding process', projectId: 'proj-4', status: 'done', priority: 'medium', dueDate: '2026-03-05', assigneeId: 'tm-3', createdAt: '2026-02-16', completedAt: '2026-03-03' },
  { id: 'task-11', title: 'Design welcome email sequence', description: 'Create automated welcome email templates', projectId: 'proj-4', status: 'todo', priority: 'medium', dueDate: '2026-03-20', assigneeId: 'tm-1', createdAt: '2026-02-20' },
  { id: 'task-12', title: 'Build self-service portal', description: 'Develop client portal for document access', projectId: 'proj-4', status: 'todo', priority: 'high', dueDate: '2026-04-15', assigneeId: 'tm-5', createdAt: '2026-02-22' },
  // Research Initiative tasks
  { id: 'task-13', title: 'Conduct user interviews', description: 'Schedule and conduct 10 user interviews', projectId: 'proj-5', status: 'in-progress', priority: 'high', dueDate: '2026-02-25', assigneeId: 'tm-4', createdAt: '2026-01-22' },
  { id: 'task-14', title: 'Survey design and distribution', description: 'Create and distribute user satisfaction survey', projectId: 'proj-5', status: 'todo', priority: 'medium', dueDate: '2026-02-28', assigneeId: 'tm-6', createdAt: '2026-01-25' },
  { id: 'task-15', title: 'Synthesize research findings', description: 'Compile insights into actionable recommendations', projectId: 'proj-5', status: 'todo', priority: 'high', dueDate: '2026-03-05', assigneeId: 'tm-4', createdAt: '2026-02-01' },
  // Design System Update tasks
  { id: 'task-16', title: 'Define glass tokens', description: 'Create design tokens for glassmorphism surfaces', projectId: 'proj-6', status: 'done', priority: 'high', dueDate: '2026-02-20', assigneeId: 'tm-1', createdAt: '2026-02-11', completedAt: '2026-02-19' },
  { id: 'task-17', title: 'Build glass components', description: 'Implement reusable glass panel components', projectId: 'proj-6', status: 'in-progress', priority: 'high', dueDate: '2026-03-10', assigneeId: 'tm-2', createdAt: '2026-02-15' },
  { id: 'task-18', title: 'Accessibility audit', description: 'Audit all components for WCAG 2.1 AA compliance', projectId: 'proj-6', status: 'todo', priority: 'medium', dueDate: '2026-03-20', assigneeId: 'tm-6', createdAt: '2026-02-20' },
  { id: 'task-19', title: 'Write component documentation', description: 'Document usage guidelines and API reference', projectId: 'proj-6', status: 'todo', priority: 'low', dueDate: '2026-03-25', assigneeId: 'tm-1', createdAt: '2026-02-25' },
];

// ===== SAMPLE ACTIVITY =====
export const sampleActivity: ActivityEvent[] = [
  { id: 'act-1', type: 'task-completed', description: 'Alex Chen completed "Define glass tokens"', timestamp: '2026-02-19T14:30:00Z', projectId: 'proj-6', taskId: 'task-16' },
  { id: 'act-2', type: 'task-added', description: 'Sam Rivera added "Design welcome email sequence" to Client Onboarding', timestamp: '2026-02-20T09:15:00Z', projectId: 'proj-4', taskId: 'task-11' },
  { id: 'act-3', type: 'project-status-changed', description: 'Brand Sprint marked as Completed', timestamp: '2026-02-20T11:00:00Z', projectId: 'proj-3' },
  { id: 'act-4', type: 'task-completed', description: 'Sam Rivera completed "Map current onboarding flow"', timestamp: '2026-03-03T16:45:00Z', projectId: 'proj-4', taskId: 'task-10' },
  { id: 'act-5', type: 'project-created', description: 'New project "Design System Update" created', timestamp: '2026-02-05T10:00:00Z', projectId: 'proj-6' },
  { id: 'act-6', type: 'task-added', description: 'Maya Johnson started working on "Build glass components"', timestamp: '2026-02-22T08:30:00Z', projectId: 'proj-6', taskId: 'task-17' },
];

// ===== SAMPLE NOTIFICATIONS =====
export const sampleNotifications: Notification[] = [
  { id: 'notif-1', title: 'Task Completed', message: '"Define glass tokens" has been marked as done.', read: false, timestamp: '2026-02-19T14:30:00Z', type: 'success' },
  { id: 'notif-2', title: 'Project Update', message: 'Brand Sprint has been completed.', read: false, timestamp: '2026-02-20T11:00:00Z', type: 'info' },
  { id: 'notif-3', title: 'At Risk', message: 'Research Initiative is behind schedule.', read: false, timestamp: '2026-02-25T09:00:00Z', type: 'warning' },
  { id: 'notif-4', title: 'New Task', message: '"Accessibility audit" has been assigned to you.', read: true, timestamp: '2026-02-20T15:00:00Z', type: 'info' },
];

// ===== DEFAULT APPEARANCE =====
export const defaultAppearance: AppearanceSettings = {
  blurIntensity: 16,
  surfaceOpacity: 0.10,
  accentColor: '#7765F7',
  atmosphere: 'default',
};

// ===== HELPERS =====
export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

export function getStatusLabel(status: ProjectStatus): string {
  const labels: Record<ProjectStatus, string> = {
    'planning': 'Planning',
    'in-progress': 'In Progress',
    'at-risk': 'At Risk',
    'completed': 'Completed',
    'on-hold': 'On Hold',
  };
  return labels[status];
}

export function getTaskStatusLabel(status: TaskStatus): string {
  const labels: Record<TaskStatus, string> = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done',
  };
  return labels[status];
}

export function calculateProjectProgress(tasks: Task[], projectId: string): number {
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  if (projectTasks.length === 0) return 0;
  const doneTasks = projectTasks.filter(t => t.status === 'done');
  return Math.round((doneTasks.length / projectTasks.length) * 100);
}

export function generateId(): string {
  return uuidv4().slice(0, 8);
}
