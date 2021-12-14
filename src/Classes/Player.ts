// Modules
import spotify from "spotify-url-info";
import ytsr from "ytsr";
import {
  getVoiceConnection,
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioResource,
  StreamType,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { stream } from "play-dl";

// Classes
import Song from "./Song";
import Listenter from "./Listener";
import AthenaClient from "../AthenaClient";

class Player {
  private client: AthenaClient;
  public listeners: Map<string, Listenter>;
  readonly baseURLs: any;

  constructor(client: AthenaClient) {
    this.client = client;
    this.listeners = new Map();

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
        this.client.utils.parseDuration(result.duration),
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
    return new Promise(async (resolve, reject) => {
      const listener = this.listeners.get(guildId);

      if (!listener) return;

      const connection = getVoiceConnection(guildId);

      if (!connection) return;

      const player = createAudioPlayer();
      const resource = await this.createPlayerResource(song);

      if (!resource) return;

      player.play(resource);

      connection.subscribe(player);

      listener.player = player;

      // Connection events
      connection.on(VoiceConnectionStatus.Disconnected, () => {
        reject();
      });

      // Player events
      player.on("stateChange", (oldS, newS) => {
        if (newS.status === AudioPlayerStatus.Idle) {
          resolve();
        }
      });

      player.on("error", (err) => {
        reject(err);
      });
    });
  }

  async serveGuild(
    guildId: string,
    voiceChannel: string,
    textChannel: string,
    voiceAdapterCreator: any,
    song?: Song
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let voiceConnection =
        getVoiceConnection(guildId) ||
        (await joinVoiceChannel({
          guildId: guildId,
          channelId: voiceChannel,
          adapterCreator: voiceAdapterCreator,
        }));

      if (!voiceConnection) return;

      let listenter = this.listeners.get(guildId);

      if (!listenter) {
        this.listeners.set(
          guildId,
          new Listenter(guildId, voiceChannel, textChannel, voiceAdapterCreator)
        );
        listenter = new Listenter(
          guildId,
          voiceChannel,
          textChannel,
          voiceAdapterCreator
        );
      }

      if (song) {
        listenter.queue.push(song);
      } else {
        if (listenter.queue.length <= 0) return;

        song = listenter.queue[0];
      }

      while (listenter.queue.length > 0) {
        try {
          listenter.listening = true;
          this.listeners.set(guildId, listenter);
          await this.streamSong(guildId, listenter.queue[0]);
          listenter.queue.shift();
          if (listenter.queue.length === 0) {
            resolve();
            listenter.listening = false;
          }
          this.listeners.set(guildId, listenter);
        } catch (err) {
          this.destroyStream(guildId);

          if (err) {
            reject();
            this.client.errorHandler.recordError(err as Error);
          } else {
            resolve();
          }
          break;
        }
      }
    });
  }

  async destroyStream(guildId: string): Promise<void> {
    try {
      const connection = await getVoiceConnection(guildId);

      connection?.destroy();
    } catch (err) {}

    this.listeners.delete(guildId);
  }

  async skipSong(guildId: string, songsToSkip: number): Promise<boolean> {
    const listener = this.listeners.get(guildId);

    if (!listener) return false;

    for (var i = 0; i < songsToSkip; i++) {
      listener.queue.shift();
    }

    if (listener.queue.length <= 0) return false;

    const connection = await getVoiceConnection(guildId);

    if (!connection) return false;

    this.serveGuild(
      listener.guildId,
      listener.voiceChannel,
      listener.textChannel,
      listener.voiceAdapterCreator
    );

    return true;
  }

  async pauseStream(guildId: string): Promise<boolean> {
    const listener = this.listeners.get(guildId);

    if (!listener) return false;

    listener.player?.pause();

    return true;
  }

  async resumeStream(guildId: string): Promise<boolean> {
    const listener = this.listeners.get(guildId);

    if (!listener) return false;

    listener.player?.unpause();

    return true;
  }

  isPlaying(guildId: string): boolean {
    return this.listeners.get(guildId)?.listening || false;
  }
}

export default Player;
