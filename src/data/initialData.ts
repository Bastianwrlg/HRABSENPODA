import { AttendanceRecord, MonthlyAttendance } from '../types/attendance';

export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

export const RAW_CSV_SNIPPET = `,RECAPITULATION OF WORKING TH 2025,,,,,,,,,,,,,,,
,NAME,DEPARTMENT,COMPANY,RECAPITULATION OF WORKING TH 2025,,,,,,,,,,,,
,,,,JAN,FEB,MAR,APR,MAY,JUN,JUL,AUG,SEPT,OCT,NOV,DEC,TOTAL
,Ratna Puspitasari,FAT,PSG,,,,,,,,  21 ,,,,,
,Verry Dina Pandu,FAT,TNS,,,,,,,,  21 ,,,,,
,Anastasya,FAT,TNS,,,,,,,,  19 ,,,,,
,Rizky Cahya Maulana,FAT,TNS,,,,,,,,  21 ,,,,,
,Indira Puspa Anggraini,FAT,PSG,,,,,,,,  20 ,,,,,
,Siska Trimardianti,FAT,PSG,,,,,,,,  21 ,,,,,
,Ayu Afzal ,HRDGA,TNS,,,,,,,,  12 ,,,,,
,Sita Destriana Wulandhari,HRDGA,TNS,,,,,,,,  11 ,,,,,
,Irham Ariawibawa,HRDGA,TNS,,,,,,,,  22 ,,,,,
,Rohaya,HRDGA,TNS,,,,,,,,  22 ,,,,,
,Masadi,HRDGA,TNS,,,,,,,,  21 ,,,,,
,Pikri Firmansyah,HRDGA,PSG,,,,,,,,  21 ,,,,,
,Ramot Athansius,PABRIK,TNS,,,,,,,,  21 ,,,,,
,Angga Gustia Pamuji,PABRIK,TNS,,,,,,,,  21 ,,,,,
,Winner MP Siagian,PABRIK,TNS,,,,,,,,  21 ,,,,,
,Rhazari Sultan Prafera,PABRIK,TNS,,,,,,,,  21 ,,,,,
,Novanti Widya Pratiwi,PABRIK,TNS,,,,,,,,  21 ,,,,,
,Jessica Siagian,PABRIK,TNS,,,,,,,,  21 ,,,,,
,Regina Apriliyani,PABRIK,TNS,,,,,,,,  21 ,,,,,
,Yulia Nuranisa,PABRIK,TNS,,,,,,,,  21 ,,,,,
,Aditya Lesmana,PABRIK,TNS,,,,,,,,  22 ,,,,,
,Sahrul Sanjaya,PABRIK,TNS,,,,,,,,  21 ,,,,,
,Caca Cahyana,PABRIK,TNS,,,,,,,,  21 ,,,,,
,Rifaldy Ahmad Ghifari,PABRIK,TNS,,,,,,,,  21 ,,,,,
,Firman Rifaldi M.,PABRIK,TNS,,,,,,,,  21 ,,,,,
,Diva Faturahman,PABRIK,TNS,,,,,,,,  21 ,,,,,
,Handrian Fransiskus Silaen,PABRIK,TNS,,,,,,,,  21 ,,,,,
,Bambang,PABRIK,TNS,,,,,,,,  22 ,,,,,
,Rizky Maulana Yusup,PABRIK,TNS,,,,,,,,  22 ,,,,,
,Ramzy Fadlan Rahmadi,PABRIK,TNS,,,,,,,,  21 ,,,,,
,Wisnu Adi Saputra,PABRIK,TNS,,,,,,,,  22 ,,,,,
,Hardiansyah,PABRIK,TNS,,,,,,,,  21 ,,,,,
,Erwin Salomo,PABRIK,TNS,,,,,,,,  21 ,,,,,
,Adrian Kristianto,CREATIVE,PSG,,,,,,,,  23 ,,,,,
,Arih Fitriani,CREATIVE,PSG,,,,,,,,  24 ,,,,,
,Widi Nur Fadhilah,CREATIVE,PSG,,,,,,,,  22 ,,,,,
,Muhammad Iqbal,CREATIVE,PSG,,,,,,,,  22 ,,,,,
,Ganes Muhammad Soleh,CREATIVE,PSG,,,,,,,,  22 ,,,,,
,Doni Rahmandani,CREATIVE,PSG,,,,,,,,  21 ,,,,,
,Rusdiyana,CREATIVE,PSG,,,,,,,,  21 ,,,,,
,Oky Handanny,SALES,PSG,,,,,,,,  25 ,,,,,
,Cyntia Visi Sanli Berzmany,SALES,PSG,,,,,,,,  21 ,,,,,
,M. Rafly Prianata,SALES,PSG,,,,,,,,  23 ,,,,,`;

interface EmployeeSeed {
  name: string;
  department: string;
  company: string;
  augWorkingDays: number;
  // Specific traits for realistic variance
  lateTendency: 'high' | 'medium' | 'low';
  sickTendency: 'high' | 'medium' | 'low';
  permitTendency: 'high' | 'medium' | 'low';
  role?: string;
}

export const RAW_EMPLOYEES: EmployeeSeed[] = [
  // FAT
  { name: 'Ratna Puspitasari', department: 'FAT', company: 'PSG', augWorkingDays: 21, lateTendency: 'low', sickTendency: 'low', permitTendency: 'low', role: 'Accounting Supervisor' },
  { name: 'Verry Dina Pandu', department: 'FAT', company: 'TNS', augWorkingDays: 21, lateTendency: 'low', sickTendency: 'low', permitTendency: 'low', role: 'Finance Staff' },
  { name: 'Anastasya', department: 'FAT', company: 'TNS', augWorkingDays: 19, lateTendency: 'medium', sickTendency: 'medium', permitTendency: 'medium', role: 'Tax Officer' },
  { name: 'Rizky Cahya Maulana', department: 'FAT', company: 'TNS', augWorkingDays: 21, lateTendency: 'low', sickTendency: 'low', permitTendency: 'low', role: 'Accounts Payable' },
  { name: 'Indira Puspa Anggraini', department: 'FAT', company: 'PSG', augWorkingDays: 20, lateTendency: 'low', sickTendency: 'medium', permitTendency: 'low', role: 'Cashier & Treasury' },
  { name: 'Siska Trimardianti', department: 'FAT', company: 'PSG', augWorkingDays: 21, lateTendency: 'low', sickTendency: 'low', permitTendency: 'low', role: 'Billing Specialist' },

  // HRDGA
  { name: 'Ayu Afzal', department: 'HRDGA', company: 'TNS', augWorkingDays: 12, lateTendency: 'medium', sickTendency: 'medium', permitTendency: 'high', role: 'HR Officer' },
  { name: 'Sita Destriana Wulandhari', department: 'HRDGA', company: 'TNS', augWorkingDays: 11, lateTendency: 'low', sickTendency: 'high', permitTendency: 'medium', role: 'GA Admin' },
  { name: 'Irham Ariawibawa', department: 'HRDGA', company: 'TNS', augWorkingDays: 22, lateTendency: 'low', sickTendency: 'low', permitTendency: 'low', role: 'HR Manager' },
  { name: 'Rohaya', department: 'HRDGA', company: 'TNS', augWorkingDays: 22, lateTendency: 'low', sickTendency: 'low', permitTendency: 'low', role: 'Payroll Specialist' },
  { name: 'Masadi', department: 'HRDGA', company: 'TNS', augWorkingDays: 21, lateTendency: 'medium', sickTendency: 'low', permitTendency: 'medium', role: 'General Affairs' },
  { name: 'Pikri Firmansyah', department: 'HRDGA', company: 'PSG', augWorkingDays: 21, lateTendency: 'low', sickTendency: 'low', permitTendency: 'low', role: 'Recruiter' },

  // PABRIK
  { name: 'Ramot Athansius', department: 'PABRIK', company: 'TNS', augWorkingDays: 21, lateTendency: 'high', sickTendency: 'low', permitTendency: 'low', role: 'Operator Mesin CNC' },
  { name: 'Angga Gustia Pamuji', department: 'PABRIK', company: 'TNS', augWorkingDays: 21, lateTendency: 'medium', sickTendency: 'low', permitTendency: 'medium', role: 'Teknisi Maintenance' },
  { name: 'Winner MP Siagian', department: 'PABRIK', company: 'TNS', augWorkingDays: 21, lateTendency: 'high', sickTendency: 'low', permitTendency: 'low', role: 'Leader Produksi' },
  { name: 'Rhazari Sultan Prafera', department: 'PABRIK', company: 'TNS', augWorkingDays: 21, lateTendency: 'high', sickTendency: 'medium', permitTendency: 'low', role: 'Operator Finishing' },
  { name: 'Novanti Widya Pratiwi', department: 'PABRIK', company: 'TNS', augWorkingDays: 21, lateTendency: 'medium', sickTendency: 'low', permitTendency: 'low', role: 'Staff Quality Control' },
  { name: 'Jessica Siagian', department: 'PABRIK', company: 'TNS', augWorkingDays: 21, lateTendency: 'low', sickTendency: 'low', permitTendency: 'low', role: 'Staff PPIC' },
  { name: 'Regina Apriliyani', department: 'PABRIK', company: 'TNS', augWorkingDays: 21, lateTendency: 'low', sickTendency: 'medium', permitTendency: 'low', role: 'Operator Packaging' },
  { name: 'Yulia Nuranisa', department: 'PABRIK', company: 'TNS', augWorkingDays: 21, lateTendency: 'low', sickTendency: 'low', permitTendency: 'low', role: 'Admin Gudang' },
  { name: 'Aditya Lesmana', department: 'PABRIK', company: 'TNS', augWorkingDays: 22, lateTendency: 'medium', sickTendency: 'low', permitTendency: 'low', role: 'Supervisor Gudang' },
  { name: 'Sahrul Sanjaya', department: 'PABRIK', company: 'TNS', augWorkingDays: 21, lateTendency: 'high', sickTendency: 'low', permitTendency: 'low', role: 'Operator Bubut' },
  { name: 'Caca Cahyana', department: 'PABRIK', company: 'TNS', augWorkingDays: 21, lateTendency: 'high', sickTendency: 'low', permitTendency: 'low', role: 'Operator Assembly' },
  { name: 'Rifaldy Ahmad Ghifari', department: 'PABRIK', company: 'TNS', augWorkingDays: 21, lateTendency: 'high', sickTendency: 'low', permitTendency: 'medium', role: 'Teknisi Elektrikal' },
  { name: 'Firman Rifaldi M.', department: 'PABRIK', company: 'TNS', augWorkingDays: 21, lateTendency: 'medium', sickTendency: 'low', permitTendency: 'low', role: 'Operator Cetak' },
  { name: 'Diva Faturahman', department: 'PABRIK', company: 'TNS', augWorkingDays: 21, lateTendency: 'low', sickTendency: 'low', permitTendency: 'low', role: 'Operator Mesin' },
  { name: 'Handrian Fransiskus Silaen', department: 'PABRIK', company: 'TNS', augWorkingDays: 21, lateTendency: 'high', sickTendency: 'low', permitTendency: 'low', role: 'Staff Material Handler' },
  { name: 'Bambang', department: 'PABRIK', company: 'TNS', augWorkingDays: 22, lateTendency: 'medium', sickTendency: 'low', permitTendency: 'low', role: 'Kepala Shift 1' },
  { name: 'Rizky Maulana Yusup', department: 'PABRIK', company: 'TNS', augWorkingDays: 22, lateTendency: 'low', sickTendency: 'low', permitTendency: 'low', role: 'Staff K3 / Safety' },
  { name: 'Ramzy Fadlan Rahmadi', department: 'PABRIK', company: 'TNS', augWorkingDays: 21, lateTendency: 'high', sickTendency: 'low', permitTendency: 'low', role: 'Operator Painting' },
  { name: 'Wisnu Adi Saputra', department: 'PABRIK', company: 'TNS', augWorkingDays: 22, lateTendency: 'medium', sickTendency: 'low', permitTendency: 'low', role: 'Operator Grinding' },
  { name: 'Hardiansyah', department: 'PABRIK', company: 'TNS', augWorkingDays: 21, lateTendency: 'high', sickTendency: 'medium', permitTendency: 'low', role: 'Operator Welding' },
  { name: 'Erwin Salomo', department: 'PABRIK', company: 'TNS', augWorkingDays: 21, lateTendency: 'high', sickTendency: 'low', permitTendency: 'low', role: 'Operator Presisi' },

  // CREATIVE
  { name: 'Adrian Kristianto', department: 'CREATIVE', company: 'PSG', augWorkingDays: 23, lateTendency: 'high', sickTendency: 'low', permitTendency: 'medium', role: 'Art Director' },
  { name: 'Arih Fitriani', department: 'CREATIVE', company: 'PSG', augWorkingDays: 24, lateTendency: 'low', sickTendency: 'low', permitTendency: 'low', role: 'Senior Graphic Designer' },
  { name: 'Widi Nur Fadhilah', department: 'CREATIVE', company: 'PSG', augWorkingDays: 22, lateTendency: 'medium', sickTendency: 'low', permitTendency: 'low', role: 'Content Writer' },
  { name: 'Muhammad Iqbal', department: 'CREATIVE', company: 'PSG', augWorkingDays: 22, lateTendency: 'medium', sickTendency: 'low', permitTendency: 'low', role: 'Motion Graphic Animator' },
  { name: 'Ganes Muhammad Soleh', department: 'CREATIVE', company: 'PSG', augWorkingDays: 22, lateTendency: 'low', sickTendency: 'medium', permitTendency: 'low', role: 'Videographer' },
  { name: 'Doni Rahmandani', department: 'CREATIVE', company: 'PSG', augWorkingDays: 21, lateTendency: 'high', sickTendency: 'low', permitTendency: 'low', role: 'UI/UX Designer' },
  { name: 'Rusdiyana', department: 'CREATIVE', company: 'PSG', augWorkingDays: 21, lateTendency: 'high', sickTendency: 'low', permitTendency: 'medium', role: 'Copywriter' },

  // SALES
  { name: 'Oky Handanny', department: 'SALES', company: 'PSG', augWorkingDays: 25, lateTendency: 'low', sickTendency: 'low', permitTendency: 'medium', role: 'Account Executive Leader' },
  { name: 'Cyntia Visi Sanli Berzmany', department: 'SALES', company: 'PSG', augWorkingDays: 21, lateTendency: 'medium', sickTendency: 'low', permitTendency: 'high', role: 'Sales B2B Representative' },
  { name: 'M. Rafly Prianata', department: 'SALES', company: 'PSG', augWorkingDays: 23, lateTendency: 'low', sickTendency: 'low', permitTendency: 'medium', role: 'Key Account Specialist' },
];

const LATE_REASONS = [
  'Kemacetan jalur arteri Pantura / Tol Cikampek',
  'Kendaraan mogok / ban bocor di perjalanan',
  'Cuaca hujan lebat & banjir genangan',
  'Keterlambatan angkutan umum KRL / Feeder',
  'Urusan darurat rumah tangga pagi hari',
  'Kendala teknis pergantian shift pabrik'
];

// Deterministic pseudorandom number generator for stable annual data
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generateAttendanceRecords(year: number = 2025): AttendanceRecord[] {
  const standardMonthlyWorkingDays = [21, 20, 22, 21, 21, 20, 22, 21, 21, 22, 21, 21]; // Average 253 days

  return RAW_EMPLOYEES.map((emp, empIdx) => {
    const months: MonthlyAttendance[] = MONTH_NAMES.map((monthName, mIdx) => {
      let baseWorking = standardMonthlyWorkingDays[mIdx];
      
      // If August (mIdx === 7), ground directly with the spreadsheet row!
      if (mIdx === 7) {
        baseWorking = emp.augWorkingDays;
      }

      const seed = (empIdx + 1) * 100 + (mIdx + 1) * 13 + (year === 2026 ? 500 : 0);
      const rand1 = pseudoRandom(seed);
      const rand2 = pseudoRandom(seed + 1);
      const rand3 = pseudoRandom(seed + 2);

      // Determine sick days
      let sickDays = 0;
      if (emp.name === 'Sita Destriana Wulandhari' && (mIdx === 7 || mIdx === 6)) {
        sickDays = mIdx === 7 ? 10 : 4; // Raw spreadsheet shows 11 working days in Aug
      } else if (emp.sickTendency === 'high') {
        sickDays = rand1 > 0.6 ? Math.floor(rand2 * 3) + 1 : 0;
      } else if (emp.sickTendency === 'medium') {
        sickDays = rand1 > 0.85 ? 1 : 0;
      } else {
        sickDays = rand1 > 0.95 ? 1 : 0;
      }

      // Determine permit (izin)
      let permitDays = 0;
      if (emp.name === 'Ayu Afzal' && mIdx === 7) {
        permitDays = 8; // Raw spreadsheet shows 12 working days in Aug
      } else if (emp.permitTendency === 'high') {
        permitDays = rand2 > 0.5 ? Math.floor(rand3 * 2) + 1 : 0;
      } else if (emp.permitTendency === 'medium') {
        permitDays = rand2 > 0.75 ? 1 : 0;
      } else {
        permitDays = rand2 > 0.9 ? 1 : 0;
      }

      // Annual leave / Cuti
      let annualLeaveDays = 0;
      if (mIdx === 3 || mIdx === 11) { // Lebaran & Akhir Tahun
        annualLeaveDays = rand3 > 0.5 ? Math.floor(rand1 * 2) + 1 : 0;
      } else {
        annualLeaveDays = rand3 > 0.88 ? 1 : 0;
      }

      // Alpha
      const absentDays = rand1 > 0.98 ? 1 : 0;

      // Actual attended days
      const attendedDays = Math.max(1, baseWorking - (sickDays + permitDays + annualLeaveDays + absentDays));

      // Calculate tardiness (late arrival)
      let lateDays = 0;
      let lateMinutes = 0;

      if (emp.lateTendency === 'high') {
        // High tardiness: 3 to 6 times per month
        lateDays = Math.floor(rand1 * 4) + 2;
        // Total minutes late: 15 to 45 mins each
        lateMinutes = lateDays * (Math.floor(rand2 * 25) + 12);
      } else if (emp.lateTendency === 'medium') {
        // Medium tardiness: 1 to 2 times
        lateDays = rand1 > 0.4 ? (rand2 > 0.7 ? 2 : 1) : 0;
        lateMinutes = lateDays * (Math.floor(rand2 * 15) + 10);
      } else {
        // Low tardiness: occasional 0 or 1
        lateDays = rand1 > 0.8 ? 1 : 0;
        lateMinutes = lateDays * (Math.floor(rand2 * 10) + 5);
      }

      // Prevent lateDays from exceeding attended days
      lateDays = Math.min(lateDays, attendedDays);
      const onTimeDays = Math.max(0, attendedDays - lateDays);

      return {
        month: monthName,
        monthIndex: mIdx,
        workingDays: baseWorking,
        onTimeDays,
        lateDays,
        lateMinutes,
        sickDays,
        permitDays,
        annualLeaveDays,
        absentDays,
      };
    });

    const totalWorkingDays = months.reduce((acc, m) => acc + m.workingDays, 0);
    const totalOnTime = months.reduce((acc, m) => acc + m.onTimeDays, 0);
    const totalLate = months.reduce((acc, m) => acc + m.lateDays, 0);
    const totalLateMinutes = months.reduce((acc, m) => acc + m.lateMinutes, 0);
    const totalSick = months.reduce((acc, m) => acc + m.sickDays, 0);
    const totalPermit = months.reduce((acc, m) => acc + m.permitDays, 0);
    const totalAnnualLeave = months.reduce((acc, m) => acc + m.annualLeaveDays, 0);
    const totalAlpha = months.reduce((acc, m) => acc + m.absentDays, 0);

    const totalAttended = totalOnTime + totalLate;
    const onTimePercentage = totalAttended > 0 ? Number(((totalOnTime / totalAttended) * 100).toFixed(1)) : 100;
    const latePercentage = totalAttended > 0 ? Number(((totalLate / totalAttended) * 100).toFixed(1)) : 0;

    // Discipline score: Penalize for late (1 pt), severe late minutes (0.05 pt), alpha (5 pt), unexcused
    const penalty = (totalLate * 1.2) + (totalLateMinutes * 0.02) + (totalAlpha * 5) + (totalPermit * 0.4);
    const disciplineScore = Math.max(45, Math.min(100, Math.round(100 - penalty)));

    // Select 2-3 sample late reasons
    const reasonIndex = (empIdx * 2) % LATE_REASONS.length;
    const recentLateReasons = [
      LATE_REASONS[reasonIndex],
      LATE_REASONS[(reasonIndex + 1) % LATE_REASONS.length],
    ];

    return {
      id: `emp-${empIdx + 1}`,
      name: emp.name,
      department: emp.department,
      company: emp.company,
      title: emp.role || 'Staff',
      email: `${emp.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@company.co.id`,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(emp.name)}&backgroundColor=0f172a,1e293b,334155`,
      months,
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
      disciplineScore,
      recentLateReasons,
    };
  });
}
