import AthenaClient from "../AthenaClient";
import { MessageEmbed, TextChannel } from "discord.js";

class ActionLogger {
  client: AthenaClient;

  constructor(client: AthenaClient) {
    this.client = client;
  }

  async logCommand(name: string, args: string[], user: string): Promise<void> {
    (
      this.client.channels.cache.get(
        this.client.config.channels.command
      ) as TextChannel
    ).send({
      embeds: [
        new MessageEmbed()
          .setColor("#5865F2")
          .setDescription(
            `**Command**: \`${name}\`\n\n**Args**: \`${
              args && args.length > 0 ? args.join(",") : "None"
            }\`\n\n**User**: \`${user}\``
          ),
      ],
    });
    return;
  }

  async logGuild(
    id: string,
    name: string,
    memberCount: number,
    ownerId: string,
    guildCreated: boolean
  ): Promise<void> {
    (
      this.client.channels.cache.get(
        this.client.config.channels.guild
      ) as TextChannel
    ).send({
      embeds: [
        new MessageEmbed()
          .setColor(guildCreated ? "GREEN" : "RED")
          .setTimestamp()
          .setDescription(
            `**Name**:\n${name} | \`${id}\`\n\n**Member Count**:\n\`${memberCount}\`\n\n**Owner ID**:\n\`${ownerId}\``
          ),
      ],
    });
  }
}

export default ActionLogger;
