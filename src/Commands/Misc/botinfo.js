const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    // Uptime    
    let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    // Ram Kullanımı
    const ram = process.memoryUsage().rss / 1024 / 1024;
    const ramusage = Math.trunc(ram);

    // Prefix
    const data = await db.manager.getGuild(message.guild);
    const prefix = data.data.preferences.prefix;
    
    if (prefix === null) prefix = client.config.default.PREFIX;
    
    let djsversion = require('../../../package.json').dependencies['discord.js']

    if (djsversion === null || djsversion === undefined) djsversion = '12.0.0';
    
    defaultEmbed
    .setDescription('**────────────── Athena ──────────────**')
    .setThumbnail(client.user.displayAvatarURL({ size: 4096, format: 'png', dynamic: true }))
    .addField(locale.PREFIX, '`' + prefix + '`', true)
    .addField(locale.RAM_USAGE, '`' + ramusage + '` MB', true)
    .addField(locale.PING, `\`${client.ws.ping}\`` + ' ms', true)
    .addField(locale.GUILD_COUNT, `\`${client.guilds.cache.size}\``, true)
    .addField(locale.USER_COUNT, `\`${client.users.cache.size}\``, true)
    .addField(locale.SHARD_COUNT, '`1`', true)
    .addField(locale.UPTIME, '`' + days + '` ' + locale.DAY + '\n `' + hours + '` ' + locale.HOUR + '\n`' + minutes + '` ' + locale.MINUTE + '\n `' + seconds + '` ' + locale.SECOND, true)
    .addField(locale.NODEJS, process.version, true)
    .addField(locale.DISCORDJS, djsversion, true)
    .setFooter('Version: ' + client.config.bot.VERSION, message.author.displayAvatarURL())
    .setTimestamp()
    message.channel.send(defaultEmbed)

}

module.exports = {
    Name: 'botinfo', 
    Aliases: ['BOTİNFO', 'botbilgi', 'BOTBİLGİ'],
    Category: 'Misc',
    Description: 'Simple command to get information about Athena.',
    Cooldown: 2,
    Usage: '',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
