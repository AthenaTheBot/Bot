const { MessageEmbed } = require("discord.js");

module.exports = class Event {
  constructor() {
    this.name = "messageCreate";
  }

  async run(client, msg) {
    if (msg.author.bot || !msg.guild) return;

    const guildData = await client.dbManager.getGuild(msg.guild.id, true);
    const userData = await client.dbManager.getUser(msg.author.id, true);

    if (guildData?.data && userData?.preferences) {
      if (
        msg.content.startsWith(`<@!${client.user.id}>`) ||
        msg.content === `<@!${client.user.id}>`
      )
        return msg.reply(
          `**Prefix**: \`${guildData.data.preferences.prefix}\``
        );
      else if (!msg.content.startsWith(guildData.data?.preferences?.prefix))
        return;

      let preferedLanguage;
      if (userData?.preferences?.language)
        preferedLanguage = userData.preferences.language;
      else preferedLanguage = guildData.data.preferences.language;

      const args = msg.content
        .slice(guildData.data.preferences.prefix.length)
        .trim()
        .split(/ +/);
      const usedCommand = args.shift().trim().toLowerCase();

      const command = client.isCommand(usedCommand);

      if (command) {
        const mainLocale = client.locales.get(preferedLanguage).main;

        const isCommandInCooldown = client.cooldownManager.isCommandInCooldown(
          msg.author.id,
          command.name
        );

        if (isCommandInCooldown) {
          const isCommandWarnSent = client.cooldownManager.isCommandWarnSent(
            msg.author.id,
            command.name
          );

          if (!isCommandWarnSent) {
            msg.channel.send({
              embeds: [
                new MessageEmbed()
                  .setColor("RED")
                  .setDescription(
                    mainLocale.COOLDOWN_WARNING.replace(
                      "$commandName",
                      command.name
                    )
                  ),
              ],
            });

            client.cooldownManager.updateCommandWarnState(
              msg.author.id,
              command.name,
              true
            );
          }

          return;
        }

        let botCanRun = true;
        const botPerms = msg.guild.me.permissionsIn(msg.channel).toArray();
        if (
          !botPerms.includes("SEND_MESSAGES") ||
          !botPerms.includes("READ_MESSAGE_HISTORY")
        )
          return;
        command.required_bot_perms.forEach((perm) => {
          if (!botPerms.includes(perm)) botCanRun = false;
        });

        let userCanRun = true;
        const userPerms = msg.member.permissionsIn(msg.channel).toArray();
        command.required_perms.forEach((perm) => {
          if (!userPerms.includes(perm)) userCanRun = false;
        });

        // * Perm Checkup
        if (!botCanRun) return msg.channel.send(mainLocale.BOT_NOT_ENOUGH_PERM);
        if (!userCanRun)
          return msg.channel.send(mainLocale.USER_NOT_ENOUGH_PERM);

        const commandLocale =
          client.locales
            .get(preferedLanguage)
            .locales.find((locale) => locale.cmd == command.name) || {};
        if (!commandLocale.content)
          return msg.channel.send("ERROR: LOCALE_NOT_AVAILABLE");

        commandLocale.content.language = preferedLanguage;

        msg.reply = async (data) => {
          return await msg.channel.send(data);
        };

        // * Music Command Checkup
        if (command.category == "Music") {
          const guildState = client.songStates.get(msg.guild.id);
          if (
            msg.guild.me.voice?.channel &&
            msg?.guild?.me?.voice?.channel?.id != msg?.member?.voice.channel?.id
          )
            return msg.reply(mainLocale.NOT_SAME_VC);

          if (
            command.name != "play" &&
            command.name != "join" &&
            command.name != "disconnect"
          ) {
            if (!guildState || !guildState.playing)
              return msg.reply(mainLocale.ALREADY_NOT_PLAYING_SONG);
          }
        }

        command.run(client, msg, args, commandLocale.content);

        if (client.config.DEBUG) return;

        client.cooldownManager.addCommandCooldown(
          msg.author.id,
          command.name,
          command.cooldown * 1000
        );

        const CommandUsageEmbed = new MessageEmbed()
          .setColor("#5865F2")
          .setDescription(
            `**Command**: \`${command.name}\` \n \n **Args**: \`${
              args.length == 0 ? "None" : args
            }\` \n \n **User**: \`${msg.author.id}\``
          );

        (
          await client.channels.fetch(client.config.LOG_CHANNELS.COMMAND_USAGE)
        ).send({ embeds: [CommandUsageEmbed] });
      }
    }
  }
};
