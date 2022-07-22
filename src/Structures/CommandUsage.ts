import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { EmbedBuilder, TextChannel } from "discord.js";
import { Athena } from "../index";
dayjs.extend(localizedFormat);

class CommandUsage {
  command: string;
  commandArgs: string[];
  userId: string;
  guildId: string;
  date: string;

  constructor(
    command: string,
    commandArgs: string[],
    userId: string,
    guildId: string
  ) {
    this.command = command;
    this.commandArgs = commandArgs;
    this.userId = userId;
    this.guildId = guildId;
    this.date = dayjs().format("L LT");
  }

  async saveUsage(): Promise<boolean> {
    return Athena.dbManager.createDocument(
      "command_usages",
      {
        command: this.command,
        userId: this.userId,
        guildId: this.guildId,
        date: this.date,
      },
      false
    );
  }

  async reportUsage(): Promise<boolean> {
    const usageChannel =
      ((await Athena.channels.cache.get(
        Athena.config.log.command
      )) as TextChannel) ||
      ((await Athena.channels.fetch(Athena.config.log.command)) as TextChannel);

    if (usageChannel) {
      const usageEmbed = new EmbedBuilder()
        .setColor(Athena.config.colors.default as any)
        .setFields([
          { name: "Command", value: `\`${this.command}\``, inline: true },
          {
            name: "Arguements",
            value:
              this.commandArgs.length > 0
                ? `\`${this.commandArgs.join(",")}\``
                : "`None`",
            inline: true,
          },
          { name: "User", value: `\`${this.userId}\``, inline: true },
          { name: "Guild", value: `\`${this.guildId}\``, inline: true },
        ])
        .setTimestamp();

      return await usageChannel
        ?.send({ embeds: [usageEmbed] })
        .then(() => true)
        .catch(() => false);
    } else {
      return false;
    }
  }
}

export default CommandUsage;
