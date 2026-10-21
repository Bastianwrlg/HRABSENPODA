export interface MonthlyAttendance {
  month: string; // 'Jan', 'Feb', 'Mar', ...
  monthIndex: number; // 0 to 11
  workingDays: number;
  onTimeDays: number;
  lateDays: number;
  lateMinutes: number;
  sickDays: number;
  permitDays: number; // Izin
  annualLeaveDays: number; // Cuti
  absentDays: number; // Alpha
}

export interface AttendanceRecord {
  id: string;
  name: string;
  department: 'FAT' | 'HRDGA' | 'PABRIK' | 'CREATIVE' | 'SALES' | string;
  company: 'PSG' | 'TNS' | string;
  title?: string;
  email?: string;
  avatarUrl?: string;
  months: MonthlyAttendance[];
  
  // Annual aggregated totals
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
  disciplineScore: number; // 0 - 100
  recentLateReasons?: string[];
}

export interface DepartmentSummary {
  department: string;
  totalEmployees: number;
  totalWorkingDays: number;
  totalOnTime: number;
  totalLate: number;
  totalLateMinutes: number;
  totalSick: number;
  totalPermit: number;
  totalAlpha: number;
  onTimeRate: number; // %
  lateRate: number; // %
  avgLateMinutesPerPerson: number;
  mostFrequentLateDay: string;
}

export interface AttendanceFilters {
  year: number; // 2025 or 2026
  month: 'ALL' | number; // 0 to 11 or ALL
  department: 'ALL' | string;
  company: 'ALL' | string;
  searchQuery: string;
}

export interface SheetSourceMeta {
  sourceName: string;
  sourceType: 'local_file' | 'google_sheet' | 'uploaded_csv';
  url?: string;
  lastSynced: string;
  totalRows: number;
  rawCsvPreview?: string;
}
