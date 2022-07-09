import { SongLyrics, SongSearchResult } from "../constants";
import { AthenaConfig } from "../index";

import fetch from "cross-fetch";
import cheerio from "cheerio";

import ErrorHandler from "./ErrorHandler";

class Lyrics {
  cache: Map<number, SongLyrics>;

  constructor() {
    this.cache = new Map<number, SongLyrics>();
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
      .catch(() => {});

    if (songSearchResult) {
      const songs = songSearchResult.response.hits.filter(
        (x) => x.type === "song"
      );

      if (songs.length > 0) {
        const targetSong = songs[0];
        const cachedLyrics = this.cache.get(targetSong.result.id);

        if (cachedLyrics) return cachedLyrics;

        const html = await fetch(targetSong.result.url)
          .then((res) => {
            if (res.status === 200) return res.text();
            else return null;
          })
          .catch((err) => null);

        if (html) {
          const $ = cheerio.load(html);
          let lyrics = "";

          // Parse lyrics from html data
          $("div").each((el) => {
            const element = $($("div").get(el));
            const className = element.attr("class");
            if (className?.startsWith("Lyrics__Container")) {
              lyrics = element
                .html(element?.html()?.replaceAll("<br>", "\n") || "")
                .text();
            }
          });

          // Remove useless part from lyrics
          let lyricsArray: any[] = lyrics.split("\n");

          for (let i = 0; i < lyricsArray.length; i++) {
            if (
              lyricsArray[i].startsWith("[") &&
              lyricsArray[i].endsWith("]")
            ) {
              lyricsArray[i] = null;
            }
          }

          lyricsArray = lyricsArray.filter((x) => x !== null);

          if (lyrics) {
            const songLyrics: SongLyrics = {
              title: targetSong.result.full_title,
              artists: targetSong.result.artist_names,
              thumbnail: targetSong.result.header_image_thumbnail_url,
              content: lyricsArray.join("\n"),
            };

            this.cache.set(targetSong.result.id, songLyrics);

            setTimeout(() => {
              this.cache.delete(targetSong.result.id);
            }, 5 * 60 * 60 * 1000);

            return songLyrics;
          }
        }
      }
    }

    return null;
  }
}
export default Lyrics;
