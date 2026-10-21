import React, { useState } from 'react';
import { HeartPulse, CalendarDays, FileCheck2, UserCheck, ChevronRight } from 'lucide-react';

interface TopSickPermitItem {
  id: string;
  name: string;
  department: string;
  company: string;
  title?: string;
  sickDays: number;
  permitDays: number;
}

interface LeaveAndSickReportProps {
  topSick: TopSickPermitItem[];
  topPermit: TopSickPermitItem[];
  onSelectEmployee: (id: string) => void;
  periodLabel: string;
}

export const LeaveAndSickReport: React.FC<LeaveAndSickReportProps> = ({
  topSick,
  topPermit,
  onSelectEmployee,
  periodLabel,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'SICK' | 'PERMIT'>('ALL');

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Rekapitulasi Izin & Sakit ({periodLabel})
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar karyawan dengan hari izin dan sakit terbanyak beserta status verifikasi HR
          </p>
        </div>

        {/* Tab switch */}
        <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Rekap
          </button>
          <button
            onClick={() => setActiveTab('SICK')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'SICK' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sakit (SKD)
          </button>
          <button
            onClick={() => setActiveTab('PERMIT')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'PERMIT' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Izin Resmi
          </button>
        </div>
      </div>

      {/* Two-Column Grid: Sakit & Izin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Sakit */}
        {(activeTab === 'ALL' || activeTab === 'SICK') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
              <span className="font-semibold text-rose-700 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5" />
                Karyawan Sakit Terbanyak
              </span>
              <span className="text-slate-400">Verifikasi SKD</span>
            </div>

            <div className="space-y-2">
              {topSick.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">Tidak ada catatan sakit pada periode ini.</p>
              ) : (
                topSick.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectEmployee(item.id)}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-rose-50/20 hover:bg-rose-50/50 hover:border-rose-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-rose-800 w-5">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-rose-700">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.department} · {item.company}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-rose-700 tabular-nums">
                          {item.sickDays} hari
                        </span>
                        <span className="block text-[10px] text-slate-400 font-sans">
                          Surat Dokter ✓
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <strong>Ketentuan HR:</strong> Sakit &gt; 2 hari berturut-turut wajib menyertakan Surat Keterangan Dokter (SKD) dari faskes BPJS/Klinik rekanan perusahaan.
            </div>
          </div>
        )}

        {/* Right Column: Izin */}
        {(activeTab === 'ALL' || activeTab === 'PERMIT') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
              <span className="font-semibold text-blue-700 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                Karyawan Izin Resmi Terbanyak
              </span>
              <span className="text-slate-400">Persetujuan Atasan</span>
            </div>

            <div className="space-y-2">
              {topPermit.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">Tidak ada catatan izin pada periode ini.</p>
              ) : (
                topPermit.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectEmployee(item.id)}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-blue-50/20 hover:bg-blue-50/50 hover:border-blue-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-blue-800 w-5">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-700">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.department} · {item.company}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-blue-700 tabular-nums">
                          {item.permitDays} hari
                        </span>
                        <span className="block text-[10px] text-slate-400 font-sans">
                          Disetujui ✓
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <strong>Kategori Izin:</strong> Keperluan keluarga mendesak, urusan administrasi pemerintahan/kependudukan, dan kedukaan keluarga inti.
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
