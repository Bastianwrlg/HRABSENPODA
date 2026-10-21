import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import { AttendanceFilters } from '../types/attendance';
import { MONTH_NAMES } from '../data/initialData';

interface FilterBarProps {
  filters: AttendanceFilters;
  onChangeFilters: (filters: AttendanceFilters) => void;
  availableDepartments: string[];
  availableCompanies: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilters,
  availableDepartments,
  availableCompanies,
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

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs mb-6 space-y-3">
      {/* Top row: Year & Period Segmented Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        
        {/* Year toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tahun Kerja:
          </span>
          <div className="inline-flex p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => onChangeFilters({ ...filters, year: 2025 })}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filters.year === 2025
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2025 (Rekap Data Asli)
            </button>
            <button
              onClick={() => onChangeFilters({ ...filters, year: 2026 })}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filters.year === 2026
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2026 (Tahun Berjalan)
            </button>
          </div>
        </div>

        {/* Month selector tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => onChangeFilters({ ...filters, month: 'ALL' })}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              filters.month === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Sepanjang Tahun (12 Bln)
          </button>
          {MONTH_NAMES.map((m, idx) => (
            <button
              key={m}
              onClick={() => onChangeFilters({ ...filters, month: idx })}
              className={`px-2 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                filters.month === idx
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

      </div>

      {/* Bottom row: Department, Company, and Search query */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        
        {/* Search */}
        <div className="lg:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChangeFilters({ ...filters, searchQuery: e.target.value })}
            placeholder="Cari nama karyawan atau divisi..."
            className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-500"
          />
        </div>

        {/* Department Filter */}
        <div className="lg:col-span-3">
          <select
            value={filters.department}
            onChange={(e) => onChangeFilters({ ...filters, department: e.target.value })}
            className="w-full px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-500 cursor-pointer"
          >
            <option value="ALL">Semua Divisi (PABRIK, CREATIVE, FAT, dll)</option>
            {availableDepartments.map((dept) => (
              <option key={dept} value={dept}>
                Divisi {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Company Filter */}
        <div className="lg:col-span-2">
          <select
            value={filters.company}
            onChange={(e) => onChangeFilters({ ...filters, company: e.target.value })}
            className="w-full px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-500 cursor-pointer"
          >
            <option value="ALL">Semua Entitas</option>
            {availableCompanies.map((comp) => (
              <option key={comp} value={comp}>
                PT {comp}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filter Button */}
        <div className="lg:col-span-2 flex justify-end">
          {isFiltered && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors w-full sm:w-auto justify-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
