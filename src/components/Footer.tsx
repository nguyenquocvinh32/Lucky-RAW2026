import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { LanguageMode } from '../types';
import { getTranslation } from '../utils/i18n';

interface FooterProps {
  lang: LanguageMode;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="relative w-full border-t border-amber-800/30 bg-gradient-to-t from-[#0e0205] to-[#170408]/90 py-6 px-4 mt-16 text-center text-xs text-amber-200/60 z-30">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Festive Wish */}
        <div className="flex items-center gap-2 text-amber-300/80 font-medium font-serif">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{getTranslation('cnyGreeting', lang)}</span>
        </div>

        {/* Company & Year */}
        <div className="flex items-center gap-2 text-zinc-400">
          <span>© 2026 Ritek Viet Nam Co., Ltd. (錸德科技越南)</span>
          <span>•</span>
          <span className="text-amber-400/90 font-semibold">Tết Ất Tỵ 2026</span>
        </div>

        {/* Mandatory Requirement 9: Designed by Vinh Nguyen */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b050a] border border-amber-600/30 text-amber-300 font-semibold shadow-inner">
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          <span className="tracking-wide">Designed by Vinh Nguyen</span>
        </div>
      </div>
    </footer>
  );
};
