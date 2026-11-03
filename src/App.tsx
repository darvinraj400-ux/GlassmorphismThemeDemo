import React, { useState } from 'react';
import { AppProvider, useApp } from './lib/store';
import { Sidebar, MobileNav, Header, GlobalSearch } from './components/layout';
import { Overview } from './components/dashboard/Overview';
import { Projects } from './components/projects/Projects';
import { Tasks } from './components/tasks/Tasks';
import { Team } from './components/team/Team';
import { Insights } from './components/insights/Insights';
import { Settings } from './components/settings/Settings';
import { ToastContainer } from './components/ui';

function AppContent() {
  const { state, dispatch } = useApp();
  const [newProjectOpen, setNewProjectOpen] = useState(false);

  const handleNewProject = () => {
    // Navigate to projects view and open the new project modal
    dispatch({ type: 'SET_VIEW', payload: 'projects' });
    // Small delay to ensure view renders before modal opens
    setTimeout(() => setNewProjectOpen(true), 50);
  };

  const renderView = () => {
    switch (state.currentView) {
      case 'overview':
        return <Overview onNewProject={handleNewProject} />;
      case 'projects':
        return <Projects onNewTask={() => {}} externalNewProject={newProjectOpen} onExternalClose={() => setNewProjectOpen(false)} />;
      case 'tasks':
        return <Tasks />;
      case 'team':
        return <Team />;
      case 'insights':
        return <Insights />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview onNewProject={handleNewProject} />;
    }
  };

  return (
    <>
      {/* Atmospheric Background - fixed behind everything */}
      <div className="atmospheric-bg" aria-hidden="true">
        <div className="atmospheric-orb atmospheric-orb-1" />
        <div className="atmospheric-orb atmospheric-orb-2" />
        <div className="atmospheric-orb atmospheric-orb-3" />
      </div>

      {/* Skip Link */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Application Shell */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', minHeight: '100vh', width: '100%' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%' }}>
          <Header onNewProject={handleNewProject} />
          <main id="main-content" style={{ flex: 1, padding: '16px', paddingBottom: '80px' }} className="lg:p-6">
            {renderView()}
          </main>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Global Search */}
      <GlobalSearch />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />
    </>
  );
}

// ===== MOBILE BOTTOM NAV =====
function MobileBottomNav() {
  const { state, dispatch } = useApp();
  const items = [
    { id: 'overview', label: 'Home', icon: '⬡' },
    { id: 'projects', label: 'Projects', icon: '◈' },
    { id: 'tasks', label: 'Tasks', icon: '☰' },
    { id: 'team', label: 'Team', icon: '◎' },
    { id: 'insights', label: 'Insights', icon: '◊' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-primary border-t border-white/10" aria-label="Mobile navigation">
      <div className="flex items-center justify-around py-2 px-2">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => dispatch({ type: 'SET_VIEW', payload: item.id })}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
              state.currentView === item.id ? 'text-white' : 'text-[var(--muted-blue-grey)]'
            }`}
            aria-current={state.currentView === item.id ? 'page' : undefined}
          >
            <span className="text-base">{item.icon}</span>
            <span className="text-[9px] font-medium">{item.label}</span>
            {state.currentView === item.id && (
              <div className="w-4 h-0.5 rounded-full bg-[var(--electric-violet)] mt-0.5" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ===== APP =====
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
