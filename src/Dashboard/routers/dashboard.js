const express = require('express');
const router = express.Router();
const encryptor = require('simple-encryptor').createEncryptor('abcdefgeijklmnorçöasşay?124568?_**!$');

router.get('/', async(req, res) => {

    if (!req.cookies || !req.cookies.session) return res.redirect('/oauth/login');

    const userData = await encryptor.decrypt(req.cookies.session);

    return res.status(200).render('dashboardServerChooser', {
        userData: userData
    });

});

router.get('/:id', async (req, res) => {

    if (!req.params || isNaN(req.params.id)) return res.redirect('/dashboard');

    if (!req.cookies || !req.cookies.session) return res.redirect('/oauth/login');

    let userData = await encryptor.decrypt(req.cookies.session);

    return res.render('dashboard', {
        userData: userData,
        selectedGuild: req.params.id
    });

})

module.exports = router;