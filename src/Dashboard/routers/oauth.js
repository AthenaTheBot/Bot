const express = require('express');
const router = express.Router();
const fs = require('fs');
const fetch = require('node-fetch');
const Athena = require('../../athena');

const { Permissions } = require('discord.js');

router.get('/login', (req, res) => {
    return res.redirect(Athena.config.dashboard.LOGIN_URL);
})

router.get('/logout', async(req, res) => {

    await res.clearCookie('_ud');
    await res.clearCookie('_ug');

    return res.redirect('/');
})

router.get('/callback', async (req, res) => {

    if (!req.query.code || req.query.code === undefined || req.query.code === null) return res.redirect('/');

    try {

        const tokenData = await fetch(`https://discord.com/api/oauth2/token`, {
            method: 'POST',
            body: `client_id=${Athena.config.bot.CLIENT_ID}&client_secret=${Athena.config.bot.CLIENT_SECRET}&grant_type=authorization_code&code=${req.query.code}&redirect_uri=${Athena.config.dashboard.REDIRECT_URI}`,
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(res => res.json()).catch(err => {});

        if (!tokenData) return res.status(200).render('erros/fetchError');

        let userData = await fetch('https://discord.com/api/users/@me', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `${tokenData.token_type} ${tokenData.access_token}`,
            },
        })
        .then(res => res.json()).catch(err => {});

        let userGuildData = await fetch('https://discord.com/api/users/@me/guilds', {
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `${tokenData.token_type} ${tokenData.access_token}`,
            },
        })
        .then(res => res.json()).catch(err => {});

        if (!userData || !userGuildData) return res.status(200).render('errors/fetchError');

        const availabeGuilds = new Array();
        for (var i = 0; i < userGuildData.length; i++) {
            const perrmissions = new Permissions(userGuildData[i].permissions);
            userGuildData[i].permissions = perrmissions.toArray();
            if (userGuildData[i].owner || userGuildData[i].permissions.includes('ADMINISTRATOR')) availabeGuilds.push(userGuildData[i]); 
        }

        // https://cdn.discordapp.com/icons/${userGuilds[i].id}/${userGuilds[i].icon}.png
    
        const data = { ...userData, ...availabeGuilds };

        return res.render('loading', {
            redirectURL: '/test',
            time: 5,
            setStorage: true,
            storageName: 'data',
            storageData: data
        });
    }
    catch (err) {

        console.log('[' + 'ERROR'.bgRed.black + ']', err);
        return res.render('errors/fetchError');
    }

})

module.exports = router;