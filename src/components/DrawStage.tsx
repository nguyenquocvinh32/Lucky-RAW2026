import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Trophy, Award, Gift, Crown, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Participant, LanguageMode, DrawCountMode, PrizeConfig } from '../types';
import { soundEffects } from '../utils/audio';
import { getTranslation } from '../utils/i18n';

interface DrawStageProps {
  lang: LanguageMode;
  participants: Participant[];
  unwonParticipants: Participant[];
  onDrawComplete: (newWinners: Participant[], prizeNameVi: string, prizeNameTw: string) => void;
}

export const PRIZE_TIERS: PrizeConfig[] = [
  { id: 'special', nameVi: 'Giải Đặc Biệt', nameTw: '特等獎 (頭獎)', color: 'from-amber-400 to-yellow-600' },
  { id: 'first', nameVi: 'Giải Nhất', nameTw: '一等獎', color: 'from-red-500 to-amber-500' },
  { id: 'second', nameVi: 'Giải Nhì', nameTw: '二等獎', color: 'from-blue-400 to-indigo-500' },
  { id: 'third', nameVi: 'Giải Ba', nameTw: '三等獎', color: 'from-emerald-400 to-teal-500' },
  { id: 'lucky', nameVi: 'Giải Khuyến Khích', nameTw: '幸運獎 / 普獎', color: 'from-purple-400 to-pink-500' },
  { id: 'custom', nameVi: 'Giải Tự Đặt', nameTw: '自訂獎項', color: 'from-amber-500 to-rose-600' },
];

export const DrawStage: React.FC<DrawStageProps> = ({
  lang,
  participants,
  unwonParticipants,
  onDrawComplete,
}) => {
  const [drawCountMode, setDrawCountMode] = useState<DrawCountMode>(1);
  const [selectedPrizeId, setSelectedPrizeId] = useState<string>('special');
  const [customPrizeName, setCustomPrizeName] = useState<string>('Giải May Mắn / 幸運大獎');

  // Animation & slot states
  const [isSpinning, setIsSpinning] = useState(false);
  const [slotDisplays, setSlotDisplays] = useState<Participant[]>([]);
  const [lockedSlots, setLockedSlots] = useState<boolean[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Robust refs to prevent closure stale states
  const lockedSlotsRef = useRef<boolean[]>([]);
  const roundWinnersRef = useRef<Participant[]>([]);
  const animationTimersRef = useRef<number[]>([]);
  const spinIntervalsRef = useRef<number[]>([]);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      animationTimersRef.current.forEach(clearTimeout);
      spinIntervalsRef.current.forEach(clearInterval);
    };
  }, []);

  // Sync display slots when idle or when count mode changes
  useEffect(() => {
    if (!isSpinning) {
      const initialSlots: Participant[] = [];
      const pool = unwonParticipants.length > 0 ? unwonParticipants : participants;
      for (let i = 0; i < drawCountMode; i++) {
        const dummy: Participant = pool[i % pool.length] || {
          id: `preview-${i}`,
          msnv: 'RT-????',
          fullName: 'Sẵn Sàng Quay',
          taiwanName: '準備抽獎',
          department: 'Ritek Viet Nam',
        };
        initialSlots.push(dummy);
      }
      setSlotDisplays(initialSlots);
      const initialLocked = new Array(drawCountMode).fill(false);
      setLockedSlots(initialLocked);
      lockedSlotsRef.current = initialLocked;
      roundWinnersRef.current = [];
    }
  }, [drawCountMode, unwonParticipants, participants, isSpinning]);

  const currentPrize = PRIZE_TIERS.find((p) => p.id === selectedPrizeId) || PRIZE_TIERS[0];
  const activePrizeVi = selectedPrizeId === 'custom' ? customPrizeName : currentPrize.nameVi;
  const activePrizeTw = selectedPrizeId === 'custom' ? customPrizeName : currentPrize.nameTw;

  const handleStartDraw = () => {
    if (isSpinning) return;
    setStatusMessage(null);

    // Validation
    if (unwonParticipants.length === 0) {
      setStatusMessage(getTranslation('noMoreParticipants', lang));
      return;
    }

    if (unwonParticipants.length < drawCountMode) {
      setStatusMessage(
        lang === 'tw'
          ? `未中獎同仁僅剩 ${unwonParticipants.length} 人，不足以進行 ${drawCountMode} 人的抽獎！`
          : lang === 'vi'
          ? `Danh sách chưa trúng chỉ còn ${unwonParticipants.length} người, không đủ để quay ${drawCountMode} người!`
          : `Chỉ còn ${unwonParticipants.length} người chưa trúng / 僅剩 ${unwonParticipants.length} 人`
      );
      return;
    }

    // Select N unique winners randomly
    const shuffledPool = [...unwonParticipants].sort(() => 0.5 - Math.random());
    const roundWinners = shuffledPool.slice(0, drawCountMode);
    roundWinnersRef.current = roundWinners;

    // Reset lock states
    const initialLocked = new Array(drawCountMode).fill(false);
    lockedSlotsRef.current = initialLocked;
    setLockedSlots(initialLocked);
    setIsSpinning(true);

    // Clear previous timers
    animationTimersRef.current.forEach(clearTimeout);
    spinIntervalsRef.current.forEach(clearInterval);
    animationTimersRef.current = [];
    spinIntervalsRef.current = [];

    const pool = participants.length > 0 ? participants : unwonParticipants;
    let tickSoundCount = 0;

    // Fast cycling for all unlocked slots
    const intervalId = window.setInterval(() => {
      tickSoundCount++;
      // Ratchet wheel ticking sound
      if (tickSoundCount % 2 === 0) {
        soundEffects.playSpinTick(1.0 + Math.sin(tickSoundCount * 0.15) * 0.25);
      }

      setSlotDisplays((prevDisplays) => {
        return prevDisplays.map((slot, index) => {
          // If this slot is already locked, ALWAYS freeze on its final winner!
          if (lockedSlotsRef.current[index]) {
            return roundWinnersRef.current[index] || slot;
          }
          // Otherwise roll random participant
          const randomIdx = Math.floor(Math.random() * pool.length);
          return pool[randomIdx] || slot;
        });
      });
    }, 45);

    spinIntervalsRef.current.push(intervalId);

    // Timing requirement: 3.5 giây mỗi người (3500ms per person)
    // Slot 0 locks at 3500ms (3.5s)
    // Slot 1 locks at 7000ms (7.0s)
    // Slot 2 locks at 10500ms (10.5s)
    // Slot 3 locks at 14000ms (14.0s)
    // Slot 4 locks at 17500ms (17.5s)
    const TIME_PER_PERSON_MS = 3500;

    for (let slotIdx = 0; slotIdx < drawCountMode; slotIdx++) {
      const targetDelay = (slotIdx + 1) * TIME_PER_PERSON_MS;

      const timerId = window.setTimeout(() => {
        // 1. Mark this slot as locked in ref & state
        lockedSlotsRef.current[slotIdx] = true;
        setLockedSlots([...lockedSlotsRef.current]);

        // 2. Immediately set the exact winner for this slot
        const winner = roundWinnersRef.current[slotIdx];
        setSlotDisplays((prev) => {
          const updated = [...prev];
          updated[slotIdx] = winner;
          return updated;
        });

        // 3. Play mechanical chime "reng reng" when locking in
        soundEffects.playSlotLockDing();

        // 4. Check if this was the final slot to lock
        if (slotIdx === drawCountMode - 1) {
          clearInterval(intervalId);

          // Give 1.2s pause so the audience can clearly view the final winner card, then pop the celebration modal!
          const finishTimer = window.setTimeout(() => {
            setIsSpinning(false);
            onDrawComplete(roundWinnersRef.current, activePrizeVi, activePrizeTw);
          }, 1200);

          animationTimersRef.current.push(finishTimer);
        }
      }, targetDelay);

      animationTimersRef.current.push(timerId);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Controls: Prize Selector & Mode Selector */}
      <div className="w-full bg-[#180409]/95 border border-amber-600/40 rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 mb-4 backdrop-blur-md shadow-xl flex flex-wrap items-center justify-between gap-3">
        {/* Prize Selection */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-amber-300 text-xs sm:text-sm font-bold">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{getTranslation('selectPrize', lang)}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {PRIZE_TIERS.map((tier) => {
              const isSelected = selectedPrizeId === tier.id;
              const displayName =
                lang === 'tw' ? tier.nameTw : lang === 'vi' ? tier.nameVi : `${tier.nameVi} / ${tier.nameTw}`;
              return (
                <button
                  key={tier.id}
                  disabled={isSpinning}
                  onClick={() => setSelectedPrizeId(tier.id)}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)] scale-105'
                      : 'bg-[#22070e] text-amber-200/70 border-amber-900/50 hover:border-amber-600/40 hover:text-amber-100'
                  } ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {displayName}
                </button>
              );
            })}
          </div>

          {selectedPrizeId === 'custom' && (
            <input
              type="text"
              value={customPrizeName}
              disabled={isSpinning}
              onChange={(e) => setCustomPrizeName(e.target.value)}
              placeholder="Nhập tên giải thưởng..."
              className="px-2.5 py-1 bg-[#120306] border border-amber-500/50 rounded-xl text-xs text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-400 w-36 sm:w-44"
            />
          )}
        </div>

        {/* Draw Count Mode: 1, 3, or 5 people */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs sm:text-sm font-semibold text-amber-300 whitespace-nowrap hidden sm:inline">
            {getTranslation('drawModeLabel', lang)}
          </span>
          <div className="flex items-center bg-[#100306] p-1 rounded-xl border border-amber-600/40">
            {([1, 3, 5] as DrawCountMode[]).map((count) => {
              const isSelected = drawCountMode === count;
              const label =
                lang === 'tw'
                  ? `${count} 人`
                  : lang === 'vi'
                  ? `${count} Người`
                  : `${count} Người / ${count}人`;
              return (
                <button
                  key={count}
                  disabled={isSpinning}
                  onClick={() => setDrawCountMode(count)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-md font-extrabold scale-105'
                      : 'text-zinc-400 hover:text-amber-200'
                  } ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Stage Frame: Engineered for full viewport projection on PC */}
      <div className="relative w-full rounded-3xl p-[2px] bg-gradient-to-b from-amber-400 via-red-600/70 to-amber-500/90 shadow-[0_0_50px_rgba(217,119,6,0.35)] overflow-hidden">
        {/* Ornate corner imperial knots */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400/80 pointer-events-none rounded-tl-lg" />
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400/80 pointer-events-none rounded-tr-lg" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400/80 pointer-events-none rounded-bl-lg" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400/80 pointer-events-none rounded-br-lg" />

        <div className="w-full bg-gradient-to-b from-[#1c050a] via-[#150307] to-[#110205] rounded-[22px] px-4 py-5 sm:px-8 sm:py-6 flex flex-col items-center relative">
          {/* Subtle Lantern Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Current Prize Badge */}
          <div className="relative mb-4 sm:mb-5">
            <div className="flex items-center gap-2.5 px-6 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 via-red-950/80 to-amber-500/20 border-2 border-amber-400/70 shadow-[0_0_20px_rgba(245,158,11,0.35)]">
              <Crown className="w-5 h-5 text-amber-300 animate-pulse" />
              <div className="text-center">
                <span className="text-[11px] uppercase tracking-wider text-amber-300/80 font-semibold block">
                  {lang === 'tw' ? '當前抽獎獎項' : lang === 'vi' ? 'Giải Thưởng Đang Quay' : 'Giải Thưởng / 獎項'}
                </span>
                <span className="text-base sm:text-xl font-black bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent font-serif tracking-wide">
                  {lang === 'tw' ? activePrizeTw : lang === 'vi' ? activePrizeVi : `${activePrizeVi} - ${activePrizeTw}`}
                </span>
              </div>
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
          </div>

          {/* Dynamic Slot Reel Grid: 1, 3, or 5 cards
              When locked, shows "ĐÃ CHỐT! (已鎖定)" and immediately reveals the winner's exact name with zero "..."!
          */}
          <div
            className={`w-full grid gap-3 sm:gap-5 my-2 ${
              drawCountMode === 1
                ? 'grid-cols-1 max-w-xl'
                : drawCountMode === 3
                ? 'grid-cols-1 md:grid-cols-3 max-w-5xl'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 max-w-7xl'
            }`}
          >
            {slotDisplays.slice(0, drawCountMode).map((item, index) => {
              const isLocked = lockedSlots[index];
              // Ensure displayPerson is guaranteed to be the actual winner if locked!
              const displayPerson =
                isLocked && roundWinnersRef.current[index]
                  ? roundWinnersRef.current[index]
                  : item;

              return (
                <div
                  key={index}
                  className={`relative rounded-2xl p-[2px] transition-all duration-300 transform ${
                    isLocked
                      ? 'bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 shadow-[0_0_35px_rgba(251,191,36,0.85)] scale-[1.03] z-10'
                      : isSpinning
                      ? 'bg-gradient-to-b from-red-600 via-amber-600 to-red-800 shadow-[0_0_15px_rgba(220,38,38,0.4)] animate-pulse'
                      : 'bg-gradient-to-b from-amber-700/40 via-red-900/30 to-amber-900/40'
                  }`}
                >
                  <div
                    className={`w-full h-full bg-gradient-to-b from-[#24060d] to-[#160308] rounded-[14px] p-3.5 sm:p-4 flex flex-col items-center justify-between text-center relative overflow-hidden min-h-[195px] sm:min-h-[225px] ${
                      isSpinning && !isLocked ? 'blur-[0.2px]' : ''
                    }`}
                  >
                    {/* Header line of Card: Slot Index & Status */}
                    <div className="w-full flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-black/60 border border-amber-500/40 text-amber-300 font-mono">
                        #{index + 1}
                      </span>

                      {/* Locked vs Spinning vs Waiting badge */}
                      {isLocked ? (
                        <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-stone-950 shadow-[0_0_12px_rgba(251,191,36,0.8)] flex items-center gap-1 animate-bounce border border-yellow-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-stone-950 stroke-[3]" />
                          <span>{lang === 'tw' ? '已鎖定中獎！' : 'ĐÃ CHỐT!'}</span>
                        </span>
                      ) : isSpinning ? (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                          {lang === 'tw' ? '抽取中...' : 'Đang quay...'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-amber-300/60">
                          {lang === 'tw' ? '等待' : 'Chờ quay'}
                        </span>
                      )}
                    </div>

                    {/* MSNV / Staff ID */}
                    <div className="mb-1.5">
                      <span className="inline-block px-3 py-1 rounded-lg bg-[#110205] border border-amber-500/40 font-mono text-xs sm:text-sm font-black text-amber-300 tracking-wider shadow-inner">
                        {displayPerson.msnv || 'RT-????'}
                      </span>
                    </div>

                    {/* Full Vietnamese Name: NO "..." - wraps fully with whitespace-normal */}
                    <div className="w-full my-auto py-1">
                      <h3
                        className={`font-black text-amber-100 font-serif leading-tight whitespace-normal break-words ${
                          drawCountMode === 1
                            ? 'text-xl sm:text-2xl'
                            : drawCountMode === 3
                            ? 'text-lg sm:text-xl'
                            : 'text-base sm:text-lg'
                        }`}
                      >
                        {displayPerson.fullName || '---'}
                      </h3>

                      {/* Taiwan / Chinese Name: NO "..." */}
                      <p
                        className={`font-bold text-amber-400 leading-snug whitespace-normal break-words mt-1 font-['Noto_Serif_TC',serif] ${
                          drawCountMode === 1
                            ? 'text-lg sm:text-xl'
                            : drawCountMode === 3
                            ? 'text-base sm:text-lg'
                            : 'text-sm sm:text-base'
                        }`}
                      >
                        {displayPerson.taiwanName || '---'}
                      </p>
                    </div>

                    {/* Department: NO "..." */}
                    <div className="pt-2 border-t border-amber-900/50 w-full mt-2">
                      <span className="text-[11px] sm:text-xs text-red-200/80 font-medium whitespace-normal break-words leading-tight block">
                        {displayPerson.department || 'Ritek Viet Nam'}
                      </span>
                    </div>

                    {/* Golden spark overlay when locked */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-amber-400/15 pointer-events-none" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Alert Message banner if any */}
          {statusMessage && (
            <div className="mt-3 p-3 rounded-xl bg-amber-950/90 border border-amber-500/60 text-amber-200 text-xs sm:text-sm flex items-center gap-2 max-w-md shadow-lg">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Grand Draw Action Button */}
          <div className="mt-6 sm:mt-7 relative group">
            <div
              className={`absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-400 via-red-500 to-amber-400 opacity-75 blur-md transition duration-500 group-hover:opacity-100 ${
                isSpinning ? 'animate-pulse opacity-100' : ''
              }`}
            />

            <button
              disabled={isSpinning || unwonParticipants.length === 0}
              onClick={handleStartDraw}
              className={`relative px-8 sm:px-14 py-3.5 sm:py-4 rounded-2xl font-black text-base sm:text-xl tracking-wider uppercase transition-all duration-300 transform flex items-center gap-3 shadow-2xl cursor-pointer ${
                isSpinning
                  ? 'bg-gradient-to-r from-red-700 to-amber-700 text-white cursor-wait scale-95 shadow-inner'
                  : unwonParticipants.length === 0
                  ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 hover:scale-105 active:scale-95 shadow-[0_10px_25px_rgba(245,158,11,0.5)]'
              }`}
            >
              <Zap
                className={`w-6 h-6 ${
                  isSpinning ? 'text-amber-300 animate-spin' : 'text-stone-950 fill-current'
                }`}
              />
              <span className="font-serif">
                {isSpinning
                  ? getTranslation('drawingText', lang)
                  : lang === 'tw'
                  ? `立即抽獎 (選出 ${drawCountMode} 位)`
                  : lang === 'vi'
                  ? `QUAY THƯỞNG (${drawCountMode} NGƯỜI)`
                  : `QUAY THƯỞNG (${drawCountMode} NGƯỜI / 抽 ${drawCountMode} 人)`}
              </span>
              <Sparkles className="w-6 h-6 text-stone-950" />
            </button>
          </div>

          {/* Quick Counter Info */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-amber-300/80 font-medium">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-amber-600/30">
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {lang === 'tw'
                  ? `剩餘可抽名額: ${unwonParticipants.length} 人`
                  : lang === 'vi'
                  ? `Số người còn lại trong hòm: ${unwonParticipants.length}`
                  : `Còn lại: ${unwonParticipants.length} người / 剩餘 ${unwonParticipants.length} 人`}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
