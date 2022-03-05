/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('drop-zone')
export class DropZone extends LitElement {
  @state()
  private classStr = 'flex basis-1 items-center justify-center rounded-lg m-2 h-40 border-dashed border-2 border-gray-500 bg-white';

  createRenderRoot() {
    return this; // turn off shadow dom to access external styles
  }

  onDrop(ev:DragEvent) {
    this.toggleClass('bg-green-500');
    this.toggleClass('bg-white');
    ev.preventDefault();
    const options = {
      detail: ev,
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('dropped', options));
  }

  static dragOverHandler(ev:DragEvent) {
    ev.preventDefault();
  }

  toggleClass(cl:string) {
    if (this.classStr.includes(cl)) {
      this.classStr = this.classStr.replace(cl, '');
    } else {
      this.classStr += ` ${cl}`;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dragEnterHandler(ev:DragEvent) {
    this.toggleClass('bg-white');
    this.toggleClass('bg-green-500');
  }

  dragLeaveHandler(ev:DragEvent) {
    this.toggleClass('bg-green-500');
    this.toggleClass('bg-white');
    ev.preventDefault();
  }

  render() {
    return html`
      <div
        @drop=${this.onDrop}
        @dragover=${DropZone.dragOverHandler}
        @dragenter=${this.dragEnterHandler}
        @dragleave=${this.dragLeaveHandler}
        class=${this.classStr}>
        <h1>Drag WAV file here</h1>
      </div>
    `;
  }
}
