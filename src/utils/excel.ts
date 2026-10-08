import * as XLSX from 'xlsx';
import { Participant } from '../types';

export const SAMPLE_PARTICIPANTS: Participant[] = [
  { id: 'RT001', msnv: 'RT-1001', fullName: 'Nguyễn Văn Hùng', taiwanName: '阮文雄 (Aaron)', department: 'Kỹ thuật / 工程部' },
  { id: 'RT002', msnv: 'RT-1002', fullName: 'Trần Thị Mai', taiwanName: '陳氏梅 (Mary)', department: 'Sản xuất / 生產部' },
  { id: 'RT003', msnv: 'RT-1003', fullName: 'Lê Hoàng Long', taiwanName: '黎黃龍 (Leo)', department: 'QC / 品保部' },
  { id: 'RT004', msnv: 'RT-1004', fullName: 'Phạm Minh Tuấn', taiwanName: '范明俊 (Tom)', department: 'Kế toán / 會計部' },
  { id: 'RT005', msnv: 'RT-1005', fullName: 'Hoàng Quốc Bảo', taiwanName: '黃國寶 (Paul)', department: 'Kho vận / 倉庫部' },
  { id: 'RT006', msnv: 'RT-1006', fullName: 'Vũ Thị Lan Anh', taiwanName: '武氏蘭英 (Angela)', department: 'Nhân sự / 人事部' },
  { id: 'RT007', msnv: 'RT-1007', fullName: 'Đặng Thanh Sơn', taiwanName: '鄧青山 (Sam)', department: 'IT / 資訊部' },
  { id: 'RT008', msnv: 'RT-1008', fullName: 'Bùi Đức Trọng', taiwanName: '裴德仲 (David)', department: 'Sản xuất / 生產部' },
  { id: 'RT009', msnv: 'RT-1009', fullName: 'Đỗ Thùy Dung', taiwanName: '杜垂蓉 (Daisy)', department: 'Mua hàng / 採購部' },
  { id: 'RT010', msnv: 'RT-1010', fullName: 'Hồ Gia Huy', taiwanName: '胡家輝 (Kevin)', department: 'Kỹ thuật / 工程部' },
  { id: 'RT011', msnv: 'RT-1011', fullName: 'Ngô Ngọc Ánh', taiwanName: '吳玉映 (Grace)', department: 'Sản xuất / 生產部' },
  { id: 'RT012', msnv: 'RT-1012', fullName: 'Dương Thành Đạt', taiwanName: '楊成達 (Danny)', department: 'Bảo trì / 廠務部' },
  { id: 'RT013', msnv: 'RT-1013', fullName: 'Lý Tiểu Phụng', taiwanName: '李小鳳 (Fiona)', department: 'QC / 品保部' },
  { id: 'RT014', msnv: 'RT-1014', fullName: 'Trịnh Hoài Nam', taiwanName: '鄭懷南 (Ken)', department: 'Sản xuất / 生產部' },
  { id: 'RT015', msnv: 'RT-1015', fullName: 'Mai Thanh Thảo', taiwanName: '梅青草 (Tina)', department: 'Nhân sự / 人事部' },
  { id: 'RT016', msnv: 'RT-1016', fullName: 'Phan Văn Trí', taiwanName: '潘文智 (Alex)', department: 'Kỹ thuật / 工程部' },
  { id: 'RT017', msnv: 'RT-1017', fullName: 'Võ Thị Kim Oanh', taiwanName: '武氏金鶯 (Chloe)', department: 'Kế toán / 會計部' },
  { id: 'RT018', msnv: 'RT-1018', fullName: 'Đinh Trọng Nghĩa', taiwanName: '丁重義 (Eric)', department: 'Sản xuất / 生產部' },
  { id: 'RT019', msnv: 'RT-1019', fullName: 'Trương Mỹ Linh', taiwanName: '張美玲 (Lynn)', department: 'Xuất nhập khẩu / 報關部' },
  { id: 'RT020', msnv: 'RT-1020', fullName: 'Lâm Kiến Quốc', taiwanName: '林建國 (Jacky)', department: 'Ban Giám Đốc / 總經理室' },
  { id: 'RT021', msnv: 'RT-1021', fullName: 'Chu Minh Hiếu', taiwanName: '朱明孝 (Howard)', department: 'Kho vận / 倉庫部' },
  { id: 'RT022', msnv: 'RT-1022', fullName: 'Tạ Như Quỳnh', taiwanName: '謝如瓊 (Queen)', department: 'Sản xuất / 生產部' },
  { id: 'RT023', msnv: 'RT-1023', fullName: 'Lưu Hải Đăng', taiwanName: '劉海登 (Dennis)', department: 'Kỹ thuật / 工程部' },
  { id: 'RT024', msnv: 'RT-1024', fullName: 'Cao Bích Ngọc', taiwanName: '高碧玉 (Ruby)', department: 'QC / 品保部' },
  { id: 'RT025', msnv: 'RT-1025', fullName: 'Huỳnh Vĩnh Phát', taiwanName: '黃永發 (Patrick)', department: 'Bảo trì / 廠務部' },
  { id: 'RT026', msnv: 'RT-1026', fullName: 'Đoàn Bảo Châu', taiwanName: '段寶珠 (Pearl)', department: 'Sản xuất / 生產部' },
  { id: 'RT027', msnv: 'RT-1027', fullName: 'Thái Hữu Phước', taiwanName: '蔡有福 (Frank)', department: 'IT / 資訊部' },
  { id: 'RT028', msnv: 'RT-1028', fullName: 'Bạch Tuyết Mai', taiwanName: '白雪梅 (Snow)', department: 'Nhân sự / 人事部' },
];

function normalizeHeader(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[\s\-_]+/g, '');
}

/**
 * Parses .xlsx, .xls, or .csv files and extracts participants
 */
export async function parseParticipantFile(file: File): Promise<{
  participants: Participant[];
  error?: string;
}> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          resolve({ participants: [], error: 'Không thể đọc nội dung tập tin / 無法讀取檔案內容' });
          return;
        }

        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          resolve({ participants: [], error: 'Tập tin không có trang tính nào / 檔案中沒有工作表' });
          return;
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          resolve({ participants: [], error: 'Tập tin trống rỗng hoặc không có dữ liệu / 檔案為空或無有效資料' });
          return;
        }

        // Map column keys
        const firstRow = rawJson[0];
        const keys = Object.keys(firstRow);

        let msnvKey: string | null = null;
        let fullNameKey: string | null = null;
        let taiwanNameKey: string | null = null;
        let departmentKey: string | null = null;

        for (const key of keys) {
          const norm = normalizeHeader(key);
          const rawNorm = key.trim().toLowerCase();

          // Check Taiwan Name first to avoid collision with general name
          if (
            !taiwanNameKey &&
            (norm.includes('taiwan') ||
              norm.includes('dailoan') ||
              norm.includes('trung') ||
              norm.includes('chinese') ||
              rawNorm.includes('台灣') ||
              rawNorm.includes('中文') ||
              rawNorm.includes('taiwan'))
          ) {
            taiwanNameKey = key;
          }
          // Check MSNV
          else if (
            !msnvKey &&
            (norm.includes('msnv') ||
              norm.includes('manv') ||
              norm.includes('manhanvien') ||
              norm.includes('empid') ||
              norm.includes('staffid') ||
              norm === 'id' ||
              rawNorm.includes('工號') ||
              rawNorm.includes('工号') ||
              rawNorm.includes('員工編號'))
          ) {
            msnvKey = key;
          }
          // Check Full Name
          else if (
            !fullNameKey &&
            (norm.includes('hovaten') ||
              norm.includes('hoten') ||
              norm.includes('tennhanvien') ||
              norm.includes('fullname') ||
              norm === 'ten' ||
              norm === 'name' ||
              rawNorm.includes('姓名') ||
              rawNorm.includes('員工姓名'))
          ) {
            fullNameKey = key;
          }
          // Check Department
          else if (
            !departmentKey &&
            (norm.includes('department') ||
              norm.includes('dept') ||
              norm.includes('bophan') ||
              norm.includes('phongban') ||
              norm === 'bp' ||
              norm === 'pb' ||
              rawNorm.includes('部門') ||
              rawNorm.includes('課別') ||
              rawNorm.includes('單位'))
          ) {
            departmentKey = key;
          }
        }

        // Fallbacks if headers didn't match standard keywords
        if (!msnvKey && keys[0]) msnvKey = keys[0];
        if (!fullNameKey && keys[1]) fullNameKey = keys[1];
        if (!taiwanNameKey && keys[2]) taiwanNameKey = keys[2];
        if (!departmentKey && keys[3]) departmentKey = keys[3];

        const participants: Participant[] = [];
        let counter = 1;

        for (const row of rawJson) {
          const msnvRaw = msnvKey ? String(row[msnvKey] ?? '').trim() : '';
          const nameRaw = fullNameKey ? String(row[fullNameKey] ?? '').trim() : '';
          const twNameRaw = taiwanNameKey ? String(row[taiwanNameKey] ?? '').trim() : '';
          const deptRaw = departmentKey ? String(row[departmentKey] ?? '').trim() : '';

          // Skip completely empty lines
          if (!msnvRaw && !nameRaw && !twNameRaw) continue;

          participants.push({
            id: `P-${Date.now()}-${counter}`,
            msnv: msnvRaw || `RT-${1000 + counter}`,
            fullName: nameRaw || `Nhân viên ${counter}`,
            taiwanName: twNameRaw || `同仁 ${counter}`,
            department: deptRaw || 'Ritek Viet Nam',
            isWon: false,
          });
          counter++;
        }

        if (participants.length === 0) {
          resolve({ participants: [], error: 'Không tìm thấy dòng dữ liệu nhân viên hợp lệ nào trong tập tin' });
        } else {
          resolve({ participants });
        }
      } catch (err) {
        console.error(err);
        resolve({
          participants: [],
          error: 'Lỗi khi đọc file. Vui lòng kiểm tra định dạng Excel/CSV. / 讀取檔案時發生錯誤。',
        });
      }
    };

    reader.onerror = () => {
      resolve({ participants: [], error: 'Lỗi khi đọc file / 讀取檔案失敗' });
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Download sample Excel template (.xlsx)
 */
export function downloadExcelTemplate() {
  const data = [
    {
      MSNV: 'RT-1001',
      'Họ và tên': 'Nguyễn Văn Hùng',
      'Tên Taiwan': '阮文雄 (Aaron)',
      Department: 'Kỹ thuật / 工程部',
    },
    {
      MSNV: 'RT-1002',
      'Họ và tên': 'Trần Thị Mai',
      'Tên Taiwan': '陳氏梅 (Mary)',
      Department: 'Sản xuất / 生產部',
    },
    {
      MSNV: 'RT-1003',
      'Họ và tên': 'Lê Hoàng Long',
      'Tên Taiwan': '黎黃龍 (Leo)',
      Department: 'QC / 品保部',
    },
    {
      MSNV: 'RT-1004',
      'Họ và tên': 'Phạm Minh Tuấn',
      'Tên Taiwan': '范明俊 (Tom)',
      Department: 'Kế toán / 會計部',
    },
    {
      MSNV: 'RT-1005',
      'Họ và tên': 'Hoàng Quốc Bảo',
      'Tên Taiwan': '黃國寶 (Paul)',
      Department: 'Kho vận / 倉庫部',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'DanhSachNhanVien');
  XLSX.writeFile(wb, 'Ritek_Danh_Sach_Quay_Thuong_Mau.xlsx');
}

/**
 * Export winners list to Excel (.xlsx)
 */
export function exportWinnersToExcel(winners: Participant[]) {
  const data = winners.map((w, index) => ({
    STT: index + 1,
    'Giải thưởng': w.prizeName || 'Trúng thưởng / 中獎',
    MSNV: w.msnv,
    'Họ và tên': w.fullName,
    'Tên Taiwan': w.taiwanName,
    Department: w.department,
    'Thời gian quay': w.wonAt || new Date().toLocaleString('vi-VN'),
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'DanhSachTrungThuong');
  XLSX.writeFile(wb, `Ritek_DanhSach_TrungThuong_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/**
 * Export unwon / remaining participants list to Excel (.xlsx)
 */
export function exportUnwonToExcel(unwon: Participant[]) {
  const data = unwon.map((u, index) => ({
    STT: index + 1,
    MSNV: u.msnv,
    'Họ và tên': u.fullName,
    'Tên Taiwan': u.taiwanName,
    Department: u.department,
    'Trạng thái': 'Chưa trúng thưởng / 未中獎',
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'DanhSachChuaTrung');
  XLSX.writeFile(wb, `Ritek_DanhSach_ChuaTrung_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/**
 * Export all participants with status
 */
export function exportAllToExcel(participants: Participant[]) {
  const data = participants.map((p, index) => ({
    STT: index + 1,
    MSNV: p.msnv,
    'Họ và tên': p.fullName,
    'Tên Taiwan': p.taiwanName,
    Department: p.department,
    'Trạng thái': p.isWon ? 'Đã trúng thưởng / 已中獎' : 'Chưa trúng thưởng / 未中獎',
    'Giải thưởng': p.prizeName || '-',
    'Thời gian trúng': p.wonAt || '-',
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'TatCaNhanVien');
  XLSX.writeFile(wb, `Ritek_ToanBo_DanhSach_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
