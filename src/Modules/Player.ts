import fetch from "cross-fetch";
const spotify = require("spotify-url-info")(fetch);
import ytsr from "ytsr";
import { getBasicInfo } from "ytdl-core";
import playDl from "play-dl";
import Song from "../Structures/Song";
import Listener from "../Structures/Listener";
import AthenaClient from "../AthenaClient";
import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import Utils from "./Utils";
import { VoiceChannel } from "discord.js";
import { SongLyrics, SongSearchResult } from "../constants";
import cheerio from "cheerio";
import { AthenaConfig } from "..";

class Player {
  private client: AthenaClient;
  public listeners: Map<string, Listener>;
  readonly baseURLs: any;

  constructor(client: AthenaClient) {
    this.client = client;
    this.listeners = new Map();
    this.baseURLs = {
      ytVideo:
        /(?:https?:\/\/|www\.|m\.|^)youtu(?:be\.com\/watch\?(?:.*?&(?:amp;)?)?v=|\.be\/)([\w‌​\-]+)(?:&(?:amp;)?[\w\?=]*)?/,
      spTrack: "open.spotify.com/track/",
      spPlaylist: "open.spotify.com/playlist/",
      spAlbum: "open.spotify.com/album/",
    };
  }

  async searchSong(query: string): Promise<Song | null> {
    try {
      let result = null;
      if (query.trim().indexOf(this.baseURLs.spTrack) > 0) {
        const spotifyData = await spotify.getData(query.trim());
        if (!spotifyData) return null;
        const artists: string[] = [];
        spotifyData?.artists.forEach((artist: any) => {
          artists.push(artist.name);
        });
        query = `${spotifyData.name} ${artists.join(" ")}`;
        result = (
          await ytsr(query.trim(), { limit: 2, safeSearch: false })
        ).items.filter((x) => x.type === "video")[0] as any;
      } else if (query.trim().indexOf(this.baseURLs.spotifyPlaylist) > 0) {
        return null;
      } else if (query.trim().match(this.baseURLs.ytVideo)) {
        result = await getBasicInfo(query.trim(), {})
          .then((data) => {
            if (data?.videoDetails)
              return {
                title: data?.videoDetails?.title,
                description: data?.videoDetails?.description,
                duration: data?.videoDetails?.lengthSeconds,
                url: data?.videoDetails?.video_url,
              };
            else return null;
          })
          .catch((err) => null);
      } else {
        result = (
          await ytsr(query.trim(), { limit: 2, safeSearch: false })
        ).items.filter((x) => x.type === "video")[0] as any;
      }

      if (!result) return null;
      else {
        return new Song(
          result.title,
          result.description,
          this.client.utils.parseDuration(result.duration),
          result.url
        );
      }
    } catch (err) {
      this.client.errorHandler.recordError(err as Error);
      return null;
    }
  }

  async getLyrics(query: string): Promise<SongLyrics | null> {
    const songSearchResult: SongSearchResult | null = await fetch(
      `${AthenaConfig.apis.genius.baseUrl}/search?q=${query}`,
      {
        headers: {
          Authorization: `Bearer ${AthenaConfig.apis.genius.key}`,
        },
      }
    )
      .then((res) => {
        if (res.status === 200) return res.json();
        else return null;
      })
      .catch(this.client.errorHandler.handleError);

    if (songSearchResult) {
      const songs = songSearchResult.response.hits.filter(
        (x) => x.type === "song"
      );

      if (songs.length > 0) {
        const targetSong = songs[0];

        const html = await fetch(targetSong.result.url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0",
          },
        })
          .then((res) => {
            if (res.status === 200) return res.text();
            else return null;
          })
          .catch((err) => null);

        if (html) {
          const $ = cheerio.load(html);
          let lyrics = "";

          $("div").each((el) => {
            const element = $($("div").get(el));
            const className = element.attr("class");
            if (className?.startsWith("Lyrics__Container")) {
              element
                .children()
                .children()
                .each((i) => {
                  const child = $(element.children().get(i));

                  if (child.attr("class") || child.attr("id")) {
                    child.html(
                      child
                        .html()
                        ?.replaceAll("<br/>", "\n")
                        .replaceAll("<br>", "\n") || ""
                    );

                    lyrics += child.text() + "\n";
                  }
                });
            }
          });

          if (lyrics)
            return {
              title: targetSong.result.full_title,
              artists: targetSong.result.artist_names,
              thumbnail: targetSong.result.header_image_thumbnail_url,
              content: lyrics,
            };
        }
      }
    }

    return null;
  }

  async playSong(
    guildId: string,
    channels: { voice: string; text: string },
    adapter: any,
    locales: any,
    song: Song | null
  ) {
    let listener = this.listeners.get(guildId);

    if (!listener) {
      listener = new Listener(
        guildId,
        channels.voice,
        channels.text,
        adapter,
        locales,
        []
      );

      this.listeners.set(
        guildId,
        new Listener(
          guildId,
          channels.voice,
          channels.text,
          adapter,
          locales,
          []
        )
      );
    }

    if (!listener?.player) listener.player = createAudioPlayer();

    if (listener.queue.length === 0 && !song) return false;

    if (listener.listening && song) {
      listener.queue.push(song);
      this.listeners.set(listener.guildId, listener);
      listener.sendMsg("ADDED_TO_QUEUE", {
        $song_title: song.title,
        $song_url: song.url,
      });

      return null;
    } else if (listener.listening && !song) return false;

    if (song) listener.queue.push(song);

    this.listeners.set(listener.guildId, listener);

    while (this.listeners.get(guildId)?.queue?.length) {
      const listener = this.listeners.get(guildId);

      if (!listener) break;

      const song = this.listeners.get(guildId)?.queue[0];

      if (!song) break;

      listener.listening = true;

      this.listeners.set(listener.guildId, listener);

      const result = await new Promise<{ state: string; payload: any }>(
        async (resolve) => {
          try {
            const source = await playDl.stream(song.url);
            const resource = createAudioResource(source.stream, {
              inputType: source.type,
            });

            listener.player?.play(resource);

            const conn = await joinVoiceChannel({
              guildId: guildId,
              channelId: channels.voice,
              adapterCreator: adapter,
              selfDeaf: true,
            });

            conn?.subscribe(listener.player as any);

            listener.sendMsg("NOW_PLAYING", {
              $song_title: song.title,
              $song_url: song.url,
            });

            conn.on(VoiceConnectionStatus.Disconnected, () => {
              resolve({
                state: "DISCONNECTED",
                payload: null,
              });
            });

            listener?.player?.on("stateChange", () => {
              if (listener.player?.state.status === AudioPlayerStatus.Idle)
                resolve({
                  state: "FINISHED",
                  payload: null,
                });
            });

            listener?.player?.on("error", (err) => {
              listener.player = null;
              resolve({
                state: "ERROR",
                payload: err,
              });
            });

            while (true) {
              await Utils.sleep(1.5 * 60 * 1000);
              const _connection = getVoiceConnection(guildId);

              if (_connection) {
                const vcMembers = (
                  (await this.client.channels.fetch(
                    listener.voiceChannel
                  )) as VoiceChannel
                )?.members.filter((x) => !x.user.bot).size;

                if (vcMembers === 0) {
                  resolve({
                    state: "INACTIVE",
                    payload: null,
                  });
                  break;
                }
              }
            }
          } catch (err) {
            resolve({
              state: "ERROR",
              payload: err,
            });
          }
        }
      );

      if (result.state === "DISCONNECTED") {
        this.destroyStream(guildId);

        return;
      } else if (result.state === "INACTIVE") {
        this.destroyStream(guildId);

        listener.sendMsg("INACTIVE_VC");
      } else if (result.state === "ERROR") {
        this.destroyStream(guildId);

        this.client.errorHandler.recordError(result.payload);

        listener.sendMsg("PLAY_ERROR", {
          $song_title: song.title,
          $song_url: song.url,
        });

        return;
      }

      if (listener?.loop) listener.queue.push(listener.queue[0]);

      listener?.queue.shift();

      if (listener.queue.length > 0) {
        listener.listening = false;

        this.listeners.set(listener.guildId, listener);
      } else {
        this.destroyStream(guildId);
      }
    }
  }

  isPlaying(guildId: string): boolean {
    const listener = this.listeners.get(guildId);

    return listener?.listening || false;
  }

  skipSong(guildId: string, amount: number = 1): boolean {
    const listener = this.listeners.get(guildId);

    if (!listener || !listener?.listening || listener.queue.length === 0)
      return false;

    for (let i = 0; i < amount; i++) {
      if (listener?.loop) listener.queue.push(listener.queue[0]);
      listener.queue.shift();
    }

    if (listener.queue.length > 0) {
      listener.listening = false;

      this.listeners.set(guildId, listener);

      this.playSong(
        guildId,
        { voice: listener.voiceChannel, text: listener.textChannel },
        listener.voiceAdapterCreator,
        listener.locales,
        null
      );
    } else {
      listener.sendMsg("EMPTY_SONG_QUEUE");

      this.destroyStream(guildId);
    }

    return true;
  }

  delSongFromQueue(guildId: string, songOrder: number): boolean {
    const listener = this.listeners.get(guildId);

    if (!listener) return false;

    if (songOrder - 1 > listener.queue.length) {
      return false;
    }

    listener.queue.splice(songOrder - 1, 1);

    const connection = getVoiceConnection(guildId);

    if (!connection) return false;

    if (songOrder - 1 == 0) {
      listener.listening = false;

      this.listeners.set(guildId, listener);

      this.playSong(
        guildId,
        { voice: listener.voiceChannel, text: listener.textChannel },
        listener.voiceAdapterCreator,
        listener.locales,
        null
      );
    }

    return true;
  }

  resumeStream(guildId: string): boolean {
    const listener = this.listeners.get(guildId);

    if (!listener || !listener?.player) return false;

    (listener.player as AudioPlayer).unpause();

    return true;
  }

  pauseStream(guildId: string): boolean {
    const listener = this.listeners.get(guildId);

    if (!listener || !listener?.player) return false;

    (listener.player as AudioPlayer).pause();

    return true;
  }

  destroyStream(guildId: string): boolean {
    this.listeners.delete(guildId);

    const conn = getVoiceConnection(guildId);

    if (conn) conn.destroy();

    return true;
  }
}

export default Player;
