module.exports = class Event {
  constructor() {
    this.name = "interactionCreate";
  }

  async run(client, interaction) {
    if (!interaction.guild || !interaction.isCommand()) return;

    const guildData = await client.dbManager.getGuild(
      interaction.guild.id,
      true
    );
    const userData = await client.dbManager.getUser(
      interaction.member.id,
      true
    );

    if (guildData?.data && userData?.preferences) {
      let preferedLanguage;
      if (userData?.preferences?.language)
        preferedLanguage = userData.preferences.language;
      else preferedLanguage = guildData.data.preferences.language;

      const command = client.isCommand(interaction.commandName);

      const args = new Array();

      interaction?.options?.data?.forEach((option) => {
        args.push(option.value);
      });

      if (command) {
        const mainLocale = client.locales.get(preferedLanguage).main;

        let botCanRun = true;
        const botPerms = interaction.guild.me
          .permissionsIn(interaction.channel)
          .toArray();
        if (
          !botPerms.includes("SEND_MESSAGES") ||
          !botPerms.includes("READ_MESSAGE_HISTORY")
        )
          return;
        command.required_bot_perms.forEach((perm) => {
          if (!botPerms.includes(perm)) botCanRun = false;
        });

        let userCanRun = true;
        const userPerms = interaction.member
          .permissionsIn(interaction.channel)
          .toArray();
        command.required_perms.forEach((perm) => {
          if (!userPerms.includes(perm)) userCanRun = false;
        });

        // * Perm Checkup
        if (!botCanRun)
          return interaction.reply(mainLocale.BOT_NOT_ENOUGH_PERM);
        if (!userCanRun)
          return interaction.reply(mainLocale.USER_NOT_ENOUGH_PERM);

        const commandLocale =
          client.locales
            .get(preferedLanguage)
            .locales.find((locale) => locale.cmd == command.name) || {};
        if (!commandLocale.content)
          return interaction.reply("ERROR: LOCALE_NOT_AVAILABLE");

        commandLocale.content.language = preferedLanguage;

        // * Music Command Checkup
        if (command.category == "Music") {
          const guildState = client.songStates.get(msg.guild.id);
          if (
            msg.guild.me.voice?.channel &&
            interaction?.guild?.me?.voice?.channel?.id !=
              interaction?.member?.voice.channel?.id
          )
            return interaction.reply(mainLocale.NOT_SAME_VC);

          if (
            command.name != "play" &&
            command.name != "join" &&
            command.name != "disconnect"
          ) {
            if (!guildState || !guildState.playing)
              return interaction.reply(mainLocale.ALREADY_NOT_PLAYING_SONG);
          }
        }

        command.run(client, interaction, args, commandLocale.content);

        if (client.config.DASHBOARD.CLIENT_ID != client.user.id) return;

        const CommandUsageEmbed = new MessageEmbed()
          .setColor("#5865F2")
          .setDescription(
            `**Command**: \`${command.name}\` \n \n **Args**: \`${
              args.length == 0 ? "None" : args
            }\` \n \n **User**: \`${msg.author.id}\``
          );

        client.channels.cache
          .get(client.config.LOG_CHANNELS.COMMAND_USAGE)
          .send({ embeds: [CommandUsageEmbed] })
          .catch((err) => {});
      }
    }
  }
};
