// Web Audio API procedural sound generator for realistic soft book page turns

class SoundEffects {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policies
  }

  private getContext(): AudioContext | null {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playPageTurn() {
    if (this.isMuted) return;

    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const duration = 0.35;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate brown/pinkish textured noise for paper friction
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Low pass filter white noise to brown noise
        lastOut = (lastOut + 0.04 * white) / 1.04;
        data[i] = lastOut * 3.5;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter to simulate crisp paper texture
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(900, ctx.currentTime);
      bandpass.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + duration);
      bandpass.Q.setValueAtTime(1.8, ctx.currentTime);

      // Highpass to eliminate heavy thuds
      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(250, ctx.currentTime);

      // Gain envelope
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      noise.connect(bandpass);
      bandpass.connect(highpass);
      highpass.connect(gainNode);
      gainNode.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext failure gracefully ignored
    }
  }

  public playBookOpen() {
    if (this.isMuted) return;

    try {
      const ctx = this.getContext();
      if (!ctx) return;

      // Soft deep hardcover creak and whoosh
      const duration = 0.55;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.03 * white) / 1.03;
        data[i] = lastOut * 4;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.25);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + duration);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + duration);
    } catch {
      // Ignore
    }
  }
}

export const soundEffects = new SoundEffects();
