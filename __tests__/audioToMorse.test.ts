import fs from 'fs';
import path from 'path';
import { IAudioToMorseParams } from '../src/types/sharedTypes';
import { processChannelData, setParams } from '../src/audioToMorse';

const WavDecoder = require('wav-decoder');

describe('audioToMorse tests', () => {
  it('audioToMorse tests', async () => {
    const buffer = fs.readFileSync(path.join(__dirname, '../input/message.wav'), null);
    const audioData = await WavDecoder.decode(buffer);
    expect(audioData.numberOfChannels).toStrictEqual(1);
    const data: number[] = audioData.channelData[0];
    const fa = Float32Array.from(data);

    const params: IAudioToMorseParams = {
      maxRoundsToZero: 0.05,
      sampleLengthMs: 10,
      morseDihMaxPercentageOfDah: 45,
      smallBreakPercentageOfWordBreak: 20,
      charBreakPercentageOfWordBreak: 50,
    };
    setParams(params);
    const blockSize = 480;
    const ad = await processChannelData(fa, blockSize);
    expect(typeof ad.secret).toStrictEqual('string');
    expect(ad.secret.length).toStrictEqual(65);
    // NOTE: actual result could be shown and tested here but is not
    // as it would reveal secret message.
  });
});
