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
     
    // Main Routes
    app.get('/', async (req, res) => {
        
        return res.status(200).render('index', {
            userData: await encryptor.decrypt(req.cookies._ud),
            userGuilds: await encryptor.decrypt(req.cookies._ug)
        });
    })
    
    app.get('/dashboard', async (req, res) => {
    
        if (!req.cookies || !req.cookies._ud || !req.cookies._ug) return res.redirect('/oauth/login');

        return res.status(200).render('pages/dashboard', {
            userData: await encryptor.decrypt(req.cookies._ud),
            userGuilds: await encryptor.decrypt(req.cookies._ug)
        });
    });

    app.get('/dashboard/:id', async (req, res) => {

        const userData = await encryptor.decrypt(req.cookies._ud);
        const userGuilds = await encryptor.decrypt(req.cookies._ug);

        if (!req.params || !req.params.id) return res.redirect('/dashboard');

        let canAccess = false;
        for (var i = 0; i < userGuilds.length; i++) {
            if (userGuilds[i].id == req.params.id) canAccess = true;
        }

        if (!canAccess) return res.redirect('/dashboard');

        res.render('pages/manager');
    })

    app.get('/commands', async (req, res) => {

        const validCategories = ['all', 'moderation', 'music', 'fun', 'misc'];
        let categoryChoosen = req.query.category;

        if (!categoryChoosen || !validCategories.includes(categoryChoosen)) categoryChoosen = 'all';

        const commands = new Array();

        client.commands.forEach(async (command) => {
            
            if (!command.Description || command.Description.length == 0) command.Description = 'None';
            if (!command.Usage) command.Usage = 'None';
            if (!command.RequiredPerms || command.RequiredPerms.length == 0) command.RequiredPerms = 'None';
            if (!command.RequiredBotPerms || command.RequiredBotPerms.length == 0) command.RequiredBotPerms = 'None';

            if (categoryChoosen == 'all') {
                
                return commands.push({
                    Name: command.Name,
                    Description: command.Description,
                    Usage: command.Usage,
                    RequiredPerms: command.RequiredPerms,
                    RequiredBotPerms : command.RequiredBotPerms
                });
            }
            else {

                if (command.Category.toLowerCase() == categoryChoosen) {

                    return commands.push({
                        Name: command.Name,
                        Description: command.Description,
                        Usage: command.Usage,
                        RequiredPerms: command.RequiredPerms,
                        RequiredBotPerms : command.RequiredBotPerms
                    });
                }
                else {

                    return;
                }
            }

        });

        return res.status(200).render('pages/commands', {
            userData: await encryptor.decrypt(req.cookies._ud),
            userGuilds: await encryptor.decrypt(req.cookies._ug),
            categories: validCategories,
            categoryChoosen: categoryChoosen,
            commands: commands
        });
    });

    app.get('/privacy', async (req, res) => {

        return res.status(200).render('pages/privacy', {
            userData: await encryptor.decrypt(req.cookies._ud),
            userGuilds: await encryptor.decrypt(req.cookies._ug)
        });
    });

    app.get('/tos', async (req, res) => {

        return res.status(200).render('pages/tos', {
            userData: await encryptor.decrypt(req.cookies._ud),
            userGuilds: await encryptor.decrypt(req.cookies._ug)
        });
    });

    // Redirect Routes
    app.get('/invite', (req, res) => {
        return res.redirect(client.config.dashboard.INVITE_LINK);
    })
    
    app.get('/support', (req, res) => {
        return res.redirect('https://discord.gg/etsgB9J');
    })

    // Oauth Routes
    const oauthRoute = require('./routers/oauth');
    app.use('/oauth', oauthRoute);


    const apiRoute = require('./routers/api');
    app.use('/api', apiRoute);

    // 404 Error
    app.use((req, res) => {
        return res.status(404).render('pages/errors/404');
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