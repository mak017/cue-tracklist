// Based on https://github.com/DmitryVarennikov/cuegenerator-react/blob/main/src/Cue/Parser.ts

import { TrackProps } from '../types';
import { addTime, castTime } from './TimeUtils';

export class ParserHelper {
  // that's how we tell performer and title apart
  private titlePerformerSeparators = [
    ' - ', // 45 hyphen-minus
    ' – ', // 8211 en dash
    ' ‒ ', // 8210 figure dash
    ' — ', // 8212 em dash
    ' ― ', // 8213 horizontal bar
  ];
  splitTitlePerformer(value: string) {
    // `foreach` and `switch` are toooooooooo slow!
    let split = [],
      performer = '',
      title = '';

    if (-1 !== value.search(this.titlePerformerSeparators[0])) {
      split = value.split(this.titlePerformerSeparators[0]);
    } else if (-1 !== value.search(this.titlePerformerSeparators[1])) {
      split = value.split(this.titlePerformerSeparators[1]);
    } else if (-1 !== value.search(this.titlePerformerSeparators[2])) {
      split = value.split(this.titlePerformerSeparators[2]);
    } else if (-1 !== value.search(this.titlePerformerSeparators[3])) {
      split = value.split(this.titlePerformerSeparators[3]);
    } else if (-1 !== value.search(this.titlePerformerSeparators[4])) {
      split = value.split(this.titlePerformerSeparators[4]);
    } else {
      split = [value];
    }

    // if string wasn't split yet then we get just a title (performer assumed to be the global one)
    if (1 === split.length) {
      performer = '';
      title = split.shift() || '';
    } else {
      performer = split.shift() || '';
      title = split.join(' ');
    }

    return {
      performer: performer.trim(),
      title: title.trim(),
    };
  }

  separateTime(value: string, isLength: boolean = false) {
    var time = '',
      residue = '';

    // ask to increase minutes up to 9999 referred to the "h:m" not "h:m:f" format
    // but I still increased "h:m:f" up to 999 hours just in case
    // https://github.com/dVaffection/cuegenerator/issues/14

    //                          01.     9999:53 | 999:02:28
    var pattern = !isLength
      ? /^(?:\d{2}\.)?\[?((?:\d{1,3}:)?\d{1,4}:\d{2})\]?.*$/i
      : /\(?(\d{1,4}:\d{2})\)?$/i;
    var matches = value.match(pattern);
    if (!matches) {
      return { residue: value.trim(), time };
    }
    if (!isLength) {
      if (matches[1]) {
        time = matches[1].trim();
        residue = value.substring(value.indexOf(matches[1]) + matches[1].length).trim();
      } else {
        residue = value.trim();
      }
    } else {
      time = matches[1].trim();
      residue = value.substring(0, value.indexOf(matches[0])).trim();
    }

    return { time, residue };
  }

  cleanOffTime(value: string) {
    var pattern = /^(?:\]? )?(?:\d{1,2}\)?\.? )?(.*)$/i;
    var matches = value.match(pattern);

    if (matches && matches[1]) {
      value = matches[1];
    }

    return value;
  }

  removeDoubleQuotes(value: string) {
    return value.replace(/"/g, '');
  }

  replaceDoubleQuotes(value: string) {
    return value.replace(/"/g, "'");
  }
}

export default class Parser {
  private helper: ParserHelper;

  constructor(helper: ParserHelper) {
    this.helper = helper;
  }

  parsePerformer(v: string): string {
    return v.trim();
  }
  parseTitle(v: string): string {
    return v.trim();
  }
  parseFileName(v: string): string {
    return v.trim();
  }
  parseTrackList(value: string, withTimestamps: boolean, withLength: boolean): Array<TrackProps> {
    const trackList = [];
    let time,
      performer,
      title,
      duration,
      cumulativeTime = '00:00';

    const contentInLines = value.split('\n');
    for (let i = 0, trackNumber = 1; i < contentInLines.length; i++, trackNumber++) {
      const row = contentInLines[i].trim();
      if (row.length < 4) {
        trackNumber--;
        continue;
      }

      const performerTitle = this.helper.splitTitlePerformer(row);
      if (withTimestamps) {
        if (performerTitle.performer) {
          const timePerformer = this.helper.separateTime(performerTitle.performer);
          time = withTimestamps ? castTime(timePerformer.time) : undefined;
          performer = this.helper.cleanOffTime(timePerformer.residue);
          title = performerTitle.title;
        } else {
          performer = '';
          const timeTitle = this.helper.separateTime(performerTitle.title);
          time = withTimestamps ? castTime(timeTitle.time) : undefined;
          title = this.helper.cleanOffTime(timeTitle.residue);
        }
      } else {
        performer = performerTitle.performer
          ? this.helper.cleanOffTime(performerTitle.performer)
          : '';
        if (!withLength) {
          title = performerTitle.title;
        } else {
          const timeTitle = this.helper.separateTime(performerTitle.title, true);
          duration = castTime(timeTitle.time, true);
          title = this.helper.cleanOffTime(timeTitle.residue);
          time = cumulativeTime;
          cumulativeTime = addTime(cumulativeTime, duration);
        }
      }

      performer = this.helper.replaceDoubleQuotes(performer);
      title = this.helper.replaceDoubleQuotes(title);

      trackList.push({
        trackNumber,
        performer,
        title,
        time,
        duration,
      });
    }

    return trackList;
  }

  // parseRegionsList(value: string): RegionsList {
  //   const regionsList: RegionsList = [];
  //   let matches;
  //   var contents = value.split('\n');

  //   for (let i = 0; i < contents.length; i++) {
  //     const row = contents[i].trim();

  //     // Soundforge or Audition
  //     matches = row.match(/(\d{2}:\d{2}:\d{2}[\.,:]\d{2})/i);
  //     if (null != matches) {
  //       let time = matches[0].split(':');
  //       const hr = time.shift() || '0';
  //       let mn: string | number = time.shift() || '0';

  //       // frames can be separated by .(dot) or :(colon) or ,(comma)
  //       if (time.length > 1) {
  //         var sc = time.shift();
  //         var fr = time.shift();
  //       } else {
  //         let sc_fr = time.shift() || '';
  //         let sc_fr_split;
  //         switch (true) {
  //           case -1 != sc_fr.indexOf('.'):
  //             sc_fr_split = sc_fr.split('.');
  //             var sc = sc_fr_split.shift();
  //             var fr = sc_fr_split.shift();
  //             break;
  //           case -1 != sc_fr.indexOf(','):
  //             sc_fr_split = sc_fr.split(',');
  //             var sc = sc_fr_split.shift();
  //             var fr = sc_fr_split.shift();
  //             break;
  //         }
  //       }

  //       mn = parseInt(mn, 10) + parseInt(hr, 10) * 60;
  //       const timeEntry = (mn < 10 ? '0' + mn : mn) + ':' + sc + ':' + fr;
  //       regionsList.push(timeEntry);

  //       continue;
  //     }

  //     // find Nero/Winamp formats mm(m):ss(:|.)ii
  //     matches = row.match(/(\d{2,3}:\d{2}[\.:]\d{2})/i);
  //     if (null != matches) {
  //       var time = matches[0].split(':');
  //       var mn = time.shift();
  //       if (time.length == 1) {
  //         var sc_fr = time[0].split('.');
  //         var sc = sc_fr.shift();
  //         var fr = sc_fr.shift();
  //       } else {
  //         var sc = time.shift();
  //         var fr = time.shift();
  //       }

  //       const timeEntry = mn + ':' + sc + ':' + fr;
  //       regionsList.push(timeEntry);

  //       continue;
  //     }

  //     // Audacity
  //     matches = row.match(/(\d{1,5}).(\d{6})/i);
  //     if (null != matches) {
  //       const milliseconds = matches[2];
  //       const seconds = Number(matches[1]) || 0;
  //       const minutes = Math.floor(seconds / 60);

  //       let mn = minutes > 0 ? minutes : 0;
  //       let sc = seconds % 60;
  //       // frames can not be more than 74, so floor them instead of round
  //       const fr = Math.floor(parseFloat(0 + '.' + milliseconds) * 75);

  //       const timeEntry = (mn < 10 ? '0' + mn : mn) + ':' + (sc < 10 ? '0' + sc : sc) + ':' + (fr < 10 ? '0' + fr : fr);
  //       regionsList.push(timeEntry);

  //       continue;
  //     }

  //     // try to recognise raw cue timings
  //     matches = row.match(/(\d{2}:\d{2}:\d{2})/i);
  //     if (null != matches) {
  //       time = matches[0].split(':');
  //       const mn = parseInt(time[0], 10);
  //       const sc = parseInt(time[1], 10);
  //       const fr = parseInt(time[2], 10);

  //       const timeEntry = (mn < 10 ? '0' + mn : mn) + ':' + (sc < 10 ? '0' + sc : sc) + ':' + (fr < 10 ? '0' + fr : fr);
  //       regionsList.push(timeEntry);

  //       continue;
  //     }
  //   }

  //   return regionsList;
  // }
}
