module.exports = (client) => {

    const colors = require('colors');
    const http = require('http');
    const https = require('https');
    const express = require('express');
    const fs = require('fs');
    const path = require('path');
    const encryptor = require('simple-encryptor').createEncryptor('abcçdefgğhıijklmnoöprsştuüvyz123456789?_-*');
    const cookieParser = require('cookie-parser');
    const bodyParser = require('body-parser');

    const httpPort = 80;
    const httpsPort = 443;

    const httpsOptions = {
        cert: fs.readFileSync(path.join(__dirname, 'certs', 'certificate.crt')),
        ca: fs.readFileSync(path.join(__dirname, 'certs', 'ca_bundle.crt')),
        key: fs.readFileSync(path.join(__dirname, 'certs', 'private.key')),
    }

    const app = express();
    const httpServer = http.createServer(app);
    const httpsServer = https.createServer(httpsOptions, app);

    app.use((req, res, next) => {
        if (req.protocol == 'http') {
            res.redirect(301, `https://${req.headers.host}${req.url}`);
        }
        next();
    });

    app.set('view engine', 'ejs');
    app.set('views', `${__dirname}/public`);
    app.use(bodyParser.json())
    app.use(cookieParser())
    app.use(express.static(`${__dirname}/public`));
            
    app.get('/', async (req, res) => {
        
        return res.render('index', {
            userData: await encryptor.decrypt(req.cookies._ud),
            userGuilds: await encryptor.decrypt(req.cookies._ug)
        });
    })
    
    app.get('/invite', (req, res) => {
        return res.redirect('https://discord.com/api/oauth2/authorize?client_id=714109639301791804&permissions=8&redirect_uri=https%3A%2F%2Fathenabot.site%2Foauth%2Fcallback&scope=bot');
    })
    
    app.get('/support', (req, res) => {
        return res.redirect('https://discord.gg/etsgB9J');
    })
    
    app.get('/oauth/login', (req, res) => {
        return res.redirect(client.config.dashboard.LOGIN_URL);
    })
    
    app.get('/oauth/logout', async(req, res) => {
    
        await res.clearCookie('_ud');
        await res.clearCookie('_ug');
    
        return res.redirect('/');
    })
    
    app.get('/oauth/callback', async (req, res) => {
    
        if (!req.query.code || req.query.code === undefined || req.query.code === null) return res.redirect('/');
    
        try {

            const DiscordOauth2 = require("discord-oauth2");
            const oauth = new DiscordOauth2();
        
            const data = await oauth.tokenRequest({ 
                clientId: client.config.bot.CLIENT_ID, 
                clientSecret: client.config.bot.CLIENT_SECRET, 
                code: req.query.code, 
                scope: "identify guilds", 
                grantType: "authorization_code", 
                redirectUri: client.config.dashboard.REDIRECT_URI
            });
        
            if (!data) return res.render('errors/fetchError');
        
            const userData = await oauth.getUser(data.access_token);
            const userGuilds = await oauth.getUserGuilds(data.access_token);
        
            const availabeGuilds = userGuilds.filter(x => x.owner === true);
        
            if (!userData || !userGuilds) return res.render('errors/fetchError');
        
            await res.cookie('_ud', await encryptor.encrypt(userData));
            await res.cookie('_ug', await encryptor.encrypt(availabeGuilds));
        
            return res.redirect('/');
        }
        catch (err) {

            client.handleError({ error: err, print: true });
            return res.render('errors/fetchError');
        }
    
    })

    app.get('/dashboard', (req, res) => {
    
        return res.render('dashboard');
    })
    
    app.post('/api/vote', async (req, res) => {

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
                }
            }
    
        }
    })

    app.use('/*',(req, res) => {
        return res.render('errors/404');
    })
    
    try {
        httpServer.listen(httpPort);
        httpsServer.listen(httpsPort);
    }
    catch (err) {

        return client.log('error', err);
    }

    return client.log('success', `Web dashboard is started.`);

}