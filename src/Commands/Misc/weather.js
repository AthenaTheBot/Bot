const run = async (client, message, args, locale, db) => {

    // Variables
    const { MessageEmbed } = require('discord.js');
    
    const errorEmbed = new MessageEmbed().setColor('RED');
    const alertEmbed = new MessageEmbed().setColor('YELLOW');
    const successEmbed = new MessageEmbed().setColor('GREEN');
    const defaultEmbed = new MessageEmbed().setColor(client.branding.colors.default);

    const fetch = require('node-fetch');
    const Discord = require('discord.js');
    const embed = new Discord.MessageEmbed();
    const city = args.slice(0).join(' ');

    if (!city) return message.channel.send(errorEmbed.setColor('RED').setDescription(`${client.branding.emojis.error} ${locale.NO_CITY}`));

    var regex = /^[a-zA-Z\d\-_.,\s]+$/g
    if (!city.match(regex)) return message.channel.send(errorEmbed.setColor('RED').setDescription(`${client.branding.emojis.error} ${locale.SPECIAL_CHAR}`));

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${locale.LANG}&units=metric&appid=${client.config.apiKeys.OPENWEATHER}`)
    .then(res => res.json())
    .then(json => {


        if (json.cod !== 200) {

            return message.channel.send(errorEmbed.setColor('RED').setTitle(locale.CITY_NOT_FOUND).setDescription(locale.CITY_NOT_FOUND_DESC))
        }

        defaultEmbed
        .setColor('RANDOM')
        .setDescription(`**${json.name}**, **${json.sys.country}** | ${locale.TITLE} \n **──────────────────────────────**`)
        .addFields(
            { name: locale.WEATHER, value: json.weather[0].description.charAt(0).toUpperCase() + json.weather[0].description.slice(1), inline: true },
            { name: locale.TEMP, value: '`' + Math.trunc(json.main.temp) + '` **°**', inline: true },
            { name: locale.FEELSLIKE, value: '`' + Math.trunc(json.main.feels_like) + '` **°**', inline: true },
            { name: locale.HUMIDITY, value: '`' + json.main.humidity + '` %', inline: true },
            { name: locale.WIND, value: '`' + json.wind.speed + '` km/h', inline: true },
            { name: locale.PRESSURE, value: '`' + json.main.pressure + '` Pa', inline: true }
        )
        return message.channel.send(defaultEmbed);

    }) 
    .catch(err => {
        return client.handleError({ commandName: module.exports.Name, channelID: message.channel.id, msg: locale.ERROR_MSG, error: err, print: true });
    })

}

module.exports = {
    Name: 'weather', 
    Aliases: ['havadurumu'],
    Category: 'Misc',
    Description: 'Search for any city and get it\'s weather information.',
    Cooldown: 4,
    Usage: '[city]',
    RequiredPerms: [],
    RequiredBotPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    Run: run
}
