import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, Download, Sparkles, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { Participant, LanguageMode } from '../types';
import { parseParticipantFile, downloadExcelTemplate, SAMPLE_PARTICIPANTS } from '../utils/excel';
import { getTranslation } from '../utils/i18n';

interface UploadSectionProps {
  lang: LanguageMode;
  onParticipantsLoaded: (participants: Participant[], sourceName: string) => void;
  currentParticipantCount: number;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  lang,
  onParticipantsLoaded,
  currentParticipantCount,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ count: number; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    // Check extension
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const lowerName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => lowerName.endsWith(ext));

    if (!isValid) {
      setErrorMessage(
        lang === 'tw'
          ? '不支援的檔案格式，請上傳 .xlsx, .xls 或 .csv 檔案'
          : lang === 'vi'
          ? 'Định dạng file không hỗ trợ, vui lòng tải file .xlsx, .xls hoặc .csv'
          : 'Định dạng không hỗ trợ / 不支援格式 (Chỉ chấp nhận .xlsx, .xls, .csv)'
      );
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const { participants, error } = await parseParticipantFile(file);

    setLoading(false);

    if (error || participants.length === 0) {
      setErrorMessage(error || 'Không tìm thấy dữ liệu nhân viên / 未找到有效人員資料');
      return;
    }

    setSuccessInfo({ count: participants.length, name: file.name });
    onParticipantsLoaded(participants, file.name);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleProcessFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleProcessFile(file);
      // Reset input value so same file can be reloaded if needed
      e.target.value = '';
    }
  };

  const handleLoadSample = () => {
    setSuccessInfo({ count: SAMPLE_PARTICIPANTS.length, name: 'Dữ liệu mẫu Ritek Viet Nam' });
    setErrorMessage(null);
    onParticipantsLoaded(SAMPLE_PARTICIPANTS, 'Ritek_Sample_Data');
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl p-[1px] bg-gradient-to-b from-amber-500/40 via-red-900/30 to-amber-600/20 shadow-2xl backdrop-blur-md">
      <div className="w-full bg-[#140407]/95 rounded-[23px] p-6 sm:p-8 border border-amber-900/30 relative overflow-hidden">
        {/* Subtle festive background pattern */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-950/60 to-red-950/60 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{getTranslation('uploadTitle', lang)}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-amber-100 font-serif">
            {lang === 'tw'
              ? '匯入尾牙抽獎員工清單'
              : lang === 'vi'
              ? 'Tải Danh Sách Nhân Viên Quay Thưởng'
              : 'Tải Danh Sách Quay Thưởng / 匯入抽獎名單'}
          </h2>
          <p className="text-xs sm:text-sm text-red-200/70 mt-1 max-w-xl mx-auto">
            {getTranslation('uploadNotice', lang)}
          </p>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center group ${
            isDragging
              ? 'border-amber-400 bg-amber-500/10 scale-[1.01] shadow-[0_0_25px_rgba(245,158,11,0.25)]'
              : 'border-amber-700/50 hover:border-amber-500/80 bg-[#1c060c]/60 hover:bg-[#230810]/70'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.xls,.csv"
            className="hidden"
          />

          {/* Animated Upload Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-red-900/40 border border-amber-500/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Upload className="w-8 h-8 text-amber-300 group-hover:text-amber-200" />
          </div>

          <p className="text-base sm:text-lg font-semibold text-amber-100 mb-1">
            {lang === 'tw'
              ? '點擊或將 Excel / CSV 檔案拖放至此'
              : lang === 'vi'
              ? 'Nhấn hoặc kéo thả file Excel / CSV vào đây'
              : 'Kéo thả hoặc nhấn chọn file Excel / CSV'}
          </p>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mb-3">
            {getTranslation('uploadDesc', lang)}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            <span className="text-[11px] px-2.5 py-1 rounded-md bg-[#2d0912] border border-amber-600/30 text-amber-300">
              MSNV / 工號
            </span>
            <span className="text-[11px] px-2.5 py-1 rounded-md bg-[#2d0912] border border-amber-600/30 text-amber-300">
              Họ và tên / 姓名
            </span>
            <span className="text-[11px] px-2.5 py-1 rounded-md bg-[#2d0912] border border-amber-600/30 text-amber-300">
              Tên Taiwan / 台灣姓名
            </span>
            <span className="text-[11px] px-2.5 py-1 rounded-md bg-[#2d0912] border border-amber-600/30 text-amber-300">
              Department / 部門
            </span>
          </div>

          {loading && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xs rounded-2xl flex items-center justify-center">
              <div className="flex items-center gap-3 text-amber-300">
                <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span className="font-semibold text-sm">
                  {lang === 'tw' ? '正在讀取檔案...' : 'Đang tải và xử lý danh sách...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Error message alert */}
        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 flex items-center gap-2.5 text-red-200 text-xs sm:text-sm shadow-md">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success message banner */}
        {successInfo && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-between gap-2.5 text-emerald-200 text-xs sm:text-sm shadow-md">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {lang === 'tw'
                  ? `成功載入 ${successInfo.count} 位人員 (${successInfo.name})`
                  : lang === 'vi'
                  ? `Đã nạp thành công ${successInfo.count} nhân viên từ "${successInfo.name}"`
                  : `Đã nạp ${successInfo.count} nhân viên / 成功載入 ${successInfo.count} 人 (${successInfo.name})`}
              </span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-800/40 text-emerald-300 font-semibold">
              Sẵn sàng quay / 可抽獎
            </span>
          </div>
        )}

        {/* Helper Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-amber-900/30">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Download Template button */}
            <button
              onClick={downloadExcelTemplate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#20070e] hover:bg-[#2d0a14] border border-amber-600/40 text-amber-200 hover:text-white text-xs font-medium transition-colors shadow-sm"
              title="Tải tập tin Excel mẫu có sẵn tiêu đề các cột"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>{getTranslation('btnDownloadTemplate', lang)}</span>
            </button>

            {/* Load Sample Data button */}
            <button
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-900/50 to-red-950/60 hover:from-amber-800/60 hover:to-red-900/70 border border-amber-500/40 text-amber-200 text-xs font-semibold transition-all shadow-sm"
              title="Dùng ngay 28 nhân viên mẫu của Ritek Viet Nam để kiểm tra tính năng quay"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
              <span>{getTranslation('btnLoadSample', lang)}</span>
            </button>
          </div>

          {currentParticipantCount > 0 && (
            <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
              <Users className="w-4 h-4 text-amber-400" />
              <span>
                {lang === 'tw'
                  ? `已在名單中: ${currentParticipantCount} 人`
                  : lang === 'vi'
                  ? `Trong danh sách: ${currentParticipantCount} người`
                  : `Danh sách: ${currentParticipantCount} người / 名單共 ${currentParticipantCount} 人`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
