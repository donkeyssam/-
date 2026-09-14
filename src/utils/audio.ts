// Web Audio & Speech Synthesizer for Interactive Prompting

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private ttsEnabled: boolean = true;
  private naturalVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.initVoice();
  }

  private initVoice() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const koVoices = voices.filter(v => v.lang === 'ko-KR' || v.lang.startsWith('ko'));
        if (koVoices.length > 0) {
          // 자연스러운 고품질 신경망/자연어 음성 우선 선택 (Natural, Neural, Google, Yuna, Heami, Seoyeon, Sora 등)
          const preferred = koVoices.find(v => 
            /natural|neural|online|google|유나|yuna|혜미|heami|서연|seoyeon|소라|sora/i.test(v.name)
          ) || koVoices.find(v => !v.localService) || koVoices[0];
          this.naturalVoice = preferred;
        }
      };

      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setTtsEnabled(enabled: boolean) {
    this.ttsEnabled = enabled;
  }

  public playSound(type: 'roll' | 'step' | 'correct' | 'wrong' | 'victory' | 'click' | 'clap') {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'roll') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'step') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(460, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'correct') {
      // 3-tone arpeggio (C5 - E5 - G5 - C6)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, now + idx * 0.08);
        g.gain.setValueAtTime(0.2, now + idx * 0.08);
        g.gain.linearRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
        o.start(now + idx * 0.08);
        o.stop(now + idx * 0.08 + 0.25);
      });
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(160, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'victory') {
      // Fanfare notes
      const fanfare = [523.25, 523.25, 523.25, 659.25, 783.99, 1046.5];
      const times = [0, 0.15, 0.3, 0.45, 0.65, 0.9];
      const durations = [0.12, 0.12, 0.12, 0.18, 0.22, 0.6];
      fanfare.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, now + times[idx]);
        g.gain.setValueAtTime(0.25, now + times[idx]);
        g.gain.linearRampToValueAtTime(0.001, now + times[idx] + durations[idx]);
        o.start(now + times[idx]);
        o.stop(now + times[idx] + durations[idx]);
      });
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'clap') {
      // 찰진 손뼉 소리 합성
      const bufferSize = Math.floor(ctx.sampleRate * 0.12);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, now);
      filter.Q.setValueAtTime(2.0, now);
      const clapGain = ctx.createGain();
      clapGain.gain.setValueAtTime(0.4, now);
      clapGain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);
      noise.connect(filter);
      filter.connect(clapGain);
      clapGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.12);
    }
  }

  public speak(text: string) {
    if (!this.ttsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      if (this.naturalVoice) {
        utterance.voice = this.naturalVoice;
      } else {
        const voices = window.speechSynthesis.getVoices();
        const koVoice = voices.find(v => v.lang === 'ko-KR' || v.lang.startsWith('ko'));
        if (koVoice) utterance.voice = koVoice;
      }
      utterance.rate = 0.92; // 0.92 속도로 더 자연스러운 억양 형성
      utterance.pitch = 1.02; // 자연스러운 친근한 톤
      window.speechSynthesis.speak(utterance);
    } catch {
      // Audio speech ignore error
    }
  }
}

export const soundManager = new SoundManager();

// 음절 결합 헬퍼 (초성+중성 문자열과 종성 문자를 합침)
export function composeSyllable(onsetVowelStr: string, finalChar: string): string {
  const finals = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const charCode = onsetVowelStr.charCodeAt(onsetVowelStr.length - 1);
  const finalIdx = finals.indexOf(finalChar);

  if (charCode >= 0xac00 && charCode <= 0xd7a3 && finalIdx !== -1) {
    const baseCode = charCode - ((charCode - 0xac00) % 28);
    return String.fromCharCode(baseCode + finalIdx);
  }
  return onsetVowelStr + finalChar;
}
