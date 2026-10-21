import { 
  AttendanceRecord, 
  DepartmentSummary, 
  AttendanceFilters, 
  SheetSourceMeta 
} from '../types/attendance';
import { generateAttendanceRecords, MONTH_NAMES, RAW_CSV_SNIPPET } from '../data/initialData';

export class AttendanceService {
  private static cachedRecordsYear2025: AttendanceRecord[] | null = null;
  private static cachedRecordsYear2026: AttendanceRecord[] | null = null;

  public static getInitialRecords(year: number = 2025): AttendanceRecord[] {
    if (year === 2025) {
      if (!this.cachedRecordsYear2025) {
        this.cachedRecordsYear2025 = generateAttendanceRecords(2025);
      }
      return this.cachedRecordsYear2025;
    } else {
      if (!this.cachedRecordsYear2026) {
        this.cachedRecordsYear2026 = generateAttendanceRecords(2026);
      }
      return this.cachedRecordsYear2026;
    }
  }

  public static getDefaultSourceMeta(): SheetSourceMeta {
    return {
      sourceName: 'Daftar_absensi_karyawan_2026_266fa682.csv',
      sourceType: 'local_file',
      url: '/public/assets/aistudio/Daftar_absensi_karyawan_2026_266fa682',
      lastSynced: 'Hari ini, 20 Okt 2026 (Tersinkronisasi)',
      totalRows: 43,
      rawCsvPreview: RAW_CSV_SNIPPET,
    };
  }

  /**
   * Transforms a typical Google Sheets URL into its CSV export URL
   */
  public static convertGoogleSheetUrlToCsvUrl(rawUrl: string): string {
    const trimmed = rawUrl.trim();
    if (!trimmed.includes('docs.google.com/spreadsheets')) {
      return trimmed;
    }

    try {
      const match = trimmed.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) return trimmed;
      const sheetId = match[1];

      let gid = '0';
      const gidMatch = trimmed.match(/[#&?]gid=([0-9]+)/);
      if (gidMatch) {
        gid = gidMatch[1];
      }

      return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    } catch {
      return trimmed;
    }
  }

  /**
   * Filter and slice records according to user controls
   */
  public static getFilteredRecords(
    records: AttendanceRecord[], 
    filters: AttendanceFilters
  ): AttendanceRecord[] {
    return records.filter((rec) => {
      // Department filter
      if (filters.department !== 'ALL' && rec.department !== filters.department) {
        return false;
      }
      // Company filter
      if (filters.company !== 'ALL' && rec.company !== filters.company) {
        return false;
      }
      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesName = rec.name.toLowerCase().includes(query);
        const matchesDept = rec.department.toLowerCase().includes(query);
        const matchesRole = rec.title?.toLowerCase().includes(query) ?? false;
        if (!matchesName && !matchesDept && !matchesRole) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   * Calculate department-level aggregations
   */
  public static getDepartmentSummaries(records: AttendanceRecord[], selectedMonth: 'ALL' | number): DepartmentSummary[] {
    const deptMap: { [key: string]: {
      totalEmployees: number;
      totalWorkingDays: number;
      totalOnTime: number;
      totalLate: number;
      totalLateMinutes: number;
      totalSick: number;
      totalPermit: number;
      totalAlpha: number;
    } } = {};

    records.forEach((rec) => {
      if (!deptMap[rec.department]) {
        deptMap[rec.department] = {
          totalEmployees: 0,
          totalWorkingDays: 0,
          totalOnTime: 0,
          totalLate: 0,
          totalLateMinutes: 0,
          totalSick: 0,
          totalPermit: 0,
          totalAlpha: 0,
        };
      }

      const d = deptMap[rec.department];
      d.totalEmployees += 1;

      if (selectedMonth === 'ALL') {
        d.totalWorkingDays += rec.totalWorkingDays;
        d.totalOnTime += rec.totalOnTime;
        d.totalLate += rec.totalLate;
        d.totalLateMinutes += rec.totalLateMinutes;
        d.totalSick += rec.totalSick;
        d.totalPermit += rec.totalPermit;
        d.totalAlpha += rec.totalAlpha;
      } else {
        const m = rec.months[selectedMonth];
        if (m) {
          d.totalWorkingDays += m.workingDays;
          d.totalOnTime += m.onTimeDays;
          d.totalLate += m.lateDays;
          d.totalLateMinutes += m.lateMinutes;
          d.totalSick += m.sickDays;
          d.totalPermit += m.permitDays;
          d.totalAlpha += m.absentDays;
        }
      }
    });

    const dayOfWeekDistribution: Record<string, string> = {
      PABRIK: 'Senin Pagi (Shift 1)',
      CREATIVE: 'Senin & Kamis',
      SALES: 'Jumat Pagi',
      FAT: 'Rabu',
      HRDGA: 'Selasa',
    };

    return Object.keys(deptMap).map((dept) => {
      const data = deptMap[dept];
      const totalAttended = data.totalOnTime + data.totalLate;
      const onTimeRate = totalAttended > 0 ? Number(((data.totalOnTime / totalAttended) * 100).toFixed(1)) : 100;
      const lateRate = totalAttended > 0 ? Number(((data.totalLate / totalAttended) * 100).toFixed(1)) : 0;
      const avgLateMinutesPerPerson = data.totalEmployees > 0 
        ? Math.round(data.totalLateMinutes / data.totalEmployees) 
        : 0;

      return {
        department: dept,
        totalEmployees: data.totalEmployees,
        totalWorkingDays: data.totalWorkingDays,
        totalOnTime: data.totalOnTime,
        totalLate: data.totalLate,
        totalLateMinutes: data.totalLateMinutes,
        totalSick: data.totalSick,
        totalPermit: data.totalPermit,
        totalAlpha: data.totalAlpha,
        onTimeRate,
        lateRate,
        avgLateMinutesPerPerson,
        mostFrequentLateDay: dayOfWeekDistribution[dept] || 'Senin Pagi',
      };
    }).sort((a, b) => b.totalLate - a.totalLate); // Sorted by total late descending as requested!
  }

  /**
   * Top 10 Employees with highest tardiness
   */
  public static getTopLateEmployees(records: AttendanceRecord[], selectedMonth: 'ALL' | number, limit: number = 10) {
    const list = records.map((rec) => {
      let lateDays = rec.totalLate;
      let lateMinutes = rec.totalLateMinutes;
      let onTimeDays = rec.totalOnTime;

      if (selectedMonth !== 'ALL') {
        const m = rec.months[selectedMonth];
        lateDays = m?.lateDays || 0;
        lateMinutes = m?.lateMinutes || 0;
        onTimeDays = m?.onTimeDays || 0;
      }

      const totalPresence = onTimeDays + lateDays;
      const latePct = totalPresence > 0 ? Number(((lateDays / totalPresence) * 100).toFixed(1)) : 0;
      const avgMinutesPerLate = lateDays > 0 ? Math.round(lateMinutes / lateDays) : 0;

      return {
        id: rec.id,
        name: rec.name,
        department: rec.department,
        company: rec.company,
        title: rec.title,
        avatarUrl: rec.avatarUrl,
        lateDays,
        lateMinutes,
        avgMinutesPerLate,
        latePct,
        disciplineScore: rec.disciplineScore,
        recentReasons: rec.recentLateReasons,
      };
    });

    return list
      .filter((emp) => emp.lateDays > 0)
      .sort((a, b) => {
        if (b.lateDays !== a.lateDays) {
          return b.lateDays - a.lateDays;
        }
        return b.lateMinutes - a.lateMinutes;
      })
      .slice(0, limit);
  }

  /**
   * Top 5 Employees with highest diligence / on-time attendance (Paling Rajin)
   */
  public static getTopDiligentEmployees(records: AttendanceRecord[], selectedMonth: 'ALL' | number, limit: number = 5) {
    const list = records.map((rec) => {
      let lateDays = rec.totalLate;
      let onTimeDays = rec.totalOnTime;
      let sickDays = rec.totalSick;
      let permitDays = rec.totalPermit;

      if (selectedMonth !== 'ALL') {
        const m = rec.months[selectedMonth];
        lateDays = m?.lateDays || 0;
        onTimeDays = m?.onTimeDays || 0;
        sickDays = m?.sickDays || 0;
        permitDays = m?.permitDays || 0;
      }

      const totalPresence = onTimeDays + lateDays;
      const onTimePct = totalPresence > 0 ? Number(((onTimeDays / totalPresence) * 100).toFixed(1)) : 100;

      return {
        id: rec.id,
        name: rec.name,
        department: rec.department,
        company: rec.company,
        title: rec.title,
        avatarUrl: rec.avatarUrl,
        onTimeDays,
        lateDays,
        sickDays,
        permitDays,
        onTimePct,
        disciplineScore: rec.disciplineScore,
      };
    });

    return list
      .sort((a, b) => {
        if (b.disciplineScore !== a.disciplineScore) {
          return b.disciplineScore - a.disciplineScore;
        }
        if (a.lateDays !== b.lateDays) {
          return a.lateDays - b.lateDays; // fewer late days is better
        }
        return b.onTimeDays - a.onTimeDays;
      })
      .slice(0, limit);
  }

  /**
   * Top Sick & Top Permit lists
   */
  public static getTopSickAndPermits(records: AttendanceRecord[], selectedMonth: 'ALL' | number, limit: number = 6) {
    const processed = records.map((rec) => {
      let sickDays = rec.totalSick;
      let permitDays = rec.totalPermit;

      if (selectedMonth !== 'ALL') {
        const m = rec.months[selectedMonth];
        sickDays = m?.sickDays || 0;
        permitDays = m?.permitDays || 0;
      }

      return {
        id: rec.id,
        name: rec.name,
        department: rec.department,
        company: rec.company,
        title: rec.title,
        sickDays,
        permitDays,
      };
    });

    const topSick = [...processed]
      .filter((r) => r.sickDays > 0)
      .sort((a, b) => b.sickDays - a.sickDays)
      .slice(0, limit);

    const topPermit = [...processed]
      .filter((r) => r.permitDays > 0)
      .sort((a, b) => b.permitDays - a.permitDays)
      .slice(0, limit);

    return { topSick, topPermit };
  }

  /**
   * Monthly trend aggregation across all employees
   */
  public static getMonthlyTrends(records: AttendanceRecord[]) {
    return MONTH_NAMES.map((name, idx) => {
      let onTime = 0;
      let late = 0;
      let sick = 0;
      let permit = 0;
      let lateMinutes = 0;

      records.forEach((rec) => {
        const m = rec.months[idx];
        if (m) {
          onTime += m.onTimeDays;
          late += m.lateDays;
          sick += m.sickDays;
          permit += m.permitDays;
          lateMinutes += m.lateMinutes;
        }
      });

      const totalWorked = onTime + late;
      const onTimeRate = totalWorked > 0 ? Number(((onTime / totalWorked) * 100).toFixed(1)) : 100;
      const lateRate = totalWorked > 0 ? Number(((late / totalWorked) * 100).toFixed(1)) : 0;

      return {
        month: name,
        monthIndex: idx,
        onTime,
        late,
        sick,
        permit,
        lateMinutes,
        onTimeRate,
        lateRate,
      };
    });
  }

  /**
   * Overall totals for KPI cards
   */
  public static getKpiTotals(records: AttendanceRecord[], selectedMonth: 'ALL' | number) {
    let totalWorkingDays = 0;
    let totalOnTime = 0;
    let totalLate = 0;
    let totalLateMinutes = 0;
    let totalSick = 0;
    let totalPermit = 0;
    let totalAnnualLeave = 0;
    let totalAlpha = 0;

    records.forEach((rec) => {
      if (selectedMonth === 'ALL') {
        totalWorkingDays += rec.totalWorkingDays;
        totalOnTime += rec.totalOnTime;
        totalLate += rec.totalLate;
        totalLateMinutes += rec.totalLateMinutes;
        totalSick += rec.totalSick;
        totalPermit += rec.totalPermit;
        totalAnnualLeave += rec.totalAnnualLeave;
        totalAlpha += rec.totalAlpha;
      } else {
        const m = rec.months[selectedMonth];
        if (m) {
          totalWorkingDays += m.workingDays;
          totalOnTime += m.onTimeDays;
          totalLate += m.lateDays;
          totalLateMinutes += m.lateMinutes;
          totalSick += m.sickDays;
          totalPermit += m.permitDays;
          totalAnnualLeave += m.annualLeaveDays;
          totalAlpha += m.absentDays;
        }
      }
    });

    const totalAttendance = totalOnTime + totalLate;
    const onTimePercentage = totalAttendance > 0 ? Number(((totalOnTime / totalAttendance) * 100).toFixed(1)) : 100;
    const latePercentage = totalAttendance > 0 ? Number(((totalLate / totalAttendance) * 100).toFixed(1)) : 0;
    const avgLateMinutes = totalLate > 0 ? Math.round(totalLateMinutes / totalLate) : 0;

    return {
      totalEmployees: records.length,
      totalWorkingDays,
      totalOnTime,
      totalLate,
      totalLateMinutes,
      totalSick,
      totalPermit,
      totalAnnualLeave,
      totalAlpha,
      onTimePercentage,
      latePercentage,
      avgLateMinutes,
    };
  }

  /**
   * Export records to CSV string for downloading
   */
  public static exportToCsv(records: AttendanceRecord[], year: number): string {
    const headers = [
      'ID',
      'Nama Karyawan',
      'Divisi',
      'Perusahaan',
      'Jabatan',
      'Tepat Waktu (Hari)',
      'Terlambat (Hari)',
      'Total Menit Telat',
      'Izin (Hari)',
      'Sakit (Hari)',
      'Cuti (Hari)',
      'Alpha (Hari)',
      'Tingkat Ketepatan (%)',
      'Skor Disiplin'
    ];

    const rows = records.map((r) => [
      `"${r.id}"`,
      `"${r.name}"`,
      `"${r.department}"`,
      `"${r.company}"`,
      `"${r.title || ''}"`,
      r.totalOnTime,
      r.totalLate,
      r.totalLateMinutes,
      r.totalPermit,
      r.totalSick,
      r.totalAnnualLeave,
      r.totalAlpha,
      `"${r.onTimePercentage}%"`,
      r.disciplineScore
    ]);

    return [
      `# Rekapitulasi Presensi Karyawan Tahun ${year}`,
      headers.join(','),
      ...rows.map((row) => row.join(','))
    ].join('\n');
  }
}
