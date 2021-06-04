import { TrackProps } from '../types';

const toSeconds = (time: string): number => {
  const timeSplitted = time.split(':');
  return +timeSplitted[0] * 60 + +timeSplitted[1];
};

const formatSecondsToString = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs}`;
};

export const calculateTotalTime = (tracks: Array<TrackProps>) => {
  const totalSeconds = tracks.reduce((acc, track) => {
    const seconds = track.duration && toSeconds(track.duration);
    return seconds ? acc + seconds : acc;
  }, 0);
  return formatSecondsToString(totalSeconds);
};
