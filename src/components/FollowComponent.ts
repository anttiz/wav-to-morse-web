/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('follow-component')
export class FollowComponent extends LitElement {
  @state()
    morse: string = '';

  /**
   * Add event listener in mount function
   */
  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('morseEvent', (ev) => this.handleMorseReceived(ev));
  }

  /**
   * Remove event listener in unmount function
   */
  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('morseEvent', (ev) => this.handleMorseReceived(ev));
  }

  /**
   * Handle event about receiving new Morse code text
   * @param ev Event
   */
  handleMorseReceived(ev: Event) {
    const cev = ev as CustomEvent;
    this.morse = (cev.detail as string).replace(/ /g, '\u00A0');
  }

  createRenderRoot() {
    return this; // turn off shadow dom to access external styles
  }

  render() {
    if (!this.morse) {
      return html`
        <div class="flex basis-1 items-center justify-center rounded-lg m-2 h-80 border-2 border-gray-500 bg-white">
          <h1>Morse code</h1>
        </div>
      `;
    }
    return html`
      <div class="flex basis-1 rounded-lg m-2 h-80 border-2 border-gray-500 p-4 bg-white">
        <span>${this.morse}</span>
      </div>
    `;
  }
}
