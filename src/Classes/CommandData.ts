import {
  DMChannel,
  Guild as DJSGuild,
  GuildMember,
  Message,
  MessageEmbed,
  NewsChannel,
  PartialDMChannel,
  TextChannel,
  ThreadChannel,
} from "discord.js";
import AthenaClient from "../AthenaClient";
import Command from "./Command";
import Guild from "./Guild";
import User from "./User";

enum CommandDataTypes {
  Interaction = "Interaction",
  Message = "Message",
}

class CommandData {
  client: AthenaClient;

  raw: any;
  type: CommandDataTypes;
  command: Command;
  args: string[];
  author: GuildMember | null;
  guild: DJSGuild;
  channel:
    | PartialDMChannel
    | DMChannel
    | TextChannel
    | NewsChannel
    | ThreadChannel;

  db: {
    user: User;
    guild: Guild;
  };

  locales: any;

  constructor(
    command: Command,
    client: AthenaClient,
    source: {
      type: CommandDataTypes;
      data: Message;
      db: { user: User; guild: Guild };
    }
  ) {
    this.client = client;

    if (source.type) {
      // General Variables
      this.raw = source.data;
      this.type = source.type;
      this.command = command;
      this.author = source.data?.member;
      this.guild = source.data?.guild as any;
      this.channel = source.data?.channel;

      this.db = source.db;

      this.locales = this.client.localeManager.getCategoryLocale(
        this.db.guild.settings.language || this.client.config.defaults.language
      );

      // Arguement parsing
      if (this.type === CommandDataTypes.Message) {
        this.args = this.raw.content.trim().split(/ +/).slice(1);
      } else {
        const args = [];
        for (var i = 0; i < this.raw.options.data.length; i++) {
          args.push(this.raw.options.data[i].value);
        }
        this.args = args;
      }
    } else {
      throw new Error(
        "Cannot create command data instance without a data type."
      );
    }
  }

  async respond(
    message: string | MessageEmbed,
    sendAsEmbed?: boolean
  ): Promise<any> {
    let respondData;
    message = sendAsEmbed
      ? new MessageEmbed().setColor("#5865F2").setDescription(message as string)
      : message;
    let payload =
      message instanceof MessageEmbed
        ? { embeds: [message?.color ? message : message.setColor("#5865F2")] }
        : message;

    try {
      if (this.type === CommandDataTypes.Interaction) {
        respondData = await this.raw.reply(payload);
      } else {
        respondData = await this.raw.channel.send(payload);
      }
    } catch (err) {
      console.error(err);
      respondData = null;
    }

    return respondData;
  }
}

export default CommandData;
export { CommandData, CommandDataTypes };
