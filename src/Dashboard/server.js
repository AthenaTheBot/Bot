module.exports = (client) => {

    const colors = require('colors');
    const http = require('http');
    const https = require('https');
    const express = require('express');
    const fs = require('fs');
    const path = require('path');
    const encryptor = require('simple-encryptor').createEncryptor('abcdefgeijklmnorçöasşay?124568?_**!$');
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
            return res.redirect(301, `https://${req.headers.host}${req.url}`);
        }
        next();
    });

    app.set('view engine', 'ejs');
    app.set('views', `${__dirname}/public/pages`);
    app.use(bodyParser.json())
    app.use(cookieParser())
    app.use('/', express.static(path.join(__dirname, 'public', 'seo')));
    app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
     
    // Main Routes
    app.get('/', async (req, res) => {
        
        if (req.cookies._ud) return res.redirect('/oauth/logout');

        return res.status(200).render('index', {
            userData: await encryptor.decrypt(req.cookies.session)
        });
    })
    
    app.get('/commands', async (req, res) => {

        if (req.cookies._ud) return res.redirect('/oauth/logout');

        return res.status(200).render('commands', {
            userData: await encryptor.decrypt(req.cookies.session)
        });
    });

    app.get('/report', async(req, res) => {

        if (req.cookies._ud) return res.redirect('/oauth/logout');

        return res.status(200).render('report', {
            userData: await encryptor.decrypt(req.cookies.session)
        });
    });

    app.get('/privacy', async (req, res) => {

        if (req.cookies._ud) return res.redirect('/oauth/logout');

        return res.status(200).render('privacy', {
            userData: await encryptor.decrypt(req.cookies.session)
        });
    });

    app.get('/tos', async (req, res) => {

        if (req.cookies._ud) return res.redirect('/oauth/logout');

        return res.status(200).render('tos', {
            userData: await encryptor.decrypt(req.cookies.session)
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

    // Api Routes
    const apiRoute = require('./routers/api');
    app.use('/api', apiRoute);

    // Dashboard Routes
    const dashboardRoute = require('./routers/dashboard');
    app.use('/dashboard', dashboardRoute);

    // 404 Error
    app.use((req, res) => {
        return res.status(404).render('errors/404');
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