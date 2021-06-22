import { useState } from 'react';
import { TrackProps } from '../types';
import { calculateTotalTime } from '../utils/TimeUtils';
import Track from './Track';
import './Tracklist.css';

type TracklistProps = {
  tracks: TrackProps[];
  setPasteTracklist: (arg: boolean) => void;
  setParsedTracks: (arg: TrackProps[]) => void;
};

const Tracklist = ({ tracks, setPasteTracklist, setParsedTracks }: TracklistProps) => {
  const [isPreSaved, setIsPreSaved] = useState(false);
  const [isShowTime, setIsShowTime] = useState(false);
  const tracksCount = tracks.length;
  const maxTrackNumberDigits = `${tracks[tracksCount - 1].trackNumber}`.length;
  const totalTime = calculateTotalTime(tracks);
  const isShowTotalTime = totalTime !== '00:00';

  const onPreSave = () => {
    setPasteTracklist(false);
    setIsPreSaved(true);
  };

  const updateTrackByTrackNumber = (trackData: TrackProps): void => {
    const tracksUpdated = tracks.map((track) => {
      if (track.trackNumber === trackData.trackNumber) {
        return trackData;
      }
      return track;
    });
    setParsedTracks(tracksUpdated);
  };

  return (
    tracks && (
      <div className="tracklist">
        {tracks.map((track) => (
          <Track
            trackNumber={`${track.trackNumber}`.padStart(maxTrackNumberDigits, '0')}
            performer={track.performer}
            title={track.title}
            duration={track.duration}
            time={track.time}
            key={track.trackNumber}
            isPreSaved={isPreSaved}
            isShowTime={isShowTime}
            updateTrack={updateTrackByTrackNumber}
          />
        ))}
        {isShowTotalTime && (
          <div className="tracklist-footer">
            <span>Total playing time:</span>
            <span>{totalTime}</span>
          </div>
        )}
        <div className="tracklist-buttons">
          {isShowTotalTime && (
            <button onClick={() => setIsShowTime(!isShowTime)}>{`${
              isShowTime ? 'Hide' : 'Show'
            } timestamps`}</button>
          )}
          {!isPreSaved && <button onClick={onPreSave}>Pre-Save</button>}
        </div>
      </div>
    )
  );
};

export default Tracklist;
