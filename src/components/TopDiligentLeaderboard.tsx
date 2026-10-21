import React from 'react';
import { Award, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export interface DiligentEmployeeItem {
  id: string;
  name: string;
  department: string;
  company: string;
  avatarUrl?: string;
  onTimeDays: number;
  lateDays: number;
  sickDays: number;
  permitDays: number;
  onTimePct: number;
  disciplineScore: number;
}

interface TopDiligentLeaderboardProps {
  topDiligent: DiligentEmployeeItem[];
  onSelectEmployee: (id: string) => void;
  periodLabel: string;
}

export const TopDiligentLeaderboard: React.FC<TopDiligentLeaderboardProps> = ({
  topDiligent,
  onSelectEmployee,
  periodLabel,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Top 5 Karyawan Paling Rajin & Tepat Waktu
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Karyawan dengan rekor kehadiran tepat waktu tertinggi & catatan nihil keterlambatan ({periodLabel})
          </p>
        </div>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Apresiasi Kedisiplinan HR
        </span>
      </div>

      {/* Cards Grid for Top 5 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {topDiligent.map((emp, index) => {
          const rank = index + 1;
          const isRank1 = rank === 1;

          return (
            <div
              key={emp.id}
              onClick={() => onSelectEmployee(emp.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative hover:shadow-xs group ${
                isRank1
                  ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-300/30'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Badge Rank */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-md font-mono text-xs font-bold ${
                    isRank1
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  #{rank}
                </span>

                <span className="text-[11px] font-mono font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {emp.onTimePct}% Tepat
                </span>
              </div>

              {/* Name */}
              <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                {emp.name}
              </div>

              {/* Department & Company */}
              <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                {emp.department} · {emp.company}
              </div>

              {/* Stat breakdown */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1 text-[11px] font-mono">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Hadir Tepat:</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {emp.onTimeDays} hari
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Terlambat:</span>
                  <span className={`tabular-nums ${emp.lateDays === 0 ? 'text-emerald-700 font-bold' : 'text-slate-700'}`}>
                    {emp.lateDays} kali
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Skor Disiplin:</span>
                  <span className="font-bold text-emerald-800 tabular-nums">
                    {emp.disciplineScore}/100
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-end text-[10px] text-slate-400 group-hover:text-slate-700">
                <span>Lihat Profil</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
