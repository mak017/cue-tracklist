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
  const tracksCount = tracks.length;
  const maxTrackNumberDigits = `${tracks[tracksCount - 1].trackNumber}`.length;

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
            key={track.trackNumber}
            isPreSaved={isPreSaved}
            updateTrack={updateTrackByTrackNumber}
          />
        ))}
        <div className="tracklist-footer">
          <span>Total playing time:</span>
          <span>{calculateTotalTime(tracks)}</span>
        </div>
        <button onClick={onPreSave}>Pre-Save</button>
      </div>
    )
  );
};

export default Tracklist;
