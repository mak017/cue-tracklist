import { TrackProps } from '../types';
import { calculateTotalTime } from '../utils/TimeUtils';
import Track from './Track';
import './Tracklist.css';

type TracklistProps = { tracks: TrackProps[] };

const Tracklist = ({ tracks }: TracklistProps) => {
  const tracksCount = tracks.length;
  const maxTrackNumberDigits = `${tracks[tracksCount - 1].trackNumber}`.length;

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
          />
        ))}
        <div className="tracklist-footer">
          <span>Total playing time:</span>
          <span>{calculateTotalTime(tracks)}</span>
        </div>
      </div>
    )
  );
};

export default Tracklist;
