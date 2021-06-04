import React, { useState } from 'react';
import { debounce } from 'ts-debounce';
import Tracklist from './Tracklist';
import Parser, { ParserHelper } from '../utils/Parser';
import { TrackProps } from '../types';
import './Layout.css';

const Layout = () => {
  const [isPasteTracklist, setIsPasteTracklist] = useState(false);
  const [pastedTracklistValue, setPastedTracklistValue] = useState('');
  const [parsedTracks, setParsedTracks] = useState<TrackProps[]>([]);
  const parser = new Parser(new ParserHelper());
  const debouncedTLParser = debounce(parser.parseTrackList, 300).bind(parser);

  const onTracklistChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setPastedTracklistValue(value);
    debouncedTLParser(value, false, true).then((tracks) => {
      console.log('tracks :>> ', tracks);
      setParsedTracks(tracks);
    });
  };

  return (
    <div className="layout">
      <button className="btn-paste-tracklist" onClick={() => setIsPasteTracklist(true)}>
        Paste tracklist
      </button>
      {isPasteTracklist && (
        <textarea
          className="paste-tracklist"
          value={pastedTracklistValue}
          onChange={onTracklistChange}
        ></textarea>
      )}
      {parsedTracks.length > 0 && <Tracklist tracks={parsedTracks} />}
    </div>
  );
};

export default Layout;
