// Base
const Athena = require('./Structures/Base');
const base = new Athena();

// Db Functions
const dbFunctions = require('./Modules/dbFunctions');
base.db.manager = new dbFunctions(base.config, base.userDatabaseCache, base.serverDatabaseCache);

// Extra Modules
const path = require('path');

// Ready Event
base.once('ready', async() => {
    await base.connectDB(base.config.bot.DATABASE);
    await base.loadCommands(path.join(__dirname, 'Commands'));
    await base.loadEvents(path.join(__dirname, 'Events'));
    await base.dashboard(base);
    await base.postStats(base, true, 60);
    await base.setPresence();
    base.log('ready', `Athena is ready to use! (Profile: ${base.user.tag})`);
});

// Login
base.login(base.config.bot.TOKEN);


// Error handling
process.on('unhandledRejection', (err) => { 
    base.handleError({ error: err, print: true }); 
});

process.on('uncaughtException', (err) => { 
    base.handleError({ error: err, print: true }); 
});
