import React, { useState } from 'react';
import { useApp } from '../../lib/store';
import { GlassPanel, StatusBadge, Avatar, EmptyState, ConfirmDialog } from '../ui';
import { TaskFormModal } from '../projects/Projects';
import { showToast } from '../ui';
import { Plus, Search, Filter, CheckCircle2, Circle, Trash2, Edit2, Calendar, LayoutGrid, List } from 'lucide-react';
import { Task, TaskStatus, Priority, generateId, getTaskStatusLabel } from '../../data/sampleData';

// ===== TASK FILTERS =====
function TaskFilters({ statusFilter, setStatusFilter, priorityFilter, setPriorityFilter, projectFilter, setProjectFilter, searchQuery, setSearchQuery }: {
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  priorityFilter: string;
  setPriorityFilter: (v: string) => void;
  projectFilter: string;
  setProjectFilter: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}) {
  const { state } = useApp();
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      <div className="relative flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-blue-grey)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="glass-input pl-9 text-xs"
        />
      </div>
      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="glass-input glass-select text-xs w-auto">
        <option value="all">All Status</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="glass-input glass-select text-xs w-auto">
        <option value="all">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)} className="glass-input glass-select text-xs w-auto">
        <option value="all">All Projects</option>
        {state.projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
    </div>
  );
}

// ===== TASK ROW =====
function TaskRow({ task, onToggle, onEdit, onDelete }: { task: Task; onToggle: () => void; onEdit: () => void; onDelete: () => void }) {
  const { getProject, getTeamMember } = useApp();
  const project = getProject(task.projectId);
  const assignee = task.assigneeId ? getTeamMember(task.assigneeId) : null;

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/3 transition-all group">
      <button onClick={onToggle} className="flex-shrink-0" aria-label={task.status === 'done' ? 'Mark as incomplete' : 'Mark as complete'}>
        {task.status === 'done' ? (
          <CheckCircle2 size={18} className="text-[var(--aqua-mint)]" />
        ) : (
          <Circle size={18} className="text-[var(--muted-blue-grey)] hover:text-[var(--electric-violet)] transition-colors" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${task.status === 'done' ? 'line-through text-[var(--muted-blue-grey)]' : 'text-white'}`}>{task.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-[var(--muted-blue-grey)]">{project?.name}</span>
          {task.dueDate && (
            <span className="text-[10px] text-[var(--muted-blue-grey)] flex items-center gap-0.5">
              <Calendar size={9} /> {task.dueDate}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={task.priority} />
        <StatusBadge status={task.status} />
        {assignee && <Avatar name={assignee.name} color={assignee.avatarColor} size={24} />}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-white/10" aria-label="Edit task">
          <Edit2 size={12} className="text-[var(--muted-blue-grey)]" />
        </button>
        <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-500/10" aria-label="Delete task">
          <Trash2 size={12} className="text-[var(--muted-blue-grey)] hover:text-red-400" />
        </button>
      </div>
    </div>
  );
}

// ===== BOARD VIEW =====
function BoardView({ tasks, onToggle, onEdit }: { tasks: Task[]; onToggle: (id: string) => void; onEdit: (task: Task) => void }) {
  const columns: { status: TaskStatus; label: string }[] = [
    { status: 'todo', label: 'To Do' },
    { status: 'in-progress', label: 'In Progress' },
    { status: 'done', label: 'Done' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map(col => {
        const colTasks = tasks.filter(t => t.status === col.status);
        return (
          <GlassPanel key={col.status} level={1} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-white">{col.label}</h3>
              <span className="text-[10px] text-[var(--muted-blue-grey)] bg-white/5 px-2 py-0.5 rounded-full">{colTasks.length}</span>
            </div>
            <div className="space-y-2">
              {colTasks.map(task => (
                <div key={task.id} className="p-2.5 rounded-lg border border-white/5 hover:border-white/10 transition-colors cursor-pointer" onClick={() => onEdit(task)}>
                  <p className="text-xs text-white mb-1.5">{task.title}</p>
                  <div className="flex items-center justify-between">
                    <StatusBadge status={task.priority} />
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}
                      className="text-[10px] text-[var(--muted-blue-grey)] hover:text-white"
                    >
                      {task.status === 'done' ? 'Reopen' : 'Complete'}
                    </button>
                  </div>
                </div>
              ))}
              {colTasks.length === 0 && (
                <p className="text-[10px] text-[var(--muted-blue-grey)] text-center py-4">No tasks</p>
              )}
            </div>
          </GlassPanel>
        );
      })}
    </div>
  );
}

// ===== TASKS PAGE =====
export function Tasks() {
  const { state, dispatch } = useApp();
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  let filtered = state.tasks.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (projectFilter !== 'all' && t.projectId !== projectFilter) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleToggle = (taskId: string) => {
    dispatch({ type: 'TOGGLE_TASK_STATUS', payload: taskId });
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      dispatch({ type: 'DELETE_TASK', payload: deleteConfirm });
      showToast('Task deleted', 'info');
      setDeleteConfirm(null);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTaskFormOpen(true);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-white">Tasks</h2>
        <div className="flex items-center gap-2">
          <div className="flex border border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-[var(--muted-blue-grey)]'}`}
              aria-label="List view"
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`p-2 ${viewMode === 'board' ? 'bg-white/10 text-white' : 'text-[var(--muted-blue-grey)]'}`}
              aria-label="Board view"
            >
              <LayoutGrid size={14} />
            </button>
          </div>
          <button onClick={() => { setEditingTask(undefined); setTaskFormOpen(true); }} className="btn-glass btn-primary text-xs">
            <Plus size={14} /> New Task
          </button>
        </div>
      </div>

      <TaskFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        projectFilter={projectFilter}
        setProjectFilter={setProjectFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {filtered.length === 0 ? (
        <EmptyState title="No tasks found" description="Try adjusting your filters or create a new task." action={<button onClick={() => { setEditingTask(undefined); setTaskFormOpen(true); }} className="btn-glass btn-primary text-xs mt-2"><Plus size={12} /> Create Task</button>} />
      ) : viewMode === 'board' ? (
        <BoardView tasks={filtered} onToggle={handleToggle} onEdit={handleEdit} />
      ) : (
        <div className="space-y-2">
          {filtered.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={() => handleToggle(task.id)}
              onEdit={() => handleEdit(task)}
              onDelete={() => setDeleteConfirm(task.id)}
            />
          ))}
        </div>
      )}

      {/* Task Form Modal */}
      <TaskFormModal
        open={taskFormOpen}
        onClose={() => { setTaskFormOpen(false); setEditingTask(undefined); }}
        projectId={editingTask?.projectId || state.projects[0]?.id || ''}
        task={editingTask}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
