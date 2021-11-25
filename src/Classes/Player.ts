// Modules
import spotify from "spotify-url-info";
import ytsr from "ytsr";

// Classes
import Utils from "./Utils";
import Song from "./Song";
import Logger from "./Logger";

class Player {
  private guildQueues: Map<string, object>;
  private utils: Utils;
  private logger: Logger;
  readonly baseURLs: any;

  constructor() {
    this.guildQueues = new Map();
    this.logger = new Logger();
    this.utils = new Utils();

    this.baseURLs = {
      spTrack: "open.spotify.com/track/",
      spPlaylist: "open.spotify.com/playlist/",
      spAlbum: "open.spotify.com/album/",
    };
  }

  async searchSong(query: string): Promise<Song | null> {
    if (query.trim().indexOf(this.baseURLs.spTrack) > 0) {
      const spotifyData = await spotify.getData(query.trim());
      if (!spotifyData) return null;
      query = spotifyData.name;
    } else if (query.trim().indexOf(this.baseURLs.spotifyPlaylist) > 0) {
      return null;
    }

    const result = (await ytsr(query.trim(), { limit: 2 })).items.filter(
      (x) => x.type === "video"
    )[0] as any;

    if (!result) return null;
    else {
      return new Song(
        result.title,
        result.description,
        this.utils.parseDuration(result.duration),
        result.url
      );
    }
  }
}

export default Player;
