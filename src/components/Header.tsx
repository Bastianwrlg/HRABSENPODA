import React from 'react';
import { Download, RefreshCw, Menu } from 'lucide-react';
import { SheetSourceMeta } from '../types/attendance';

interface HeaderProps {
  sourceMeta: SheetSourceMeta;
  onOpenSyncModal: () => void;
  onExportCsv: () => void;
  year: number;
  onOpenMobileMenu?: () => void;
  periodLabel?: string;
}

export const Header: React.FC<HeaderProps> = ({
  sourceMeta,
  onOpenSyncModal,
  onExportCsv,
  year,
  onOpenMobileMenu,
  periodLabel,
}) => {
  return (
    <header className="border-b border-slate-800 bg-[#0b0f19] text-white sticky top-0 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Mobile toggle & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            {onOpenMobileMenu && (
              <button
                onClick={onOpenMobileMenu}
                aria-label="Buka Menu"
                className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 text-white flex items-center justify-center font-black tracking-tighter text-sm shadow-md ring-1 ring-white/20">
              PODA
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white whitespace-nowrap">
                  PODA
                </span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  TAHUN {year}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Sistem Presensi Terintegrasi Spreadsheet
              </p>
            </div>
          </div>

          {/* Zone 2: Active period info */}
          {periodLabel && (
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg font-mono">
              <span>Periode Aktif:</span>
              <strong className="text-amber-400 font-semibold">{periodLabel}</strong>
            </div>
          )}

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenSyncModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Sumber Spreadsheet</span>
            </button>

            <button
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh CSV</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
