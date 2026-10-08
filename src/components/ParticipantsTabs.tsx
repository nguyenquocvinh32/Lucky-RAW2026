import React, { useState } from 'react';
import { Download, Search, Undo2, Trophy, Users, UserCheck, AlertCircle } from 'lucide-react';
import { Participant, LanguageMode } from '../types';
import { exportWinnersToExcel, exportUnwonToExcel, exportAllToExcel } from '../utils/excel';
import { getTranslation } from '../utils/i18n';

interface ParticipantsTabsProps {
  lang: LanguageMode;
  participants: Participant[];
  winners: Participant[];
  unwon: Participant[];
  onRevertWinner: (participantId: string) => void;
}

type TabType = 'winners' | 'unwon' | 'all';

export const ParticipantsTabs: React.FC<ParticipantsTabsProps> = ({
  lang,
  participants,
  winners,
  unwon,
  onRevertWinner,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('winners');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter based on search query
  const filterList = (list: Participant[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (p) =>
        p.msnv.toLowerCase().includes(q) ||
        p.fullName.toLowerCase().includes(q) ||
        p.taiwanName.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        (p.prizeName && p.prizeName.toLowerCase().includes(q))
    );
  };

  const handleRevert = (p: Participant) => {
    const confirmMsg =
      lang === 'tw'
        ? `確定要取消同仁「${p.fullName} (${p.taiwanName}) - ${p.msnv}」的中獎資格並恢復抽獎機會嗎？`
        : lang === 'vi'
        ? `Bạn có chắc muốn xóa "${p.fullName} (${p.msnv})" khỏi danh sách trúng thưởng và trả về danh sách chưa trúng?`
        : `Xóa và trả về danh sách chưa trúng / 恢復「${p.fullName} (${p.msnv})」未中獎資格？`;

    if (window.confirm(confirmMsg)) {
      onRevertWinner(p.id);
    }
  };

  const filteredWinners = filterList(winners);
  const filteredUnwon = filterList(unwon);
  const filteredAll = filterList(participants);

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 bg-[#150408]/90 border border-amber-600/30 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md">
      {/* Tab Navigation & Export Actions */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pb-5 border-b border-amber-900/40">
        {/* Tabs: Đã trúng | Chưa trúng | Toàn bộ */}
        <div className="flex flex-wrap items-center bg-[#100306] p-1.5 rounded-2xl border border-amber-700/40 gap-1">
          <button
            onClick={() => setActiveTab('winners')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === 'winners'
                ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md border border-amber-400/50 scale-[1.02]'
                : 'text-amber-200/60 hover:text-amber-100 hover:bg-[#20060d]'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>
              {lang === 'tw'
                ? `已中獎 (${winners.length})`
                : lang === 'vi'
                ? `Đã trúng thưởng (${winners.length})`
                : `Đã trúng / 已中獎 (${winners.length})`}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('unwon')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === 'unwon'
                ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md border border-amber-400/50 scale-[1.02]'
                : 'text-amber-200/60 hover:text-amber-100 hover:bg-[#20060d]'
            }`}
          >
            <Users className="w-4 h-4 text-amber-300" />
            <span>
              {lang === 'tw'
                ? `未中獎 (${unwon.length})`
                : lang === 'vi'
                ? `Chưa trúng thưởng (${unwon.length})`
                : `Chưa trúng / 未中獎 (${unwon.length})`}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md border border-amber-400/50 scale-[1.02]'
                : 'text-amber-200/60 hover:text-amber-100 hover:bg-[#20060d]'
            }`}
          >
            <UserCheck className="w-4 h-4 text-amber-300" />
            <span>
              {lang === 'tw'
                ? `全部名單 (${participants.length})`
                : lang === 'vi'
                ? `Toàn bộ (${participants.length})`
                : `Toàn bộ / 全部 (${participants.length})`}
            </span>
          </button>
        </div>

        {/* Search Bar & Download Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getTranslation('searchPlaceholder', lang)}
              className="w-full bg-[#1b050a] border border-amber-600/30 rounded-xl pl-9 pr-3 py-1.5 text-xs text-amber-100 placeholder:text-amber-200/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>

          {/* Download Buttons: Requirement 6 */}
          {activeTab === 'winners' && (
            <button
              onClick={() => exportWinnersToExcel(winners)}
              disabled={winners.length === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/50 text-xs font-bold transition-all ${
                winners.length > 0
                  ? 'bg-gradient-to-r from-amber-900/60 to-red-950/80 text-amber-200 hover:text-white hover:border-amber-300 shadow-md'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-500 cursor-not-allowed'
              }`}
              title="Tải về danh sách những người đã trúng thưởng dạng Excel"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>{getTranslation('btnExportWinners', lang)}</span>
            </button>
          )}

          {activeTab === 'unwon' && (
            <button
              onClick={() => exportUnwonToExcel(unwon)}
              disabled={unwon.length === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/50 text-xs font-bold transition-all ${
                unwon.length > 0
                  ? 'bg-gradient-to-r from-amber-900/60 to-red-950/80 text-amber-200 hover:text-white hover:border-amber-300 shadow-md'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-500 cursor-not-allowed'
              }`}
              title="Tải về danh sách những người chưa trúng thưởng dạng Excel"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>{getTranslation('btnExportUnwon', lang)}</span>
            </button>
          )}

          {activeTab === 'all' && (
            <button
              onClick={() => exportAllToExcel(participants)}
              disabled={participants.length === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/50 text-xs font-bold transition-all ${
                participants.length > 0
                  ? 'bg-gradient-to-r from-amber-900/60 to-red-950/80 text-amber-200 hover:text-white hover:border-amber-300 shadow-md'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>{getTranslation('btnExportAll', lang)}</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="mt-4 overflow-x-auto rounded-2xl border border-amber-900/40 bg-[#120306]/70 shadow-inner">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-amber-800/40 bg-[#1e060d]/80 text-amber-300 font-bold tracking-wide">
              <th className="py-3 px-4 w-12 text-center">{getTranslation('colNo', lang)}</th>
              {activeTab === 'winners' && (
                <th className="py-3 px-4">{getTranslation('colPrize', lang)}</th>
              )}
              <th className="py-3 px-4">{getTranslation('colMsnv', lang)}</th>
              <th className="py-3 px-4">{getTranslation('colName', lang)}</th>
              <th className="py-3 px-4">{getTranslation('colTwName', lang)}</th>
              <th className="py-3 px-4">{getTranslation('colDept', lang)}</th>
              {activeTab === 'winners' && (
                <th className="py-3 px-4 text-center">{getTranslation('colAction', lang)}</th>
              )}
              {activeTab === 'all' && (
                <th className="py-3 px-4 text-center">
                  {lang === 'tw' ? '狀態' : lang === 'vi' ? 'Trạng thái' : 'Trạng thái / 狀態'}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-950/50">
            {/* Winners Tab Table */}
            {activeTab === 'winners' && (
              <>
                {filteredWinners.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-amber-200/50 text-sm">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-7 h-7 text-amber-500/50" />
                        <span>{getTranslation('emptyWinners', lang)}</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredWinners.map((winner, idx) => (
                    <tr
                      key={winner.id}
                      className="hover:bg-amber-950/30 transition-colors text-amber-100/90"
                    >
                      <td className="py-3 px-4 text-center font-mono text-amber-400/80 font-bold">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-gradient-to-r from-red-900/60 to-amber-900/60 border border-amber-500/40 text-amber-200 font-bold text-xs">
                          {winner.prizeName || 'Trúng thưởng'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-300 whitespace-nowrap">
                        {winner.msnv}
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-100 whitespace-normal break-words max-w-[180px]">{winner.fullName}</td>
                      <td className="py-3 px-4 text-amber-300 font-['Noto_Serif_TC',serif] whitespace-normal break-words max-w-[180px]">
                        {winner.taiwanName}
                      </td>
                      <td className="py-3 px-4 text-red-200/80 whitespace-normal break-words max-w-[180px]">{winner.department}</td>
                      {/* Requirement 7: Nút xóa người đó để trả về danh sách chưa trúng */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleRevert(winner)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-200 hover:text-white text-xs font-semibold transition-all shadow-sm group"
                          title={getTranslation('btnRevertTooltip', lang)}
                        >
                          <Undo2 className="w-3.5 h-3.5 text-red-400 group-hover:-translate-x-0.5 transition-transform" />
                          <span>
                            {lang === 'tw'
                              ? '恢復未中獎'
                              : lang === 'vi'
                              ? 'Trả về DS chưa trúng'
                              : 'Trả về DS / 恢復'}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </>
            )}

            {/* Unwon Tab Table */}
            {activeTab === 'unwon' && (
              <>
                {filteredUnwon.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-amber-200/50 text-sm">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-7 h-7 text-amber-500/50" />
                        <span>
                          {lang === 'tw'
                            ? '目前無符合條件的未中獎人員'
                            : 'Không tìm thấy người nào trong danh sách chưa trúng!'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUnwon.map((p, idx) => (
                    <tr
                      key={p.id}
                      className="hover:bg-amber-950/30 transition-colors text-amber-100/90"
                    >
                      <td className="py-3 px-4 text-center font-mono text-zinc-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-300 whitespace-nowrap">{p.msnv}</td>
                      <td className="py-3 px-4 font-medium text-amber-100 whitespace-normal break-words max-w-[200px]">{p.fullName}</td>
                      <td className="py-3 px-4 text-amber-300 font-['Noto_Serif_TC',serif] whitespace-normal break-words max-w-[200px]">
                        {p.taiwanName}
                      </td>
                      <td className="py-3 px-4 text-red-200/80 whitespace-normal break-words max-w-[200px]">{p.department}</td>
                    </tr>
                  ))
                )}
              </>
            )}

            {/* All Tab Table */}
            {activeTab === 'all' && (
              <>
                {filteredAll.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-amber-200/50 text-sm">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-7 h-7 text-amber-500/50" />
                        <span>Chưa có dữ liệu nhân viên / 無人員資料</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAll.map((p, idx) => (
                    <tr
                      key={p.id}
                      className="hover:bg-amber-950/30 transition-colors text-amber-100/90"
                    >
                      <td className="py-3 px-4 text-center font-mono text-zinc-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-300 whitespace-nowrap">{p.msnv}</td>
                      <td className="py-3 px-4 font-medium text-amber-100 whitespace-normal break-words max-w-[200px]">{p.fullName}</td>
                      <td className="py-3 px-4 text-amber-300 font-['Noto_Serif_TC',serif] whitespace-normal break-words max-w-[200px]">
                        {p.taiwanName}
                      </td>
                      <td className="py-3 px-4 text-red-200/80 whitespace-normal break-words max-w-[200px]">{p.department}</td>
                      <td className="py-3 px-4 text-center">
                        {p.isWon ? (
                          <span className="inline-block px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 font-semibold text-xs">
                            {lang === 'tw'
                              ? `已中 (${p.prizeName || '獎項'})`
                              : `Đã trúng (${p.prizeName || 'Giải'})`}
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700 text-zinc-400 text-xs">
                            {lang === 'tw' ? '未中獎' : 'Chưa trúng'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
