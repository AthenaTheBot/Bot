const Core = require('./Core');
const Athena = new Core();

Athena.init();

process.on('uncaughtException', (err) => {
    Athena.log(2, err);
});

process.on('unhandledRejection', (err) => {
    Athena.log(2, err);
});

module.exports = Athena;