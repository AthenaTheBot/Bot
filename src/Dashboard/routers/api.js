const express = require('express');
const router = express.Router();

const config = require('../../../config');

router.get('/vote', async (req, res) => {

    if (req.header('Authorization')) {

        let user;
        switch(req.header('Authorization')) {
            case client.config.webhookTokens.TOPGG:
                user = req.body.user;
                break;
            case client.config.webhookTokens.BOTSFORDISCORD:
                user = req.body.user;
                break;
            case client.config.webhookTokens.DISCORDBOATS:
                user = req.body.user.id;
                break;
            case client.config.webhookTokens.DCBOTLISTCOM:
                user = req.body.id;
                break;
            default:
                user = undefined;
                break;
        }

        if (!user) return res.status(403).json({ message: 'Unauthorized' }).end();
        else {

            res.status(200).json({ message: 'Successful' }).end();

            let userDiscordData = await client.users.cache.get(user);
            let userData = await client.db.manager.getUser(userDiscordData);

            if (!userData || !userDiscordData) return;
            
            client.log("log", `${userDiscordData.tag} is voted!`);
            
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

        return res.status(403).json({ message: 'Unauthorized' });
    }
})

module.exports = router;