import React from 'react';
import { Trophy, ChevronRight, AlertCircle, ArrowUpRight } from 'lucide-react';

export interface TopLateItem {
  id: string;
  name: string;
  department: string;
  company: string;
  title?: string;
  avatarUrl?: string;
  lateDays: number;
  lateMinutes: number;
  avgMinutesPerLate: number;
  latePct: number;
  disciplineScore: number;
  recentReasons?: string[];
}

interface TopLateLeaderboardProps {
  topEmployees: TopLateItem[];
  onSelectEmployee: (employeeId: string) => void;
  periodLabel: string;
}

export const TopLateLeaderboard: React.FC<TopLateLeaderboardProps> = ({
  topEmployees,
  onSelectEmployee,
  periodLabel,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              10 Besar Karyawan Paling Sering Terlambat ({periodLabel})
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar karyawan prioritas evaluasi kedisiplinan dan monitoring jam masuk kerja
          </p>
        </div>

        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
          Standar HRIS PODA
        </span>
      </div>

      {/* Top 3 Visual Highlight Cards */}
      {topEmployees.length >= 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {topEmployees.slice(0, 3).map((emp, idx) => {
            const podiumStyles = [
              { label: 'Rank 1 Terbanyak', border: 'border-amber-300', bg: 'bg-amber-50/40', text: 'text-amber-900', badge: 'bg-amber-400 text-slate-950' },
              { label: 'Rank 2', border: 'border-slate-300', bg: 'bg-slate-50', text: 'text-slate-800', badge: 'bg-slate-300 text-slate-900' },
              { label: 'Rank 3', border: 'border-orange-200', bg: 'bg-orange-50/30', text: 'text-orange-950', badge: 'bg-orange-300 text-orange-950' },
            ][idx];

            return (
              <div
                key={emp.id}
                onClick={() => onSelectEmployee(emp.id)}
                className={`p-3 rounded-xl border ${podiumStyles.border} ${podiumStyles.bg} cursor-pointer hover:shadow-xs transition-all relative`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${podiumStyles.badge}`}>
                    #{idx + 1}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-amber-800">
                    {emp.lateDays}x telat
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900 truncate">
                  {emp.name}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {emp.department} · {emp.company}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>+{emp.avgMinutesPerLate}m/kejadian</span>
                  <span className="font-semibold text-slate-700">{emp.lateMinutes} mnt total</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compact Table for all 10 ranks */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 px-3 w-10 text-center">No</th>
              <th className="py-2.5 px-3">Nama Lengkap</th>
              <th className="py-2.5 px-3">Divisi & PT</th>
              <th className="py-2.5 px-3 text-right">Frekuensi Telat</th>
              <th className="py-2.5 px-3 text-right">Total Durasi</th>
              <th className="py-2.5 px-3 text-right">Rerata</th>
              <th className="py-2.5 px-3 text-center">Skor Disiplin</th>
              <th className="py-2.5 px-3 text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {topEmployees.map((emp, index) => {
              const rank = index + 1;

              return (
                <tr
                  key={emp.id}
                  onClick={() => onSelectEmployee(emp.id)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-500">
                    {rank}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900 group-hover:text-amber-800">
                      {emp.name}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-medium">
                    {emp.department} <span className="text-slate-300">·</span> {emp.company}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-700 tabular-nums">
                    {emp.lateDays} kali
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700 tabular-nums">
                    {emp.lateMinutes} menit
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-500 tabular-nums">
                    +{emp.avgMinutesPerLate}m
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`font-mono text-[11px] font-bold tabular-nums px-2 py-0.5 rounded ${
                        emp.disciplineScore >= 80
                          ? 'text-emerald-700 bg-emerald-50'
                          : emp.disciplineScore >= 65
                          ? 'text-amber-700 bg-amber-50'
                          : 'text-rose-700 bg-rose-50'
                      }`}
                    >
                      {emp.disciplineScore}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEmployee(emp.id);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded"
                    >
                      <span>Detail</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
