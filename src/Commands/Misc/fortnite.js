const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const fetch = require('node-fetch');
    
    const userData = await db.manager.getUser(message.author);

    const tips = userData.preferences.tips
    let msg;
    if (tips) msg = locale.TIP;
    else msg = '';

    if (!args[0]) return message.channel.send(msg, errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.NO_ARGS}`))
    
    if (args[0] === 'daily' || args[0] === 'günlük' || args[0] === 'shop' || args[0] === 'market' || args[0] === 'mağaza') {

        return message.channel.send(alertEmbed.setColor('YELLOW').setDescription(locale.IN_MAINTAINCE));

    }

    if (args[0] === 'stats') {

        if (!args[1]) return message.channel.send(msg, errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.INVALID_PLATFORM}`));

        if (args[1] === 'kbm' || args[1] === 'gamepad' || args[1] === 'touch') {

            const name = args.slice(2).join(' ');

            if (!name) return message.channel.send(msg, errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.INVALID_USER}`));

            var regex = /^[a-zA-Z\d\-_.,\s]+$/g
            if (!name.match(regex)) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.SPECIAL_CHAR}`));

            fetch(`https://api.fortnitetracker.com/v1/profile/${args[1]}/${name}`, {
                headers: {
                    'TRN-Api-Key': client.config.apiKeys.FORTSTAT,
                }
            })
            .then(res => res.json())
            .then(json => {

                if (json.error) return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.USER_NOT_FOUND}`));

                // Lifetime Stats | x.value
                let lifetimewins = '`' + json.lifeTimeStats.find(x => x.key === 'Wins').value + '`' // Wins
                let lifetimewinratio = '`' + json.lifeTimeStats.find(x => x.key === 'Win%').value + '`' // Win Ratio
                let lifetimekills = '`' + json.lifeTimeStats.find(x => x.key === 'Kills').value + '`' // Kills
                let lifetimekd = '`' + json.lifeTimeStats.find(x => x.key === 'K/d').value + '`' // K/D
                let lifetimetop10 = '`' + json.lifeTimeStats.find(x => x.key === 'Top 10').value + '`' // TOP 3
                let lifetimetop25 = '`' + json.lifeTimeStats.find(x => x.key === 'Top 25s').value + '`' // TOP 25

                // Solo Stats
                let solomatches = '`' + json.stats.p2.matches.displayValue + '`' // Solo Matches
                let solokills = '`' + json.stats.p2.kills.displayValue + '`' // Solo Kills
                let solowins = '`' + json.stats.p2.top1.displayValue + '`' // Solo Wins
                let solowinratio = '`' + json.stats.p2.winRatio.displayValue + '`' // Solo Win Ratio

                // Duo Matches
                let duomatches = '`' + json.stats.p10.matches.displayValue + '`' // Duo Mathces
                let duokills = '`' + json.stats.p10.kills.displayValue + '`' // Duo Kills
                let duowins = '`' + json.stats.p10.top1.displayValue + '`' // Duo Wins
                let duowinratio = '`' + json.stats.p10.winRatio.displayValue + '`' // Duo Win Ratio

                // Squad Stats
                let squadmatches = '`' + json.stats.p9.matches.displayValue + '`' // Duo Mathces
                let squadkills = '`' + json.stats.p9.kills.displayValue + '`' // Duo Kills
                let squadwins = '`' + json.stats.p9.top1.displayValue + '`' // Duo Wins
                let squadwinratio = '`' + json.stats.p9.winRatio.displayValue + '`' // Duo Win Ratio

                // LTM Stats
                let ltmmatches = '`' + json.stats.ltm.matches.displayValue + '`' // LTM Matches
                let ltmkills = '`' + json.stats.ltm.kills.displayValue + '`' // LTM Kills
                let ltmwins = '`' + json.stats.ltm.top1.displayValue + '`' // LTM Wins
                let ltmwinratio = '`' + json.stats.ltm.winRatio.displayValue + '`' // LTM Win Ratio

                defaultEmbed
                .setThumbnail(json.avatar)
                .setFooter(locale.FOOTER)
                .setDescription(`${locale.TITLE.replace('$user', name)} \n **─────────────────────────────────**`)
                .addFields(
                    { name: locale.SOLO, value: `${locale.MATCHES}: ${solomatches} \n ${locale.KILLS}: ${solokills} \n ${locale.WINS}: ${solowins} \n ${locale.WIN_RATIO}: ${solowinratio}`, inline: true },
                    { name: locale.DUO, value: `${locale.MATCHES}: ${duomatches} \n ${locale.KILLS}: ${duokills} \n ${locale.WINS}: ${duowins} \n ${locale.WIN_RATIO}: ${duowinratio}`, inline: true },
                    { name: locale.SQUAD, value: `${locale.MATCHES}: ${squadmatches} \n ${locale.KILLS}: ${squadkills} \n ${locale.WINS}: ${squadwins} \n ${locale.WIN_RATIO}: ${squadwinratio}`, inline: true },
                    { name: locale.LTM, value: `${locale.MATCHES}: ${ltmmatches} \n ${locale.KILLS}: ${ltmkills} \n ${locale.WINS}: ${ltmwins} \n ${locale.WIN_RATIO}: ${ltmwinratio}`, inline: true },
                    //{ name: locale.LIFETIME, value: `${locale.WINS}: ${lifetimewins} \n ${locale.WIN_RATIO}: ${lifetimewinratio} \n ${locale.KILLS}: ${lifetimekills} \n K/D: ${lifetimekd} \n Top 10: ${lifetimetop10} \n Top 25: ${lifetimetop25}`, inline: true },
                )
                return message.channel.send(defaultEmbed);

            })
            .catch(err => {
                return client.handleError({ commandName: module.exports.Name, channelID: message.channel.id, msg: locale.ERROR_MSG, error: err, print: true });
            })

        } else return message.channel.send(msg, errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.INVALID_PLATFORM}`));

        return;
    }

    return message.channel.send(errorEmbed.setDescription(`${client.branding.emojis.error} ${locale.INVALID_ARG}`));
}

module.exports = {
    Name: 'fortnite', 
    Aliases: ['FORTNİTE'],
    Category: 'Misc',
    Description: 'Shows the fortnite stats of the specified account.',
    Cooldown: 4,
    Usage: '[kbm, gamepad, touch] [name]',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
