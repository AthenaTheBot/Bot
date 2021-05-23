const express = require('express');
const router = express.Router();

const encryptor = require('simple-encryptor').createEncryptor('abcdefgeijklmnorçöasşay?124568?_**!$');
const path = require('path');

const fetch = require('node-fetch');

const fs = require('fs');

const Athena = require('../../athena');

const { Permissions } = require('discord.js');

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

router.get('/errors', async (req, res) => {

    const userData = await encryptor.decrypt(req.cookies._ud);

    if (userData && userData.id == Athena.config.bot.OWNER) {

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

router.post('/guilds/:id', async (req, res) => {

    if (!req.cookies || !req.cookies.session || !encryptor.decrypt(req.cookies.session)) return res.status(403).json({ status: 403, message: 'Unauthorized' }).end();

    if (!req.params || !req.params.id || isNaN(req.params.id) || !req.body || !req.body.operation) return res.status(400).json({ status: 400, message: 'Bad Request' }).end();

    const guildData = await Athena.db.collection('servers').findOne({ _id: req.params.id }).catch(err => {});
            
    if (!guildData || !guildData.data) return res.status(500).json({ status: 500, message: 'Server Error' }).end();

    switch(req.body.operation) {
        case 'getGuild':
            res.status(200).json({ status: 200, data: guildData.data });
            break;

        case 'setPrefix':

            if (req.body.value == guildData.data.preferences.prefix) return res.status(401).json({ status: 401, message: 'Bad Request', code: 'same_prefix' }).end();

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

            if (req.body.value == guildData.data.preferences.language || !validLanguages.includes(req.body.value)) return res.status(400).json({ status: 400, message: 'Bad Request', code: 'same_language' }).end();

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

    if (req.cookies || req.cookies.session) return res.status(403).json({ status: 403, message: 'Unauthorized' }).end();

    const sessionKey = await encryptor.decrypt(req.cookies.session);

    let userCurrentGuilds = await fetch('https://discord.com/api/users/@me', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${sessionKey}`,
        }
    })
    .then(res => res.json()).catch(err => {});

    if (!userCurrentGuilds) return res.status(500).json({ status: 500, message: 'Server Error' }).end();

    return res.status(200).json({ status: 200, data: userCurrentGuilds }).end();
});

router.get('/users/@me/guilds', async (req, res) => {

    if (!req.cookies || !req.cookies.session) return res.status(403).json({ status: 403, message: 'Unauthorized' }).end();

    const sessionKey = await encryptor.decrypt(req.cookies.session);

    let userCurrentGuilds = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${sessionKey}`,
        }
    })
    .then(res => res.json()).catch(err => {});

    if (!userCurrentGuilds) return res.status(500).json({ status: 500, message: 'Server Error' }).end();

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