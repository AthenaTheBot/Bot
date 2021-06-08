const express = require('express');
const router = express.Router();

const encryptor = require('simple-encryptor').createEncryptor('abcdefgeijklmnorçöasşay?124568?_**!$');
const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs');
const Athena = require('../../athena');
const { Permissions } = require('discord.js');

router.get('/commands', (req, res) => {

    const commands = new Array();

    try {

        const validCategories = fs.readdirSync(path.join(__dirname, '..', '..', 'Commands'));

        validCategories.forEach((category) => {
    
            if (category == 'Owner') return;
            
            const categoryCommands = new Array();
    
            const commandFiles = fs.readdirSync(path.join(__dirname, '..', '..', 'Commands', category)).filter(file => file.endsWith('.js'));
    
            commandFiles.forEach(commandFile => {
    
                const command = require(path.join(__dirname, '..', '..', 'Commands', category, commandFile));
    
                if (!Athena.commands.get(command.Name) || command.Category == 'Owner') return;
                
                return categoryCommands.push({ 
                    name: command.Name, 
                    description: command.Description || 'None', 
                    usage: command.Usage || 'None',
                    required_perms: command.RequiredPerms, 
                    required_bot_perms: command.RequiredBotPerms 
                });
            })
    
            commands.push({ category: category, commands: categoryCommands });
        });
    }
    catch (err) {

        Athena.log('error', err);
        return res.status(500).json({ status: 500, message: 'Server Error' });
    }

    let filteredCategory;
    if (req.query.category) {
        filteredCategory = commands.filter(commands => commands.category == req.query.category);
        if (filteredCategory.length == 0) return res.status(400).json({ status: 400, message: 'Bad Request' }).end();
    }
    else filteredCategory = commands;

    return res.json({ status: 200, data: filteredCategory });
})

router.get('/vote', async (req, res) => {

    if (req.header('Authorization')) {

        let user;
        switch(req.header('Authorization')) {
            case Athena.webhookTokens.TOPGG:
                user = req.body.user;
                break;
            case Athena.webhookTokens.BOTSFORDISCORD:
                user = req.body.user;
                break;
            case Athena.webhookTokens.DISCORDBOATS:
                user = req.body.user.id;
                break;
            case Athena.webhookTokens.DCBOTLISTCOM:
                user = req.body.id;
                break;
            default:
                user = undefined;
                break;
        }

        if (!user) return res.status(403).json({ status: 403, message: 'Unauthorized' }).end();
        else {

            res.status(200).json({ status: 200, message: 'Successful' }).end();

            let userDiscordData = await Athena.users.cache.get(user);
            let userData = await Athena.db.manager.getUser(userDiscordData);

            if (!userData || !userDiscordData) return;
            
            Athena.log("log", `${userDiscordData.tag} is voted!`);
            
            if (!userData.preferences.notifications) return;
            else {

                let language = userData.preferences.language;
                if (!userData.preferences.language) language = client.config.defaults.LANGUAGE;
                        
                const mainLocale = require(`../Locales/${language}/main.json`);

                return userDiscordData.send(mainLocale.VOTE_MSG.replace('$user', userDiscordData.username).replace('$emoji', '<a:tadaa:805507286402596894>')).catch(err => {});
            };
        };
    }
    else {

        return res.status(403).json({ status: 403, message: 'Unauthorized' }).end();
    }
});

router.get('/errors', async (req, res) => {

    if (!req.cookies || !req.cookies.session) return res.status(403).json({ status: 403, message: 'Unauthorized' }).end();

    const session = await encryptor.decrypt(req.cookies.session);

    if (session && session.id == Athena.config.bot.OWNER) {

        if (req.query && req.query.operation) {

            if (req.query.operation == 'reset') {

                try {

                    await fs.writeFileSync(path.join(__dirname, '..', '..', '..', 'Errors.json'), JSON.stringify({ ERRORS: [] }));
                }
                catch (err) {

                    return res.status(500).json({ status: 500, message: err }).end(); 
                }

                return res.status(200).json({ status: 200, message: 'Successfully reset the errors file.' }).end();
            }

            return;
        }

        try {

            delete require.cache[require.resolve(path.join(path.join(__dirname, '..', '..', '..', 'Errors.json')))];

            let ErrorFile = require(path.join(__dirname, '..', '..', '..', 'Errors.json'));
            ErrorFile.status = 200;

            if (ErrorFile.ERRORS.length == 0) ErrorFile.ERRORS = 'No Errors Found';

            return res.status(200).json({ status: 200, errors: ErrorFile.ERRORS }).end();

        }
        catch (err) {

            if (err.code == 'MODULE_NOT_FOUND') return res.status(200).json({ status: 200, errors: 'No Errors Found' }).end();
            else {

                return res.status(500).json({ status: 500, message: err }).end();
            }
        }
    }
    else {

        res.status(403).json({ status: 403, message: 'Unauthorized' }).end();
    }
})

router.post('/report', async (req, res) => {

    if (!req.cookies || !req.cookies.session || !encryptor.decrypt(req.cookies.session)) return res.status(403).json({ status: 403, message: 'Unauthorized' }).end();

    if (!req.body || !req.body.id || !req.body.content) return res.status(400).json({ status: 400, message: 'Bad Request' }).end();

    if (Athena.websiteRequestCache.includes(req.ip)) return res.status(429).json({ status: 429, message: 'Too Many Requests!' }).end();

    const userData = encryptor.decrypt(req.cookies.session);

    let run = true;
    fetch(Athena.config.dashboard.REPORTS_WEBHOOK, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tts: false,
            embeds: [
                {
                    description: `**Reporter**: \n ${userData.username}#${userData.discriminator} | \`${userData.id}\` \n \n **Reported User**: \n \`${req.body.id}\` \n \n **Content**: \n ${req.body.content}`,
                    color: 7506394,
                }
            ]
        })
    })
    .catch(err => {

        res.status(500).json({ status: 500, message: 'Server Error' }).end();
        setRequestCache(req.ip);
        run = false;
        return;
    })

    if (!run) return;

    res.status(200).json({ status: 200, message: 'Success' }).end();
    setRequestCache(req.ip);
    return;
})

router.post('/guilds/:id', async (req, res) => {

    if (!req.cookies || !req.cookies.session || isNaN(req.params.id) || req.params.id.length != 18) return res.status(400).json({ status: 400, message: 'Bad Request' }).end();

    const session = await encryptor.decrypt(req.cookies.session);

    if (!session || !session) return res.status(400).json({ status: 400, message: 'Bad Request' }).end();

    let userCurrentGuilds = await getCurrentUserGuilds(session.key, true);
    
    if (!userCurrentGuilds || userCurrentGuilds.length == 0 || userCurrentGuilds.retry_after) return res.status(500).json({ status: 500, message: 'Server Error' }).end();

    const availabeGuild = userCurrentGuilds.filter(x => x.id == req.params.id);

    if (!availabeGuild || availabeGuild.length == 0) return res.status(400).json({ status: 400, message: 'Bad Request' }).end();

    const perms = new Permissions(availabeGuild[0].permissions).toArray();

    if (!perms || !perms.includes('ADMINISTRATOR') && availabeGuild[0].owner != true) return res.status(403).json({ status: 403, message: 'Unauthorized' }).end();

    const guildData = await Athena.db.collection('servers').findOne({ _id: req.params.id }).catch(err => {});

    if (!guildData || !guildData.data) return res.status(500).json({ status: 500, message: 'Server Error' }).end();

    switch(req.body.operation) {
        case 'getGuild':
            res.status(200).json({ status: 200, data: guildData.data }).end();
            break;

        case 'getMusicState':
            let data = await Athena.guildMusicStates.get(req.params.id) || {};
            res.status(200).json({ status: 200, a: true, data: { playing: data.playing || null, queue: data.queue || [], loop: data.loop || false } }).end();
            break;  

        case 'updateMusicState':
            const validStates = ['pause', 'resume', 'skip', 'enableLoop', 'disableLoop'];
            if (!req.body.value || !validStates.includes(req.body.value)) return res.status(400).json({ status: 400, message: 'Bad Request' }).end();
            const guildState = Athena.guildMusicStates.get(req.params.id);
            if (!guildState) return res.status(400).json({ status: 400, message: 'Bad Request' }).end();
            switch(req.body.value) {
                case 'pause':
                    guildState.player.pause();
                    res.status(200).json({ status: 200, message: 'Successfull' }).end();
                    break;

                case 'resume':
                    guildState.player.resume();
                    res.status(200).json({ status: 200, message: 'Successfull' }).end();
                    break;

                case 'skip':
                    const guildMusicState = Athena.guildMusicStates.get(req.params.id);
                    guildMusicState.queue.shift();
                    const guildData = await Athena.guilds.fetch(req.params.id);
                    if (guildMusicState.queue.length == 0) guildData.me.voice.channel.leave();
                    else {
                        Athena.musicPlayer.play(Athena, guildData);
                    }
                    res.status(200).json({ status: 200, message: 'Successfull' }).end();
                    break;

                case 'enableLoop':
                    const guildMusicState2 = Athena.guildMusicStates.get(req.params.id);
                    guildMusicState2.loop = true;
                    res.status(200).json({ status: 200, message: 'Successfull' }).end();
                    break;

                case 'disableLoop':
                    const guildMusicState3 = Athena.guildMusicStates.get(req.params.id);
                    guildMusicState3.loop = false;
                    res.status(200).json({ status: 200, message: 'Successfull' }).end();
                    break;

            }
            break;

        case 'setPrefix':

            if (req.body.value == guildData.data.preferences.prefix) return res.status(401).json({ status: 401, message: 'Bad Request' }).end();

            try {

                await Athena.db.manager.setValue({ collection: 'servers', query: { _id: req.params.id }, operation: { $set: { "data.preferences.prefix": req.body.value } } });
            }
            catch(err) {

                Athena.log('error', err);
                return res.status(500).json({ status: 500, message: 'Server Error' }).end();
            }

            res.status(200).json({ status: 200, message: 'Successfull' }).end();

            break;

        case 'setLanguage':
            const validLanguages = ['en-US', 'tr-TR'];

            if (!validLanguages.includes(req.body.value) )return res.status(400).json({ status: 400, message: 'Bad Request' }).end();

            if (req.body.value == guildData.data.preferences.language) return res.status(401).json({ status: 401, message: 'Bad Request' }).end();

            try {

                await Athena.db.manager.setValue({ collection: 'servers', query: { _id: req.params.id }, operation: { $set: { "data.preferences.language": req.body.value } } });
            }
            catch(err) {

                Athena.log('error', err);
                return res.status(500).json({ status: 500, message: 'Server Error' }).end();
            }

            res.status(200).json({ status: 200, message: 'Successfull' }).end();

            break;

            default:
            res.status(400).json({ status: 400, message: 'Bad Request' }).end();
            break;
    }
});

router.get('/users/@me', async (req, res) => {

    if (!req.cookies || !req.cookies.session) return res.status(403).json({ status: 403, message: 'Unauthorized' }).end();

    const userData = await encryptor.decrypt(req.cookies.session);

    userData.key = null;

    return res.status(200).json({ status: 200, data: userData }).end();
})

router.get('/users/@me/guilds', async (req, res) => {

    if (!req.cookies || !req.cookies.session) return res.status(403).json({ status: 403, message: 'Unauthorized' }).end();

    const session = await encryptor.decrypt(req.cookies.session);

    if (!session) return res.status(400).json({ status: 400, message: 'Bad Request' }).end();

    let userCurrentGuilds = await getCurrentUserGuilds(session.key, false);

    const availabeGuilds = new Array();
    for (var i = 0; i < userCurrentGuilds.length; i++) {
        const perrmissions = new Permissions(userCurrentGuilds[i].permissions);
        userCurrentGuilds[i].permissions = perrmissions.toArray();
        const guildInfo = Athena.guilds.resolve(userCurrentGuilds[i].id);
        if (guildInfo) {
            userCurrentGuilds[i].memberCount = guildInfo.memberCount;
            userCurrentGuilds[i].channelCount = guildInfo.channels.cache.size;
        }
        else {
            userCurrentGuilds[i].memberCount = 'Unknown';
            userCurrentGuilds[i].channelCount = 'Unknown';
        }
        if (userCurrentGuilds[i].owner || userCurrentGuilds[i].permissions.includes('ADMINISTRATOR')) availabeGuilds.push(userCurrentGuilds[i]); 
    };

    return res.status(200).json({ status: 200, data: availabeGuilds }).end();
});

module.exports = router;

const getCurrentUserGuilds = async (sessionKey, cache) => {

    if (cache) return Athena.websiteUserGuildsCache.get(sessionKey);

    let userCurrentGuilds = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${sessionKey}`,
        }
    })
    .then(res => res.json()).catch(err => {});

    if (!userCurrentGuilds) return undefined;
    else {

        Athena.websiteUserGuildsCache.set(sessionKey, userCurrentGuilds);
        return userCurrentGuilds;
    }
};

const setRequestCache = (ip) => {

    Athena.websiteRequestCache.push(ip);

    setTimeout(() => {

        const filteredArray = Athena.websiteRequestCache.filter(x => x != ip);

        Athena.websiteRequestCache = filteredArray;

    }, 120000)
}