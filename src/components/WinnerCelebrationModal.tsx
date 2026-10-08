import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Crown, Sparkles, X, Check, Gift } from 'lucide-react';
import { Participant, LanguageMode } from '../types';
import { getTranslation } from '../utils/i18n';
import { soundEffects } from '../utils/audio';
import { FireworksCanvas } from './FireworksCanvas';

interface WinnerCelebrationModalProps {
  lang: LanguageMode;
  winners: Participant[];
  prizeNameVi: string;
  prizeNameTw: string;
  onClose: () => void;
}

export const WinnerCelebrationModal: React.FC<WinnerCelebrationModalProps> = ({
  lang,
  winners,
  prizeNameVi,
  prizeNameTw,
  onClose,
}) => {
  useEffect(() => {
    // 1. Play sounds: powerful booming fireworks explosions ("đùng đùng") & festive fanfare
    soundEffects.playBoomingFireworksSound();
    soundEffects.playFirecrackers();
    const fanfareTimer = setTimeout(() => {
      soundEffects.playFanfare();
    }, 600);

    // 2. Confetti bursts
    const end = Date.now() + 3000;
    const colors = ['#f59e0b', '#ef4444', '#fbbf24', '#fef08a', '#d97706'];

    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    return () => {
      clearTimeout(fanfareTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      {/* Background canvas fireworks */}
      <FireworksCanvas active={true} />

      <div className="relative w-full max-w-5xl bg-gradient-to-b from-[#2a0710] via-[#1a0409] to-[#120205] border-2 border-amber-400 rounded-3xl p-5 sm:p-8 md:p-10 shadow-[0_0_60px_rgba(245,158,11,0.6)] text-center my-auto z-10 overflow-hidden">
        {/* Festive corner ornaments */}
        <div className="absolute top-2 left-2 w-10 h-10 border-t-2 border-l-2 border-amber-400 rounded-tl-xl pointer-events-none" />
        <div className="absolute top-2 right-2 w-10 h-10 border-t-2 border-r-2 border-amber-400 rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-10 h-10 border-b-2 border-l-2 border-amber-400 rounded-bl-xl pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-10 h-10 border-b-2 border-r-2 border-amber-400 rounded-br-xl pointer-events-none" />

        {/* Close Button top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-amber-300 hover:text-white hover:bg-black/80 border border-amber-500/40 transition-colors z-20 cursor-pointer"
          title="Đóng / 關閉"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="flex flex-col items-center mb-5">
          <div className="relative mb-2.5">
            <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-1 shadow-[0_0_30px_rgba(245,158,11,0.8)] flex items-center justify-center animate-bounce">
              <div className="w-full h-full bg-[#180408] rounded-xl flex items-center justify-center">
                <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300" />
              </div>
            </div>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 absolute -top-2 -right-2 animate-spin" />
          </div>

          <h2 className="text-xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100 bg-clip-text text-transparent font-serif tracking-wide drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
            {getTranslation('congratsTitle', lang)}
          </h2>

          <p className="text-xs sm:text-sm text-red-200/90 mt-1 font-medium max-w-lg">
            {getTranslation('congratsSubtitle', lang)}
          </p>

          {/* Prize Name Ribbon */}
          <div className="mt-3.5 px-6 py-1.5 rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 border border-amber-300 text-stone-950 font-black text-xs sm:text-base shadow-lg flex items-center gap-2">
            <Gift className="w-4 h-4 fill-stone-950" />
            <span>
              {lang === 'tw' ? prizeNameTw : lang === 'vi' ? prizeNameVi : `${prizeNameVi} / ${prizeNameTw}`}
            </span>
          </div>
        </div>

        {/* Winners Summary Cards
            Requirement: HIỆN ĐẦY ĐỦ TÊN, KHÔNG ĐỂ '...'
        */}
        <div
          className={`grid gap-3.5 sm:gap-4 my-5 ${
            winners.length === 1
              ? 'grid-cols-1 max-w-md mx-auto'
              : winners.length === 3
              ? 'grid-cols-1 md:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
          }`}
        >
          {winners.map((winner, idx) => (
            <div
              key={winner.id || idx}
              className="relative rounded-2xl p-[1.5px] bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.4)] transform hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="w-full h-full bg-gradient-to-b from-[#24060d] to-[#160307] rounded-[14px] p-4 flex flex-col items-center justify-between text-center min-h-[190px]">
                {/* Staff ID */}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono font-black mb-2">
                  {winner.msnv}
                </span>

                {/* Vietnamese Name: Full text wrap, NO ellipsis! */}
                <div className="my-auto w-full py-1">
                  <h3
                    className={`font-black text-amber-100 font-serif leading-snug whitespace-normal break-words ${
                      winners.length === 1
                        ? 'text-xl sm:text-2xl'
                        : winners.length === 3
                        ? 'text-lg sm:text-xl'
                        : 'text-base sm:text-lg'
                    }`}
                  >
                    {winner.fullName}
                  </h3>

                  {/* Taiwan Name: Full text wrap, NO ellipsis! */}
                  <p
                    className={`font-bold text-amber-400 leading-snug whitespace-normal break-words mt-1.5 font-['Noto_Serif_TC',serif] ${
                      winners.length === 1
                        ? 'text-lg sm:text-xl'
                        : winners.length === 3
                        ? 'text-base sm:text-lg'
                        : 'text-sm sm:text-base'
                    }`}
                  >
                    {winner.taiwanName}
                  </p>
                </div>

                {/* Department: Full text wrap, NO ellipsis! */}
                <div className="pt-2 border-t border-amber-900/50 w-full mt-2">
                  <p className="text-xs text-red-200/90 font-medium whitespace-normal break-words leading-tight">
                    {winner.department}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button: Đóng & Tiếp tục */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-8 sm:px-12 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 font-black text-sm sm:text-base hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(245,158,11,0.5)] cursor-pointer flex items-center gap-2"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>{getTranslation('closeBtn', lang)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
