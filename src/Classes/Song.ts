import {
  AudioResource,
  createAudioResource,
  demuxProbe,
} from "@discordjs/voice";
import { raw as ytdl } from "youtube-dl-exec";

class Song {
  title: string;
  description: string;
  duration: number;
  url: string;

  constructor(
    title: string,
    description: string,
    duration: number,
    url: string
  ) {
    this.title = title;
    this.description = description;
    this.duration = duration;
    this.url = url;
  }
}

export default Song;
