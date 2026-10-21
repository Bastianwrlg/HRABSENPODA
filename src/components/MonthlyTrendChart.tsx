import React, { useState } from 'react';
import { Calendar, BarChart3, TrendingUp, Info } from 'lucide-react';

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

interface MonthlyTrendChartProps {
  monthlyData: MonthlyDataPoint[];
  selectedMonthIndex: 'ALL' | number;
  onSelectMonth: (index: 'ALL' | number) => void;
  year: number;
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({
  monthlyData,
  selectedMonthIndex,
  onSelectMonth,
  year,
}) => {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  // Maximum value for scale
  const maxLate = Math.max(...monthlyData.map((d) => d.late), 10);
  const activeMonthData = hoveredMonth !== null 
    ? monthlyData[hoveredMonth] 
    : (selectedMonthIndex !== 'ALL' ? monthlyData[selectedMonthIndex] : null);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Tren Keterlambatan & Kehadiran Bulanan (Jan - Des {year})
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Klik kolom bulan untuk memfilter seluruh dashboard berdasarkan bulan tersebut
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-amber-500" />
            <span className="text-slate-600 font-medium">Terlambat (Kejadian)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-rose-400" />
            <span className="text-slate-600 font-medium">Sakit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-blue-400" />
            <span className="text-slate-600 font-medium">Izin</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="pt-6 pb-2">
        <div className="grid grid-cols-12 gap-1.5 sm:gap-3 h-48 items-end border-b border-slate-200 px-1">
          {monthlyData.map((d) => {
            const isSelected = selectedMonthIndex === d.monthIndex;
            const isHovered = hoveredMonth === d.monthIndex;
            const barHeightLate = Math.min(100, Math.round((d.late / maxLate) * 100));
            const barHeightSick = Math.min(60, Math.round((d.sick / maxLate) * 100));
            const barHeightPermit = Math.min(60, Math.round((d.permit / maxLate) * 100));

            return (
              <div
                key={d.month}
                onClick={() => onSelectMonth(isSelected ? 'ALL' : d.monthIndex)}
                onMouseEnter={() => setHoveredMonth(d.monthIndex)}
                onMouseLeave={() => setHoveredMonth(null)}
                className="flex flex-col items-center h-full justify-end cursor-pointer group relative"
              >
                {/* Floating tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-14 z-20 bg-slate-900 text-white text-[11px] py-1.5 px-2.5 rounded-md shadow-md whitespace-nowrap pointer-events-none">
                    <div className="font-bold">{d.month} {year}</div>
                    <div className="text-slate-300 font-mono">
                      Telat: {d.late}x ({d.lateMinutes}m) · Sakit: {d.sick} · Izin: {d.permit}
                    </div>
                  </div>
                )}

                {/* Bars group */}
                <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-full pb-1">
                  
                  {/* Late Bar */}
                  <div
                    className={`w-full max-w-[14px] rounded-t-sm transition-all duration-300 ${
                      isSelected || isHovered ? 'bg-amber-600' : 'bg-amber-400'
                    }`}
                    style={{ height: `${Math.max(6, barHeightLate)}%` }}
                  />

                  {/* Sick Bar */}
                  <div
                    className={`w-full max-w-[8px] rounded-t-sm transition-all duration-300 ${
                      isSelected || isHovered ? 'bg-rose-500' : 'bg-rose-300'
                    }`}
                    style={{ height: `${Math.max(3, barHeightSick)}%` }}
                  />

                  {/* Permit Bar */}
                  <div
                    className={`w-full max-w-[8px] rounded-t-sm transition-all duration-300 ${
                      isSelected || isHovered ? 'bg-blue-500' : 'bg-blue-300'
                    }`}
                    style={{ height: `${Math.max(3, barHeightPermit)}%` }}
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

                {/* Rate indicator */}
                <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                  {d.late}x
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Month Detail Strip */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {activeMonthData ? (
              <span>
                Fokus Bulan: <strong className="text-slate-900 font-semibold">{activeMonthData.month} {year}</strong> — Hadir Tepat Waktu: {activeMonthData.onTime} hari ({activeMonthData.onTimeRate}%), Telat: {activeMonthData.late} kali ({activeMonthData.lateMinutes} menit), Sakit: {activeMonthData.sick} hari, Izin: {activeMonthData.permit} hari.
              </span>
            ) : (
              <span>Menampilkan agregat 12 bulan penuh. Klik salah satu bulan di atas untuk filter spesifik.</span>
            )}
          </span>
        </div>
        {selectedMonthIndex !== 'ALL' && (
          <button
            onClick={() => onSelectMonth('ALL')}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline underline-offset-2 ml-auto"
          >
            Tampilkan 12 Bulan Penuh
          </button>
        )}
      </div>
    </div>
  );
};
