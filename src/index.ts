import './public/styles/styles.css';
import { IAudioToMorseParams } from './types/sharedTypes';
import Main from './main';

const params: IAudioToMorseParams = {
  maxRoundsToZero: 0.05, // if value is less than this, it is considered silence
  sampleLengthMs: 10, // sample length in milliseconds
  morseDihMaxPercentageOfDah: 45, // dih must be less than 45% of length of dah
  smallBreakPercentageOfWordBreak: 20, // small break must be less than 20% of word break
  charBreakPercentageOfWordBreak: 50, // char break must be less than 50% of word break
};

window.addEventListener('DOMContentLoaded', () => {
  const m = new Main(params);
  m.start();
});
