const express = require('express');
const router = express.Router();
const encryptor = require('simple-encryptor').createEncryptor('abcçdefgğhıijklmnoöprsştuüvyz123456789?_-*');

router.get('/', async(req, res) => {

    let userData = await encryptor.decrypt(req.cookies._ud);
    let userGuilds = await encryptor.decrypt(req.cookies._ug);

    if (!req.cookies || !req.cookies._ud || !req.cookies._ug) return res.redirect('/oauth/login');

    for (var i = 0; i < userGuilds.length; i++) {
        if (userGuilds[i].name.length > 25) userGuilds[i].name = userGuilds[i].name.slice(0, 25) + '...';
    }

    return res.status(200).render('pages/dashboardServerChooser', {
        userData: userData,
        userGuilds: userGuilds
    });

});

router.get('/:id', async (req, res) => {

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

module.exports = router;