const { MessageEmbed } = require('discord.js');
const path = require('path');

module.exports = {
    name: 'message',
    async run(base, message) {

        if (message.author.bot) return;

        const Embed = new MessageEmbed();
    
        if (!message.guild) {
    
            if (message.author.id === base.config.bot.OWNER) {
    
                let prefix = 'at!';
                let args = message.content.slice(prefix.length).trim().split(/ +/g);
                const cmd = args.shift().toLowerCase();

                let command;
                if (base.commands.has(cmd)) command = base.commands.get(cmd);
                else if (base.commandAliases.has(cmd)) command = base.commandAliases.get(cmd); 

                if (command) {

                    if (command.Category != 'Owner') return;
                    command.Run(base, message, args);

                } else return;
                
            } else return;
    
        } else {

            const userData = await base.db.manager.getUser(message.author);
            const guildData = await base.db.manager.getGuild(message.guild);
    
            let language;
            if (userData.preferences.language === null) language = guildData.data.preferences.language;
            else language = userData.preferences.language;
    
            let prefix = guildData.data.preferences.prefix;
            let args = message.content.slice(prefix.length).trim().split(/ +/g);
            const cmd = args.shift().toLowerCase();
            `${__dirname}/../Locales/${language}/main.json`
            const mainLocale = JSON.parse(JSON.stringify(require(path.join(__dirname, '../Locales', language, 'main.json'))));

            var expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
            var regex = new RegExp(expression);
    
            if (message.content.match(regex)) {
    
                if (guildData.data.moderationModule.linkProtection.status) {
    
                    if (guildData.data.moderationModule.linkProtection.whitelist.channels.includes(message.channel.id)) return;
                    if (guildData.data.moderationModule.linkProtection.whitelist.users.includes(message.author.id)) return;
    
                    message.delete();
                    return message.reply(mainLocale.LINKS_PORHIBITED);
                }
            }
        
            if (!message.content.startsWith(prefix)) return;
    
            let command;
            if (base.commands.has(cmd)) command = base.commands.get(cmd);
            else if (base.commandAliases.has(cmd)) command = base.commandAliases.get(cmd); 
    
            if (command) {

                if (command.Category == 'Owner') return;

                if (base.cooldownFunctions.inCooldown(base, message.author.id, command.Name)) {

                    const userCooldownData = base.cooldowns.get(message.author.id).find(x => x.commandName == command.Name);

                    if (userCooldownData) {

                        if (userCooldownData.warnSent) return;
                        else {

                            if (base.permissionCheck(message.channel, message.guild.me, 'SEND_MESSAGES')) {
                                message.reply(mainLocale.COOLDOWN_WARNING.replace('$commandName', command.Name));
                            }

                            base.cooldownFunctions.updateState(base, message.author.id, command.Name, true);
                            return;
                        }
                    }
                }

                const locale = require(path.join(__dirname, '../Locales', language, command.Category, command.Name));

                // Bot Perm Checkup
                let botCanRunCommand = true;
                let botRequiredPerms = new Array();
                command.RequiredBotPerms.forEach(permission => {
                    let channel = message.channel;
                    if (!base.permissionCheck.textBasedPerms.includes(permission)) channel = message.member.voice.channel;
                    if (!base.permissionCheck(channel, message.guild.me, permission)) {
                        botCanRunCommand = false;
                        botRequiredPerms.push(permission);
                    };
                });

                // User Perm Checkup
                let canRunCommand = true;
                let requiredPerms = new Array();
                command.RequiredPerms.forEach(permission => {
                    let channel = message.channel;
                    if (!base.permissionCheck.textBasedPerms.includes(permission)) channel = message.member.voice.channel;
                    if (!base.permissionCheck(channel, message.member, permission)) {
                        canRunCommand = false;
                        requiredPerms.push(permission);
                    };
                });

                try {
    
                    if (!botCanRunCommand) {

                        if (!botRequiredPerms.includes('SEND_MESSAGES')) {
                        
                            let msg = mainLocale.BOT_NEED_PERM.replace('$RequiredBotPerms', `\`${botRequiredPerms.join('`, `')}\``);

                            if (!botRequiredPerms.includes('EMBED_LINKS')) {

                                msg = Embed
                                .setColor(base.branding.colors.default)
                                .setDescription(mainLocale.BOT_NEED_PERM.replace('$RequiredBotPerms', `\`${botRequiredPerms.join('`, `')}\``));
                            };

                            message.channel.send(msg).catch(err => {});

                            return await base.cooldownFunctions.add(base, message.author.id, command.Name, command.Cooldown);
                        }
                        else {

                            base.users.cache.get(message.author.id).send(mainLocale.INSUFFICENT_PERM).catch(err => {});
                            return await base.cooldownFunctions.add(base, message.author.id, command.Name, command.Cooldown);
                        }
                    }

                    if (!canRunCommand) return message.channel.send(Embed.setColor(base.branding.colors.default).setDescription(mainLocale.NEED_PERM.replace('$RequiredPerms', `\`${requiredPerms.join('`, `')}\``)))
                    .catch(err => {});

                    await command.Run(base, message, args, locale, base.db);

                    base.cooldownFunctions.add(base, message.author.id, command.Name, command.Cooldown);
                            
                } catch (err) {
    
                    base.log('error', `${err} (${command.Name})`);
    
                } finally {
    
                    base.log('usage', `${message.author.tag}, used command ${command.Name}.`);

                    if (base.user.id === base.config.bot.CLIENT_ID && message.author.id != base.config.bot.OWNER) {
                        if (!args || args.length == 0) args = 'None';
                        base.channels.cache.get(base.config.channels.COMMAND).send(Embed.setColor(base.branding.colors.default).setDescription(`**Used Command**: \n \`${command.Name}\` | \`${args}\` \n \n **Command User**: \n \`${message.author.id}\` `));
                    }
    
                    base.db.manager.nullCheck(message);
    
                };
    
            };
    
        };
    }
};