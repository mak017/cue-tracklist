import { useRef } from 'react';
import ContentEditable from 'react-contenteditable';
import { TrackProps } from '../types';
import './Track.css';

interface TrackComponentProps extends Omit<TrackProps, 'trackNumber'> {
  trackNumber: string;
  isPreSaved: boolean;
  isShowTime: boolean;
  updateTrack: (trackData: TrackProps) => void;
}

const Track = ({
  trackNumber,
  performer,
  title,
  duration,
  time,
  isPreSaved,
  isShowTime,
  updateTrack,
}: TrackComponentProps) => {
  const artistRef = useRef(performer || '');
  const titleRef = useRef(title || '');

  const onChange = (type: 'artist' | 'title', value: string): void => {
    if (type === 'artist') {
      artistRef.current = value;
    } else {
      titleRef.current = value;
    }
  };

  const onBlur = () => {
    updateTrack({
      trackNumber: +trackNumber,
      performer: artistRef.current,
      title: titleRef.current,
      duration,
    });
  };

  return (
    <div className="track">
      {isShowTime && <span className="track-time">[{time}]</span>}
      <span className="track-number">{trackNumber}.</span>
      {performer && (
        <>
          {!isPreSaved ? (
            <span className="track-artist">{performer}</span>
          ) : (
            <ContentEditable
              html={artistRef.current}
              tagName="span"
              onChange={(event) => onChange('artist', event.target.value)}
              onBlur={onBlur}
            />
          )}
          <span className="track-divider"></span>
        </>
      )}
      {!isPreSaved ? (
        <span className="track-title">{title}</span>
      ) : (
        <ContentEditable
          html={titleRef.current}
          tagName="span"
          onChange={(event) => onChange('title', event.target.value)}
          onBlur={onBlur}
        />
      )}
      <span className="track-length">({duration})</span>
    </div>
  );
};

export default Track;
