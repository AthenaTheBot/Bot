import { AudioPlayer } from "@discordjs/voice";
import { EmbedBuilder, TextChannel } from "discord.js";
import Song from "./Song";
import { Athena } from "..";

class GuildQueue {
  guildId: string;
  voiceChannel: string;
  textChannel: string;
  loop: boolean;
  queue: Song[];
  listening: boolean;
  voiceAdapterCreator: any;
  player: AudioPlayer | null;
  locales: any;

  constructor(
    id: string,
    voiceChannel: string,
    textChannel: string,
    voiceAdapterCreator: any,
    locales: any,
    queue?: Song[]
  ) {
    this.guildId = id;
    this.voiceChannel = voiceChannel;
    this.textChannel = textChannel;
    this.loop = false;
    this.voiceAdapterCreator = voiceAdapterCreator;
    this.player = null;
    this.locales = locales;

    if (queue) {
      this.queue = [...queue];
    } else {
      this.queue = [];
    }

    this.listening = false;
  }

  async sendMsg(locale: string, localeVariables: any = {}): Promise<void> {
    let message = this.locales[locale];
    if (!message) return;

    try {
      Object.getOwnPropertyNames(localeVariables).forEach((localeVar) => {
        message = message.replaceAll(localeVar, localeVariables[localeVar]);
      });

      const embed = new EmbedBuilder()
        .setColor("#5865F2")
        .setDescription(message);

      const channel =
        (Athena.channels.cache.get(this.textChannel) as TextChannel) ||
        ((await Athena.channels.fetch(this.textChannel)) as TextChannel);

      if (!channel) throw new Error("Channel not found");

      channel.send({
        embeds: [embed],
      });
    } catch (err: any) {
      Athena.errorHandler.recordError(err);
    }
  }
}

export default GuildQueue;
