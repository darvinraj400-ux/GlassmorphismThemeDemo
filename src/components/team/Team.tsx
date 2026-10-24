import React, { useState } from 'react';
import { useApp } from '../../lib/store';
import { GlassPanel, Avatar, StatusBadge, EmptyState } from '../ui';
import { Users, ListTodo, FolderKanban, CheckCircle2 } from 'lucide-react';

export function Team() {
  const { state, dispatch } = useApp();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const getMemberStats = (memberId: string) => {
    const tasks = state.tasks.filter(t => t.assigneeId === memberId);
    const activeTasks = tasks.filter(t => t.status !== 'done');
    const completedTasks = tasks.filter(t => t.status === 'done');
    const projects = state.projects.filter(p => p.teamMembers.includes(memberId));
    return { total: tasks.length, active: activeTasks.length, completed: completedTasks.length, projects: projects.length };
  };

  const selectedMemberData = selectedMember ? state.team.find(m => m.id === selectedMember) : null;
  const memberTasks = selectedMember ? state.tasks.filter(t => t.assigneeId === selectedMember) : [];
  const memberProjects = selectedMember ? state.projects.filter(p => p.teamMembers.includes(selectedMember)) : [];

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-lg font-semibold text-white mb-5">Team</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Team Directory */}
        <div className="lg:col-span-1">
          <GlassPanel level={2} className="p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Users size={16} className="text-[var(--electric-violet)]" />
              Members ({state.team.length})
            </h3>
            <div className="space-y-2">
              {state.team.map(member => {
                const stats = getMemberStats(member.id);
                return (
                  <button
                    key={member.id}
                    onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedMember === member.id
                        ? 'border-[var(--electric-violet)]/30 bg-[var(--electric-violet)]/5'
                        : 'border-white/5 hover:border-white/10 hover:bg-white/3'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={member.name} color={member.avatarColor} size={36} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white">{member.name}</p>
                        <p className="text-[10px] text-[var(--muted-blue-grey)]">{member.role}</p>
                      </div>
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        member.status === 'active' ? 'bg-green-400' : member.status === 'away' ? 'bg-yellow-400' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-[var(--muted-blue-grey)]">
                      <span className="flex items-center gap-1"><ListTodo size={9} /> {stats.active} active</span>
                      <span className="flex items-center gap-1"><CheckCircle2 size={9} /> {stats.completed} done</span>
                      <span className="flex items-center gap-1"><FolderKanban size={9} /> {stats.projects} projects</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </GlassPanel>
        </div>

        {/* Member Detail */}
        <div className="lg:col-span-2">
          {selectedMemberData ? (
            <div className="space-y-5">
              {/* Profile */}
              <GlassPanel level={2} className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar name={selectedMemberData.name} color={selectedMemberData.avatarColor} size={56} />
                  <div>
                    <h3 className="text-base font-semibold text-white">{selectedMemberData.name}</h3>
                    <p className="text-sm text-[var(--muted-blue-grey)]">{selectedMemberData.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`w-2 h-2 rounded-full ${
                        selectedMemberData.status === 'active' ? 'bg-green-400' : selectedMemberData.status === 'away' ? 'bg-yellow-400' : 'bg-gray-500'
                      }`} />
                      <span className="text-[10px] text-[var(--muted-blue-grey)] capitalize">{selectedMemberData.status}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-lg bg-white/3 border border-white/5">
                    <p className="text-lg font-bold text-white">{getMemberStats(selectedMemberData.id).active}</p>
                    <p className="text-[10px] text-[var(--muted-blue-grey)]">Active Tasks</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/3 border border-white/5">
                    <p className="text-lg font-bold text-white">{getMemberStats(selectedMemberData.id).completed}</p>
                    <p className="text-[10px] text-[var(--muted-blue-grey)]">Completed</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/3 border border-white/5">
                    <p className="text-lg font-bold text-white">{getMemberStats(selectedMemberData.id).projects}</p>
                    <p className="text-[10px] text-[var(--muted-blue-grey)]">Projects</p>
                  </div>
                </div>
              </GlassPanel>

              {/* Assigned Tasks */}
              <GlassPanel level={2} className="p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Assigned Tasks</h3>
                {memberTasks.length === 0 ? (
                  <EmptyState title="No tasks assigned" description="This team member has no assigned tasks." />
                ) : (
                  <div className="space-y-2">
                    {memberTasks.map(task => {
                      const project = state.projects.find(p => p.id === task.projectId);
                      return (
                        <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-white/5">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            task.priority === 'high' ? 'bg-orange-400' : task.priority === 'medium' ? 'bg-[var(--soft-lavender)]' : 'bg-[var(--aqua-mint)]'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs ${task.status === 'done' ? 'line-through text-[var(--muted-blue-grey)]' : 'text-white'}`}>{task.title}</p>
                            <p className="text-[10px] text-[var(--muted-blue-grey)]">{project?.name}</p>
                          </div>
                          <StatusBadge status={task.status} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </GlassPanel>

              {/* Projects */}
              <GlassPanel level={2} className="p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Projects</h3>
                {memberProjects.length === 0 ? (
                  <EmptyState title="No projects" description="This member is not assigned to any projects." />
                ) : (
                  <div className="space-y-2">
                    {memberProjects.map(project => (
                      <div key={project.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-white/5">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white">{project.name}</p>
                          <p className="text-[10px] text-[var(--muted-blue-grey)]">{project.progress}% complete</p>
                        </div>
                        <StatusBadge status={project.status} />
                      </div>
                    ))}
                  </div>
                )}
              </GlassPanel>
            </div>
          ) : (
            <GlassPanel level={2} className="p-12 flex items-center justify-center">
              <div className="text-center">
                <Users size={40} className="mx-auto mb-4 text-[var(--muted-blue-grey)] opacity-30" />
                <p className="text-sm text-[var(--muted-blue-grey)]">Select a team member to view their details</p>
              </div>
            </GlassPanel>
          )}
        </div>
      </div>
    </div>
  );
}
