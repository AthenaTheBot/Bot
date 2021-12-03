// Modules
import spotify from "spotify-url-info";
import { Guild } from "discord.js";
import ytsr from "ytsr";
import {
  getVoiceConnection,
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioResource,
  demuxProbe,
  StreamType,
} from "@discordjs/voice";
import { stream } from "play-dl";

// Classes
import Utils from "./Utils";
import Song from "./Song";
import Listenter from "./Listener";
import Logger from "./Logger";

class Player {
  public listeners: Map<string, Listenter>;
  private utils: Utils;
  private logger: Logger;
  readonly baseURLs: any;

  constructor() {
    this.listeners = new Map();
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

  async createPlayerResource(song: Song): Promise<AudioResource | null> {
    const source = await stream(song.url, { quality: 2 });

    if (!source?.stream) return null;

    return createAudioResource(source.stream, {
      inputType: StreamType.Arbitrary,
    });
  }

  async streamSong(guildId: string, song: Song): Promise<void> {
    return new Promise(async (resolve) => {
      const connection = getVoiceConnection(guildId);

      if (!connection) return;

      const player = createAudioPlayer();
      const resource = await this.createPlayerResource(song);

      if (!resource) return;

      player.play(resource);

      connection.subscribe(player);

      player.on("stateChange", (oldS, newS) => {
        if (newS.status === "idle") {
          resolve();
        }
      });
    });
  }

  async serveGuild(
    guild: Guild,
    voiceChannel: string,
    textChannel: string,
    song: Song
  ) {
    let voiceConnection =
      getVoiceConnection(guild.id) ||
      (await joinVoiceChannel({
        guildId: guild.id,
        channelId: voiceChannel,
        adapterCreator: guild.voiceAdapterCreator,
      }));

    if (!voiceConnection) return;

    let listenter = this.listeners.get(guild.id);

    if (!listenter) {
      this.listeners.set(
        guild.id,
        new Listenter(guild.id, voiceChannel, textChannel)
      );
      listenter = new Listenter(guild.id, voiceChannel, textChannel);
    }

    listenter.queue.push(song);

    while (listenter.queue.length > 0) {
      listenter.listening = true;
      this.listeners.set(guild.id, listenter);
      await this.streamSong(guild.id, listenter.queue[0]);
      listenter.queue.shift();
      if (listenter.queue.length === 0) listenter.listening = false;
      this.listeners.set(guild.id, listenter);
    }
  }
}

export default Player;
