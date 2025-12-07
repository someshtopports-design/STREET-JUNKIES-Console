import React from 'react';
import { AuditLog } from '../types';
import { History, User, Calendar } from 'lucide-react';

interface ActivityLogProps {
  logs: AuditLog[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-heading font-bold text-slate-900">Activity Logs</h1>
        <p className="text-slate-500 mt-1">Audit trail of employee actions and system events.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {logs.length === 0 ? (
           <div className="p-16 text-center text-slate-400 flex flex-col items-center">
             <History size={48} className="mb-4 opacity-50" />
             <p>No activity recorded yet.</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                  <th className="px-6 py-4 font-semibold">Time</th>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                  <th className="px-6 py-4 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[...logs].reverse().map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs whitespace-nowrap">
                       <div className="flex items-center gap-2">
                          <Calendar size={12} />
                          {new Date(log.timestamp).toLocaleString()}
                       </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                       <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">
                             <User size={12} />
                          </div>
                          {log.user}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
                            {log.action}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};