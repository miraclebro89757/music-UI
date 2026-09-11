/**
 * Web Audio Engine for Concert Music Player
 * Handles local audio files, live frequency analysis for visualizer,
 * and stadium acoustic reverb simulation.
 */

class AudioEngine {
  private audioContext: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private reverbConvolver: ConvolverNode | null = null;
  private dryGain: GainNode | null = null;
  private wetGain: GainNode | null = null;
  private synthGain: GainNode | null = null;
  private synthInterval: number | null = null;
  private isSynthMode: boolean = false;
  private stadiumEffectEnabled: boolean = true;
  private currentUrl: string | null = null;

  public init(): AudioContext {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  private setupNodes(): void {
    if (!this.audioContext) return;

    if (!this.analyserNode) {
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.analyserNode.smoothingTimeConstant = 0.8;
    }

    if (!this.dryGain) {
      this.dryGain = this.audioContext.createGain();
      this.dryGain.gain.value = 0.85;
    }

    if (!this.wetGain) {
      this.wetGain = this.audioContext.createGain();
      this.wetGain.gain.value = this.stadiumEffectEnabled ? 0.35 : 0.0;
    }

    if (!this.reverbConvolver) {
      this.reverbConvolver = this.createConcertHallImpulse(this.audioContext, 2.5, 2.0);
    }
  }

  /**
   * Generates a synthetic impulse response for a 50,000-person stadium / concert hall
   */
  private createConcertHallImpulse(ctx: AudioContext, duration: number, decay: number): ConvolverNode {
    const rate = ctx.sampleRate;
    const length = rate * duration;
    const impulse = ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = i / length;
      const envelope = Math.exp(-n * decay);
      left[i] = (Math.random() * 2 - 1) * envelope;
      right[i] = (Math.random() * 2 - 1) * envelope;
    }

    const convolver = ctx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  }

  public setStadiumEffect(enabled: boolean): void {
    this.stadiumEffectEnabled = enabled;
    if (this.wetGain) {
      this.wetGain.gain.setTargetAtTime(enabled ? 0.4 : 0.0, this.audioContext?.currentTime || 0, 0.1);
    }
  }

  public getStadiumEffect(): boolean {
    return this.stadiumEffectEnabled;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyserNode;
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyserNode) {
      return new Uint8Array(64).fill(10);
    }
    const data = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(data);
    return data;
  }

  /**
   * Plays a real audio URL (e.g. from local file object URL or direct audio link)
   */
  public loadAudio(url: string, onEnded?: () => void, onTimeUpdate?: (current: number, duration: number) => void): HTMLAudioElement {
    this.init();
    this.setupNodes();
    this.stopSynth();
    this.isSynthMode = false;

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous';
    }

    if (this.currentUrl !== url) {
      this.audioElement.src = url;
      this.currentUrl = url;
    }

    if (!this.sourceNode && this.audioContext && this.audioElement) {
      try {
        this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
        // Connect to analyser, dry gain, and wet reverb
        this.sourceNode.connect(this.analyserNode!);
        this.analyserNode!.connect(this.dryGain!);
        this.dryGain!.connect(this.audioContext.destination);

        if (this.reverbConvolver && this.wetGain) {
          this.analyserNode!.connect(this.reverbConvolver);
          this.reverbConvolver.connect(this.wetGain);
          this.wetGain.connect(this.audioContext.destination);
        }
      } catch (e) {
        console.warn('Audio source node connection note:', e);
      }
    }

    if (onEnded) {
      this.audioElement.onended = onEnded;
    }
    if (onTimeUpdate) {
      this.audioElement.ontimeupdate = () => {
        if (this.audioElement) {
          onTimeUpdate(this.audioElement.currentTime, this.audioElement.duration || 0);
        }
      };
    }

    return this.audioElement;
  }

  public async play(): Promise<void> {
    this.init();
    if (this.isSynthMode) {
      this.startSynth();
      return;
    }
    if (this.audioElement) {
      try {
        await this.audioElement.play();
      } catch (err) {
        console.warn('Auto-play restriction:', err);
      }
    } else {
      this.startSynth();
    }
  }

  public pause(): void {
    if (this.isSynthMode) {
      this.stopSynth();
      return;
    }
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  public seek(seconds: number): void {
    if (this.audioElement && !this.isSynthMode) {
      this.audioElement.currentTime = seconds;
    }
  }

  public setVolume(val: number): void {
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, val));
    }
    if (this.dryGain) {
      this.dryGain.gain.value = val * 0.85;
    }
  }

  /**
   * Synthetic ambient concert soundscape when no local file is attached yet.
   * Generates warm stadium concert chords + gentle live audience reverberation.
   */
  public startSynth(): void {
    this.init();
    this.setupNodes();
    this.isSynthMode = true;

    if (this.synthInterval) return;

    if (!this.synthGain && this.audioContext) {
      this.synthGain = this.audioContext.createGain();
      this.synthGain.gain.value = 0.25;
      if (this.analyserNode) {
        this.synthGain.connect(this.analyserNode);
        this.analyserNode.connect(this.dryGain!);
        this.dryGain!.connect(this.audioContext.destination);

        if (this.reverbConvolver && this.wetGain) {
          this.analyserNode.connect(this.reverbConvolver);
          this.reverbConvolver.connect(this.wetGain);
          this.wetGain.connect(this.audioContext.destination);
        }
      }
    }

    const chords = [
      [220.0, 277.18, 329.63, 440.0], // A Major chord
      [164.81, 220.0, 246.94, 329.63], // E/G# chord
      [146.83, 220.0, 293.66, 369.99], // D Major chord
      [174.61, 220.0, 261.63, 349.23], // F#m chord
    ];

    let chordIndex = 0;

    const playChord = () => {
      if (!this.audioContext || !this.isSynthMode || !this.synthGain) return;
      const chord = chords[chordIndex % chords.length];
      chordIndex++;

      const now = this.audioContext.currentTime;

      chord.forEach((freq) => {
        if (!this.audioContext) return;
        const osc = this.audioContext.createOscillator();
        const noteGain = this.audioContext.createGain();

        // Warm sine + triangle harmonics
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.12, now + 0.6);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

        osc.connect(noteGain);
        noteGain.connect(this.synthGain);

        osc.start(now);
        osc.stop(now + 3.3);
      });
    };

    playChord();
    this.synthInterval = window.setInterval(playChord, 3200);
  }

  public stopSynth(): void {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.isSynthMode = false;
  }
}

export const audioEngine = new AudioEngine();
