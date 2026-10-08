// Web Audio API based sound synthesizer for offline, zero-dependency sound effects

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Sound of spinning wheel tick / ratchet
   * pitchMultiplier: higher pitch as wheel spins faster
   */
  public playSpinTick(pitchMultiplier = 1.0) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Sharp wooden/mechanical ratchet tick
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 * pitchMultiplier, now);
      osc.frequency.exponentialRampToValueAtTime(120 * pitchMultiplier, now + 0.04);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600 * pitchMultiplier, now);
      filter.Q.setValueAtTime(3, now);

      gain.gain.setValueAtTime(0.18 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio fallback fail-safe
    }
  }

  /**
   * Sound of slot locking in: "Reng reng" / chime ding
   */
  public playSlotLockDing() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Two rapid chimes: "Reng reng"
      const chimes = [
        { timeOffset: 0.0, freq: 1174.66 }, // D6
        { timeOffset: 0.08, freq: 1760.00 }, // A6
      ];

      chimes.forEach(({ timeOffset, freq }) => {
        const osc = ctx.createOscillator();
        const overtone = ctx.createOscillator();
        const gain = ctx.createGain();

        const t = now + timeOffset;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * 2.01, t);

        gain.gain.setValueAtTime(0.35 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

        osc.connect(gain);
        overtone.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        overtone.start(t);
        osc.stop(t + 0.7);
        overtone.stop(t + 0.7);
      });
    } catch {
      // Audio fallback fail-safe
    }
  }

  /**
   * Powerful booming fireworks explosions sound (Tiếng pháo hoa đùng đùng nổ vang dội)
   */
  public playBoomingFireworksSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Staggered series of booming aerial fireworks: "ĐÙNG... ĐÙNG... ĐÙNG!"
      const boomTimes = [0.0, 0.45, 0.95, 1.5, 2.1, 2.7];

      boomTimes.forEach((delay, index) => {
        const t = now + delay;

        // 1. Heavy sub-bass explosive boom: "ĐÙNG!"
        const boomOsc = ctx.createOscillator();
        const boomGain = ctx.createGain();

        // Deep explosive thump dropping from 160Hz down to 35Hz
        boomOsc.type = 'sine';
        boomOsc.frequency.setValueAtTime(160 - index * 10, t);
        boomOsc.frequency.exponentialRampToValueAtTime(32, t + 0.38);

        const boomVol = (0.7 + Math.random() * 0.2) * this.volume;
        boomGain.gain.setValueAtTime(boomVol, t);
        boomGain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

        boomOsc.connect(boomGain);
        boomGain.connect(ctx.destination);
        boomOsc.start(t);
        boomOsc.stop(t + 0.6);

        // 2. Mid punch impact
        const midOsc = ctx.createOscillator();
        const midGain = ctx.createGain();
        midOsc.type = 'triangle';
        midOsc.frequency.setValueAtTime(240, t);
        midOsc.frequency.exponentialRampToValueAtTime(50, t + 0.15);
        midGain.gain.setValueAtTime(0.4 * this.volume, t);
        midGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        midOsc.connect(midGain);
        midGain.connect(ctx.destination);
        midOsc.start(t);
        midOsc.stop(t + 0.22);

        // 3. Crackling debris & sparkles trailing each boom
        const crackleCount = 10;
        for (let c = 0; c < crackleCount; c++) {
          const cTime = t + 0.08 + Math.random() * 0.35;
          const bufSize = Math.floor(ctx.sampleRate * 0.03);
          const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
          const data = buf.getChannelData(0);
          for (let k = 0; k < bufSize; k++) {
            data[k] = (Math.random() * 2 - 1) * Math.exp(-k / (bufSize * 0.3));
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buf;

          const nFilter = ctx.createBiquadFilter();
          nFilter.type = 'bandpass';
          nFilter.frequency.setValueAtTime(1500 + Math.random() * 2000, cTime);
          nFilter.Q.setValueAtTime(2, cTime);

          const nGain = ctx.createGain();
          nGain.gain.setValueAtTime(0.15 * this.volume, cTime);
          nGain.gain.exponentialRampToValueAtTime(0.001, cTime + 0.04);

          noise.connect(nFilter);
          nFilter.connect(nGain);
          nGain.connect(ctx.destination);

          noise.start(cTime);
          noise.stop(cTime + 0.05);
        }
      });
    } catch {
      // Audio fallback fail-safe
    }
  }

  /**
   * Authentic Vietnamese & Chinese Lunar New Year firecracker crackle pops (Tiếng pháo nổ giòn giã)
   */
  public playFirecrackers() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const numCrackles = 32; // rapid series of bursts
      const duration = 2.4;

      for (let i = 0; i < numCrackles; i++) {
        // Random intervals with accelerating bursts
        const offset = (i / numCrackles) * duration + (Math.random() - 0.5) * 0.08;
        if (offset < 0) continue;
        const popTime = now + offset;

        // Create burst using noise buffer
        const bufferSize = Math.floor(ctx.sampleRate * 0.05);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufferSize * 0.25));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(800 + Math.random() * 1200, popTime);

        const gain = ctx.createGain();
        const baseGain = (0.2 + Math.random() * 0.2) * this.volume;
        gain.gain.setValueAtTime(baseGain, popTime);
        gain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.06);

        // Low thud for larger blast
        if (i % 4 === 0 || i === numCrackles - 1) {
          const boomOsc = ctx.createOscillator();
          const boomGain = ctx.createGain();
          boomOsc.type = 'sine';
          boomOsc.frequency.setValueAtTime(140, popTime);
          boomOsc.frequency.exponentialRampToValueAtTime(40, popTime + 0.12);
          boomGain.gain.setValueAtTime(0.3 * this.volume, popTime);
          boomGain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.15);

          boomOsc.connect(boomGain);
          boomGain.connect(ctx.destination);
          boomOsc.start(popTime);
          boomOsc.stop(popTime + 0.18);
        }

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(popTime);
        noise.stop(popTime + 0.07);
      }
    } catch {
      // Audio fallback fail-safe
    }
  }

  /**
   * Festive victory fanfare melody
   */
  public playFanfare() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Traditional celebratory major fanfare: C5, E5, G5, high C6 chord
      const notes = [
        { f: 523.25, time: 0.0, dur: 0.15 },
        { f: 659.25, time: 0.15, dur: 0.15 },
        { f: 783.99, time: 0.3, dur: 0.2 },
        { f: 1046.50, time: 0.5, dur: 0.8 },
      ];

      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + note.time;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, t);

        gain.gain.setValueAtTime(0.28 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + note.dur + 0.05);
      });
    } catch {
      // Audio fallback fail-safe
    }
  }
}

export const soundEffects = new SoundManager();
