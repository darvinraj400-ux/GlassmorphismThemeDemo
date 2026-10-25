import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  Project, Task, TaskStatus, TeamMember, ActivityEvent, Notification, AppearanceSettings,
  sampleProjects, sampleTasks, sampleTeam, sampleActivity, sampleNotifications,
  defaultAppearance, generateId
} from '../data/sampleData';

// ===== STATE =====
interface AppState {
  projects: Project[];
  tasks: Task[];
  team: TeamMember[];
  activity: ActivityEvent[];
  notifications: Notification[];
  appearance: AppearanceSettings;
  currentView: string;
  selectedProjectId: string | null;
  searchOpen: boolean;
  searchQuery: string;
  mobileNavOpen: boolean;
}

type Action =
  | { type: 'SET_VIEW'; payload: string }
  | { type: 'SELECT_PROJECT'; payload: string | null }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK_STATUS'; payload: string }
  | { type: 'ADD_ACTIVITY'; payload: ActivityEvent }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'DISMISS_NOTIFICATION'; payload: string }
  | { type: 'UPDATE_APPEARANCE'; payload: Partial<AppearanceSettings> }
  | { type: 'RESET_APPEARANCE' }
  | { type: 'TOGGLE_SEARCH' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_MOBILE_NAV' }
  | { type: 'RESET_DATA' };

const STORAGE_KEY = 'glass-ui-dashboard';

function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.projects && parsed.tasks) {
        return {
          ...parsed,
          currentView: 'overview',
          selectedProjectId: null,
          searchOpen: false,
          searchQuery: '',
          mobileNavOpen: false,
        };
      }
    }
  } catch (e) {
    // Invalid stored data, use defaults
  }
  return {
    projects: sampleProjects,
    tasks: sampleTasks,
    team: sampleTeam,
    activity: sampleActivity,
    notifications: sampleNotifications,
    appearance: defaultAppearance,
    currentView: 'overview',
    selectedProjectId: null,
    searchOpen: false,
    searchQuery: '',
    mobileNavOpen: false,
  };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload, selectedProjectId: null, mobileNavOpen: false };
    case 'SELECT_PROJECT':
      return { ...state, selectedProjectId: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [action.payload, ...state.projects] };
    case 'UPDATE_PROJECT':
      return { ...state, projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        tasks: state.tasks.filter(t => t.projectId !== action.payload),
        selectedProjectId: state.selectedProjectId === action.payload ? null : state.selectedProjectId,
      };
    case 'ADD_TASK': {
      const newProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          const projTasks = [...state.tasks.filter(t => t.projectId === p.id), action.payload];
          const doneTasks = projTasks.filter(t => t.status === 'done');
          return { ...p, progress: Math.round((doneTasks.length / projTasks.length) * 100) };
        }
        return p;
      });
      return { ...state, tasks: [action.payload, ...state.tasks], projects: newProjects };
    }
    case 'UPDATE_TASK': {
      const newProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          const projTasks = state.tasks.map(t => t.id === action.payload.id ? action.payload : t).filter(t => t.projectId === p.id);
          const doneTasks = projTasks.filter(t => t.status === 'done');
          return { ...p, progress: projTasks.length > 0 ? Math.round((doneTasks.length / projTasks.length) * 100) : p.progress };
        }
        return p;
      });
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t), projects: newProjects };
    }
    case 'DELETE_TASK': {
      const task = state.tasks.find(t => t.id === action.payload);
      if (!task) return state;
      const remainingTasks = state.tasks.filter(t => t.id !== action.payload && t.projectId === task.projectId);
      const newProjects = state.projects.map(p => {
        if (p.id === task.projectId) {
          const doneTasks = remainingTasks.filter(t => t.status === 'done');
          return { ...p, progress: remainingTasks.length > 0 ? Math.round((doneTasks.length / remainingTasks.length) * 100) : p.progress };
        }
        return p;
      });
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload), projects: newProjects };
    }
    case 'TOGGLE_TASK_STATUS': {
      const task = state.tasks.find(t => t.id === action.payload);
      if (!task) return state;
      const newStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done';
      const updatedTask: Task = { ...task, status: newStatus, completedAt: newStatus === 'done' ? new Date().toISOString() : undefined };
      const newProjects = state.projects.map(p => {
        if (p.id === task.projectId) {
          const projTasks = state.tasks.map(t => t.id === task.id ? updatedTask : t).filter(t => t.projectId === p.id);
          const doneTasks = projTasks.filter(t => t.status === 'done');
          return { ...p, progress: projTasks.length > 0 ? Math.round((doneTasks.length / projTasks.length) * 100) : p.progress };
        }
        return p;
      });
      const activityEvent: ActivityEvent = {
        id: generateId(),
        type: 'task-completed',
        description: newStatus === 'done' ? `"${task.title}" marked as done` : `"${task.title}" reopened`,
        timestamp: new Date().toISOString(),
        projectId: task.projectId,
        taskId: task.id,
      };
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === task.id ? updatedTask : t),
        projects: newProjects,
        activity: [activityEvent, ...state.activity],
      };
    }
    case 'ADD_ACTIVITY':
      return { ...state, activity: [action.payload, ...state.activity].slice(0, 50) };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return { ...state, notifications: state.notifications.map(n => n.id === action.payload ? { ...n, read: true } : n) };
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };
    case 'DISMISS_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    case 'UPDATE_APPEARANCE':
      return { ...state, appearance: { ...state.appearance, ...action.payload } };
    case 'RESET_APPEARANCE':
      return { ...state, appearance: defaultAppearance };
    case 'TOGGLE_SEARCH':
      return { ...state, searchOpen: !state.searchOpen, searchQuery: state.searchOpen ? '' : state.searchQuery };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'TOGGLE_MOBILE_NAV':
      return { ...state, mobileNavOpen: !state.mobileNavOpen };
    case 'RESET_DATA':
      return {
        projects: sampleProjects,
        tasks: sampleTasks,
        team: sampleTeam,
        activity: sampleActivity,
        notifications: sampleNotifications,
        appearance: state.appearance,
        currentView: 'overview',
        selectedProjectId: null,
        searchOpen: false,
        searchQuery: '',
        mobileNavOpen: false,
      };
    default:
      return state;
  }
}

// ===== CONTEXT =====
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  getTeamMember: (id: string) => TeamMember | undefined;
  getProject: (id: string) => Project | undefined;
  getProjectTasks: (projectId: string) => Task[];
  getMetrics: () => { activeProjects: number; openTasks: number; completedThisWeek: number; teamMomentum: number };
  searchResults: () => { projects: Project[]; tasks: Task[] };
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    try {
      const toStore = {
        projects: state.projects,
        tasks: state.tasks,
        activity: state.activity,
        notifications: state.notifications,
        appearance: state.appearance,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (e) {
      // Storage unavailable
    }
  }, [state.projects, state.tasks, state.activity, state.notifications, state.appearance]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--glass-blur', `${state.appearance.blurIntensity}px`);
    root.style.setProperty('--glass-blur-heavy', `${state.appearance.blurIntensity * 1.5}px`);
    root.style.setProperty('--glass-bg-primary', `rgba(255, 255, 255, ${state.appearance.surfaceOpacity})`);
    root.style.setProperty('--glass-bg', `rgba(255, 255, 255, ${state.appearance.surfaceOpacity * 0.8})`);
    root.style.setProperty('--glass-bg-floating', `rgba(255, 255, 255, ${state.appearance.surfaceOpacity * 1.5})`);
    root.style.setProperty('--glass-bg-hover', `rgba(255, 255, 255, ${state.appearance.surfaceOpacity * 1.2})`);
    root.style.setProperty('--accent-primary', state.appearance.accentColor);
  }, [state.appearance]);

  const getTeamMember = useCallback((id: string) => state.team.find(m => m.id === id), [state.team]);
  const getProject = useCallback((id: string) => state.projects.find(p => p.id === id), [state.projects]);
  const getProjectTasks = useCallback((projectId: string) => state.tasks.filter(t => t.projectId === projectId), [state.tasks]);

  const getMetrics = useCallback(() => {
    const activeProjects = state.projects.filter(p => p.status === 'in-progress' || p.status === 'at-risk').length;
    const openTasks = state.tasks.filter(t => t.status !== 'done').length;
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const completedThisWeek = state.tasks.filter(t => t.status === 'done' && t.completedAt && new Date(t.completedAt) >= weekAgo).length;
    const totalTasks = state.tasks.length;
    const doneTasks = state.tasks.filter(t => t.status === 'done').length;
    const teamMomentum = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
    return { activeProjects, openTasks, completedThisWeek, teamMomentum };
  }, [state.projects, state.tasks]);

  const searchResults = useCallback(() => {
    const q = state.searchQuery.toLowerCase().trim();
    if (!q) return { projects: [], tasks: [] };
    const projects = state.projects.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    const tasks = state.tasks.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    return { projects, tasks };
  }, [state.searchQuery, state.projects, state.tasks]);

  return (
    <AppContext.Provider value={{ state, dispatch, getTeamMember, getProject, getProjectTasks, getMetrics, searchResults }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
