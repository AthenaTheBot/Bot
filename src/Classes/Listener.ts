import Song from "./Song";

class GuildQueue {
  guildId: string;
  voiceChannel: string;
  textChannel: string;
  queue: Song[];
  listening: boolean;

  constructor(
    id: string,
    voiceChannel: string,
    textChannel: string,
    queue?: Song[]
  ) {
    this.guildId = id;
    this.voiceChannel = voiceChannel;
    this.textChannel = textChannel;
    if (queue) {
      this.queue = [...queue];
    } else {
      this.queue = [];
    }

    this.listening = false;
  }
}

export default GuildQueue;
