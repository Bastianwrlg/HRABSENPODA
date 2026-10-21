import React, { useState } from 'react';
import { AttendanceRecord } from '../types/attendance';
import { ArrowUpDown, ChevronRight, User, ExternalLink } from 'lucide-react';

interface EmployeeTableProps {
  records: AttendanceRecord[];
  selectedMonth: 'ALL' | number;
  onSelectEmployee: (id: string) => void;
}

type SortField = 'name' | 'department' | 'onTime' | 'late' | 'lateMinutes' | 'sick' | 'permit' | 'score';
type SortDirection = 'asc' | 'desc';

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  records,
  selectedMonth,
  onSelectEmployee,
}) => {
  const [sortField, setSortField] = useState<SortField>('late');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [pageSize, setPageSize] = useState<number>(15);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sortedRecords = [...records].sort((a, b) => {
    let valA = 0;
    let valB = 0;

    const mA = selectedMonth !== 'ALL' ? a.months[selectedMonth] : null;
    const mB = selectedMonth !== 'ALL' ? b.months[selectedMonth] : null;

    switch (sortField) {
      case 'name':
        return sortDir === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      case 'department':
        return sortDir === 'asc' 
          ? a.department.localeCompare(b.department) 
          : b.department.localeCompare(a.department);
      case 'onTime':
        valA = mA ? mA.onTimeDays : a.totalOnTime;
        valB = mB ? mB.onTimeDays : b.totalOnTime;
        break;
      case 'late':
        valA = mA ? mA.lateDays : a.totalLate;
        valB = mB ? mB.lateDays : b.totalLate;
        break;
      case 'lateMinutes':
        valA = mA ? mA.lateMinutes : a.totalLateMinutes;
        valB = mB ? mB.lateMinutes : b.totalLateMinutes;
        break;
      case 'sick':
        valA = mA ? mA.sickDays : a.totalSick;
        valB = mB ? mB.sickDays : b.totalSick;
        break;
      case 'permit':
        valA = mA ? mA.permitDays : a.totalPermit;
        valB = mB ? mB.permitDays : b.totalPermit;
        break;
      case 'score':
        valA = a.disciplineScore;
        valB = b.disciplineScore;
        break;
    }

    return sortDir === 'asc' ? valA - valB : valB - valA;
  });

  const totalPages = Math.ceil(sortedRecords.length / pageSize);
  const pagedRecords = sortedRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-8">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Data Rekapitulasi Presensi Karyawan ({records.length} Karyawan)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar lengkap karyawan beserta rincian kehadiran tepat waktu, keterlambatan, izin, dan sakit
          </p>
        </div>

        {/* Page size selector */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span>Tampilkan:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 text-xs border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none"
          >
            <option value={15}>15 baris</option>
            <option value={25}>25 baris</option>
            <option value={50}>Semua ({records.length})</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider select-none">
              <th
                onClick={() => handleSort('name')}
                className="py-2.5 px-3 cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center gap-1">
                  <span>Nama Karyawan</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('department')}
                className="py-2.5 px-3 cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center gap-1">
                  <span>Divisi / PT</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('onTime')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Tepat Waktu</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('late')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Telat (Hari)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('lateMinutes')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Menit Telat</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('sick')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Sakit</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('permit')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Izin</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('score')}
                className="py-2.5 px-3 text-center cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Skor Disiplin</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pagedRecords.map((rec) => {
              const m = selectedMonth !== 'ALL' ? rec.months[selectedMonth] : null;
              const onTime = m ? m.onTimeDays : rec.totalOnTime;
              const late = m ? m.lateDays : rec.totalLate;
              const lateMins = m ? m.lateMinutes : rec.totalLateMinutes;
              const sick = m ? m.sickDays : rec.totalSick;
              const permit = m ? m.permitDays : rec.totalPermit;

              return (
                <tr
                  key={rec.id}
                  onClick={() => onSelectEmployee(rec.id)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  {/* Name */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                        {rec.name.charAt(0)}
                      </div>
                      <div className="font-semibold text-slate-900 group-hover:text-slate-700">
                        {rec.name}
                      </div>
                    </div>
                  </td>

                  {/* Department & Company */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <span>{rec.department}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-400">{rec.company}</span>
                    </div>
                  </td>

                  {/* On time */}
                  <td className="py-3 px-3 text-right font-mono tabular-nums">
                    <span className="font-semibold text-emerald-700">{onTime}</span>
                    <span className="text-slate-400 ml-1">hari</span>
                  </td>

                  {/* Late */}
                  <td className="py-3 px-3 text-right font-mono tabular-nums">
                    <span className={`font-semibold ${late > 5 ? 'text-amber-700 font-bold' : 'text-slate-700'}`}>
                      {late}
                    </span>
                    <span className="text-slate-400 ml-1">kali</span>
                  </td>

                  {/* Late Minutes */}
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600">
                    {lateMins} m
                  </td>

                  {/* Sick */}
                  <td className="py-3 px-3 text-right font-mono tabular-nums">
                    <span className={sick > 0 ? 'text-rose-700 font-medium' : 'text-slate-400'}>
                      {sick}
                    </span>
                  </td>

                  {/* Permit */}
                  <td className="py-3 px-3 text-right font-mono tabular-nums">
                    <span className={permit > 0 ? 'text-blue-700 font-medium' : 'text-slate-400'}>
                      {permit}
                    </span>
                  </td>

                  {/* Discipline Score */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`font-mono text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded ${
                        rec.disciplineScore >= 85
                          ? 'text-emerald-700 bg-emerald-50'
                          : rec.disciplineScore >= 70
                          ? 'text-amber-700 bg-amber-50'
                          : 'text-rose-700 bg-rose-50'
                      }`}
                    >
                      {rec.disciplineScore}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEmployee(rec.id);
                      }}
                      className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 text-xs text-slate-600">
          <div>
            Menampilkan {(currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(currentPage * pageSize, sortedRecords.length)} dari {sortedRecords.length} karyawan
          </div>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-2.5 py-1 border border-slate-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Sebelumnya
            </button>
            <span className="font-mono px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-2.5 py-1 border border-slate-200 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
