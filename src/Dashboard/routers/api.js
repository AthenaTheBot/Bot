const express = require('express');
const router = express.Router();

const encryptor = require('simple-encryptor').createEncryptor('abcdefgeijklmnorçöasşay?124568?_**!$');
const path = require('path');

const fs = require('fs');

const Athena = require('../../athena');

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

        if (!user) return res.status(403).json({ status: 403, message: 'Unauthorized' }).end();
        else {

            res.status(200).json({ status: 200, message: 'Successful' }).end();

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

    if (userData && userData.id == base.config.bot.OWNER) {

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

module.exports = router;