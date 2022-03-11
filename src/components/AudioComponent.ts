/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IAudioFileData } from '../types/sharedTypes';

@customElement('audio-component')
export class AudioComponent extends LitElement {
  @property()
    audioData: IAudioFileData | null = null;

  audioSource: AudioBufferSourceNode | null = null;

  constructor() {
    super();
    window.addEventListener('audioDataReceived', (ev) => this.handleAudioDataReceived(ev));
  }

  private handleAudioDataReceived(ev:Event) {
    const cev = ev as CustomEvent;
    this.audioData = cev.detail as IAudioFileData;
  }

  createRenderRoot() {
    return this; // turn off shadow dom to access external styles
  }

  render() {
    if (!this.audioData) {
      return html`
        <div class="flex basis-1/2 items-center justify-center rounded-lg h-40 min-h-max m-2 border-2 border-gray-500 bg-white">
          <h1>Result</h1>
        </div>
      `;
    }
    const secret = this.audioData.valid ? this.audioData.secret : 'Could not decode message from file!';
    return html`
      <div class="flex basis-1/2 rounded-lg h-40 min-h-max m-2 border-2 border-gray-500 bg-white">
        <div class="flex flex-col">
          <div class="flex basis1/2 p-1 flex-col">
            <span class="font-semibold">File:</span>
            <span class="text-xs">${this.audioData.file.name}</span>
          </div>
          <div class="flex basis1/2 p-1 flex-col">
            <span class="font-semibold">Secret:&nbsp;</span>
            <span class="text-xs">${secret}</span>
          </div>
        </div>
    `;
  }
}
