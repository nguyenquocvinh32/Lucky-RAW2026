/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { DrawStage } from './components/DrawStage';
import { WinnerCelebrationModal } from './components/WinnerCelebrationModal';
import { ParticipantsTabs } from './components/ParticipantsTabs';
import { Footer } from './components/Footer';
import { Participant, LanguageMode, AppView } from './types';
import { SAMPLE_PARTICIPANTS } from './utils/excel';
import { getTranslation } from './utils/i18n';
import { Users, Trophy, Sparkles, Gift } from 'lucide-react';

const STORAGE_KEY = 'ritek_draw_participants_v1';
const LANG_STORAGE_KEY = 'ritek_draw_lang_v1';

export default function App() {
  // Load initial language mode
  const [lang, setLang] = useState<LanguageMode>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return (saved as LanguageMode) || 'bilingual';
  });

  // Current active view: 'stage' (default desktop viewport) | 'list' | 'upload'
  const [activeView, setActiveView] = useState<AppView>('stage');

  // Load participants from storage, or fallback to sample so app is ready immediately
  const [participants, setParticipants] = useState<Participant[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return SAMPLE_PARTICIPANTS;
  });

  // Celebration Modal state
  const [celebrationData, setCelebrationData] = useState<{
    isOpen: boolean;
    winners: Participant[];
    prizeNameVi: string;
    prizeNameTw: string;
  }>({
    isOpen: false,
    winners: [],
    prizeNameVi: '',
    prizeNameTw: '',
  });

  // Persist language mode
  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }, [lang]);

  // Persist participants list
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
    } catch {
      // ignore
    }
  }, [participants]);

  // Derived lists
  const winners = participants.filter((p) => p.isWon);
  const unwon = participants.filter((p) => !p.isWon);

  // Handlers
  const handleParticipantsLoaded = (newParticipants: Participant[]) => {
    setParticipants(newParticipants);
    setActiveView('stage'); // Auto switch to stage so MC/user can start drawing immediately!
  };

  const handleDrawComplete = (
    roundWinners: Participant[],
    prizeNameVi: string,
    prizeNameTw: string
  ) => {
    const nowStr = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const winnerIds = new Set(roundWinners.map((w) => w.id));

    const combinedPrizeName =
      lang === 'tw' ? prizeNameTw : lang === 'vi' ? prizeNameVi : `${prizeNameVi} / ${prizeNameTw}`;

    setParticipants((prev) =>
      prev.map((p) => {
        if (winnerIds.has(p.id)) {
          return {
            ...p,
            isWon: true,
            wonAt: nowStr,
            prizeName: combinedPrizeName,
          };
        }
        return p;
      })
    );

    // Trigger celebration modal
    setCelebrationData({
      isOpen: true,
      winners: roundWinners,
      prizeNameVi,
      prizeNameTw,
    });
  };

  // Requirement 7: Xóa người đó để trả về danh sách chưa trúng
  const handleRevertWinner = (participantId: string) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === participantId) {
          return {
            ...p,
            isWon: false,
            prizeName: undefined,
            wonAt: undefined,
          };
        }
        return p;
      })
    );
  };

  // Requirement 8: Có nút new để xóa hết thông tin up lại trang load danh sách
  const handleResetAll = () => {
    setParticipants([]);
    setActiveView('upload');
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0c0407] text-[#faedd9] overflow-x-hidden selection:bg-amber-600 selection:text-white">
      {/* Traditional Chinese ambient background elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header with AppView navigation */}
      <Header
        lang={lang}
        setLang={setLang}
        onResetAll={handleResetAll}
        participantCount={participants.length}
        winnerCount={winners.length}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content Area: Responsive & full viewport friendly */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-5 z-20 flex flex-col">
        {/* Top Summary Stats Bar (Compact for desktop viewport) */}
        <div className="w-full grid grid-cols-3 gap-2.5 sm:gap-4 mb-4">
          {/* Total */}
          <div className="bg-gradient-to-r from-[#1e060d]/90 to-[#140307]/90 border border-amber-600/30 rounded-2xl p-2.5 sm:p-3.5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-amber-300/70 font-medium">
                  {getTranslation('totalParticipants', lang)}
                </p>
                <h4 className="text-base sm:text-xl font-black text-amber-100 font-mono leading-none mt-0.5">
                  {participants.length}
                </h4>
              </div>
            </div>
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-black/40 text-amber-300/80 border border-amber-600/20 font-medium hidden sm:inline">
              {lang === 'tw' ? '名單' : 'Tổng số'}
            </span>
          </div>

          {/* Won */}
          <div className="bg-gradient-to-r from-[#220710]/90 to-[#17050b]/90 border border-amber-500/40 rounded-2xl p-2.5 sm:p-3.5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500/20 to-red-600/20 border border-amber-400/50 flex items-center justify-center shrink-0">
                <Trophy className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-amber-300/70 font-medium">
                  {getTranslation('wonCount', lang)}
                </p>
                <h4 className="text-base sm:text-xl font-black text-amber-300 font-mono leading-none mt-0.5">
                  {winners.length}
                </h4>
              </div>
            </div>
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-400/30 font-semibold hidden sm:inline">
              {lang === 'tw' ? '已中獎' : 'Đã trúng'}
            </span>
          </div>

          {/* Unwon / Remaining */}
          <div className="bg-gradient-to-r from-[#1a050c]/90 to-[#120308]/90 border border-amber-600/30 rounded-2xl p-2.5 sm:p-3.5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-red-200/70 font-medium">
                  {getTranslation('unwonCount', lang)}
                </p>
                <h4 className="text-base sm:text-xl font-black text-red-200 font-mono leading-none mt-0.5">
                  {unwon.length}
                </h4>
              </div>
            </div>
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-black/40 text-red-300/80 border border-red-500/20 font-medium hidden sm:inline">
              {lang === 'tw' ? '可抽' : 'Còn lại'}
            </span>
          </div>
        </div>

        {/* VIEW 1: SÂN KHẤU QUAY (Stage View - Fits 100% desktop/local screen) */}
        {activeView === 'stage' && (
          <div className="w-full flex-1 flex flex-col justify-between">
            <DrawStage
              lang={lang}
              participants={participants}
              unwonParticipants={unwon}
              onDrawComplete={handleDrawComplete}
            />

            {/* Recent Winners Live Strip (Shown on stage without leaving the screen) */}
            {winners.length > 0 && (
              <div className="mt-4 p-3 rounded-2xl bg-[#140307]/80 border border-amber-600/30 backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Gift className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {lang === 'tw'
                        ? '最新中獎同仁名單'
                        : lang === 'vi'
                        ? 'Người vừa trúng thưởng gần đây'
                        : 'Người vừa trúng / 最新中獎'}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveView('list')}
                    className="text-[11px] text-amber-400 hover:text-amber-200 font-medium underline cursor-pointer"
                  >
                    {lang === 'tw' ? '查看全部中獎名單 →' : 'Xem toàn bộ danh sách trúng →'}
                  </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {winners.slice(-6).reverse().map((w) => (
                    <div
                      key={w.id}
                      className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#20060d] border border-amber-500/40 shadow-sm"
                    >
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/50 text-amber-300 font-bold">
                        {w.msnv}
                      </span>
                      <span className="text-xs font-bold text-amber-100 whitespace-nowrap">
                        {w.fullName}
                      </span>
                      <span className="text-xs text-amber-400 font-['Noto_Serif_TC',serif] whitespace-nowrap">
                        {w.taiwanName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-medium whitespace-nowrap">
                        {w.prizeName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: DANH SÁCH & QUẢN LÝ (List Management View) */}
        {activeView === 'list' && (
          <div className="w-full flex-1">
            <ParticipantsTabs
              lang={lang}
              participants={participants}
              winners={winners}
              unwon={unwon}
              onRevertWinner={handleRevertWinner}
            />
          </div>
        )}

        {/* VIEW 3: TẢI FILE EXCEL & CÀI ĐẶT (Upload View) */}
        {activeView === 'upload' && (
          <div className="w-full flex-1 py-2">
            <UploadSection
              lang={lang}
              onParticipantsLoaded={handleParticipantsLoaded}
              currentParticipantCount={participants.length}
            />
          </div>
        )}
      </main>

      {/* Winner Celebration Modal */}
      {celebrationData.isOpen && (
        <WinnerCelebrationModal
          lang={lang}
          winners={celebrationData.winners}
          prizeNameVi={celebrationData.prizeNameVi}
          prizeNameTw={celebrationData.prizeNameTw}
          onClose={() => setCelebrationData((prev) => ({ ...prev, isOpen: false }))}
        />
      )}

      {/* Footer */}
      <Footer lang={lang} />
    </div>
  );
}
