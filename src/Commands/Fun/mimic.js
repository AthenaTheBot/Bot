const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    let mention = message.mentions.users.first();
    const str = args.slice(1).join(' ')

    if (!args[0]) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.INVALID_MEMBER}`));

    let targetID;
    if (mention) targetID = mention.id;
    else {
        const check = message.guild.members.cache.get(args[0]);
        if (!check) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.INVALID_MEMBER}`));
        else targetID = check.id;
    }

    if (!str) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.INVALID_MSG}`));

    message.delete().catch(err => {});

    const target = message.guild.members.cache.get(targetID);

    const webhook = await message.channel.createWebhook(target.user.username, { avatar: target.user.displayAvatarURL(), reason: 'Mimic command.' }).catch(err => {});

    webhook.send(str).catch(err => {});

    setTimeout(() => {

        webhook.delete('Mimic command.').catch(err => {});
    }, 3000);
}

module.exports = {
    Name: 'mimic', 
    Aliases: ['taklit', 'taklitet'],
    Category: 'Fun',
    Description: 'Hmm, maybe Athena can mimic someone, who knows...',
    Cooldown: 2.5,
    RequiredPerms: [],
    RequiredBotPerms: ["MANAGE_WEBHOOKS", "SEND_MESSAGES"],
    Run: run
}
