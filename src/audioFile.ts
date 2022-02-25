import { processAudioFile } from './audioToMorse';
import { IAudioFileData, IProcessFileParams } from './types/sharedTypes';

export default class AudioFile {
  params: IProcessFileParams;

  fileData: IAudioFileData | null = null;

  constructor(processParams: IProcessFileParams) {
    this.params = processParams;
  }

  async processFile() {
    this.fileData = await processAudioFile(this.params);
  }

  get secret() {
    if (this.fileData) {
      return this.fileData.secret;
    }
    return '';
  }

  get audioData() {
    return (this.fileData);
  }
}
