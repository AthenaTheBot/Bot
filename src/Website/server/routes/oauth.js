const express = require('express');
const route = express.Router();
const encryptor = require('simple-encryptor')('aaüv.?ğğdlvmpqewmfnıpasd124863133u');
const DiscordOauth2 = require("discord-oauth2");
const Athena = require('../../../Athena');

const oauth = new DiscordOauth2({
    clientId: Athena.config.DASHBOARD.CLIENT_ID,
    clientSecret: Athena.config.DASHBOARD.CLIENT_SECRET,
    redirectUri: Athena.config.DASHBOARD.REDIRECT_URI,
});

route.get('/login', (req, res) => {
    res.redirect(Athena.config.DASHBOARD.LOGIN_LINK);
});

route.get('/logout', (req, res) => {
    res.clearCookie('session');
    res.redirect('/');
});

route.get('/callback', async (req, res) => {
    if (!req.query?.code) return res.redirect('/');

    const tokenData = await oauth.tokenRequest({
        code: req.query.code,
        scope: "identify guilds email",
        grantType: "authorization_code",
    }).catch(err => {});

    if (!tokenData?.access_token) return res.redirect('/error');

    const userData = await oauth.getUser(tokenData.access_token);

    if (!userData) return res.redirect('/error');

    const session = {
        key: tokenData.access_token || null,
        ...userData
    }

    const expiresInHour = tokenData.expires_in / 3600;

    await res.cookie('session', encryptor.encrypt(session), {
        expires: new Date(Date.now() + expiresInHour * 3600000)
    });

    res.redirect('/');
});

module.exports= route;