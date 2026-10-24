import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../lib/store';
import {
  LayoutDashboard, FolderKanban, ListTodo, Users, BarChart3,
  Search, Bell, Plus, Menu, X, Settings, LogOut, ChevronDown
} from 'lucide-react';
import { GlassPanel } from '../ui';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
];

// ===== SIDEBAR =====
export function Sidebar() {
  const { state, dispatch } = useApp();

  return (
    <aside className="hidden lg:flex flex-col w-56 h-screen sticky top-0 p-4 z-20">
      <div className="glass-primary p-3 flex-1 flex flex-col">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-2 py-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--electric-violet)] to-[var(--luminous-cyan)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <div>
            <h1 className="text-xs font-bold text-white tracking-wide">GLASS UI</h1>
            <p className="text-[10px] text-[var(--muted-blue-grey)]">Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1" aria-label="Main navigation">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => dispatch({ type: 'SET_VIEW', payload: item.id })}
              className={`nav-item w-full relative ${state.currentView === item.id ? 'active' : ''}`}
              aria-current={state.currentView === item.id ? 'page' : undefined}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="pt-4 border-t border-white/5 space-y-1">
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'settings' })}
            className={`nav-item w-full relative ${state.currentView === 'settings' ? 'active' : ''}`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

// ===== MOBILE NAV =====
export function MobileNav() {
  const { state, dispatch } = useApp();

  if (!state.mobileNavOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => dispatch({ type: 'TOGGLE_MOBILE_NAV' })} />
      <div className="absolute left-0 top-0 bottom-0 w-72 glass-floating p-4 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--electric-violet)] to-[var(--luminous-cyan)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <h1 className="text-sm font-bold text-white">GLASS UI</h1>
          </div>
          <button onClick={() => dispatch({ type: 'TOGGLE_MOBILE_NAV' })} className="p-2 rounded-lg hover:bg-white/10" aria-label="Close menu">
            <X size={20} className="text-[var(--muted-blue-grey)]" />
          </button>
        </div>
        <nav className="space-y-1" aria-label="Mobile navigation">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => dispatch({ type: 'SET_VIEW', payload: item.id })}
              className={`nav-item w-full relative ${state.currentView === item.id ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'settings' })}
            className={`nav-item w-full relative ${state.currentView === 'settings' ? 'active' : ''}`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

// ===== HEADER =====
export function Header({ onNewProject }: { onNewProject: () => void }) {
  const { state, dispatch } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const unreadCount = state.notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const viewTitles: Record<string, string> = {
    overview: 'Overview',
    projects: 'Projects',
    tasks: 'Tasks',
    team: 'Team',
    insights: 'Insights',
    settings: 'Settings',
  };

  return (
    <header className="sticky top-0 z-30 px-4 py-3 lg:px-6">
      <div className="glass-primary px-4 py-2.5 flex items-center gap-3">
        {/* Mobile menu */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => dispatch({ type: 'TOGGLE_MOBILE_NAV' })}
          aria-label="Open navigation menu"
        >
          <Menu size={20} className="text-[var(--muted-blue-grey)]" />
        </button>

        {/* Page title */}
        <h2 className="text-sm font-semibold text-white flex-1">
          {viewTitles[state.currentView] || 'Overview'}
        </h2>

        {/* Search */}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SEARCH' })}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Search"
        >
          <Search size={18} className="text-[var(--muted-blue-grey)]" />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors relative"
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
          >
            <Bell size={18} className="text-[var(--muted-blue-grey)]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--electric-violet)] rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 glass-floating p-4 animate-scale-in max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                <button
                  onClick={() => dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' })}
                  className="text-xs text-[var(--electric-violet)] hover:underline"
                >
                  Mark all read
                </button>
              </div>
              {state.notifications.length === 0 ? (
                <p className="text-xs text-[var(--muted-blue-grey)] text-center py-4">No notifications</p>
              ) : (
                <div className="space-y-2">
                  {state.notifications.map(n => (
                    <div key={n.id} className={`p-2.5 rounded-lg border transition-colors ${n.read ? 'border-transparent' : 'border-white/10 bg-white/5'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium text-white">{n.title}</p>
                          <p className="text-[11px] text-[var(--muted-blue-grey)] mt-0.5">{n.message}</p>
                        </div>
                        <button
                          onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', payload: n.id })}
                          className="p-0.5 hover:bg-white/10 rounded"
                          aria-label="Dismiss notification"
                        >
                          <X size={12} className="text-[var(--muted-blue-grey)]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* New Project */}
        <button onClick={onNewProject} className="btn-glass btn-primary text-xs hidden sm:inline-flex">
          <Plus size={14} />
          <span>New Project</span>
        </button>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="User menu"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--electric-violet)] to-[var(--luminous-cyan)] flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">U</span>
            </div>
            <ChevronDown size={12} className="text-[var(--muted-blue-grey)] hidden sm:block" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 glass-floating p-2 animate-scale-in">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="text-xs font-medium text-white">Demo User</p>
                <p className="text-[10px] text-[var(--muted-blue-grey)]">demo@glassui.app</p>
              </div>
              <button
                onClick={() => { dispatch({ type: 'SET_VIEW', payload: 'settings' }); setProfileOpen(false); }}
                className="nav-item w-full text-xs"
              >
                <Settings size={14} />
                <span>Settings</span>
              </button>
              <button
                onClick={() => { dispatch({ type: 'RESET_DATA' }); setProfileOpen(false); }}
                className="nav-item w-full text-xs"
              >
                <LogOut size={14} />
                <span>Reset Demo Data</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ===== GLOBAL SEARCH OVERLAY =====
export function GlobalSearch() {
  const { state, dispatch, getProject, searchResults } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const results = searchResults();

  useEffect(() => {
    if (state.searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_SEARCH' });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  if (!state.searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => dispatch({ type: 'TOGGLE_SEARCH' })} />
      <div className="glass-floating relative w-full max-w-xl animate-scale-in">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Search size={18} className="text-[var(--muted-blue-grey)] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={state.searchQuery}
              onChange={e => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
              placeholder="Search projects and tasks..."
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[var(--muted-blue-grey)]"
              aria-label="Search"
            />
            <kbd className="text-[10px] text-[var(--muted-blue-grey)] border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
          </div>
        </div>
        <div className="p-4 max-h-80 overflow-y-auto">
          {state.searchQuery.trim() === '' ? (
            <p className="text-xs text-[var(--muted-blue-grey)] text-center py-4">Type to search projects and tasks</p>
          ) : results.projects.length === 0 && results.tasks.length === 0 ? (
            <p className="text-xs text-[var(--muted-blue-grey)] text-center py-4">No results found</p>
          ) : (
            <div className="space-y-3">
              {results.projects.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-[var(--muted-blue-grey)] uppercase tracking-wider mb-2">Projects</p>
                  {results.projects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { dispatch({ type: 'SELECT_PROJECT', payload: p.id }); dispatch({ type: 'SET_VIEW', payload: 'projects' }); dispatch({ type: 'TOGGLE_SEARCH' }); }}
                      className="w-full text-left p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <p className="text-sm text-white">{p.name}</p>
                      <p className="text-[11px] text-[var(--muted-blue-grey)]">{p.description.slice(0, 60)}...</p>
                    </button>
                  ))}
                </div>
              )}
              {results.tasks.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-[var(--muted-blue-grey)] uppercase tracking-wider mb-2">Tasks</p>
                  {results.tasks.map(t => {
                    const project = getProject(t.projectId);
                    return (
                      <button
                        key={t.id}
                        onClick={() => { dispatch({ type: 'SELECT_PROJECT', payload: t.projectId }); dispatch({ type: 'SET_VIEW', payload: 'projects' }); dispatch({ type: 'TOGGLE_SEARCH' }); }}
                        className="w-full text-left p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <p className="text-sm text-white">{t.title}</p>
                        <p className="text-[11px] text-[var(--muted-blue-grey)]">{project?.name}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
