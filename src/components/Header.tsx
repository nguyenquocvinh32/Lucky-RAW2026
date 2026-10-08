import React, { useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Maximize2, Minimize2, Sparkles, Globe, Tv, FileSpreadsheet, ListFilter } from 'lucide-react';
import { LanguageMode, AppView } from '../types';
import { getTranslation } from '../utils/i18n';
import { soundEffects } from '../utils/audio';

interface HeaderProps {
  lang: LanguageMode;
  setLang: (lang: LanguageMode) => void;
  onResetAll: () => void;
  participantCount: number;
  winnerCount: number;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  onResetAll,
  participantCount,
  winnerCount,
  activeView,
  setActiveView,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    soundEffects.setMuted(nextState);
    if (!nextState) {
      soundEffects.playSlotLockDing();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const handleNewClick = () => {
    const confirmMsg = getTranslation('btnNewConfirm', lang);
    if (window.confirm(confirmMsg)) {
      onResetAll();
    }
  };

  return (
    <header className="relative w-full border-b border-amber-600/30 bg-gradient-to-r from-[#180408]/95 via-[#250810]/95 to-[#180408]/95 backdrop-blur-md px-3 sm:px-6 py-2.5 shadow-2xl z-40">
      {/* Decorative Traditional Chinese auspicious corner accents */}
      <div className="absolute top-0 left-0 w-24 h-full pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent" />
      <div className="absolute top-0 right-0 w-24 h-full pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Brand / Logo Section */}
        <div className="flex items-center gap-3">
          {/* Imperial Crest / Ritek Badge */}
          <div className="relative group flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400 via-red-600 to-amber-600 p-[1.5px] shadow-[0_0_15px_rgba(217,119,6,0.5)] shrink-0">
            <div className="w-full h-full bg-[#1e070d] rounded-[10px] flex items-center justify-center">
              <span className="font-serif text-lg sm:text-xl font-black bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text text-transparent tracking-tighter">
                錸
              </span>
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping opacity-75" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-wide uppercase bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent font-['Cinzel',serif] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Ritek Viet Nam
              </h1>
              <span className="text-[11px] px-1.5 py-0.2 rounded border border-amber-500/40 bg-amber-500/10 text-amber-300 font-medium">
                錸德越南
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-red-200/80 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400 inline" />
              <span>
                {lang === 'tw'
                  ? '新春尾牙幸運抽獎系統'
                  : lang === 'vi'
                  ? 'Quay Thưởng May Mắn Đầu Xuân'
                  : 'Quay Thưởng May Mắn / 新春尾牙幸運抽獎'}
              </span>
            </p>
          </div>
        </div>

        {/* Center: Main View Tabs for desktop / local app layout */}
        <div className="flex items-center bg-[#110205] p-1 rounded-xl border border-amber-500/40 shadow-inner">
          <button
            onClick={() => setActiveView('stage')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === 'stage'
                ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md border border-amber-300/40'
                : 'text-zinc-400 hover:text-amber-200 hover:bg-[#1f060d]'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>{lang === 'tw' ? '抽獎舞台' : lang === 'vi' ? 'Sân Khấu Quay' : 'Sân Khấu / 舞台'}</span>
          </button>

          <button
            onClick={() => setActiveView('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === 'list'
                ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md border border-amber-300/40'
                : 'text-zinc-400 hover:text-amber-200 hover:bg-[#1f060d]'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>
              {lang === 'tw' ? '名單管理' : lang === 'vi' ? 'Danh Sách' : 'Danh Sách / 名單'}
              {winnerCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-black text-[10px] font-black">
                  {winnerCount}
                </span>
              )}
            </span>
          </button>

          <button
            onClick={() => setActiveView('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === 'upload'
                ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md border border-amber-300/40'
                : 'text-zinc-400 hover:text-amber-200 hover:bg-[#1f060d]'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{lang === 'tw' ? '匯入檔案' : lang === 'vi' ? 'Tải File Excel' : 'Tải File / 匯入'}</span>
          </button>
        </div>

        {/* Right Tools: Language Modes, Sound, New Button, Fullscreen */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Multilingual Selector: Song ngữ | Tiếng Việt | 繁體中文 */}
          <div className="flex items-center bg-[#130307]/90 p-1 rounded-xl border border-amber-600/30 shadow-inner">
            <Globe className="w-3.5 h-3.5 text-amber-400 ml-1.5 mr-1 hidden sm:block" />
            <button
              onClick={() => setLang('bilingual')}
              className={`px-2 py-1 text-xs rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                lang === 'bilingual'
                  ? 'bg-gradient-to-r from-amber-600 to-red-700 text-amber-100 shadow-md border border-amber-400/40'
                  : 'text-zinc-400 hover:text-amber-200'
              }`}
              title="Song ngữ Việt - Đài Loan (雙語)"
            >
              Song ngữ / 雙語
            </button>
            <button
              onClick={() => setLang('vi')}
              className={`px-2 py-1 text-xs rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                lang === 'vi'
                  ? 'bg-gradient-to-r from-amber-600 to-red-700 text-amber-100 shadow-md border border-amber-400/40'
                  : 'text-zinc-400 hover:text-amber-200'
              }`}
            >
              Tiếng Việt
            </button>
            <button
              onClick={() => setLang('tw')}
              className={`px-2 py-1 text-xs rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                lang === 'tw'
                  ? 'bg-gradient-to-r from-amber-600 to-red-700 text-amber-100 shadow-md border border-amber-400/40'
                  : 'text-zinc-400 hover:text-amber-200'
              }`}
            >
              繁體中文
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
              isMuted
                ? 'bg-zinc-800/80 border-zinc-700 text-zinc-400'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
            }`}
            title={isMuted ? getTranslation('soundOff', lang) : getTranslation('soundOn', lang)}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl border border-amber-600/30 bg-[#1f060d]/80 text-amber-200 hover:bg-amber-950/60 transition-all duration-200 hidden sm:flex items-center justify-center cursor-pointer"
            title="Toàn màn hình / 全螢幕"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Requirement 8: "Có nút new để xóa hết thông tin up lại trang load danh sách" */}
          <button
            onClick={handleNewClick}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-red-500/50 bg-gradient-to-r from-red-950/80 to-[#3b0811] text-red-200 hover:text-white hover:border-red-400 transition-all duration-200 shadow-sm hover:shadow-[0_0_12px_rgba(239,68,68,0.3)] text-xs font-semibold cursor-pointer"
            title="Làm mới toàn bộ dữ liệu để tải danh sách mới"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-400" />
            <span>{getTranslation('btnNew', lang)}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

