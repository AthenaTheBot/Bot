const express = require('express');
const router = express.Router();

const Athena = require('../../Structures/Base');
const base = new Athena();

router.get('/vote', async (req, res) => {

    if (req.header('Authorization')) {

        let user;
        switch(req.header('Authorization')) {
            case base.webhookTokens.TOPGG:
                user = req.body.user;
                break;
            case base.webhookTokens.BOTSFORDISCORD:
                user = req.body.user;
                break;
            case base.webhookTokens.DISCORDBOATS:
                user = req.body.user.id;
                break;
            case base.webhookTokens.DCBOTLISTCOM:
                user = req.body.id;
                break;
            default:
                user = undefined;
                break;
        }

        if (!user) return res.status(403).json({ message: 'Unauthorized' }).end();
        else {

            res.status(200).json({ message: 'Successful' }).end();

            let userDiscordData = await base.users.cache.get(user);
            let userData = await base.db.manager.getUser(userDiscordData);

            if (!userData || !userDiscordData) return;
            
            base.log("log", `${userDiscordData.tag} is voted!`);
            
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

        return res.status(403).json({ message: 'Unauthorized' }).end();
    }
})

module.exports = router;