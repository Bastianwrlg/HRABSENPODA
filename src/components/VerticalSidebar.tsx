import React from 'react';
import { 
  Calendar, 
  Search, 
  RotateCcw, 
  FileSpreadsheet, 
  Download, 
  RefreshCw, 
  X, 
  Award, 
  Trophy, 
  Building2, 
  PieChart as PieIcon, 
  Users, 
  HeartPulse, 
  Layers 
} from 'lucide-react';
import { AttendanceFilters, SheetSourceMeta } from '../types/attendance';
import { MONTH_NAMES } from '../data/initialData';

interface VerticalSidebarProps {
  filters: AttendanceFilters;
  onChangeFilters: (filters: AttendanceFilters) => void;
  availableDepartments: string[];
  availableCompanies: string[];
  sourceMeta: SheetSourceMeta;
  onOpenSyncModal: () => void;
  onExportCsv: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  activeSection?: string;
  onNavigateSection?: (sectionId: string) => void;
}

export const VerticalSidebar: React.FC<VerticalSidebarProps> = ({
  filters,
  onChangeFilters,
  availableDepartments,
  availableCompanies,
  sourceMeta,
  onOpenSyncModal,
  onExportCsv,
  isOpenMobile,
  onCloseMobile,
  activeSection,
  onNavigateSection,
}) => {
  const isFiltered =
    filters.month !== 'ALL' ||
    filters.department !== 'ALL' ||
    filters.company !== 'ALL' ||
    filters.searchQuery !== '';

  const handleReset = () => {
    onChangeFilters({
      year: filters.year,
      month: 'ALL',
      department: 'ALL',
      company: 'ALL',
      searchQuery: '',
    });
  };

  const navItems = [
    { id: 'section-kpi', label: 'Ringkasan KPI', icon: Layers },
    { id: 'section-rajin', label: 'Top 5 Paling Rajin', icon: Award },
    { id: 'section-grafik', label: 'Pie & Grafik Visual', icon: PieIcon },
    { id: 'section-telat', label: '10 Besar Terlambat', icon: Trophy },
    { id: 'section-divisi', label: 'Analisis Divisi', icon: Building2 },
    { id: 'section-izin-sakit', label: 'Rekap Izin & Sakit', icon: HeartPulse },
    { id: 'section-karyawan', label: 'Data 43 Karyawan', icon: Users },
  ];

  const handleNavClick = (id: string) => {
    if (onNavigateSection) {
      onNavigateSection(id);
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-[#0b0f19] text-slate-200 border-r border-slate-800 w-72 select-none">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 text-white flex items-center justify-center font-black tracking-tighter text-sm shadow-md ring-1 ring-white/20 shrink-0">
            PODA
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-white block leading-none">
              PODA
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-1 block">
              Portal Absensi Karyawan
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Menu & Filters */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs scrollbar-thin">
        
        {/* Menu Navigasi Cepat */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-2">
            Navigasi Dashboard
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors text-left font-medium"
                >
                  <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Menu Filter Vertikal */}
        <div className="pt-4 border-t border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Filter Presensi
            </span>
            {isFiltered && (
              <button
                onClick={handleReset}
                className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* 1. Tahun Kerja (Vertikal) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300 block px-1">
              Tahun Kerja:
            </label>
            <div className="flex flex-col gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => onChangeFilters({ ...filters, year: 2025 })}
                className={`w-full py-1.5 px-3 text-left rounded-md font-medium transition-colors ${
                  filters.year === 2025
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                2025 (Rekap Data Asli)
              </button>
              <button
                onClick={() => onChangeFilters({ ...filters, year: 2026 })}
                className={`w-full py-1.5 px-3 text-left rounded-md font-medium transition-colors ${
                  filters.year === 2026
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                2026 (Tahun Berjalan)
              </button>
            </div>
          </div>

          {/* 2. Periode Bulan (Vertikal Dropdown / Selector) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300 block px-1">
              Periode Bulan:
            </label>
            <select
              value={filters.month === 'ALL' ? 'ALL' : filters.month}
              onChange={(e) => {
                const val = e.target.value === 'ALL' ? 'ALL' : Number(e.target.value);
                onChangeFilters({ ...filters, month: val });
              }}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              <option value="ALL">Sepanjang Tahun (12 Bulan)</option>
              {MONTH_NAMES.map((m, idx) => (
                <option key={m} value={idx}>
                  Bulan {m} ({filters.year})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Pencarian Nama */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300 block px-1">
              Cari Karyawan:
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => onChangeFilters({ ...filters, searchQuery: e.target.value })}
                placeholder="Cari nama karyawan..."
                className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* 4. Filter Divisi */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300 block px-1">
              Divisi:
            </label>
            <select
              value={filters.department}
              onChange={(e) => onChangeFilters({ ...filters, department: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              <option value="ALL">Semua Divisi (5 Divisi)</option>
              {availableDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  Divisi {dept}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Filter Entitas Perusahaan */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300 block px-1">
              Entitas PT:
            </label>
            <select
              value={filters.company}
              onChange={(e) => onChangeFilters({ ...filters, company: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              <option value="ALL">Semua Entitas</option>
              {availableCompanies.map((comp) => (
                <option key={comp} value={comp}>
                  PT {comp}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2 bg-[#080b13]">
        <button
          onClick={onOpenSyncModal}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Sumber Spreadsheet</span>
        </button>

        <button
          onClick={onExportCsv}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Unduh Rekap CSV</span>
        </button>

        <div className="text-[10px] text-slate-500 text-center pt-1 font-mono">
          43 Karyawan Terdaftar · {filters.year}
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-0 h-screen z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 z-50 max-w-full flex">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
