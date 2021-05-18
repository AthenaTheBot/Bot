const express = require('express');
const router = express.Router();
const encryptor = require('simple-encryptor').createEncryptor('abcçdefgğhıijklmnoöprsştuüvyz123456789?_-*');

const Athena = require('../../athena');

router.get('/', async(req, res) => {

    if (!req.cookies || !req.cookies._ud || !req.cookies._ug) return res.redirect('/oauth/login');

    let userData = await encryptor.decrypt(req.cookies._ud);
    let userGuilds = await encryptor.decrypt(req.cookies._ug);

    for (var i = 0; i < userGuilds.length; i++) {
        if (userGuilds[i].name.length > 25) userGuilds[i].name = userGuilds[i].name.slice(0, 25) + '...';
        const guild = Athena.guilds.resolve(userGuilds[i].id)
        if (!guild) {
            userGuilds[i].memberCount = 'Unknown';
            userGuilds[i].channelCount = 'Unknown';
            userGuilds[i].dashURL = '#';
            userGuilds[i].available = false;
        }
        else {
            userGuilds[i].memberCount = guild.memberCount;
            userGuilds[i].channelCount = guild.channels.cache.size;
            userGuilds[i].dashURL = '/dashboard/' + guild.id;
            userGuilds[i].available = true;
        }
    }

    return res.status(200).render('pages/dashboardServerChooser', {
        userData: userData,
        userGuilds: userGuilds
    });

});

router.get('/:id', async (req, res) => {

    if (!req.cookies || !req.cookies._ud || !req.cookies._ug) return res.redirect('/oauth/login');

    let userData = await encryptor.decrypt(req.cookies._ud);
    let userGuilds = await encryptor.decrypt(req.cookies._ug);

    if (!req.params || !req.params.id) return res.redirect('/dashboard');

    let canAccess = false;
    for (var i = 0; i < userGuilds.length; i++) {
        if (userGuilds[i].id == req.params.id) canAccess = true;
    }

    if (!canAccess) return res.redirect('/dashboard');

    const selectedGuild = userGuilds.find(guild => guild.id == req.params.id);

    const selectedGuildData = Athena.guilds.resolve(selectedGuild.id);

    if (!selectedGuildData) return res.redirect('/dashboard');
    else {
        selectedGuild.memberCount = selectedGuildData.memberCount;
        selectedGuild.channelCount = selectedGuildData.channels.cache.size;
        selectedGuild.dashURL = '/dashboard/' + selectedGuildData.id;
        selectedGuild.available = true;
    }

    if (selectedGuild.name.length > 25) selectedGuild.displayName = selectedGuild.name.slice(0, 25) + '...';
    else selectedGuild.displayName = selectedGuild.name;

    return res.render('pages/dashboard', {
        userData: userData,
        selectedGuild: userGuilds.find(guild => guild.id == req.params.id)
    });

});

router.post('/actions', async (req, res) => {

    if (req.ip == '::1') {

        switch(req.body.operation) {
            case 'setPrefix':
                if (req.body.value) return res.status(400).json({ status: 400, message: 'Bad Request' }).end();
                try {

                    await Athena.db.manager.setValue({ collection: 'servers', query: { _id: req.body.guildID }, operation: { $set: { "data.preferences.prefix": req.body.prefix } } });
                }
                catch(err) {

                    Athena.handleError({ error: err, print: true });
                    return res.status(500).json({ status: 500, message: 'Server Error' }).end();
                }
                return res.status(200).json({ status: 200, message: 'Successfull' }).end();
                break;
            case 'setLanguage':
                if (req.body.value) return res.status(400).json({ status: 400, message: 'Bad Request' }).end();
                try {

                    const validLangauges = ['en-US', 'tr-TR'];

                    if (!validLangauges.includes(req.body.language)) return res.status(400).json({ status: 400, message: 'Bad Request' }).end();

                    await Athena.db.manager.setValue({ collection: 'servers', query: { _id: req.body.guildID }, operation: { $set: { "data.preferences.language": req.body.language } } });
                }
                catch(err) {

                    Athena.handleError({ error: err, print: true });
                    return res.status(500).json({ status: 500, message: 'Server Error' }).end();
                }
                return res.status(200).json({ status: 200, message: 'Successfull' }).end();
                break;
            default:
                res.status(400).json({ status: 400, message: 'Bad Request' }).end();
                break;
        }
    };

});

module.exports = router;