import React, { useState, useMemo } from 'react';
import { AttendanceService } from './services/dataService';
import { AttendanceFilters, SheetSourceMeta } from './types/attendance';
import { Header } from './components/Header';
import { VerticalSidebar } from './components/VerticalSidebar';
import { KpiSummaryCards } from './components/KpiSummaryCards';
import { TopDiligentLeaderboard } from './components/TopDiligentLeaderboard';
import { AttendanceCharts } from './components/AttendanceCharts';
import { DepartmentComparison } from './components/DepartmentComparison';
import { TopLateLeaderboard } from './components/TopLateLeaderboard';
import { LeaveAndSickReport } from './components/LeaveAndSickReport';
import { MonthlyTrendChart } from './components/MonthlyTrendChart';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeDetailModal } from './components/EmployeeDetailModal';
import { SpreadsheetSyncModal } from './components/SpreadsheetSyncModal';
import { MONTH_NAMES } from './data/initialData';

export default function App() {
  // Current filters state
  const [filters, setFilters] = useState<AttendanceFilters>({
    year: 2025,
    month: 'ALL',
    department: 'ALL',
    company: 'ALL',
    searchQuery: '',
  });

  // Source metadata state
  const [sourceMeta, setSourceMeta] = useState<SheetSourceMeta>(
    AttendanceService.getDefaultSourceMeta()
  );

  // Modals state
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Active records based on selected year
  const allYearRecords = useMemo(() => {
    return AttendanceService.getInitialRecords(filters.year);
  }, [filters.year]);

  // Filtered records based on department, company, search
  const filteredRecords = useMemo(() => {
    return AttendanceService.getFilteredRecords(allYearRecords, filters);
  }, [allYearRecords, filters]);

  // Available unique departments and companies
  const availableDepartments = useMemo(() => {
    return Array.from(new Set(allYearRecords.map((r) => r.department))).sort();
  }, [allYearRecords]);

  const availableCompanies = useMemo(() => {
    return Array.from(new Set(allYearRecords.map((r) => r.company))).sort();
  }, [allYearRecords]);

  // Calculated aggregations
  const kpiTotals = useMemo(() => {
    return AttendanceService.getKpiTotals(filteredRecords, filters.month);
  }, [filteredRecords, filters.month]);

  // Top 5 Diligent / Paling Rajin (New!)
  const topDiligentEmployees = useMemo(() => {
    return AttendanceService.getTopDiligentEmployees(filteredRecords, filters.month, 5);
  }, [filteredRecords, filters.month]);

  const departmentSummaries = useMemo(() => {
    return AttendanceService.getDepartmentSummaries(filteredRecords, filters.month);
  }, [filteredRecords, filters.month]);

  const topLateEmployees = useMemo(() => {
    return AttendanceService.getTopLateEmployees(filteredRecords, filters.month, 10);
  }, [filteredRecords, filters.month]);

  const { topSick, topPermit } = useMemo(() => {
    return AttendanceService.getTopSickAndPermits(filteredRecords, filters.month, 6);
  }, [filteredRecords, filters.month]);

  const monthlyTrends = useMemo(() => {
    return AttendanceService.getMonthlyTrends(filteredRecords);
  }, [filteredRecords]);

  // Currently selected employee for drilldown modal
  const selectedEmployee = useMemo(() => {
    if (!selectedEmployeeId) return null;
    return allYearRecords.find((r) => r.id === selectedEmployeeId) || null;
  }, [selectedEmployeeId, allYearRecords]);

  // Period label for titles
  const periodLabel = useMemo(() => {
    if (filters.month === 'ALL') {
      return `Tahun ${filters.year} (Jan - Des)`;
    }
    return `${MONTH_NAMES[filters.month]} ${filters.year}`;
  }, [filters.year, filters.month]);

  // Export CSV handler
  const handleExportCsv = () => {
    const csvContent = AttendanceService.exportToCsv(filteredRecords, filters.year);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Rekap_Presensi_Karyawan_${filters.year}_${filters.month === 'ALL' ? 'Tahunan' : MONTH_NAMES[filters.month]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReloadDefault = () => {
    setSourceMeta(AttendanceService.getDefaultSourceMeta());
    setFilters({
      year: 2025,
      month: 'ALL',
      department: 'ALL',
      company: 'ALL',
      searchQuery: '',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col lg:flex-row font-sans">
      {/* 1. Vertical Sidebar: Navigation & All Filters (Vertical Menu) */}
      <VerticalSidebar
        filters={filters}
        onChangeFilters={setFilters}
        availableDepartments={availableDepartments}
        availableCompanies={availableCompanies}
        sourceMeta={sourceMeta}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onExportCsv={handleExportCsv}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          sourceMeta={sourceMeta}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          onExportCsv={handleExportCsv}
          year={filters.year}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          periodLabel={periodLabel}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Welcome Intro Banner */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                PODA — Dashboard Analisis Absensi & Kedisiplinan Karyawan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Data terintegrasi master sheet absensi: 43 karyawan (Divisi PABRIK, CREATIVE, FAT, HRDGA, SALES).
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-600 font-mono">
                Periode Terpilih: <strong className="text-amber-700 font-semibold">{periodLabel}</strong>
              </span>
            </div>
          </div>

          {/* Section 1: Executive KPI Summary Cards */}
          <div id="section-kpi">
            <KpiSummaryCards totals={kpiTotals} periodLabel={periodLabel} />
          </div>

          {/* Section 2: Top 5 Karyawan Paling Rajin (New!) */}
          <div id="section-rajin">
            <TopDiligentLeaderboard
              topDiligent={topDiligentEmployees}
              onSelectEmployee={(id) => setSelectedEmployeeId(id)}
              periodLabel={periodLabel}
            />
          </div>

          {/* Section 3: Pie Chart & Graphic Visualizations */}
          <div id="section-grafik">
            <AttendanceCharts
              totals={kpiTotals}
              departments={departmentSummaries}
              periodLabel={periodLabel}
            />
          </div>

          {/* Section 4: Two-Column Analytical Split: Top 10 Terlambat & Divisi Paling Banyak Telat */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Top 10 Sering Telat (7 Cols) */}
            <div id="section-telat" className="lg:col-span-7">
              <TopLateLeaderboard
                topEmployees={topLateEmployees}
                onSelectEmployee={(id) => setSelectedEmployeeId(id)}
                periodLabel={periodLabel}
              />
            </div>

            {/* Divisi Yang Banyak Telat (5 Cols) */}
            <div id="section-divisi" className="lg:col-span-5">
              <DepartmentComparison
                departments={departmentSummaries}
                selectedDept={filters.department}
                onSelectDepartment={(dept) => {
                  setFilters({
                    ...filters,
                    department: filters.department === dept ? 'ALL' : dept,
                  });
                }}
              />
            </div>

          </div>

          {/* Section 5: Rekapitulasi Izin & Sakit */}
          <div id="section-izin-sakit">
            <LeaveAndSickReport
              topSick={topSick}
              topPermit={topPermit}
              onSelectEmployee={(id) => setSelectedEmployeeId(id)}
              periodLabel={periodLabel}
            />
          </div>

          {/* Section 6: 12-Month Monthly Trend Visual Chart */}
          <MonthlyTrendChart
            monthlyData={monthlyTrends}
            selectedMonthIndex={filters.month}
            onSelectMonth={(m) => setFilters({ ...filters, month: m })}
            year={filters.year}
          />

          {/* Section 7: Master Directory Employee Table (All 43 Employees) */}
          <div id="section-karyawan">
            <EmployeeTable
              records={filteredRecords}
              selectedMonth={filters.month}
              onSelectEmployee={(id) => setSelectedEmployeeId(id)}
            />
          </div>

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-5 text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">PODA</span>
              <span className="text-slate-300">·</span>
              <span>Sistem Pemantauan Absensi & Kedisiplinan Terintegrasi Spreadsheet</span>
            </div>
            <div>
              Data Master: <span className="font-mono text-slate-700">Daftar_absensi_karyawan_2026_266fa682 (43 Karyawan)</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        onClose={() => setSelectedEmployeeId(null)}
        year={filters.year}
      />

      <SpreadsheetSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        currentMeta={sourceMeta}
        onUpdateMeta={setSourceMeta}
        onReloadDefault={handleReloadDefault}
      />
    </div>
  );
}
