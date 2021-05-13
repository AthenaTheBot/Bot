const express = require('express');
const router = express.Router();
const encryptor = require('simple-encryptor').createEncryptor('abcçdefgğhıijklmnoöprsştuüvyz123456789?_-*');
const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2();

const config = require('../../../config');

router.get('/login', (req, res) => {
    return res.redirect(config.dashboard.LOGIN_URL);
})

router.get('/logout', async(req, res) => {

    await res.clearCookie('_ud');
    await res.clearCookie('_ug');

    return res.redirect('/');
})

router.get('/callback', async (req, res) => {

    if (!req.query.code || req.query.code === undefined || req.query.code === null) return res.redirect('/');

    try {

        const data = await oauth.tokenRequest({ 
            clientId: config.bot.CLIENT_ID, 
            clientSecret: config.bot.CLIENT_SECRET, 
            code: req.query.code, 
            scope: "identify guilds", 
            grantType: "authorization_code", 
            redirectUri: config.dashboard.REDIRECT_URI
        });
    
        if (!data) return res.render('pages/errors/fetchError');
    
        const userData = await oauth.getUser(data.access_token);
        const userGuilds = await oauth.getUserGuilds(data.access_token);
    
        const availabeGuilds = userGuilds.filter(x => x.owner === true);
    
        if (!userData || !userGuilds) return res.render('pages/errors/fetchError');
    
        await res.cookie('_ud', await encryptor.encrypt(userData));
        await res.cookie('_ug', await encryptor.encrypt(availabeGuilds));
    
        return res.redirect('/');
    }
    catch (err) {

        console.log('[' + 'ERROR'.bgRed.black + ']', err);
        return res.render('pages/errors/fetchError');
    }

})

module.exports = router;