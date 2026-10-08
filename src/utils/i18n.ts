import { LanguageMode } from '../types';

export interface TranslationItem {
  vi: string;
  tw: string;
}

export const translations: Record<string, TranslationItem> = {
  // App brand & header
  appTitle: {
    vi: 'Quay Thưởng May Mắn',
    tw: '幸運大抽獎',
  },
  companySubtitle: {
    vi: 'Ritek Việt Nam - Xuân Ất Tỵ',
    tw: '錸德科技 (越南) - 歲次乙巳新春尾牙',
  },
  soundOn: {
    vi: 'Âm thanh: Bật',
    tw: '音效：開啟',
  },
  soundOff: {
    vi: 'Âm thanh: Tắt',
    tw: '音效：靜音',
  },
  btnNew: {
    vi: 'Làm mới / New',
    tw: '重新開始 / New',
  },
  btnNewConfirm: {
    vi: 'Bạn có chắc chắn muốn làm mới? Toàn bộ danh sách hiện tại sẽ được khởi tạo lại.',
    tw: '您確定要重新開始嗎？目前的抽獎紀錄與資料將被重置。',
  },
  // Upload section
  uploadTitle: {
    vi: 'Tải Danh Sách Quay Thưởng',
    tw: '上傳抽獎人員名單',
  },
  uploadDesc: {
    vi: 'Kéo thả tập tin Excel (.xlsx, .xls) hoặc .csv vào đây, hoặc nhấn để chọn file',
    tw: '將 Excel (.xlsx, .xls) 或 .csv 檔案拖放至此，或點擊選取檔案',
  },
  uploadNotice: {
    vi: 'Hỗ trợ các cột: MSNV, Họ và tên, Tên Taiwan, Department',
    tw: '支援欄位：工號 (MSNV)、越南姓名、台灣姓名、部門 (Department)',
  },
  btnUploadFile: {
    vi: 'Tải danh sách Excel/CSV',
    tw: '上傳 Excel/CSV 名單',
  },
  btnDownloadTemplate: {
    vi: 'Tải file Excel mẫu',
    tw: '下載範本檔案',
  },
  btnLoadSample: {
    vi: 'Dùng dữ liệu mẫu Ritek',
    tw: '載入錸德範例名單',
  },
  // Stats
  totalParticipants: {
    vi: 'Tổng nhân viên',
    tw: '總人數',
  },
  wonCount: {
    vi: 'Đã trúng thưởng',
    tw: '已中獎人數',
  },
  unwonCount: {
    vi: 'Chưa trúng (Còn lại)',
    tw: '未中獎 (剩餘名額)',
  },
  // Draw stage
  selectPrize: {
    vi: 'Chọn giải thưởng:',
    tw: '選擇獎項：',
  },
  drawModeLabel: {
    vi: 'Chế độ quay mỗi lượt:',
    tw: '每輪抽獎人數：',
  },
  draw1Person: {
    vi: '1 Người / lượt',
    tw: '1 人 / 輪',
  },
  draw3Persons: {
    vi: '3 Người / lượt',
    tw: '3 人 / 輪',
  },
  draw5Persons: {
    vi: '5 Người / lượt',
    tw: '5 人 / 輪',
  },
  btnDraw: {
    vi: 'QUAY THƯỞNG NGAY',
    tw: '立即開始抽獎',
  },
  drawingText: {
    vi: 'Đang quay thưởng...',
    tw: '抽獎進行中...',
  },
  noMoreParticipants: {
    vi: 'Đã hết người trong danh sách chưa trúng!',
    tw: '抽獎箱已空，所有人員皆已中獎！',
  },
  notEnoughParticipants: {
    vi: 'Không đủ số người chưa trúng cho số lượng quay đã chọn!',
    tw: '未中獎人數不足以進行此輪設定人數的抽獎！',
  },
  // Default prizes
  prizeSpecial: {
    vi: 'Giải Đặc Biệt',
    tw: '特等獎 (頭獎)',
  },
  prizeFirst: {
    vi: 'Giải Nhất',
    tw: '一等獎',
  },
  prizeSecond: {
    vi: 'Giải Nhì',
    tw: '二等獎',
  },
  prizeThird: {
    vi: 'Giải Ba',
    tw: '三等獎',
  },
  prizeLucky: {
    vi: 'Giải Khuyến Khích',
    tw: '幸運獎 / 普獎',
  },
  prizeCustom: {
    vi: 'Giải Tự Đặt',
    tw: '自訂獎項',
  },
  // Celebration modal
  congratsTitle: {
    vi: 'CHÚC MỪNG TRÚNG THƯỞNG!',
    tw: '恭喜中獎！鴻運當頭！',
  },
  congratsSubtitle: {
    vi: 'Vạn sự cát tường - Rinh lộc đầu xuân cùng Ritek Viet Nam',
    tw: '吉星高照・財源廣進・錸德越南同仁賀喜',
  },
  closeBtn: {
    vi: 'Đóng & Tiếp tục',
    tw: '確定關閉並繼續',
  },
  // Lists & Tabs
  tabWinners: {
    vi: 'Danh sách đã trúng',
    tw: '已中獎名單',
  },
  tabUnwon: {
    vi: 'Danh sách chưa trúng',
    tw: '未中獎名單',
  },
  tabAll: {
    vi: 'Toàn bộ danh sách',
    tw: '全部同仁名單',
  },
  btnExportWinners: {
    vi: 'Xuất DS Trúng (.xlsx)',
    tw: '匯出中獎名單 (.xlsx)',
  },
  btnExportUnwon: {
    vi: 'Xuất DS Chưa Trúng (.xlsx)',
    tw: '匯出未中獎名單 (.xlsx)',
  },
  btnExportAll: {
    vi: 'Xuất Tất Cả (.xlsx)',
    tw: '匯出完整名單 (.xlsx)',
  },
  colNo: {
    vi: 'STT',
    tw: '序號',
  },
  colMsnv: {
    vi: 'MSNV',
    tw: '工號',
  },
  colName: {
    vi: 'Họ và tên',
    tw: '越南姓名',
  },
  colTwName: {
    vi: 'Tên Taiwan',
    tw: '台灣/中文名',
  },
  colDept: {
    vi: 'Bộ phận (Dept)',
    tw: '部門',
  },
  colPrize: {
    vi: 'Giải thưởng',
    tw: '中獎獎項',
  },
  colAction: {
    vi: 'Thao tác',
    tw: '操作',
  },
  btnRevertTooltip: {
    vi: 'Xóa khỏi DS trúng và trả về danh sách chưa trúng',
    tw: '移除中獎並恢復抽獎資格',
  },
  btnRevertConfirm: {
    vi: 'Bạn có muốn hủy giải của nhân viên này và đưa họ trở lại danh sách chưa trúng?',
    tw: '確定要取消此同仁的中獎資格並放回抽獎池嗎？',
  },
  emptyWinners: {
    vi: 'Chưa có ai trúng thưởng. Hãy bấm nút Quay Thưởng để bắt đầu!',
    tw: '目前尚無中獎紀錄，點擊上方按鈕開始抽獎！',
  },
  searchPlaceholder: {
    vi: 'Tìm theo tên, MSNV, bộ phận...',
    tw: '搜尋姓名、工號、部門...',
  },
  // Lang switcher labels
  langBilingual: {
    vi: 'Song ngữ (VI - TW)',
    tw: '雙語模式 (越/中)',
  },
  langVi: {
    vi: 'Tiếng Việt',
    tw: '越南語 (VI)',
  },
  langTw: {
    vi: '繁體中文 (Taiwan)',
    tw: '繁體中文 (TW)',
  },
  // Footer
  designedBy: {
    vi: 'Designed by Vinh Nguyen',
    tw: 'Designed by Vinh Nguyen',
  },
  cnyGreeting: {
    vi: 'Chúc Mừng Năm Mới - An Khang Thịnh Vượng - Vạn Sự Như Ý',
    tw: '新年快樂・大吉大利・萬事如意・步步高陞',
  },
};

export function getTranslation(key: string, mode: LanguageMode): string {
  const item = translations[key];
  if (!item) return key;

  if (mode === 'vi') return item.vi;
  if (mode === 'tw') return item.tw;

  // In bilingual mode:
  if (item.vi === item.tw) return item.vi;
  return `${item.vi} / ${item.tw}`;
}

export function getDualText(key: string): { vi: string; tw: string } {
  const item = translations[key] || { vi: key, tw: key };
  return { vi: item.vi, tw: item.tw };
}
