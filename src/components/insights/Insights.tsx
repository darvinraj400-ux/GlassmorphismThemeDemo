import React from 'react';
import { useApp } from '../../lib/store';
import { GlassPanel, EmptyState } from '../ui';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';

// ===== SVG BAR CHART =====
function BarChart({ data, label }: { data: { label: string; value: number; color: string }[]; label: string }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const barWidth = 100 / data.length;

  return (
    <div className="chart-container" role="img" aria-label={label}>
      <svg viewBox="0 0 400 200" className="w-full h-auto">
        {data.map((d, i) => {
          const barH = (d.value / maxValue) * 150;
          const x = i * (400 / data.length) + 10;
          const width = (400 / data.length) - 20;
          return (
            <g key={i}>
              <rect
                x={x}
                y={180 - barH}
                width={width}
                height={barH}
                rx={4}
                fill={d.color}
                opacity={0.8}
              />
              <text
                x={x + width / 2}
                y={195}
                textAnchor="middle"
                className="fill-[var(--muted-blue-grey)]"
                fontSize="10"
              >
                {d.label}
              </text>
              <text
                x={x + width / 2}
                y={175 - barH}
                textAnchor="middle"
                className="fill-white"
                fontSize="11"
                fontWeight="600"
              >
                {d.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ===== SVG DONUT CHART =====
function DonutChart({ data, label }: { data: { label: string; value: number; color: string }[]; label: string }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return <EmptyState title="No data" description="Not enough data to display chart." />;

  const radius = 70;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center" role="img" aria-label={label}>
      <svg viewBox="0 0 200 200" className="w-40 h-40">
        {data.map((d, i) => {
          const pct = d.value / total;
          const dashArray = `${pct * circumference} ${circumference}`;
          const rotation = (offset / total) * 360 - 90;
          offset += d.value;
          return (
            <circle
              key={i}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              strokeDashoffset={0}
              transform={`rotate(${rotation} 100 100)`}
              opacity={0.85}
            />
          );
        })}
        <text x="100" y="95" textAnchor="middle" className="fill-white" fontSize="20" fontWeight="700">
          {total}
        </text>
        <text x="100" y="115" textAnchor="middle" className="fill-[var(--muted-blue-grey)]" fontSize="10">
          Total
        </text>
      </svg>
      <div className="flex flex-wrap justify-center gap-3 mt-3">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-[10px] text-[var(--muted-blue-grey)]">{d.label} ({d.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== HORIZONTAL BAR =====
function HorizontalBarChart({ data, label }: { data: { label: string; value: number; color: string }[]; label: string }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="space-y-3" role="img" aria-label={label}>
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-white">{d.label}</span>
            <span className="text-[11px] text-[var(--muted-blue-grey)]">{d.value}</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(d.value / maxValue) * 100}%`, backgroundColor: d.color, opacity: 0.8 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== INSIGHTS PAGE =====
export function Insights() {
  const { state } = useApp();

  // Tasks by status
  const tasksByStatus = [
    { label: 'To Do', value: state.tasks.filter(t => t.status === 'todo').length, color: '#AAB4D0' },
    { label: 'In Progress', value: state.tasks.filter(t => t.status === 'in-progress').length, color: '#65DDF2' },
    { label: 'Done', value: state.tasks.filter(t => t.status === 'done').length, color: '#87E8D0' },
  ];

  // Tasks by priority
  const tasksByPriority = [
    { label: 'High', value: state.tasks.filter(t => t.priority === 'high').length, color: '#fb923c' },
    { label: 'Medium', value: state.tasks.filter(t => t.priority === 'medium').length, color: '#B6AEFF' },
    { label: 'Low', value: state.tasks.filter(t => t.priority === 'low').length, color: '#87E8D0' },
  ];

  // Tasks by project
  const tasksByProject = state.projects.map(p => ({
    label: p.name.length > 15 ? p.name.slice(0, 15) + '...' : p.name,
    value: state.tasks.filter(t => t.projectId === p.id).length,
    color: '#7765F7',
  })).filter(d => d.value > 0);

  // Workload by team member
  const workloadByMember = state.team.map(m => ({
    label: m.name.split(' ')[0],
    value: state.tasks.filter(t => t.assigneeId === m.id && t.status !== 'done').length,
    color: m.avatarColor,
  })).filter(d => d.value > 0);

  // Project progress comparison
  const projectProgress = state.projects.filter(p => p.status !== 'completed').map(p => ({
    label: p.name.length > 12 ? p.name.slice(0, 12) + '...' : p.name,
    value: p.progress,
    color: p.progress >= 75 ? '#87E8D0' : p.progress >= 40 ? '#65DDF2' : '#B6AEFF',
  }));

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-white">Insights</h2>
        <span className="text-[10px] text-[var(--muted-blue-grey)] bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
          Demo data · Local workspace
        </span>
      </div>

      {state.tasks.length === 0 ? (
        <EmptyState title="No data yet" description="Create some tasks to see insights and charts." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Tasks by Status */}
          <GlassPanel level={2} className="p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <PieChart size={16} className="text-[var(--luminous-cyan)]" />
              Tasks by Status
            </h3>
            <DonutChart data={tasksByStatus} label="Tasks grouped by their current status" />
          </GlassPanel>

          {/* Tasks by Priority */}
          <GlassPanel level={2} className="p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-[var(--electric-violet)]" />
              Tasks by Priority
            </h3>
            <BarChart data={tasksByPriority} label="Tasks grouped by priority level" />
          </GlassPanel>

          {/* Project Progress */}
          <GlassPanel level={2} className="p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-[var(--aqua-mint)]" />
              Project Progress
            </h3>
            <HorizontalBarChart data={projectProgress} label="Progress percentage for each active project" />
          </GlassPanel>

          {/* Team Workload */}
          <GlassPanel level={2} className="p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-[var(--soft-lavender)]" />
              Team Workload
            </h3>
            {workloadByMember.length > 0 ? (
              <HorizontalBarChart data={workloadByMember} label="Active task count per team member" />
            ) : (
              <EmptyState title="No workload data" description="No team members have active tasks assigned." />
            )}
          </GlassPanel>

          {/* Tasks by Project */}
          <GlassPanel level={2} className="p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-[var(--electric-violet)]" />
              Tasks by Project
            </h3>
            {tasksByProject.length > 0 ? (
              <BarChart data={tasksByProject} label="Number of tasks in each project" />
            ) : (
              <EmptyState title="No tasks" description="No tasks have been created yet." />
            )}
          </GlassPanel>
        </div>
      )}
    </div>
  );
}
