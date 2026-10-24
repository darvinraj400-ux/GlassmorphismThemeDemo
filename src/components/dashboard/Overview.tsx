import React from 'react';
import { useApp } from '../../lib/store';
import { GlassPanel, ProgressBar, Avatar, StatusBadge } from '../ui';
import { FolderKanban, ListTodo, CheckCircle2, TrendingUp, ArrowRight, Clock, Plus } from 'lucide-react';
import { formatDate, formatRelativeTime, getStatusLabel } from '../../data/sampleData';

// ===== WELCOME PANEL =====
function WelcomePanel({ onNewProject }: { onNewProject: () => void }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <GlassPanel level={2} className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">{greeting}.</h2>
          <p className="text-sm text-[var(--muted-blue-grey)]">
            Here's what's happening in your workspace this week.
          </p>
        </div>
        <button onClick={onNewProject} className="btn-glass btn-primary text-xs">
          <Plus size={14} />
          New Project
        </button>
      </div>
    </GlassPanel>
  );
}

// ===== METRICS GRID =====
function MetricsGrid() {
  const { getMetrics } = useApp();
  const metrics = getMetrics();

  const cards = [
    { label: 'Active Projects', value: metrics.activeProjects, icon: FolderKanban, trend: '+2 this month', color: 'var(--electric-violet)' },
    { label: 'Open Tasks', value: metrics.openTasks, icon: ListTodo, trend: 'Across all projects', color: 'var(--luminous-cyan)' },
    { label: 'Completed This Week', value: metrics.completedThisWeek, icon: CheckCircle2, trend: 'Sample data', color: 'var(--aqua-mint)' },
    { label: 'Team Momentum', value: `${metrics.teamMomentum}%`, icon: TrendingUp, trend: 'Overall completion rate', color: 'var(--soft-lavender)' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <GlassPanel key={i} level={2} className="p-4 glass-interactive" interactive>
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg" style={{ background: `${card.color}15` }}>
              <card.icon size={18} style={{ color: card.color }} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-0.5">{card.value}</p>
          <p className="text-xs text-[var(--muted-blue-grey)] mb-1">{card.label}</p>
          <p className="text-[10px] text-[var(--muted-blue-grey)] opacity-70">{card.trend}</p>
        </GlassPanel>
      ))}
    </div>
  );
}

// ===== PROJECT OVERVIEW =====
function ProjectOverview({ onProjectClick }: { onProjectClick: (id: string) => void }) {
  const { state, dispatch } = useApp();
  const activeProjects = state.projects.filter(p => p.status !== 'completed' && p.status !== 'on-hold').slice(0, 4);

  return (
    <GlassPanel level={2} className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Active Projects</h3>
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'projects' })}
          className="text-xs text-[var(--electric-violet)] hover:underline flex items-center gap-1"
        >
          View all <ArrowRight size={12} />
        </button>
      </div>
      <div className="space-y-3">
        {activeProjects.map(project => (
          <button
            key={project.id}
            onClick={() => onProjectClick(project.id)}
            className="w-full text-left p-3 rounded-xl border border-white/5 hover:border-white/15 hover:bg-white/5 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-white">{project.name}</h4>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-[11px] text-[var(--muted-blue-grey)] mb-2 line-clamp-1">{project.description}</p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <ProgressBar value={project.progress} />
              </div>
              <span className="text-[11px] text-[var(--muted-blue-grey)] font-medium">{project.progress}%</span>
            </div>
          </button>
        ))}
      </div>
    </GlassPanel>
  );
}

// ===== TASK OVERVIEW =====
function TaskOverview() {
  const { state } = useApp();
  const recentTasks = state.tasks.filter(t => t.status !== 'done').slice(0, 5);

  return (
    <GlassPanel level={2} className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Recent Tasks</h3>
        <span className="text-[10px] text-[var(--muted-blue-grey)]">{state.tasks.filter(t => t.status !== 'done').length} open</span>
      </div>
      <div className="space-y-2">
        {recentTasks.map(task => {
          const project = state.projects.find(p => p.id === task.projectId);
          return (
            <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                task.priority === 'high' ? 'bg-orange-400' : task.priority === 'medium' ? 'bg-[var(--soft-lavender)]' : 'bg-[var(--aqua-mint)]'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white truncate">{task.title}</p>
                <p className="text-[10px] text-[var(--muted-blue-grey)]">{project?.name}</p>
              </div>
              <StatusBadge status={task.status} />
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}

// ===== ACTIVITY FEED =====
function ActivityFeed() {
  const { state } = useApp();
  const recentActivity = state.activity.slice(0, 6);

  const getIcon = (type: string) => {
    switch (type) {
      case 'task-completed': return '✓';
      case 'task-added': return '+';
      case 'project-created': return '◆';
      case 'project-status-changed': return '↻';
      default: return '•';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'task-completed': return 'text-[var(--aqua-mint)] bg-[var(--aqua-mint)]/10';
      case 'task-added': return 'text-[var(--luminous-cyan)] bg-[var(--luminous-cyan)]/10';
      case 'project-created': return 'text-[var(--electric-violet)] bg-[var(--electric-violet)]/10';
      case 'project-status-changed': return 'text-[var(--soft-lavender)] bg-[var(--soft-lavender)]/10';
      default: return 'text-[var(--muted-blue-grey)] bg-white/5';
    }
  };

  return (
    <GlassPanel level={2} className="p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {recentActivity.map(event => (
          <div key={event.id} className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${getIconColor(event.type)}`}>
              {getIcon(event.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white leading-relaxed">{event.description}</p>
              <p className="text-[10px] text-[var(--muted-blue-grey)] mt-0.5 flex items-center gap-1">
                <Clock size={9} />
                {formatRelativeTime(event.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

// ===== TEAM OVERVIEW =====
function TeamOverview() {
  const { state } = useApp();

  return (
    <GlassPanel level={2} className="p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Team</h3>
      <div className="space-y-3">
        {state.team.slice(0, 5).map(member => {
          const memberTasks = state.tasks.filter(t => t.assigneeId === member.id && t.status !== 'done');
          return (
            <div key={member.id} className="flex items-center gap-3">
              <Avatar name={member.name} color={member.avatarColor} size={30} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white font-medium truncate">{member.name}</p>
                <p className="text-[10px] text-[var(--muted-blue-grey)]">{member.role}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  member.status === 'active' ? 'bg-green-400' : member.status === 'away' ? 'bg-yellow-400' : 'bg-gray-500'
                }`} />
                <span className="text-[10px] text-[var(--muted-blue-grey)]">{memberTasks.length} tasks</span>
              </div>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}

// ===== MAIN OVERVIEW =====
export function Overview({ onNewProject }: { onNewProject: () => void }) {
  const { dispatch } = useApp();

  const handleProjectClick = (id: string) => {
    dispatch({ type: 'SELECT_PROJECT', payload: id });
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      <WelcomePanel onNewProject={onNewProject} />
      <MetricsGrid />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ProjectOverview onProjectClick={handleProjectClick} />
        </div>
        <div>
          <TaskOverview />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ActivityFeed />
        <TeamOverview />
      </div>
    </div>
  );
}
