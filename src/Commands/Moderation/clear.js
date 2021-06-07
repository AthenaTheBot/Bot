const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    if (!args[0] || isNaN(args[0]) || args[0] <= 0) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.INVALID_AMOUT}`));

    let deleteCount = 0;

    if (args[0] > 100) {

        const loopCount = `${Math.trunc(args[0] / 100)}`;
        let remainder = `${args[0] / 100}`.split(`${loopCount}.`).pop()

        if (Number.isInteger(args[0] / 100)) {

            remainder = null;

        } else {

            if (remainder.startsWith('0'))  remainder = `${remainder.split('0').pop()}`;

        }

        for (var i = 1; i <= loopCount; i++) {

            const msg1 = await message.channel.bulkDelete(100).catch(err => {});
            deleteCount = deleteCount + msg1.size;
        }

        if (remainder != null && remainder > 0) { 

            const msg2 = await message.channel.bulkDelete(remainder).catch(err => {});
            deleteCount = deleteCount + msg2.size;
        }

        const clearMsg = await message.channel.send(locale.SUCCESS.replace('$count', deleteCount));

        setTimeout(() => { clearMsg.delete(); }, 2000);

        return;

    } else {

        const msg3 = await message.channel.bulkDelete(args[0]).catch(err => {});

        deleteCount = deleteCount + msg3.size;

        const clearMsg = await message.channel.send(locale.SUCCESS.replace('$count', deleteCount));
    
        setTimeout(() => {  clearMsg.delete().catch(err => {}); }, 2000);

        return;
    }

}

module.exports = {
    Name: 'clear', 
    Aliases: ['purge', 'sil', 'temizle'],
    Category: 'Moderation',
    Description: 'Simply clears the given amout of message from the command channel.',
    Cooldown: 1,
    Usage: '[amout]',
    RequiredPerms: ["MANAGE_MESSAGES"],
    RequiredBotPerms: ["MANAGE_MESSAGES", "SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
