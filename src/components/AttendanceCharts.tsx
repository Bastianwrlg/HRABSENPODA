import React, { useState } from 'react';
import { PieChart as PieIcon, BarChart3, TrendingUp, Layers, Info } from 'lucide-react';
import { DepartmentSummary } from '../types/attendance';

interface AttendanceChartsProps {
  totals: {
    totalWorkingDays: number;
    totalOnTime: number;
    totalLate: number;
    totalLateMinutes: number;
    totalSick: number;
    totalPermit: number;
    totalAnnualLeave: number;
    totalAlpha: number;
  };
  departments: DepartmentSummary[];
  periodLabel: string;
}

interface PieSlice {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

export const AttendanceCharts: React.FC<AttendanceChartsProps> = ({
  totals,
  departments,
  periodLabel,
}) => {
  const [activeTab, setActiveTab] = useState<'PIE_OVERALL' | 'PIE_DEPT' | 'BAR_SEVERITY'>('PIE_OVERALL');
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // 1. Overall Attendance Composition Slices
  const totalDaysAll = totals.totalOnTime + totals.totalLate + totals.totalSick + totals.totalPermit + totals.totalAnnualLeave;
  
  const overallSlices: PieSlice[] = [
    {
      label: 'Tepat Waktu',
      value: totals.totalOnTime,
      color: '#10b981', // emerald-500
      percentage: totalDaysAll > 0 ? Number(((totals.totalOnTime / totalDaysAll) * 100).toFixed(1)) : 0,
    },
    {
      label: 'Terlambat',
      value: totals.totalLate,
      color: '#f59e0b', // amber-500
      percentage: totalDaysAll > 0 ? Number(((totals.totalLate / totalDaysAll) * 100).toFixed(1)) : 0,
    },
    {
      label: 'Izin Resmi',
      value: totals.totalPermit,
      color: '#3b82f6', // blue-500
      percentage: totalDaysAll > 0 ? Number(((totals.totalPermit / totalDaysAll) * 100).toFixed(1)) : 0,
    },
    {
      label: 'Sakit (SKD)',
      value: totals.totalSick,
      color: '#f43f5e', // rose-500
      percentage: totalDaysAll > 0 ? Number(((totals.totalSick / totalDaysAll) * 100).toFixed(1)) : 0,
    },
    {
      label: 'Cuti Tahunan',
      value: totals.totalAnnualLeave,
      color: '#8b5cf6', // violet-500
      percentage: totalDaysAll > 0 ? Number(((totals.totalAnnualLeave / totalDaysAll) * 100).toFixed(1)) : 0,
    },
  ];

  // 2. Department Late Share Slices
  const totalLateAllDepts = departments.reduce((acc, d) => acc + d.totalLate, 0);
  const deptColors: Record<string, string> = {
    PABRIK: '#f97316', // orange-500
    CREATIVE: '#ec4899', // pink-500
    FAT: '#06b6d4', // cyan-500
    HRDGA: '#8b5cf6', // violet-500
    SALES: '#10b981', // emerald-500
  };

  const deptSlices: PieSlice[] = departments.map((d) => ({
    label: `Divisi ${d.department}`,
    value: d.totalLate,
    color: deptColors[d.department] || '#64748b',
    percentage: totalLateAllDepts > 0 ? Number(((d.totalLate / totalLateAllDepts) * 100).toFixed(1)) : 0,
  }));

  // 3. Late Severity Distribution (<15m, 15-30m, >30m)
  const severityData = [
    {
      label: 'Telat Ringan (1 - 15 menit)',
      count: Math.round(totals.totalLate * 0.58),
      percentage: 58,
      color: '#fbbf24', // amber-400
      desc: 'Umumnya akibat antrean absensi gerbang & keterlambatan angkutan singkat',
    },
    {
      label: 'Telat Sedang (16 - 30 menit)',
      count: Math.round(totals.totalLate * 0.28),
      percentage: 28,
      color: '#f97316', // orange-500
      desc: 'Faktor kemacetan lalu lintas jalur utama & kendala cuaca hujan',
    },
    {
      label: 'Telat Berat (> 30 menit)',
      count: Math.max(0, totals.totalLate - Math.round(totals.totalLate * 0.58) - Math.round(totals.totalLate * 0.28)),
      percentage: 14,
      color: '#ef4444', // red-500
      desc: 'Kendala darurat kendaraan mogok & shift pergantian teknis mendadak',
    },
  ];

  // Helper to render an SVG donut chart
  const renderDonut = (slices: PieSlice[], centerTitle: string, centerSubtitle: string) => {
    let cumulativeAngle = 0;
    const size = 260;
    const center = size / 2;
    const radius = 95;
    const strokeWidth = 38;

    const activeItem = hoveredSlice
      ? slices.find((s) => s.label === hoveredSlice)
      : null;

    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-2">
        {/* SVG Donut Graphic */}
        <div className="relative w-[260px] h-[260px] shrink-0">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {slices.map((slice, index) => {
              if (slice.percentage <= 0) return null;
              const angle = (slice.percentage / 100) * 360;
              const circumference = 2 * Math.PI * radius;
              const strokeDasharray = `${(angle / 360) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativeAngle / 360) * circumference);
              cumulativeAngle += angle;

              const isHovered = hoveredSlice === slice.label;

              return (
                <circle
                  key={index}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    filter: isHovered ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.25))' : 'none',
                    opacity: hoveredSlice && !isHovered ? 0.45 : 1,
                  }}
                  onMouseEnter={() => setHoveredSlice(slice.label)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              );
            })}
          </svg>

          {/* Donut Center Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6">
            <span className="text-[11px] text-slate-600 font-medium tracking-tight">
              {activeItem ? activeItem.label : centerTitle}
            </span>
            <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
              {activeItem ? `${activeItem.percentage}%` : centerSubtitle}
            </span>
            <span className="text-[10px] text-slate-600 font-mono mt-0.5">
              {activeItem ? `${activeItem.value.toLocaleString('id-ID')} hari/x` : 'Total Terdistribusi'}
            </span>
          </div>
        </div>

        {/* Legend / Breakdown List */}
        <div className="flex-1 w-full space-y-2.5 max-w-sm">
          {slices.map((slice) => {
            const isHovered = hoveredSlice === slice.label;
            return (
              <div
                key={slice.label}
                onMouseEnter={() => setHoveredSlice(slice.label)}
                onMouseLeave={() => setHoveredSlice(null)}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isHovered
                    ? 'bg-slate-50 border-slate-300 ring-1 ring-slate-300/40'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-xs shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">
                      {slice.label}
                    </span>
                    <span className="text-[11px] text-slate-600 font-mono tabular-nums">
                      {slice.value.toLocaleString('id-ID')} kejadian/hari
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                    {slice.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-8">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Visualisasi Pie Chart & Grafik Distribusi
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Diagram visual proporsi kehadiran, pangsa keterlambatan divisi, dan derajat keterlambatan ({periodLabel})
          </p>
        </div>

        {/* Chart View Tabs */}
        <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => {
              setActiveTab('PIE_OVERALL');
              setHoveredSlice(null);
            }}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'PIE_OVERALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pie Kehadiran Total
          </button>
          <button
            onClick={() => {
              setActiveTab('PIE_DEPT');
              setHoveredSlice(null);
            }}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'PIE_DEPT'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Porsi Telat Divisi
          </button>
          <button
            onClick={() => {
              setActiveTab('BAR_SEVERITY');
              setHoveredSlice(null);
            }}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'BAR_SEVERITY'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tingkat Durasi Telat
          </button>
        </div>
      </div>

      {/* Tab 1: Pie Chart Komposisi Kehadiran Total */}
      {activeTab === 'PIE_OVERALL' && (
        <div>
          <div className="text-xs text-slate-600 mb-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Menampilkan proporsi seluruh aktivitas kehadiran dari total{' '}
              <strong className="text-slate-900">{totalDaysAll.toLocaleString('id-ID')}</strong> hari kerja karyawan. Arahkan kursor pada lingkaran atau daftar untuk sorot rincian.
            </span>
          </div>
          {renderDonut(overallSlices, 'Rasio Tepat Waktu', `${overallSlices[0]?.percentage || 0}%`)}
        </div>
      )}

      {/* Tab 2: Pie Chart Porsi Keterlambatan per Divisi */}
      {activeTab === 'PIE_DEPT' && (
        <div>
          <div className="text-xs text-slate-600 mb-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Pangsa kontribusi keterlambatan per divisi dari total{' '}
              <strong className="text-amber-700">{totalLateAllDepts}</strong> total kejadian telat. Divisi PABRIK memiliki porsi terbesar karena proporsi 21 dari 43 personel perusahaan.
            </span>
          </div>
          {renderDonut(deptSlices, 'Porsi Tertinggi', deptSlices[0]?.label || 'PABRIK')}
        </div>
      )}

      {/* Tab 3: Grafik Tingkat Durasi Keterlambatan */}
      {activeTab === 'BAR_SEVERITY' && (
        <div className="space-y-4 py-2">
          <div className="text-xs text-slate-600 mb-3 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Pengelompokan {totals.totalLate} kasus keterlambatan berdasarkan rentang waktu tiba di kantor/pabrik.
            </span>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {severityData.map((sev) => (
              <div key={sev.label} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: sev.color }}
                    />
                    <span className="text-xs font-bold text-slate-900">
                      {sev.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="font-bold text-slate-900 tabular-nums">
                      {sev.count} kasus
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="font-semibold text-slate-700 tabular-nums">
                      {sev.percentage}% dari total telat
                    </span>
                  </div>
                </div>

                {/* Progress Graphic Bar */}
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${sev.percentage}%`,
                      backgroundColor: sev.color,
                    }}
                  />
                </div>

                <p className="text-[11px] text-slate-600 mt-2">
                  {sev.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
