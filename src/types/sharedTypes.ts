export interface IAudioToMorseParams {
  maxRoundsToZero: number;
  sampleLengthMs: number;
  morseDihMaxPercentageOfDah: number;
  smallBreakPercentageOfWordBreak: number;
  charBreakPercentageOfWordBreak: number;
  soundMinDuration: number;
  soundMaxDuration: number;
}

export interface IProcessFileParams {
  params: IAudioToMorseParams;
  file: File;
}

export interface IValueAmount {
  value: number;
  amount: number;
}

export type MorseSequenceCharacter = 'cb' | 'wb' | 'dih' | 'dah' | '-' | 'start' | 'end';

export interface IMorseWithTime {
  char: MorseSequenceCharacter;
  amount: number;
}

export interface IAudioFileChannelData {
  valid: boolean;
  secret: string;
  morse: MorseSequenceCharacter[];
  morseWithTime: IMorseWithTime[];
  sequence: IValueAmount[];
}

export interface IAudioFileData {
  valid: boolean;
  secret: string;
  file: File;
  morse: MorseSequenceCharacter[];
  morseWithTime: IMorseWithTime[];
  ab: AudioBuffer;
  audioCtx: AudioContext;
  sequence: IValueAmount[];
}
