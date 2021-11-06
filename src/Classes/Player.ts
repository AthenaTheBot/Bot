import Song from "./Song";

class Player {
  guildQueues: object;

  constructor() {
    this.guildQueues = [];
  }

  async searchSong(query: string): Promise<Song | null> {
    return null;
  }
}

export default Player;
