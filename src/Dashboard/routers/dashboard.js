const express = require('express');
const router = express.Router();
const encryptor = require('simple-encryptor').createEncryptor('abcçdefgğhıijklmnoöprsştuüvyz123456789?_-*');

const Athena = require('../../Structures/Base');
const base = new Athena();

router.get('/', async(req, res) => {

    if (!req.cookies || !req.cookies._ud || !req.cookies._ug) return res.redirect('/oauth/login');

    let userData = await encryptor.decrypt(req.cookies._ud);
    let userGuilds = await encryptor.decrypt(req.cookies._ug);

    for (var i = 0; i < userGuilds.length; i++) {
        if (userGuilds[i].name.length > 25) userGuilds[i].name = userGuilds[i].name.slice(0, 25) + '...';
    }

    return res.status(200).render('pages/dashboardServerChooser', {
        userData: userData,
        userGuilds: userGuilds
    });

});

router.get('/:id', async (req, res) => {

    if (!req.cookies || !req.cookies._ud || !req.cookies._ug) return res.redirect('/oauth/login');

    const userData = await encryptor.decrypt(req.cookies._ud);
    const userGuilds = await encryptor.decrypt(req.cookies._ug);

    if (!req.params || !req.params.id) return res.redirect('/dashboard');

    let canAccess = false;
    for (var i = 0; i < userGuilds.length; i++) {
        if (userGuilds[i].id == req.params.id) canAccess = true;
    }

    if (!canAccess) return res.redirect('pages/dashboard');

    const selectedGuild = userGuilds.find(guild => guild.id == req.params.id);

    if (selectedGuild.name.length > 25) selectedGuild.displayName = selectedGuild.name.slice(0, 25) + '...';
    else selectedGuild.displayName = selectedGuild.name;

    return res.render('pages/dashboard', {
        userData: await encryptor.decrypt(req.cookies._ud),
        selectedGuild: userGuilds.find(guild => guild.id == req.params.id)
    });

});

router.post('/actions', async (req, res) => {

    if (req.ip == '::1') {

        switch(req.body.operation) {
            case 'setPrefix':
                if (req.body.value) return res.status(400).json({ status: 400, message: 'Bad Request' }).end();
                try {

                    await base.db.manager.setValue({ collection: 'servers', query: { _id: req.body.guildID }, operation: { $set: { "data.preferences.prefix": req.body.prefix } } });
                }
                catch(err) {

                    base.handleError({ error: err, print: true });
                    return res.status(500).json({ status: 500, message: 'Server Error' }).end();
                }
                return res.status(200).json({ status: 200, message: 'Successfull' }).end();
                break;
            case 'setLanguage':
                break;
            default:
                res.status(400).json({ status: 400, message: 'Bad Request' }).end();
                break;
        }
    };

});

module.exports = router;