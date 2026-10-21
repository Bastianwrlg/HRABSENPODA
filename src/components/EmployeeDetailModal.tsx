import React from 'react';
import { AttendanceRecord } from '../types/attendance';
import { X, Clock, CheckCircle2, HeartPulse, CalendarDays, AlertTriangle, Building, Briefcase } from 'lucide-react';

interface EmployeeDetailModalProps {
  employee: AttendanceRecord | null;
  onClose: () => void;
  year: number;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  onClose,
  year,
}) => {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              {employee.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {employee.name}
                </h3>
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {employee.department} · {employee.company}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {employee.email}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <span className="text-[11px] text-slate-400 block font-medium">Hadir Tepat</span>
              <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                {employee.totalOnTime}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                {employee.onTimePercentage}% hadir
              </span>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-xl">
              <span className="text-[11px] text-amber-700 block font-medium">Terlambat</span>
              <span className="text-lg font-bold text-amber-900 font-mono tabular-nums">
                {employee.totalLate}x
              </span>
              <span className="text-[10px] text-amber-700 font-medium block mt-0.5">
                {employee.totalLateMinutes} menit total
              </span>
            </div>

            <div className="bg-rose-50/50 border border-rose-100 p-3 rounded-xl">
              <span className="text-[11px] text-rose-700 block font-medium">Sakit (SKD)</span>
              <span className="text-lg font-bold text-rose-900 font-mono tabular-nums">
                {employee.totalSick}
              </span>
              <span className="text-[10px] text-rose-700 font-medium block mt-0.5">
                Hari kerja
              </span>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl">
              <span className="text-[11px] text-blue-700 block font-medium">Izin & Cuti</span>
              <span className="text-lg font-bold text-blue-900 font-mono tabular-nums">
                {employee.totalPermit + employee.totalAnnualLeave}
              </span>
              <span className="text-[10px] text-blue-700 font-medium block mt-0.5">
                {employee.totalPermit} Izin · {employee.totalAnnualLeave} Cuti
              </span>
            </div>
          </div>

          {/* 12-Month Matrix */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Rekapitulasi Kehadiran 12 Bulan (Tahun {year})
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-2.5">Bulan</th>
                    <th className="py-2 px-2 text-right">Hari Kerja</th>
                    <th className="py-2 px-2 text-right">Tepat Waktu</th>
                    <th className="py-2 px-2 text-right">Telat (x)</th>
                    <th className="py-2 px-2 text-right">Durasi Telat</th>
                    <th className="py-2 px-2 text-right">Sakit</th>
                    <th className="py-2 px-2 text-right">Izin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                  {employee.months.map((m) => (
                    <tr key={m.month} className="hover:bg-slate-50/80">
                      <td className="py-2 px-2.5 font-sans font-medium text-slate-900">
                        {m.month}
                      </td>
                      <td className="py-2 px-2 text-right text-slate-600">
                        {m.workingDays}
                      </td>
                      <td className="py-2 px-2 text-right text-emerald-700 font-semibold">
                        {m.onTimeDays}
                      </td>
                      <td className="py-2 px-2 text-right text-amber-700 font-semibold">
                        {m.lateDays > 0 ? `${m.lateDays}x` : '-'}
                      </td>
                      <td className="py-2 px-2 text-right text-slate-600">
                        {m.lateMinutes > 0 ? `${m.lateMinutes}m` : '-'}
                      </td>
                      <td className="py-2 px-2 text-right text-rose-600">
                        {m.sickDays > 0 ? m.sickDays : '-'}
                      </td>
                      <td className="py-2 px-2 text-right text-blue-600">
                        {m.permitDays > 0 ? m.permitDays : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Late Friction & HR Notes */}
          {employee.recentLateReasons && employee.recentLateReasons.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-900">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Catatan Faktor Keterlambatan Terdaftar
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                {employee.recentLateReasons.map((reason, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {reason}
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-slate-400 mt-2">
                Sistem absensi mencatat jam masuk via Fingerprint/Face Recognition pada gerbang masuk.
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Skor Disiplin: <strong className="text-slate-900">{employee.disciplineScore}/100</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
