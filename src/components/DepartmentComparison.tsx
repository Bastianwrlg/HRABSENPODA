import React from 'react';
import { DepartmentSummary } from '../types/attendance';
import { Factory, Palette, BadgePercent, Landmark, Users2, AlertTriangle, ArrowRight } from 'lucide-react';

interface DepartmentComparisonProps {
  departments: DepartmentSummary[];
  onSelectDepartment?: (dept: string) => void;
  selectedDept?: string;
}

export const DepartmentComparison: React.FC<DepartmentComparisonProps> = ({
  departments,
  onSelectDepartment,
  selectedDept = 'ALL',
}) => {
  const highestVolumeDept = [...departments].sort((a, b) => b.totalLate - a.totalLate)[0];
  const maxLate = Math.max(...departments.map((d) => d.totalLate), 1);

  // Icon mapping for Poda departments
  const getDeptIcon = (dept: string) => {
    switch (dept) {
      case 'PABRIK':
        return <Factory className="w-4 h-4 text-amber-600" />;
      case 'CREATIVE':
        return <Palette className="w-4 h-4 text-pink-600" />;
      case 'SALES':
        return <BadgePercent className="w-4 h-4 text-indigo-600" />;
      case 'FAT':
        return <Landmark className="w-4 h-4 text-emerald-600" />;
      default:
        return <Users2 className="w-4 h-4 text-sky-600" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Analisis Divisi Paling Sering Terlambat</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Komparasi keterlambatan antar unit operasional PODA E-Liquid (Pabrik, Lab, Studio, Kantor)
          </p>
        </div>

        {highestVolumeDept && (
          <span className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-md">
            Volume Tertinggi: Divisi {highestVolumeDept.department} ({highestVolumeDept.totalLate}x)
          </span>
        )}
      </div>

      {/* Department Cards List */}
      <div className="space-y-3">
        {departments.map((dept, idx) => {
          const isSelected = selectedDept === dept.department;
          const barWidth = Math.max(10, Math.round((dept.totalLate / maxLate) * 100));

          return (
            <div
              key={dept.department}
              onClick={() => onSelectDepartment && onSelectDepartment(dept.department)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-50/40 border-amber-400 ring-1 ring-amber-400/30'
                  : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                
                {/* Dept Name & Headcount */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    {getDeptIcon(dept.department)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        Divisi {dept.department}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        ({dept.totalEmployees} Karyawan)
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Jalur Kritis: {dept.mostFrequentLateDay}
                    </span>
                  </div>
                </div>

                {/* Quantitative Metric Badges */}
                <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-sans">Total Telat</span>
                    <span className="font-bold text-amber-700 tabular-nums">
                      {dept.totalLate} kali
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-sans">Rerata Menit</span>
                    <span className="font-semibold text-slate-700 tabular-nums">
                      {dept.avgLateMinutesPerPerson} m/org
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-sans">Ketepatan</span>
                    <span className={`font-bold tabular-nums ${dept.onTimeRate >= 90 ? 'text-emerald-700' : 'text-slate-700'}`}>
                      {dept.onTimeRate}%
                    </span>
                  </div>
                </div>

              </div>

              {/* Volume Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              {/* Sub-line */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                <span>
                  Hadir On-Time: {dept.totalOnTime.toLocaleString('id-ID')} hari · Izin: {dept.totalPermit} · Sakit: {dept.totalSick}
                </span>
                <span className="font-mono text-slate-700 font-medium">
                  {dept.totalLateMinutes.toLocaleString('id-ID')} menit akumulasi
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
