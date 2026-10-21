import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Clock, 
  Calendar, 
  Layers, 
  ChevronRight,
  Info 
} from 'lucide-react';
import { DepartmentSummary } from '../types/attendance';

interface MonthlyDataPoint {
  month: string;
  monthIndex: number;
  onTime: number;
  late: number;
  sick: number;
  permit: number;
  lateMinutes: number;
  onTimeRate: number;
  lateRate: number;
}

interface EnhancedChartsProps {
  monthlyData: MonthlyDataPoint[];
  selectedMonthIndex: 'ALL' | number;
  onSelectMonth: (monthIndex: 'ALL' | number) => void;
  departments: DepartmentSummary[];
  year: number;
}

export const EnhancedCharts: React.FC<EnhancedChartsProps> = ({
  monthlyData,
  selectedMonthIndex,
  onSelectMonth,
  departments,
  year,
}) => {
  const [chartView, setChartView] = useState<'stacked' | 'line'>('stacked');
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [activeDonutDept, setActiveDonutDept] = useState<string | null>(null);

  // Colors aligned with PODA corporate palette
  const colors = {
    onTime: '#10b981', // Emerald
    late: '#f59e0b',   // Amber
    sick: '#f43f5e',   // Rose
    permit: '#0ea5e9', // Sky Blue
  };

  // Find max late and total for monthly chart scale
  const maxLateCount = Math.max(...monthlyData.map((d) => d.late), 1);
  const maxLateMinutes = Math.max(...monthlyData.map((d) => d.lateMinutes), 1);
  const totalLateAllDepts = departments.reduce((acc, d) => acc + d.totalLate, 0) || 1;

  // Active hover data
  const currentMonthData = hoveredMonth !== null 
    ? monthlyData[hoveredMonth] 
    : (selectedMonthIndex !== 'ALL' ? monthlyData[selectedMonthIndex] : null);

  // Department donut data
  const deptPalette = ['#f59e0b', '#ec4899', '#6366f1', '#14b8a6', '#8b5cf6'];
  let cumulativeAngle = 0;
  const donutSlices = departments.map((dept, idx) => {
    const percentage = Number(((dept.totalLate / totalLateAllDepts) * 100).toFixed(1));
    const angle = (dept.totalLate / totalLateAllDepts) * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    return {
      department: dept.department,
      count: dept.totalLate,
      percentage,
      startAngle,
      angle,
      color: deptPalette[idx % deptPalette.length],
    };
  });

  // Calculate SVG arc coordinates for donut
  const renderDonutSlice = (startAngle: number, angle: number, radius: number, innerRadius: number) => {
    const rad = Math.PI / 180;
    const endAngle = startAngle + angle;
    
    // Convert polar to cartesian (center at 100, 100)
    const x1 = 100 + radius * Math.cos((startAngle - 90) * rad);
    const y1 = 100 + radius * Math.sin((startAngle - 90) * rad);
    const x2 = 100 + radius * Math.cos((endAngle - 90) * rad);
    const y2 = 100 + radius * Math.sin((endAngle - 90) * rad);

    const x3 = 100 + innerRadius * Math.cos((endAngle - 90) * rad);
    const y3 = 100 + innerRadius * Math.sin((endAngle - 90) * rad);
    const x4 = 100 + innerRadius * Math.cos((startAngle - 90) * rad);
    const y4 = 100 + innerRadius * Math.sin((startAngle - 90) * rad);

    const largeArc = angle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  // Arrival time distribution mock calibrated to actual tardiness
  const timeDistribution = [
    { label: '07:30 - 08:00', category: 'Tepat Waktu', percentage: 91.2, color: 'bg-emerald-500', count: '8.450+' },
    { label: '08:01 - 08:15', category: 'Telat Ringan (1-15m)', percentage: 5.6, color: 'bg-amber-400', count: '482' },
    { label: '08:16 - 08:30', category: 'Telat Sedang (16-30m)', percentage: 2.1, color: 'bg-orange-500', count: '184' },
    { label: '> 08:30', category: 'Telat Berat (>30m)', percentage: 1.1, color: 'bg-rose-500', count: '92' },
  ];

  // Day of week tardiness distribution
  const dayPatterns = [
    { day: 'Senin', percentage: 38, note: 'Puncak kemacetan awal pekan & briefing shift' },
    { day: 'Selasa', percentage: 14, note: 'Kondisi lalu lintas normal' },
    { day: 'Rabu', percentage: 12, note: 'Tingkat kepatuhan tinggi' },
    { day: 'Kamis', percentage: 16, note: 'Stabil' },
    { day: 'Jumat', percentage: 20, note: 'Kepadatan menjelang akhir pekan' },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* 1. Primary Chart: 12-Month Analytical Attendance Flow */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        {/* Chart Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-slate-800" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Tren & Pola Keterlambatan Bulanan (Januari - Desember {year})
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualisasi terpadu kejadian terlambat, durasi menit, izin, dan sakit di lingkungan PODA E-Liquid
            </p>
          </div>

          {/* Toggle view & controls */}
          <div className="flex items-center gap-3">
            <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium">
              <button
                onClick={() => setChartView('stacked')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  chartView === 'stacked'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Grafik Kolom
              </button>
              <button
                onClick={() => setChartView('line')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  chartView === 'line'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kurva Tren
              </button>
            </div>

            {selectedMonthIndex !== 'ALL' && (
              <button
                onClick={() => onSelectMonth('ALL')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline underline-offset-2"
              >
                Tampilkan 12 Bulan
              </button>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-500" />
              <span className="text-slate-700 font-medium">Kejadian Terlambat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-rose-400" />
              <span className="text-slate-700 font-medium">Sakit (SKD)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-sky-400" />
              <span className="text-slate-700 font-medium">Izin Resmi</span>
            </div>
          </div>

          <span className="text-[11px] text-slate-400">
            * Klik salah satu kolom bulan untuk filter interaktif
          </span>
        </div>

        {/* Chart Canvas Area */}
        <div className="relative pt-6 pb-2">
          {/* Subtle horizontal grid lines */}
          <div className="absolute inset-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none opacity-40">
            <div className="border-b border-dashed border-slate-200 w-full" />
            <div className="border-b border-dashed border-slate-200 w-full" />
            <div className="border-b border-dashed border-slate-200 w-full" />
            <div className="border-b border-slate-200 w-full" />
          </div>

          {chartView === 'stacked' ? (
            /* STACKED / COLUMN VIEW */
            <div className="grid grid-cols-12 gap-1.5 sm:gap-3 h-52 items-end px-2 relative z-10">
              {monthlyData.map((d) => {
                const isSelected = selectedMonthIndex === d.monthIndex;
                const isHovered = hoveredMonth === d.monthIndex;

                const heightLate = Math.max(8, Math.round((d.late / maxLateCount) * 85));
                const heightSick = Math.max(4, Math.round((d.sick / maxLateCount) * 60));
                const heightPermit = Math.max(4, Math.round((d.permit / maxLateCount) * 60));

                return (
                  <div
                    key={d.month}
                    onClick={() => onSelectMonth(isSelected ? 'ALL' : d.monthIndex)}
                    onMouseEnter={() => setHoveredMonth(d.monthIndex)}
                    onMouseLeave={() => setHoveredMonth(null)}
                    className="flex flex-col items-center h-full justify-end cursor-pointer group"
                  >
                    {/* Floating Info Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-14 z-30 bg-slate-900 text-white text-[11px] py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap pointer-events-none transform -translate-y-1">
                        <div className="font-bold text-amber-300">
                          {d.month} {year}: {d.late} Keterlambatan ({d.lateMinutes} mnt)
                        </div>
                        <div className="text-slate-300 font-mono text-[10px]">
                          Tepat: {d.onTime} hr ({d.onTimeRate}%) · Sakit: {d.sick} · Izin: {d.permit}
                        </div>
                      </div>
                    )}

                    {/* Bars Container */}
                    <div className="w-full flex items-end justify-center gap-1 h-full pb-1">
                      {/* Late Bar */}
                      <div
                        className={`w-full max-w-[14px] rounded-t-sm transition-all duration-300 ${
                          isSelected || isHovered
                            ? 'bg-amber-500 ring-2 ring-amber-400/50'
                            : 'bg-amber-400 group-hover:bg-amber-500'
                        }`}
                        style={{ height: `${heightLate}%` }}
                      />

                      {/* Sick Bar */}
                      <div
                        className={`w-full max-w-[7px] rounded-t-xs transition-all duration-300 ${
                          isSelected || isHovered ? 'bg-rose-500' : 'bg-rose-300'
                        }`}
                        style={{ height: `${heightSick}%` }}
                      />

                      {/* Permit Bar */}
                      <div
                        className={`w-full max-w-[7px] rounded-t-xs transition-all duration-300 ${
                          isSelected || isHovered ? 'bg-sky-500' : 'bg-sky-300'
                        }`}
                        style={{ height: `${heightPermit}%` }}
                      />
                    </div>

                    {/* Month Label */}
                    <span
                      className={`mt-2 text-[11px] font-semibold transition-colors ${
                        isSelected
                          ? 'text-slate-900 font-bold underline decoration-2 underline-offset-4'
                          : 'text-slate-500 group-hover:text-slate-800'
                      }`}
                    >
                      {d.month}
                    </span>

                    {/* Late number tag */}
                    <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                      {d.late}x
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LINE CURVE VIEW */
            <div className="h-52 relative px-4 flex items-center">
              <svg className="w-full h-44 overflow-visible" viewBox="0 0 1100 160">
                {/* Late count curve */}
                {(() => {
                  const points = monthlyData.map((d, i) => {
                    const x = (i / 11) * 1100;
                    const y = 140 - (d.late / maxLateCount) * 120;
                    return `${x},${y}`;
                  }).join(' ');

                  const areaPoints = `0,150 ${points} 1100,150`;

                  return (
                    <g>
                      {/* Gradient fill */}
                      <defs>
                        <linearGradient id="lateGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <polygon points={areaPoints} fill="url(#lateGradient)" />
                      <polyline
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points}
                      />

                      {/* Data Dots */}
                      {monthlyData.map((d, i) => {
                        const cx = (i / 11) * 1100;
                        const cy = 140 - (d.late / maxLateCount) * 120;
                        const isSelected = selectedMonthIndex === d.monthIndex;

                        return (
                          <g key={d.month} className="cursor-pointer" onClick={() => onSelectMonth(isSelected ? 'ALL' : d.monthIndex)}>
                            <circle
                              cx={cx}
                              cy={cy}
                              r={isSelected ? 6 : 4}
                              className={`transition-all duration-200 ${
                                isSelected ? 'fill-amber-600 stroke-white stroke-2' : 'fill-white stroke-amber-500 stroke-2'
                              }`}
                            />
                            <text
                              x={cx}
                              y={158}
                              textAnchor="middle"
                              className={`text-[12px] font-sans font-semibold ${
                                isSelected ? 'fill-slate-900 font-bold' : 'fill-slate-400'
                              }`}
                            >
                              {d.month}
                            </text>
                            <text
                              x={cx}
                              y={cy - 10}
                              textAnchor="middle"
                              className="text-[11px] font-mono fill-amber-700 font-bold"
                            >
                              {d.late}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })()}
              </svg>
            </div>
          )}
        </div>

        {/* Selected Month Detail Strip */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {currentMonthData ? (
                <span>
                  Bulan Terpilih: <strong className="text-slate-900">{currentMonthData.month} {year}</strong> — Hadir Tepat Waktu: {currentMonthData.onTime} hari ({currentMonthData.onTimeRate}%), Terlambat: {currentMonthData.late} kali ({currentMonthData.lateMinutes} menit), Sakit: {currentMonthData.sick} hari, Izin: {currentMonthData.permit} hari.
                </span>
              ) : (
                <span>Agregasi 12 bulan penuh aktif. Klik salah satu bulan di atas untuk mengisolasi analisis data.</span>
              )}
            </span>
          </div>

          <div className="font-mono text-slate-500 text-[11px]">
            Total Keterlambatan Tahunan: {monthlyData.reduce((acc, m) => acc + m.late, 0)} Kejadian
          </div>
        </div>
      </div>

      {/* 2. Secondary Analytics Row: Donut Share + Time Distribution + Day Pattern */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Donut Chart: Proporsi Keterlambatan per Divisi (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PieChartIcon className="w-4 h-4 text-slate-800" />
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                Pangsa Keterlambatan per Divisi
              </h4>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Distribusi persentase kontribusi keterlambatan
            </p>

            {/* SVG Donut */}
            <div className="relative w-44 h-44 mx-auto my-2">
              <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                {donutSlices.map((slice) => {
                  const path = renderDonutSlice(slice.startAngle, slice.angle, 85, 52);
                  const isHovered = activeDonutDept === slice.department;

                  return (
                    <path
                      key={slice.department}
                      d={path}
                      fill={slice.color}
                      opacity={activeDonutDept && !isHovered ? 0.35 : 1}
                      className="transition-all duration-200 cursor-pointer hover:opacity-90"
                      onMouseEnter={() => setActiveDonutDept(slice.department)}
                      onMouseLeave={() => setActiveDonutDept(null)}
                    />
                  );
                })}
              </svg>
              {/* Donut center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xs text-slate-400 font-medium">Total</span>
                <span className="text-lg font-bold text-slate-900 font-mono tabular-nums leading-tight">
                  {totalLateAllDepts}
                </span>
                <span className="text-[10px] text-slate-500">Kejadian</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-100 text-xs">
              {donutSlices.map((slice) => (
                <div
                  key={slice.department}
                  onMouseEnter={() => setActiveDonutDept(slice.department)}
                  onMouseLeave={() => setActiveDonutDept(null)}
                  className={`flex items-center justify-between p-1 rounded-md transition-colors cursor-pointer ${
                    activeDonutDept === slice.department ? 'bg-slate-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
                    <span className="font-medium text-slate-800">Divisi {slice.department}</span>
                  </div>
                  <div className="font-mono text-slate-600 tabular-nums">
                    <span>{slice.count}x</span>
                    <span className="text-slate-400 ml-1.5">({slice.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Time Bracket Distribution (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-slate-800" />
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                Distribusi Jam Masuk Presensi
              </h4>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Klasifikasi waktu clock-in gerbang pabrik & kantor pusat
            </p>

            <div className="space-y-4">
              {timeDistribution.map((tier) => (
                <div key={tier.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 font-mono">{tier.label}</span>
                      <span className="text-slate-400 text-[11px] ml-1.5 font-sans">({tier.category})</span>
                    </div>
                    <span className="font-mono font-bold text-slate-800 tabular-nums">
                      {tier.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                    <div
                      className={`${tier.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${tier.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
              <strong>Toleransi HRIS PODA:</strong> Keterlambatan 1-10 menit dikenakan peringatan sistemik; keterlambatan &gt;15 menit memotong skor insentif kedisiplinan bulanan.
            </div>
          </div>
        </div>

        {/* Day-of-the-Week Tardiness Friction (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-slate-800" />
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                Pola Keterlambatan per Hari
              </h4>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Identifikasi hari paling rawan keterlambatan (Senin - Jumat)
            </p>

            <div className="space-y-3">
              {dayPatterns.map((dp) => (
                <div key={dp.day} className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 last:border-0">
                  <div className="w-16 font-semibold text-slate-800">
                    {dp.day}
                  </div>

                  <div className="flex-1 mx-3">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${dp.day === 'Senin' ? 'bg-amber-500' : 'bg-slate-400'}`}
                        style={{ width: `${dp.percentage * 2.5}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                      {dp.note}
                    </span>
                  </div>

                  <div className="w-10 text-right font-mono font-bold text-slate-800 tabular-nums">
                    {dp.percentage}%
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-amber-50/60 border border-amber-200/60 text-[11px] text-amber-900">
              <strong>Rekomendasi Operasional:</strong> Divisi PABRIK disarankan menggeser jadwal briefing shift Senin ke 15 menit lebih awal untuk mengantisipasi jalur Pantura/arteri.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
