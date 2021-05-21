const express = require('express');
const router = express.Router();
const encryptor = require('simple-encryptor').createEncryptor('abcdefgeijklmnorçöasşay?124568?_**!$');

const Athena = require('../../athena');

router.get('/', async(req, res) => {

    if (!req.cookies || !req.cookies._ud) return res.redirect('/oauth/login');

    return res.status(200).render('dashboardServerChooser', {
        userData: await encryptor.decrypt(req.cookies._ud)
    });

});

router.get('/:id', async (req, res) => {

    if (!req.cookies || !req.cookies._ud || !req.cookies._ug) return res.redirect('/oauth/login');

    let userData = await encryptor.decrypt(req.cookies._ud);

    if (!req.params || !req.params.id) return res.redirect('/dashboard');

    if (!canAccess) return res.redirect('/dashboard');

    return res.render('dashboard', {
        userData: userData,
        selectedGuild: userGuilds.find(guild => guild.id == req.params.id)
    });

});

router.post('/actions', async (req, res) => {

    if (req.method == 'POST') {
    
        switch(req.body.operation) {
            case 'setPrefix':
                if (!req.body.prefix) return res.status(400).json({ status: 400, message: 'Bad Request' }).end();
                try {

                    await Athena.db.manager.setValue({ collection: 'servers', query: { _id: req.body.guildID }, operation: { $set: { "data.preferences.prefix": req.body.prefix } } });
                }
                catch(err) {

                    Athena.handleError({ error: err, print: true });
                    return res.status(500).json({ status: 500, message: 'Server Error' }).end();
                }
                res.status(200).json({ status: 200, message: 'Successfull' }).end();
                break;
            case 'setLanguage':
                if (!req.body.language) return res.status(400).json({ status: 400, message: 'Bad Request' }).end();
                const validLangauges = ['en-US', 'tr-TR'];
                if (!validLangauges.includes(req.body.language)) return res.status(400).json({ status: 400, message: 'Bad Request' }).end();
                try {
    
                    await Athena.db.manager.setValue({ collection: 'servers', query: { _id: req.body.guildID }, operation: { $set: { "data.preferences.language": req.body.language } } });
                }
                catch(err) {

                    Athena.handleError({ error: err, print: true });
                    return res.status(500).json({ status: 500, message: 'Server Error' }).end();
                }
                res.status(200).json({ status: 200, message: 'Successfull' }).end();
                break;
            case 'getPrefix':
                if (!req.body.guildID) return res.status(400).json({ status: 400, message: 'Bad Request' }).end();
                try {
                    const guildData = await Athena.db.collection('servers').findOne({ _id: req.body.guildID });
                    if (!guildData || !guildData.data || !guildData.data.preferences) return res.status(500).json({ status: 500, message: 'Server Error' }).end();
                    const prefix = guildData.data.preferences.prefix;
                    if (!prefix) return res.status(500).json({ status: 500, message: 'Server Error' }).end();
                    return res.status(200).json({ status: 200, data: prefix }).end();
                }
                catch(err) {
                    Athena.handleError({ error: err, print: true });
                    return res.status(500).json({ status: 500, message: 'Server Error' }).end();
                }
                break;
            case 'getLanguage':
                if (!req.body.guildID) return res.status(400).json({ status: 400, message: 'Bad Request' }).end();
                try {
                    const guildData = await Athena.db.collection('servers').findOne({ _id: req.body.guildID });
                    if (!guildData || !guildData.data || !guildData.data.preferences) return res.status(500).json({ status: 500, message: 'Server Error' }).end();
                    const language = guildData.data.preferences.language;
                    if (!language) return res.status(500).json({ status: 500, message: 'Server Error' }).end();
                    return res.status(200).json({ status: 200, data: language }).end();
                }
                catch(err) {
                    Athena.handleError({ error: err, print: true });
                    return res.status(500).json({ status: 500, message: 'Server Error' }).end();
                }
                break;
            default:
                res.status(400).json({ status: 400, message: 'Bad Request' }).end();
                break;
        }
        return;
    }

});

module.exports = router;