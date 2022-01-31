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
import Listener from "./Listener";
import AthenaClient from "../AthenaClient";
import { MessageEmbed, TextChannel } from "discord.js";

class Player {
  private client: AthenaClient;
  public listeners: Map<string, Listener>;
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

    const result = (
      await ytsr(query.trim(), { limit: 2, safeSearch: false })
    ).items.filter((x) => x.type === "video")[0] as any;

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
    const source = await stream(song.url, { quality: 2 }).catch((err) => null);

    if (!source?.stream) return null;

    return createAudioResource(source.stream, {
      inputType: StreamType.Arbitrary,
    });
  }

  async streamSong(guildId: string, song: Song): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const listener = this.listeners.get(guildId);

      if (!listener) return reject(new Error("NO_LISTENER"));

      const connection = getVoiceConnection(guildId);

      if (!connection) return reject(new Error("NO_CONNECTION"));

      const player = createAudioPlayer();
      const resource = await this.createPlayerResource(song);

      if (!resource) return reject(new Error("NO_RESOURCE"));

      player.play(resource);

      connection.subscribe(player);

      listener.player = player;

      // Connection events
      connection.on(VoiceConnectionStatus.Disconnected, () => {
        reject(new Error("BOT_DICSONNECTED"));
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
    locales: object,
    song?: Song
  ): Promise<void> {
    const sendMsg = async (msg: string): Promise<void> => {
      try {
        const channel = (await this.client.channels.fetch(
          textChannel
        )) as TextChannel;
        const msgEmbed = new MessageEmbed()
          .setColor("#5865F2")
          .setDescription(msg);
        channel.send({ embeds: [msgEmbed] });
      } catch (err) {}
    };

    return new Promise(async (resolve, reject) => {
      let voiceConnection =
        getVoiceConnection(guildId) ||
        (await joinVoiceChannel({
          guildId: guildId,
          channelId: voiceChannel,
          adapterCreator: voiceAdapterCreator,
        }));

      if (!voiceConnection) return;

      let listener = this.listeners.get(guildId);

      if (!listener) {
        this.listeners.set(
          guildId,
          new Listener(
            guildId,
            voiceChannel,
            textChannel,
            voiceAdapterCreator,
            locales
          )
        );
        listener = new Listener(
          guildId,
          voiceChannel,
          textChannel,
          voiceAdapterCreator,
          locales
        );
      }

      if (song) {
        listener.queue.push(song);
      } else {
        if (listener.queue.length <= 0) return;

        song = listener.queue[0];
      }

      while (listener.queue.length > 0) {
        try {
          listener.listening = true;
          this.listeners.set(listener.guildId, listener);
          sendMsg(
            (listener.locales as any).NOW_PLAYING.replace(
              "$song_title",
              listener.queue[0].title
            ).replace("$song_url", listener.queue[0].url)
          );
          await this.streamSong(guildId, listener.queue[0]);
          if (listener.loop) {
            listener.queue.push(listener.queue[0]);
          }
          listener.queue.shift();
          if (listener.queue.length === 0) {
            resolve();
            listener.listening = false;
            this.listeners.set(listener.guildId, listener);
            setTimeout(() => {
              const newListener = this.listeners.get(guildId);
              if (!newListener || !newListener?.listening) {
                this.destroyStream(guildId);
              }
            }, 30 * 1000);
          }
        } catch (err) {
          if ((err as Error).message == "BOT_DISCONNECTED") {
            this.destroyStream(guildId);
            listener.listening = false;
            resolve();
            break;
          } else if ((err as Error).message == "NO_RESOURCE") {
            sendMsg(
              (listener.locales as any).PLAY_ERROR.replace(
                "$song_title",
                listener.queue[0].title
              ).replace("$song_url", listener.queue[0].url)
            );
            listener.queue.shift();
            this.listeners.set(listener.guildId, listener);
            if (listener.queue.length == 0) {
              listener.listening = false;
              this.listeners.set(listener.guildId, listener);
              reject();
              setTimeout(() => {
                const newListener = this.listeners.get(guildId);
                if (!newListener || !newListener?.listening) {
                  this.destroyStream(guildId);
                }
              }, 30 * 1000);
            }
          } else {
            this.destroyStream(guildId);
            listener.listening = false;
            reject(err);
            break;
          }
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

    if (listener.queue.length <= songsToSkip && !listener.loop) return false;

    if (listener.loop && listener.queue.length <= songsToSkip) {
      while (songsToSkip >= listener.queue.length) {
        songsToSkip = -listener.queue.length;
      }

      if (songsToSkip > 0) songsToSkip--;
    }

    for (var i = 0; i < songsToSkip; i++) {
      if (listener.loop) listener.queue.push(listener.queue[i]);
      listener.queue.shift();
    }

    if (listener.queue.length <= 0) return false;

    const connection = await getVoiceConnection(guildId);

    if (!connection) return false;

    this.serveGuild(
      listener.guildId,
      listener.voiceChannel,
      listener.textChannel,
      listener.voiceAdapterCreator,
      listener.locales
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

  async delSongFromQueue(guildId: string, songId: number): Promise<boolean> {
    const listener = this.listeners.get(guildId);

    if (!listener) return false;

    if (songId - 1 > listener.queue.length) {
      return false;
    }

    listener.queue.splice(songId - 1, 1);

    const connection = await getVoiceConnection(guildId);

    if (!connection) return false;

    if (songId - 1 == 0) {
      this.serveGuild(
        listener.guildId,
        listener.voiceChannel,
        listener.textChannel,
        listener.voiceAdapterCreator,
        listener.locales
      );
    }

    return true;
  }

  isPlaying(guildId: string): boolean {
    return this.listeners.get(guildId)?.listening || false;
  }
}

export default Player;
