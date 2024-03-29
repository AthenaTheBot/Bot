import {
  DMChannel,
  Guild as DJSGuild,
  GuildMember,
  Message,
  EmbedBuilder,
  NewsChannel,
  PartialDMChannel,
  TextChannel,
  GuildMember as DJSMember,
  Role as DJSRole,
  PublicThreadChannel,
  PrivateThreadChannel,
  VoiceChannel,
  StageChannel,
} from "discord.js";
import { Permissions } from "../constants";
import AthenaClient from "../AthenaClient";
import Command from "./Command";
import Guild from "./Guild";
import User from "./User";

enum CommandTypes {
  Interaction = "Interaction",
  Message = "Message",
}

class CommandContext {
  client: AthenaClient;

  raw: any;
  type: CommandTypes;
  command: Command;
  args: string[];
  author: GuildMember | null;
  guild: DJSGuild;
  channel:
    | DMChannel
    | PartialDMChannel
    | NewsChannel
    | TextChannel
    | PublicThreadChannel
    | PrivateThreadChannel
    | VoiceChannel
    | StageChannel;

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
      type: CommandTypes;
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
        this.db.guild.modules.settings.language ||
          this.client.config.defaults.language
      );

      this.executeable = true;

      // Get Athena's Perms
      const athenaPerms = this.client.userManager.getAllPerms(
        this.guild.members.me as GuildMember,
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
      if (this.type === CommandTypes.Message) {
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
      this.type === CommandTypes.Interaction ||
      !isNaN(this.args[index] as any)
    )
      userId = this.args[index];
    else userId = this.args[index].replace(/\D/g, "");

    try {
      const user =
        (await this.guild.members.cache.get(userId)) ||
        (await this.guild.members.fetch(userId));

      return user;
    } catch (err) {
      return null;
    }
  }

  async parseRoleFromArgs(index: number): Promise<DJSRole | null> {
    if (!this.args[index]) return null;

    let roleId = null;

    if (
      this.type === CommandTypes.Interaction ||
      !isNaN(this.args[index] as any)
    )
      roleId = this.args[index];
    else roleId = this.args[index].replace(/\D/g, "");

    try {
      const role =
        (await this.guild.roles.cache.get(roleId)) ||
        (await this.guild.roles.fetch(roleId));

      return role;
    } catch (err) {
      return null;
    }
  }

  async respond(
    respondPayload: string | EmbedBuilder | EmbedBuilder[] | any,
    sendAsEmbed?: boolean
  ): Promise<any> {
    let payload: any;

    if (typeof respondPayload === "string") {
      if (sendAsEmbed) {
        payload = {
          embeds: [
            new EmbedBuilder()
              .setColor("#5865F2")
              .setDescription(respondPayload.trim()),
          ],
        };
      } else payload = { content: respondPayload };
    } else if (Array.isArray(respondPayload)) {
      payload = {
        embeds: [...respondPayload.filter((x) => x instanceof EmbedBuilder)],
      };
    } else if (respondPayload instanceof EmbedBuilder) {
      payload = { embeds: [respondPayload] };
    } else {
      payload = respondPayload;
    }

    let returnData;
    try {
      if (this.type === CommandTypes.Interaction) {
        returnData = await this.raw.editReply(payload);
      } else {
        returnData = await this.raw.channel.send(payload);
      }
    } catch (err) {
      console.log(err);
      returnData = null;
    }

    return returnData;
  }
}

export default CommandContext;
export { CommandContext, CommandTypes };
