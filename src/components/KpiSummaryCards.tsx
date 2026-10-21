import React from 'react';
import { CheckCircle2, Clock, CalendarDays, HeartPulse, AlertCircle, ArrowUpRight } from 'lucide-react';

interface KpiTotals {
  totalEmployees: number;
  totalWorkingDays: number;
  totalOnTime: number;
  totalLate: number;
  totalLateMinutes: number;
  totalSick: number;
  totalPermit: number;
  totalAnnualLeave: number;
  totalAlpha: number;
  onTimePercentage: number;
  latePercentage: number;
  avgLateMinutes: number;
}

interface KpiSummaryCardsProps {
  totals: KpiTotals;
  periodLabel: string;
}

export const KpiSummaryCards: React.FC<KpiSummaryCardsProps> = ({ totals, periodLabel }) => {
  const lateHours = (totals.totalLateMinutes / 60).toFixed(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Hadir Tepat Waktu */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Kehadiran Tepat Waktu
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono tabular-nums">
            {totals.totalOnTime.toLocaleString('id-ID')}
          </span>
          <span className="text-xs text-slate-400 font-medium">Hari Kerja</span>
        </div>

        <div className="flex items-center justify-between text-xs pt-2.5 mt-2 border-t border-slate-100">
          <span className="text-slate-500">Rasio Ketepatan</span>
          <span className="font-bold text-emerald-700 font-mono tabular-nums bg-emerald-50 px-2 py-0.5 rounded">
            {totals.onTimePercentage}%
          </span>
        </div>

        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Target PODA: ≥90%</span>
          <span className="text-emerald-600 font-medium font-mono">
            {totals.onTimePercentage >= 90 ? 'Tercapai ✓' : 'Perlu Perbaikan'}
          </span>
        </div>
      </div>

      {/* 2. Total Keterlambatan */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Keterlambatan
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono tabular-nums">
            {totals.totalLate.toLocaleString('id-ID')}
          </span>
          <span className="text-xs text-slate-400 font-medium">Kejadian</span>
        </div>

        <div className="flex items-center justify-between text-xs pt-2.5 mt-2 border-t border-slate-100">
          <span className="text-slate-500">Akumulasi Waktu</span>
          <span className="font-bold text-amber-800 font-mono tabular-nums bg-amber-50 px-2 py-0.5 rounded">
            {totals.totalLateMinutes.toLocaleString('id-ID')} m ({lateHours} jam)
          </span>
        </div>

        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Rerata Durasi</span>
          <span className="font-mono text-slate-600">+{totals.avgLateMinutes} menit/kejadian</span>
        </div>
      </div>

      {/* 3. Sakit (SKD) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Sakit (Klaim SKD)
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <HeartPulse className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono tabular-nums">
            {totals.totalSick.toLocaleString('id-ID')}
          </span>
          <span className="text-xs text-slate-400 font-medium">Hari</span>
        </div>

        <div className="flex items-center justify-between text-xs pt-2.5 mt-2 border-t border-slate-100">
          <span className="text-slate-500">Status Verifikasi</span>
          <span className="font-bold text-rose-700 font-mono tabular-nums bg-rose-50 px-2 py-0.5 rounded">
            100% Surat Dokter
          </span>
        </div>

        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Rerata per Organisasi</span>
          <span className="font-mono text-slate-600">
            {totals.totalEmployees > 0 ? (totals.totalSick / totals.totalEmployees).toFixed(1) : 0} hari/org
          </span>
        </div>
      </div>

      {/* 4. Izin & Cuti Resmi */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Izin & Cuti Tahunan
          </span>
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <CalendarDays className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono tabular-nums">
            {(totals.totalPermit + totals.totalAnnualLeave).toLocaleString('id-ID')}
          </span>
          <span className="text-xs text-slate-400 font-medium">Hari</span>
        </div>

        <div className="flex items-center justify-between text-xs pt-2.5 mt-2 border-t border-slate-100">
          <span className="text-slate-500">Komposisi</span>
          <span className="font-semibold text-sky-800 font-mono tabular-nums bg-sky-50 px-2 py-0.5 rounded">
            Izin: {totals.totalPermit} · Cuti: {totals.totalAnnualLeave}
          </span>
        </div>

        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Alpha (Tanpa Kabar)</span>
          <span className={`font-mono font-medium ${totals.totalAlpha > 0 ? 'text-rose-600' : 'text-slate-600'}`}>
            {totals.totalAlpha} hari
          </span>
        </div>
      </div>

    </div>
  );
};
