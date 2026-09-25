// High fidelity Web Audio ambient synthesizer + HTMLAudioElement manager
// Allows seamless auto play, auto-next song, and playlist looping with real music files

type LoopMode = 'all' | 'one' | 'off';

class AudioController {
  private audioCtx: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private synthGainNode: GainNode | null = null;
  private isSynthPlaying = false;
  private synthInterval: any = null;
  private volume = 0.5;
  private loopMode: LoopMode = 'all';
  private isMuted = false;
  private onEndedCallback: (() => void) | null = null;
  private onTimeUpdateCallback: ((current: number, duration: number) => void) | null = null;
  private autoPlayUnlocked = false;
  private currentStreamUrl: string = '';

  constructor() {
    this.setupAutoplayUnlock();
  }

  private initAudio() {
    if (!this.audioElement && typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.audioElement.preload = 'auto';
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
      this.audioElement.loop = this.loopMode === 'one';

      this.audioElement.addEventListener('ended', () => {
        if (this.loopMode === 'one') {
          // Handled natively by audioElement.loop
          return;
        }
        if (this.onEndedCallback) {
          this.onEndedCallback();
        }
      });

      this.audioElement.addEventListener('timeupdate', () => {
        if (this.onTimeUpdateCallback && this.audioElement) {
          this.onTimeUpdateCallback(
            this.audioElement.currentTime || 0,
            this.audioElement.duration || 0
          );
        }
      });

      this.audioElement.addEventListener('loadedmetadata', () => {
        if (this.onTimeUpdateCallback && this.audioElement) {
          this.onTimeUpdateCallback(
            this.audioElement.currentTime || 0,
            this.audioElement.duration || 0
          );
        }
      });
    }
  }

  // Automatically unlocks audio playback on first interaction if blocked by browser policy
  private setupAutoplayUnlock() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      this.autoPlayUnlocked = true;

      // Resume AudioContext if suspended
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }

      // If audio element is paused but has a stream set, trigger play
      if (this.audioElement && this.audioElement.paused && this.currentStreamUrl) {
        this.audioElement.play().catch(() => {});
      }

      // Remove listeners once unlocked
      ['click', 'touchstart', 'pointerdown', 'keydown'].forEach(evt => {
        window.removeEventListener(evt, unlock);
      });
    };

    ['click', 'touchstart', 'pointerdown', 'keydown'].forEach(evt => {
      window.addEventListener(evt, unlock, { once: true, passive: true });
    });
  }

  public setOnEnded(callback: () => void) {
    this.onEndedCallback = callback;
  }

  public setOnTimeUpdate(callback: (current: number, duration: number) => void) {
    this.onTimeUpdateCallback = callback;
  }

  public playStream(url: string, onFallback?: () => void): Promise<boolean> {
    this.initAudio();
    if (!this.audioElement) return Promise.resolve(false);

    this.stopSynth();
    this.currentStreamUrl = url;

    // Only update src if different to avoid reloading track from start unnecessarily
    if (this.audioElement.src !== new URL(url, window.location.href).href) {
      this.audioElement.src = url;
    }

    this.audioElement.volume = this.isMuted ? 0 : this.volume;
    this.audioElement.loop = this.loopMode === 'one';

    return this.audioElement.play().then(() => {
      this.autoPlayUnlocked = true;
      return true;
    }).catch(err => {
      console.warn('Autoplay waiting for user gesture:', err);
      if (onFallback) onFallback();
      return false;
    });
  }

  public pause() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopSynth();
  }

  public resume(): Promise<boolean> {
    this.stopSynth();
    if (this.audioElement && this.currentStreamUrl) {
      return this.audioElement.play().then(() => true).catch(() => {
        return false;
      });
    }
    return Promise.resolve(false);
  }

  public seek(seconds: number) {
    if (this.audioElement && !isNaN(seconds)) {
      this.audioElement.currentTime = seconds;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }
    if (this.synthGainNode && this.audioCtx) {
      this.synthGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.15, this.audioCtx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.setVolume(this.volume);
    return this.isMuted;
  }

  public setLoopMode(mode: LoopMode) {
    this.loopMode = mode;
    if (this.audioElement) {
      this.audioElement.loop = mode === 'one';
    }
  }

  public getLoopMode(): LoopMode {
    return this.loopMode;
  }

  public stopSynth() {
    this.isSynthPlaying = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }
}

export const globalAudioController = new AudioController();
