const fetch = require('node-fetch');

module.exports = (base, sync, amount) => {

    if (base.config.bot.CLIENT_ID != base.user.id) return base.log('warn', 'The client id specified in the config file isn\'t same as the logged in account. Ignoring situation..')

    base.config.botlistingWebsites.forEach(botlist => {

        const url = botlist.url.replace('$botID', base.user.id);
        const body = JSON.parse(JSON.stringify(botlist.body).replace('$botServerCount', base.guilds.cache.size));

        fetch(url, {
            method: 'POST',
            body:    JSON.stringify(body),
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': botlist.token
            },
        })
        .catch(err => {
            base.log('error', err);
        })
    })

    base.log('success', 'Successfully posted stats!');

    if (sync) {

        setInterval(() => {

            base.config.botlistingWebsites.forEach(botlist => {

                const url = botlist.url.replace('$botID', base.user.id);
                const body = JSON.parse(JSON.stringify(botlist.body).replace('$botServerCount', base.guilds.cache.size));
        
                fetch(url, {
                    method: 'POST',
                    body:    JSON.stringify(body),
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': botlist.token
                    },
                })
                .catch(err => {
                    base.log('error', err);
                })
            })
        
            base.log('success', 'Successfully posted stats!');

        }, amount * 1000 * 60)
    }
}