// Modules
import spotify from "spotify-url-info";
import ytsr from "ytsr";

// Classes
import Utils from "./Utils";
import Song from "./Song";

class Player {
  guildQueues: object;
  regExps: any;
  private utils: Utils;

  constructor() {
    this.guildQueues = [];

    this.regExps = {
      youtubeVideo: new RegExp(
        /^https?:\/\/(?:(?:www|m)\.)?(?:youtube\.com\/watch(?:\?v=|\?.+?&v=)|youtu\.be\/)([a-z0-9_-]+)$/i
      ),
      spotifyPlaylist: new RegExp(
        /^https?:\/\/(?:open|play)\.spotify\.com\/user\/([\w\d]+)\/playlist\/[\w\d]+$/i
      ),
      spotifyTrack: new RegExp(
        /^https?:\/\/(?:open|play)\.spotify\.com\/track\/[\w\d]+$/i
      ),
    };

    this.utils = new Utils();
  }

  async searchSong(query: string): Promise<Song | null> {
    if (query.match(this.regExps.spotifyTrack)) {
      const spotifyData = await spotify.getData(query.trim());
      if (!spotifyData) return null;
      query = spotifyData;
    } else if (query.match(this.regExps.spotifyPlaylist)) {
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
