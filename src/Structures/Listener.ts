import { AudioPlayer } from "@discordjs/voice";
import Song from "./Song";

class GuildQueue {
  guildId: string;
  voiceChannel: string;
  textChannel: string;
  loop: boolean;
  queue: Song[];
  listening: boolean;
  voiceAdapterCreator: any;
  player: AudioPlayer | null;
  locales: object;

  constructor(
    id: string,
    voiceChannel: string,
    textChannel: string,
    voiceAdapterCreator: any,
    locales: object,
    queue?: Song[]
  ) {
    this.guildId = id;
    this.voiceChannel = voiceChannel;
    this.textChannel = textChannel;
    this.loop = false;
    this.voiceAdapterCreator = voiceAdapterCreator;
    this.player = null;
    this.locales = locales;

    if (queue) {
      this.queue = [...queue];
    } else {
      this.queue = [];
    }

    this.listening = false;
  }
}

export default GuildQueue;
