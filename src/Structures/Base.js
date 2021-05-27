// Main Module
const { Client, Collection, MessageEmbed, Intents } = require('discord.js');

// Extra Modules We Require
const mongoose = require('mongoose');
const moment = require('moment');
const colors = require('colors');
const fs = require('fs');
const path = require('path');

// Base Class
class Base extends Client {
    constructor() {
        super({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
        this.config = require('../../config');
        this.dashboard = require('../Dashboard/server');
        this.permissionCheck = require('../Modules/permissionCheck');
        this.cooldownFunctions = require('../Modules/cooldownFunctions');
        this.musicPlayer = require('../Modules/musicPlayer.js');
        this.postStats = require('../Modules/postStats');
        this.db = mongoose.connection;
        this.commands = new Collection();
        this.commandAliases = new Collection();
        this.userDatabaseCache = new Collection();
        this.serverDatabaseCache = new Collection();
        this.guildMusicStates = new Collection();
        this.cooldowns = new Collection();
        this.websiteRequestCache = new Array();
        this.websiteUserGuildsCache = new Collection();
        this.branding = {
            colors: {
                default: '#7289DA'
            },
            "emojis": {
                success: '<a:success:824915268076699649>',
                error: '<a:error:824915320955207690>',
                alert: '<:alert:820047864561664061>',
                loading: '<a:loading:745226354269618236>'
            }
        };
    };

    async log(type, message) {

        const date = moment(Date.now()).format('DD/MM/YYYY - hh:mm');

        switch(type) {
            case 'ready':
                type = 'READY'.rainbow;
                break;
            case 'command':
                type = `COMMAND`.bgCyan.black;
                break;
            case 'event':
                type = 'EVENT'.bgBlue.black;
                break;
            case 'usage':
                type = 'USAGE'.bgMagenta.black;
                break;    
            case 'error':
                type = 'ERROR'.bgRed.black;
                break;
            case 'warn':
                type = 'WARN'.bgYellow.black;
                break;
            case 'success':
                type = 'SUCCESS'.bgGreen.black;
                break;
            default:
                type = 'LOG'.bgWhite.black.black;
                break;
        }

        console.log(`[${date}]:`, type, message);
    };

    async loadCommands(dir) {

        const categories = await fs.readdirSync(dir);

        try {
    
            categories.forEach(category => {
    
                const files = fs.readdirSync(path.join(dir, category)).filter(x => x.endsWith('.js'));
    
                files.forEach(async (file) => {
        
                    const command = require(path.join(dir, category, file));
    
                    if (!command.Name || !command.Aliases) return this.log('warn', `Found one command without command export or empty command name. Ignoring command.. (File: ${file})`);
                    else {

                        if (command.RequiredPerms.length > 0 || command.RequiredBotPerms > 0) {
                            let permsAreValid = true;
                            command.RequiredPerms.forEach(perm => {
                                if (!this.permissionCheck.allValidPerms.includes(perm)) permsAreValid = false;
                            });
                            command.RequiredBotPerms.forEach(perm => {
                                if (!this.permissionCheck.allValidPerms.includes(perm)) permsAreValid = false;
                            });
                            if (!permsAreValid) return this.log('warn', `Found one command with invalid perms specified. Ignoring command.. (File: ${file})`);
                        };
                        
                        await this.commands.set(command.Name.toLowerCase(), command);
        
                        await command.Aliases.forEach(alias => { 
                            if (alias === '' || alias.length === 0) return this.log('error', `There is a command with empty alias. (Command: ${command.Name})`);
                            this.commandAliases.set(alias, command) 
                        });

                        this.log('command', 'Loaded command: ' + command.Name);
                    }
            
                })
        
            })
    
        } catch (err) {
    
            return this.log('error', `${err} (Command: ${err})`);
        }
    
    };

    async loadEvents(dir) {

        try {
    
            const files = fs.readdirSync(path.join(dir)).filter(file => file.endsWith('.js'));
            
            files.forEach(file => {
        
                const event = require(path.join(dir, file));
        
                this.on(event.name, async (data) => {
        
                    try {
                        event.run(this, data);
    
                    } catch(err) {
    
                        this.log('error', `${err} (${event.name})`);
                    }
    
                });
    
                this.log('event', 'Loaded event: ' + event.name);
            })
    
        }
        catch (err) {
    
            return this.log('error', err);
        }
    
    }

    async loadLocales(dir) {

        this.commands.forEach(command => {

            if (command.Category == 'Owner') return;

            try {

                const availabeLocales = fs.readdirSync(path.join(dir));

                command.locales = new Array();

                availabeLocales.forEach(locale => {

                    const commandLocale = require(path.join(dir, locale, command.Category, command.Name + '.json'));

                    commandLocale.language = locale;

                    command.locales.push(commandLocale);
                })

                this.commands.set(command.Name, command);
            }
            catch(err) {

                if (err.code == 'MODULE_NOT_FOUND') {
                    this.log('warn', `Found one command with missing locale. Disabling command for preventing bugs.. (Command: ${command.Name})`);
                    this.commands.delete(command.Name);
                    command.Aliases.forEach(alias => {
                        this.commandAliases.delete(alias);
                    });
                }
                else {

                    return this.log('error', err);
                }
            };
        });

        return this.log('success', 'Successfully loaded all command locales.');
    }

    async connectDB(url) {

        if (!url) return this.log('error', 'Invalid Mongo Database url.');
    
        try {
    
            await mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, keepAlive: true });
    
        } catch (err) {
    
            return this.log('error', `${err}`);
        }
    
        this.log('success', 'Successfully connected to the database.');
        
        return mongoose.connection;
    
    };

    async setPresence() {

        this.user.setActivity(`at!help | athenabot.site`, { type: 'PLAYING' });
    
        setInterval(() => { this.user.setActivity(`at!help | athenabot.site`, { type: 'PLAYING' }); }, 225000);
    }

    async handleError(data) {

        if (!data.commandName) data.commandName = 'None';

        if (data.print && data.error) {

            this.log('error', `${data.error} (Command: ${data.commandName})`);

            try {

                delete require.cache[require.resolve(path.join(__dirname, '..', '..', 'Errors.json'))];

                const currentErrorFile = require(path.join(__dirname, '..', '..', 'Errors.json'));
        
                currentErrorFile.ERRORS.push({ code: data.error.code, name: data.error.name, message: data.error.code, stack: data.error.stack });
        
                fs.writeFileSync(path.join(__dirname, '..', '..', 'Errors.json'), JSON.stringify(currentErrorFile));
                
            }
            catch(err) {

                if (err.code == 'MODULE_NOT_FOUND') {

                    this.log('warn', 'An error occured and error file not found! Creating error file..');

                    fs.writeFileSync(path.join(__dirname, '..', '..', 'Errors.json'), JSON.stringify({ ERRORS: [ { code: data.error.code, name: data.error.name, message: data.error.code, stack: data.error.stack } ] }));
                }
                else {

                    this.log('error', err);

                    fs.writeFileSync(path.join(__dirname, '..', '..', 'Errors.json'), JSON.stringify({ ERRORS: [ { code: data.error.code, name: data.error.name, message: data.error.code, stack: data.error.stack } ] }));

                }
            }
        }
    
        if (this.user.id != this.config.bot.CLIENT_ID) return;

        const errorEmbed = new MessageEmbed();
        errorEmbed.setColor('RED');

        this.channels.cache.get(this.config.channels.ERROR).send(errorEmbed.setDescription(`**An unexpred error occured on the bot!** \n ──────────────────────────── \n Command: \`${data.commandName}\` \n  \n Error: \n` + '```' + data.error + '```')); 

        if (!data.msg || !data.channelID) return;

        try {

            if (!data.msg || !data.channelID || data.msg === undefined || data.channelID === undefined) return;
            this.channels.cache.get(data.channelID).send(errorEmbed.setDescription(data.msg));

        } catch (err) {

            this.log('error', `${err}`);
        } 
    } 
}

module.exports = Base;