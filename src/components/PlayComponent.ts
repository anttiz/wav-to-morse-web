/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IAudioFileData } from '../types/sharedTypes';

@customElement('play-component')
export class PlayComponent extends LitElement {
  @property()
    audioData: IAudioFileData | null = null;

  @state()
    playing: boolean = false;

  @state()
    currentTime: number = 0;

  audioSource: AudioBufferSourceNode | null = null;

  timerHandle: NodeJS.Timer | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('audioDataReceived', (ev) => this.handleAudioDataReceived(ev));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('audioDataReceived', (ev) => this.handleAudioDataReceived(ev));
  }

  handleAudioDataReceived(ev: Event) {
    this.stopAll();
    this.currentTime = 0;
    const cev = ev as CustomEvent;
    this.audioData = cev.detail as IAudioFileData;
  }

  createRenderRoot() {
    return this; // turn off shadow dom to access external styles
  }

  /**
   * Starts timer where in the timeout current time is updated and
   * current Morse code spot event is sent
   *
   * @memberof PlayComponent
   */
  startTimer() {
    const ctx = this.audioData!.audioCtx;
    this.timerHandle = setInterval(() => {
      if (this.playing) {
        this.currentTime = ctx.currentTime;
      }
      if (this.currentTime > this.audioData!.ab.duration) {
        this.stop();
      } else if (this.audioData?.valid) {
        this.calculateCurrentSpot();
      }
    }, 1000);
  }

  /**
   * Stops update timer
   */
  stopTimer() {
    if (this.timerHandle) {
      const ctx = this.audioData!.audioCtx;
      this.currentTime = ctx.currentTime;
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
  }

  /**
   * Stops playing and clears audio source
   */
  stopAll() {
    this.stop();
    if (this.audioSource) {
      this.audioSource.disconnect();
      this.audioSource.stop(0);
      this.audioSource = null;
    }
    this.sendMorseEventWithText('');
  }

  /**
   * Starts playing audio file.
   */
  start() {
    if (this.audioData) {
      const endPassed = this.currentTime > this.audioData!.ab.duration;
      if (endPassed) {
        // no support to continue after end has been reached at the moment
        this.stopAll();
        return;
      }
      const ctx = this.audioData.audioCtx;
      if (this.currentTime !== 0) {
        this.currentTime = ctx.currentTime;
      }
      if (!this.audioSource) {
        this.audioSource = ctx.createBufferSource();
        this.audioSource.buffer = this.audioData.ab;
        this.audioSource.connect(this.audioData.audioCtx.destination);
        this.audioSource.start(0, this.currentTime);
      }
      ctx.resume().then(() => {
        this.startTimer();
        this.playing = true;
      });
    }
  }

  /**
   * Pause audio file playing.
   */
  stop() {
    if (this.audioData) {
      const ctx = this.audioData.audioCtx;
      this.playing = false;
      this.stopTimer();
      if (ctx.state === 'running') {
        ctx.suspend();
      }
    }
  }

  /**
   * Handle play button press
   */
  togglePlay() {
    if (this.audioData) {
      if (!this.playing) {
        this.start();
      } else {
        this.stop();
      }
    }
  }

  /**
   * Calculate where audio is playing so that Morse code Follow component can
   * be updated to know where the current Morse spot is.
   */
  calculateCurrentSpot() {
    const passedSequence = [];
    const totalSum = this.audioData!.morseWithTime.reduce((acc, curr) => acc + curr.amount, 0);
    const fractionListened = Math.min(1, this.currentTime / this.audioData!.ab.duration);
    let sum = 0;
    let i = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (i < this.audioData!.morseWithTime.length) {
        const el = this.audioData!.morseWithTime[i];
        sum += el.amount;
        if (sum / totalSum <= fractionListened) {
          passedSequence.push(el);
        } else {
          break;
        }
        i += 1;
      }
    }
    // remove from the end until it is whole character
    while (passedSequence.length
      && (passedSequence[passedSequence.length - 1].char === 'cb'
      || passedSequence[passedSequence.length - 1].char === 'wb'
      || passedSequence[passedSequence.length - 1].char === 'end')) {
      passedSequence.pop();
    }
    // construct string of Morse code
    const current = passedSequence.reduce((acc, curr) => {
      if (curr.char === 'dih') {
        return `${acc}.`;
      }
      if (curr.char === 'dah') {
        return `${acc}-`;
      }
      if (curr.char === 'cb') {
        return `${acc}${' '.repeat(2)}`;
      }
      if (curr.char === 'wb') {
        return `${acc}${' '.repeat(8)}`;
      }
      return acc;
    }, '');
    this.sendMorseEventWithText(current);
  }

  /**
   * Send event about current Morse code
   * @param text {string} current Morse code
   */
  sendMorseEventWithText(text: string) {
    const options = {
      detail: text,
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('morseEvent', options));
  }

  /**
   * Render current HTML
   */
  render() {
    if (!this.audioData) {
      return html`
        <div class="flex basis-1 items-center justify-center rounded-lg m-2 h-40 border-2 border-gray-500 bg-white">
          <h1>Play it</h1>
        </div>
      `;
    }
    const icon = this.playing
      ? html`<i class="fa fa-pause fa-2x text-white"></i>`
      : html`<i class="fa fa-play fa-2x text-white"></i>`;
    return html`
      <div class="flex basis-1 items-center justify-center rounded-lg m-2 h-40 border-2 border-gray-500 bg-white">
        <div class="flex flex-col justify-center items-center h-screen">
          <button @click=${this.togglePlay} class="w-16 h-16 rounded-full bg-violet-500">
            ${icon}
          </button>
          <div>
            <span>${(this.currentTime).toFixed(0)}</span>
          </div>
        </div>
      </div>
    `;
  }
}
