export interface IAudioToMorseParams {
  maxRoundsToZero: number;
  sampleLengthMs: number;
  morseDihMaxPercentageOfDah: number;
  smallBreakPercentageOfWordBreak: number;
  charBreakPercentageOfWordBreak: number;
}

export interface IProcessFileParams {
  params: IAudioToMorseParams;
  file: File;
}

export interface IValueAmount {
  value: number;
  amount: number;
}

export type MorseSequenceCharacter = 'cb' | 'wb' | 'dih' | 'dah' | '-';

export interface IAudioFileData {
  secret: string;
  file: File;
  morse: MorseSequenceCharacter[];
  ab: AudioBuffer;
  audioCtx: AudioContext;
}
