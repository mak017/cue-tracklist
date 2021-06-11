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

/**
 * Accept time in format either hr:mn:sc or mn:sc
 *
 * @param {String}
 * @returns mn:sc:fr
 */
export const castTime = (value: string, isLength: boolean = false) => {
  let castTime = !isLength ? '00:00:00' : '00:00';
  value = value.trim();

  const pattern = /^\d{1,4}:\d{2}:\d{2}$/;
  const matches = value.match(pattern);
  if (matches) {
    const times = value.split(':');
    const hrParsed = parseInt(times[0], 10);
    const mnParsed = parseInt(times[1], 10);
    const sc = times[2].padStart(2, '0');
    const mn = String(hrParsed * 60 + mnParsed).padStart(2, '0');
    castTime = !isLength ? `${mn}:${sc}:00` : `${mn}:${sc}`;
  } else {
    const pattern = /(^\d{1,4}):(\d{2})$/;
    const matches = value.match(pattern);
    if (matches) {
      const mn = matches[1].padStart(2, '0');
      const sc = matches[2].padStart(2, '0');
      castTime = !isLength ? `${mn}:${sc}:00` : `${mn}:${sc}`;
    }
  }

  return castTime;
};

export const calculateTotalTime = (tracks: Array<TrackProps>) => {
  const totalSeconds = tracks.reduce((acc, track) => {
    const seconds = track.duration && toSeconds(track.duration);
    return seconds ? acc + seconds : acc;
  }, 0);
  return castTime(formatSecondsToString(totalSeconds), true);
};

export const addTime = (a: string, b: string) => {
  const seconds = toSeconds(a) + toSeconds(b);
  return castTime(formatSecondsToString(seconds), true);
};
