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
  GuildMember as DJSMember,
  Role as DJSRole,
} from "discord.js";
import { Permissions } from "../constants";
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

  executeable: boolean;
  executeFail:
    | {
        reason: string;
        perms: Permissions[] | null;
      }
    | undefined
    | null;

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

      this.executeable = true;

      // Get Athena's Perms
      const athenaPerms = this.client.userManager.getAllPerms(
        this.guild.me as GuildMember,
        this.channel as TextChannel
      );

      const userPerms = this.client.userManager.getAllPerms(
        this.author as GuildMember,
        this.channel as TextChannel
      );

      const [athenaPassed, athenaFailPerms] =
        this.command.requiredBotPerms.checkRequirements(athenaPerms);

      const [userPassed, userFailPerms] =
        this.command.requiredBotPerms.checkRequirements(userPerms);

      if (!athenaPassed) {
        this.executeable = false;
        this.executeFail = {
          reason: "BOT_INSUFFICIENT_PERMS",
          perms: athenaFailPerms,
        };
      }

      if (!userPassed) {
        this.executeable = false;
        this.executeFail = {
          reason: "USER_INSUFFICIENT_PERMS",
          perms: userFailPerms,
        };
      }

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

  async parseUserFromArgs(index: number): Promise<DJSMember | null> {
    if (!this.args[index]) return null;

    let userId = null;

    if (
      this.type === CommandDataTypes.Interaction ||
      !isNaN(this.args[index] as any)
    )
      userId = this.args[index];
    else userId = this.args[index].slice(3, this.args[index].length - 1);

    try {
      const user = (await this.guild.members.cache.get(userId)) || null;

      return user;
    } catch (err) {
      return null;
    }
  }

  async parseRoleFromArgs(index: number): Promise<DJSRole | null> {
    if (!this.args[index]) return null;

    let roleId = null;

    if (
      this.type === CommandDataTypes.Interaction ||
      !isNaN(this.args[index] as any)
    )
      roleId = this.args[index];
    else roleId = this.args[index].slice(3, this.args[index].length - 1);

    try {
      const role = (await this.guild.roles.cache.get(roleId)) || null;

      return role;
    } catch (err) {
      return null;
    }
  }

  async respond(
    respondPayload: string | MessageEmbed | MessageEmbed[] | any,
    sendAsEmbed?: boolean
  ): Promise<any> {
    let payload: any;

    if (typeof respondPayload === "string") {
      if (sendAsEmbed) {
        payload = {
          embeds: [
            new MessageEmbed()
              .setColor("#5865F2")
              .setDescription(respondPayload.trim()),
          ],
        };
      } else payload = respondPayload;
    } else if (Array.isArray(respondPayload)) {
      payload = {
        embeds: [...respondPayload.filter((x) => x instanceof MessageEmbed)],
      };
    } else if (respondPayload instanceof MessageEmbed) {
      payload = { embeds: [respondPayload] };
    } else {
      payload = respondPayload;
    }

    let returnData;
    try {
      if (this.type === CommandDataTypes.Interaction) {
        returnData = await this.raw.reply(payload);
      } else {
        returnData = await this.raw.channel.send(payload);
      }
    } catch (err) {
      returnData = null;
    }

    return returnData;
  }
}

export default CommandData;
export { CommandData, CommandDataTypes };
