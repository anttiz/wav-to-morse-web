import AudioFile from './audioFile';
import DropElement from './dropElement';
import { IAudioToMorseParams } from './types/sharedTypes';

export default class Main {
  dz: DropElement | null = null;

  params: IAudioToMorseParams | null = null;

  constructor(props: IAudioToMorseParams) {
    this.params = props;
  }

  async processFileDrop(ev: DragEvent) {
    let file: File | null = null;
    if (ev.dataTransfer && ev.dataTransfer.items) {
      for (let i = 0; i < ev.dataTransfer.items.length; i += 1) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === 'file') {
          file = ev.dataTransfer.items[i].getAsFile();
          break;
        }
      }
    }
    if (file && file.type === 'audio/wav') {
      const ad = new AudioFile({ params: this.params!, file });
      await ad.processFile();
      // eslint-disable-next-line no-console
      console.log(ad.secret, ad.audioData);
    }
  }

  start() {
    this.dz = new DropElement(document.getElementById('drop-zone')!);
    this.dz.dropCb = this.processFileDrop.bind(this);
  }
}
