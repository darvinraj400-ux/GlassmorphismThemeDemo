import React, { useState } from 'react';
import { useApp } from '../../lib/store';
import { GlassPanel, Modal, FormField, ProgressBar, StatusBadge, Avatar, EmptyState, ConfirmDialog } from '../ui';
import { showToast } from '../ui';
import { Plus, Search, Filter, ArrowLeft, Calendar, Users, ListTodo, Edit2, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Project, Task, ProjectStatus, TaskStatus, Priority, formatDate, getStatusLabel, generateId, getTaskStatusLabel } from '../../data/sampleData';

// ===== PROJECT FILTERS =====
function ProjectFilters({ statusFilter, setStatusFilter, searchQuery, setSearchQuery, sortBy, setSortBy }: {
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      <div className="relative flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-blue-grey)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="glass-input pl-9 text-xs"
        />
      </div>
      <select
        value={statusFilter}
        onChange={e => setStatusFilter(e.target.value)}
        className="glass-input glass-select text-xs w-auto"
      >
        <option value="all">All Status</option>
        <option value="planning">Planning</option>
        <option value="in-progress">In Progress</option>
        <option value="at-risk">At Risk</option>
        <option value="completed">Completed</option>
        <option value="on-hold">On Hold</option>
      </select>
      <select
        value={sortBy}
        onChange={e => setSortBy(e.target.value)}
        className="glass-input glass-select text-xs w-auto"
      >
        <option value="name">Sort by Name</option>
        <option value="progress">Sort by Progress</option>
        <option value="dueDate">Sort by Due Date</option>
      </select>
    </div>
  );
}

// ===== PROJECT FORM =====
function ProjectForm({ project, onSave, onClose }: { project?: Project; onSave: (p: Project) => void; onClose: () => void }) {
  const { state } = useApp();
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [status, setStatus] = useState<ProjectStatus>(project?.status || 'planning');
  const [dueDate, setDueDate] = useState(project?.dueDate || '');
  const [teamMembers, setTeamMembers] = useState<string[]>(project?.teamMembers || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Project name is required';
    if (!description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const p: Project = {
      id: project?.id || `proj-${generateId()}`,
      name: name.trim(),
      description: description.trim(),
      status,
      progress: project?.progress || 0,
      startDate: project?.startDate || new Date().toISOString().split('T')[0],
      dueDate: dueDate || project?.dueDate || '',
      teamMembers,
      createdAt: project?.createdAt || new Date().toISOString(),
    };
    onSave(p);
  };

  const toggleMember = (id: string) => {
    setTeamMembers(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Project Name" error={errors.name}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} className="glass-input" placeholder="e.g., Website Refresh" />
      </FormField>
      <FormField label="Description" error={errors.description}>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className="glass-input min-h-[80px] resize-none" placeholder="Brief project description..." />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Status">
          <select value={status} onChange={e => setStatus(e.target.value as ProjectStatus)} className="glass-input glass-select">
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="at-risk">At Risk</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </FormField>
        <FormField label="Due Date">
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="glass-input" />
        </FormField>
      </div>
      <FormField label="Team Members">
        <div className="flex flex-wrap gap-2">
          {state.team.map(member => (
            <button
              key={member.id}
              type="button"
              onClick={() => toggleMember(member.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] border transition-all ${
                teamMembers.includes(member.id)
                  ? 'border-[var(--electric-violet)]/50 bg-[var(--electric-violet)]/10 text-white'
                  : 'border-white/10 text-[var(--muted-blue-grey)] hover:border-white/20'
              }`}
            >
              <Avatar name={member.name} color={member.avatarColor} size={18} />
              {member.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </FormField>
      <div className="flex gap-3 justify-end mt-6">
        <button type="button" onClick={onClose} className="btn-glass">Cancel</button>
        <button type="submit" className="btn-glass btn-primary">{project ? 'Update Project' : 'Create Project'}</button>
      </div>
    </form>
  );
}

// ===== PROJECT CARD =====
function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const { state, getTeamMember } = useApp();
  const taskCount = state.tasks.filter(t => t.projectId === project.id).length;

  return (
    <GlassPanel level={2} className="p-4 glass-interactive" interactive onClick={onClick}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold text-white">{project.name}</h3>
        <StatusBadge status={project.status} />
      </div>
      <p className="text-[11px] text-[var(--muted-blue-grey)] mb-3 line-clamp-2">{project.description}</p>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1">
          <ProgressBar value={project.progress} />
        </div>
        <span className="text-[11px] text-[var(--muted-blue-grey)] font-medium">{project.progress}%</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {project.teamMembers.slice(0, 3).map(id => {
            const member = getTeamMember(id);
            return member ? <Avatar key={id} name={member.name} color={member.avatarColor} size={22} /> : null;
          })}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[var(--muted-blue-grey)]">
          <span className="flex items-center gap-1"><ListTodo size={10} /> {taskCount} tasks</span>
          {project.dueDate && <span className="flex items-center gap-1"><Calendar size={10} /> {formatDate(project.dueDate)}</span>}
        </div>
      </div>
    </GlassPanel>
  );
}

// ===== PROJECT DETAIL =====
function ProjectDetail({ projectId, onBack, onNewTask }: { projectId: string; onBack: () => void; onNewTask: () => void }) {
  const { state, dispatch, getTeamMember, getProjectTasks } = useApp();
  const project = state.projects.find(p => p.id === projectId);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  if (!project) return <EmptyState title="Project not found" description="This project may have been deleted." />;

  const tasks = getProjectTasks(projectId);
  const members = project.teamMembers.map(id => getTeamMember(id)).filter(Boolean);

  const handleStatusChange = (newStatus: ProjectStatus) => {
    dispatch({
      type: 'UPDATE_PROJECT',
      payload: { ...project, status: newStatus },
    });
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: {
        id: generateId(),
        type: 'project-status-changed',
        description: `${project.name} status changed to ${getStatusLabel(newStatus)}`,
        timestamp: new Date().toISOString(),
        projectId: project.id,
      },
    });
    showToast(`Project status updated to ${getStatusLabel(newStatus)}`, 'success');
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_PROJECT', payload: projectId });
    showToast('Project deleted', 'info');
    onBack();
  };

  const handleToggleTask = (taskId: string) => {
    dispatch({ type: 'TOGGLE_TASK_STATUS', payload: taskId });
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Header */}
      <GlassPanel level={2} className="p-5">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-[var(--muted-blue-grey)] hover:text-white mb-4 transition-colors">
          <ArrowLeft size={14} /> Back to Projects
        </button>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-semibold text-white">{project.name}</h2>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm text-[var(--muted-blue-grey)] mb-3">{project.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-[var(--muted-blue-grey)]">
              <span className="flex items-center gap-1"><Calendar size={12} /> Due: {project.dueDate ? formatDate(project.dueDate) : 'No date'}</span>
              <span className="flex items-center gap-1"><Users size={12} /> {members.length} members</span>
              <span className="flex items-center gap-1"><ListTodo size={12} /> {tasks.length} tasks</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setEditOpen(true)} className="btn-glass text-xs"><Edit2 size={12} /> Edit</button>
            <button onClick={() => setDeleteConfirm(true)} className="btn-glass btn-danger text-xs"><Trash2 size={12} /></button>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1"><ProgressBar value={project.progress} /></div>
          <span className="text-sm font-semibold text-white">{project.progress}%</span>
        </div>
        {/* Status change */}
        <div className="mt-4 flex flex-wrap gap-2">
          {(['planning', 'in-progress', 'at-risk', 'completed', 'on-hold'] as ProjectStatus[]).map(s => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all ${
                project.status === s ? 'border-[var(--electric-violet)]/50 bg-[var(--electric-violet)]/15 text-white' : 'border-white/10 text-[var(--muted-blue-grey)] hover:border-white/20'
              }`}
            >
              {getStatusLabel(s)}
            </button>
          ))}
        </div>
      </GlassPanel>

      {/* Team */}
      <GlassPanel level={2} className="p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Team Members</h3>
        <div className="flex flex-wrap gap-3">
          {members.map(m => m && (
            <div key={m.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/5">
              <Avatar name={m.name} color={m.avatarColor} size={28} />
              <div>
                <p className="text-xs text-white font-medium">{m.name}</p>
                <p className="text-[10px] text-[var(--muted-blue-grey)]">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Tasks */}
      <GlassPanel level={2} className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Tasks</h3>
          <button onClick={onNewTask} className="btn-glass text-xs"><Plus size={12} /> Add Task</button>
        </div>
        {tasks.length === 0 ? (
          <EmptyState title="No tasks yet" description="Add a task to this project to get started." action={<button onClick={onNewTask} className="btn-glass btn-primary text-xs mt-2"><Plus size={12} /> Add Task</button>} />
        ) : (
          <div className="space-y-2">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                <button
                  onClick={() => handleToggleTask(task.id)}
                  className="flex-shrink-0"
                  aria-label={task.status === 'done' ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {task.status === 'done' ? (
                    <CheckCircle2 size={18} className="text-[var(--aqua-mint)]" />
                  ) : (
                    <Circle size={18} className="text-[var(--muted-blue-grey)] hover:text-white transition-colors" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs ${task.status === 'done' ? 'line-through text-[var(--muted-blue-grey)]' : 'text-white'}`}>{task.title}</p>
                  <p className="text-[10px] text-[var(--muted-blue-grey)]">{getTaskStatusLabel(task.status)} · {task.priority} priority</p>
                </div>
                <StatusBadge status={task.priority} />
              </div>
            ))}
          </div>
        )}
      </GlassPanel>

      {/* Modals */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Project">
        <ProjectForm
          project={project}
          onSave={(p) => {
            dispatch({ type: 'UPDATE_PROJECT', payload: p });
            setEditOpen(false);
            showToast('Project updated', 'success');
          }}
          onClose={() => setEditOpen(false)}
        />
      </Modal>
      <ConfirmDialog
        open={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? All associated tasks will also be deleted. This action cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}

// ===== PROJECTS LIST =====
function ProjectsList({ onSelectProject, onNewProject, onNewTask }: { onSelectProject: (id: string) => void; onNewProject: () => void; onNewTask: () => void }) {
  const { state, dispatch } = useApp();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  let filtered = state.projects.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'progress') return b.progress - a.progress;
    if (sortBy === 'dueDate') return (a.dueDate || '').localeCompare(b.dueDate || '');
    return 0;
  });

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-white">Projects</h2>
        <button onClick={onNewProject} className="btn-glass btn-primary text-xs"><Plus size={14} /> New Project</button>
      </div>
      <ProjectFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      {filtered.length === 0 ? (
        <EmptyState title="No projects found" description="Try adjusting your filters or create a new project." action={<button onClick={onNewProject} className="btn-glass btn-primary text-xs mt-2"><Plus size={12} /> Create Project</button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(project => (
            <ProjectCard key={project.id} project={project} onClick={() => onSelectProject(project.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ===== PROJECTS PAGE =====
export function Projects({ onNewTask, externalNewProject, onExternalClose }: { onNewTask: () => void; externalNewProject?: boolean; onExternalClose?: () => void }) {
  const { state, dispatch } = useApp();
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [taskFormOpen, setTaskFormOpen] = useState(false);

  // Handle external new project trigger
  React.useEffect(() => {
    if (externalNewProject) {
      setProjectFormOpen(true);
      onExternalClose?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalNewProject]);

  const handleNewProject = () => setProjectFormOpen(true);

  const handleSaveProject = (project: Project) => {
    if (state.projects.find(p => p.id === project.id)) {
      dispatch({ type: 'UPDATE_PROJECT', payload: project });
      showToast('Project updated', 'success');
    } else {
      dispatch({ type: 'ADD_PROJECT', payload: project });
      dispatch({
        type: 'ADD_ACTIVITY',
        payload: {
          id: generateId(),
          type: 'project-created',
          description: `New project "${project.name}" created`,
          timestamp: new Date().toISOString(),
          projectId: project.id,
        },
      });
      showToast('Project created', 'success');
    }
    setProjectFormOpen(false);
  };

  if (state.selectedProjectId) {
    return (
      <>
        <ProjectDetail
          projectId={state.selectedProjectId}
          onBack={() => dispatch({ type: 'SELECT_PROJECT', payload: null })}
          onNewTask={() => setTaskFormOpen(true)}
        />
        <TaskFormModal
          open={taskFormOpen}
          onClose={() => setTaskFormOpen(false)}
          projectId={state.selectedProjectId}
        />
      </>
    );
  }

  return (
    <>
      <ProjectsList
        onSelectProject={(id) => dispatch({ type: 'SELECT_PROJECT', payload: id })}
        onNewProject={handleNewProject}
        onNewTask={onNewTask}
      />
      <Modal open={projectFormOpen} onClose={() => setProjectFormOpen(false)} title="New Project">
        <ProjectForm onSave={handleSaveProject} onClose={() => setProjectFormOpen(false)} />
      </Modal>
    </>
  );
}

// ===== TASK FORM MODAL =====
function TaskFormModal({ open, onClose, projectId, task }: { open: boolean; onClose: () => void; projectId: string; task?: Task }) {
  const { state, dispatch } = useApp();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'medium');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'todo');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Task title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const t: Task = {
      id: task?.id || `task-${generateId()}`,
      title: title.trim(),
      description: description.trim(),
      projectId,
      status,
      priority,
      dueDate: dueDate || '',
      assigneeId: assigneeId || '',
      createdAt: task?.createdAt || new Date().toISOString(),
      completedAt: task?.completedAt,
    };
    if (task) {
      dispatch({ type: 'UPDATE_TASK', payload: t });
      showToast('Task updated', 'success');
    } else {
      dispatch({ type: 'ADD_TASK', payload: t });
      dispatch({
        type: 'ADD_ACTIVITY',
        payload: {
          id: generateId(),
          type: 'task-added',
          description: `"${t.title}" added to project`,
          timestamp: new Date().toISOString(),
          projectId,
          taskId: t.id,
        },
      });
      showToast('Task created', 'success');
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={task ? 'Edit Task' : 'New Task'}>
      <form onSubmit={handleSubmit}>
        <FormField label="Task Title" error={errors.title}>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="glass-input" placeholder="e.g., Design homepage mockup" />
        </FormField>
        <FormField label="Description">
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="glass-input min-h-[60px] resize-none" placeholder="Task description..." />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Priority">
            <select value={priority} onChange={e => setPriority(e.target.value as Priority)} className="glass-input glass-select">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </FormField>
          <FormField label="Status">
            <select value={status} onChange={e => setStatus(e.target.value as TaskStatus)} className="glass-input glass-select">
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Due Date">
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="glass-input" />
          </FormField>
          <FormField label="Assignee">
            <select value={assigneeId} onChange={e => setAssigneeId(e.target.value)} className="glass-input glass-select">
              <option value="">Unassigned</option>
              {state.team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </FormField>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button type="button" onClick={onClose} className="btn-glass">Cancel</button>
          <button type="submit" className="btn-glass btn-primary">{task ? 'Update Task' : 'Create Task'}</button>
        </div>
      </form>
    </Modal>
  );
}

export { TaskFormModal };
