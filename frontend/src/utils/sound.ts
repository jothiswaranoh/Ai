/**
 * Audio chime synthesizer using Web Audio API.
 * Synthesizes a clean, pleasant notification sound with zero external audio dependencies.
 * Fully supported in all modern browsers without CORS or network latency issues.
 */

class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Plays a pleasant double-note ascending chime (perfect for success/transaction confirmations).
   */
  playSuccess() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Note 1: E5 (659.25 Hz)
      // Note 2: B5 (987.77 Hz)
      const notes = [
        { freq: 659.25, time: now, duration: 0.22, gain: 0.18 },
        { freq: 987.77, time: now + 0.11, duration: 0.38, gain: 0.22 },
      ];

      notes.forEach(({ freq, time, duration, gain }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        // Gentle attack
        gainNode.gain.setValueAtTime(0.0001, time);
        gainNode.gain.linearRampToValueAtTime(gain, time + 0.02);
        // Exponential decay
        gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + duration + 0.05);
      });
    } catch (err) {
      console.warn('Audio playback error (can be ignored):', err);
    }
  }

  /**
   * Plays a subtle notification bell.
   */
  playNotification() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.1); // G5

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (err) {
      console.warn('Notification sound error:', err);
    }
  }
}

export const soundEffects = new SoundEffects();

export function playNotificationSound() {
  soundEffects.playSuccess();
}
