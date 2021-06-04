import { TrackProps } from '../types';
import './Track.css';

interface TrackComponentProps extends Omit<TrackProps, 'trackNumber'> {
  trackNumber: string;
}

const Track = ({ trackNumber, performer, title, duration }: TrackComponentProps) => {
  return (
    <div className="track">
      <span className="track-number">{trackNumber}.</span>
      {performer && (
        <>
          <span className="track-artist">{performer}</span>
          <span className="track-divider"></span>
        </>
      )}
      <span className="track-title">{title}</span>
      <span className="track-length">({duration})</span>
    </div>
  );
};

export default Track;
