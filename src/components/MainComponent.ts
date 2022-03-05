/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { processAudioFile } from '../audioToMorse';
import { IAudioToMorseParams } from '../types/sharedTypes';

@customElement('main-component')
export class MainComponent extends LitElement {
  private params: IAudioToMorseParams = {
    maxRoundsToZero: 0.05, // if value is less than this, it is considered silence
    sampleLengthMs: 10, // sample length in milliseconds
    morseDihMaxPercentageOfDah: 45, // dih must be less than 45% of length of dah
    smallBreakPercentageOfWordBreak: 20, // small break must be less than 20% of word break
    charBreakPercentageOfWordBreak: 50, // char break must be less than 50% of word break
  };

  createRenderRoot() {
    return this; // turn off shadow dom to access external styles
  }

  /**
   * Handle file drop event. Process audio file and inform that new audio file is received
   * @param ev Custom event
   */
  async fileDropHandler(ev: CustomEvent) {
    const orig = ev.detail as DragEvent;
    let file: File | null = null;
    if (orig.dataTransfer && orig.dataTransfer.items) {
      for (let i = 0; i < orig.dataTransfer.items.length; i += 1) {
        // If dropped items aren't files, reject them
        if (orig.dataTransfer.items[i].kind === 'file') {
          file = orig.dataTransfer.items[i].getAsFile();
          break;
        }
      }
    }

    if (file && file.name.toLocaleLowerCase().includes('.wav')) {
      const audioData = await processAudioFile({ params: this.params!, file });
      const options = {
        detail: audioData,
        bubbles: true,
        composed: true,
      };
      this.dispatchEvent(new CustomEvent('audioDataReceived', options));
    }
  }

  /**
   * Render
   */
  render() {
    return html`
      <div class="container mx-auto max-w-screen-md">
        <div class="grid grid-cols-2 p-1">
          <drop-zone @dropped=${this.fileDropHandler}></drop-zone>
          <audio-component></audio-component>
          <play-component></play-component>
          <div class="flex basis-1/2 items-center justify-center rounded-lg h-40 m-2 border-2 border-gray-500 bg-white">
            <h1 class="text-gray-400">Staircase graph could be here</h1>
          </div>
        </div>
        <div class="grid grid-cols-1 p-1">
          <follow-component></follow-component>
        </div>
      </div>
    `;
  }
}
