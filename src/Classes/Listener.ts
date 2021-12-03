import { AudioPlayer } from "@discordjs/voice";
import Song from "./Song";

class GuildQueue {
  guildId: string;
  voiceChannel: string;
  textChannel: string;
  queue: Song[];
  listening: boolean;
  voiceAdapterCreator: any;
  player: AudioPlayer | null;

  constructor(
    id: string,
    voiceChannel: string,
    textChannel: string,
    voiceAdapterCreator: any,
    queue?: Song[]
  ) {
    this.guildId = id;
    this.voiceChannel = voiceChannel;
    this.textChannel = textChannel;
    this.voiceAdapterCreator = voiceAdapterCreator;
    this.player = null;

    if (queue) {
      this.queue = [...queue];
    } else {
      this.queue = [];
    }

    this.listening = false;
  }
}

export default GuildQueue;
