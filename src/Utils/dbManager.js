// Templates
const guildTemplate = require('../Structures/Guild');
const userTemplate = require('../Structures/User');

class dbManager {
    constructor(core) {
        if (core) {
            this.core = core;
        }
        else {

            throw new Error('Cannot create db functions instance without a core variable.');
        }

        this.canUsable = false;
    }

    setUsable() {
        this.canUsable = true;
        return null;
    }

    async createGuild(id) {

        if (!this.canUsable) return {};

        if (!id || isNaN(id) || id.length != 18) {
            this.core.log(3, 'Used create guild function wiothut passing id arguement.');
            return {};
        }

        const guild = new  guildTemplate(id);

        try {

            await this.core.dbConnection.collection('servers').insertOne(guild);
        }
        catch(err){

            this.core.log(2, err);
            return {};
        }

        return guild;

    };

    async createUser(id) {

        if (!this.canUsable) return {};

        if (!id || isNaN(id) || id.length != 18) {
            this.core.log(3, 'Used create user function wiothut passing id arguement.');
            return {};
        }

        const user = new  userTemplate(id);

        try {

            await this.core.dbConnection.collection('users').insertOne(user);
        }
        catch(err){

            this.core.log(2, err);
            return {};
        }

        return user;
    };

    async getGuild(id, force) {

        if (!this.canUsable) return {};

        if (!id || isNaN(id) || id.length != 18) {
            this.core.log(3, 'Used get guild function without passing id arguement.');
            return;
        }

        const guild = await this.core.dbConnection.collection('servers').findOne({ _id: id }).catch(err => {});

        if (!guild) {
            if (force) {
                const newGuild = await this.createGuild(id);
                return newGuild;
            }
            return {};
        }
        else {

            return guild;
        }
    };

    async getUser(id, force) {

        if (!this.canUsable) return {};

        if (!id || isNaN(id) || id.length != 18) {
            this.core.log(3, 'Used get user function without passing id arguement.');
            return;
        }

        const user = await this.core.dbConnection.collection('users').findOne({ _id: id }).catch(err => {});

        if (!user) {
            if (force) {
                const newUser = await this.createUser(id);
                return newUser;
            }
            return {};
        }
        else {

            return user;
        }
    };

    async updateDocument(type, id, query) {

        if (!this.canUsable) return {};

        if (!type || !id || !query) {
            this.core.log(3, 'Used update database function without passing right arguements.');
            return;
        }

        switch(type) {
            case 'guild':
                this.core.dbConnection.collection('servers').updateOne({ _id: id }, query);
                break;

            case 'user':
                this.core.dbConnection.collection('servers').updateOne({ _id: id }, query);
                break;
        }
    }

    async removeDocument(type, id) {

        if (!this.canUsable) return {};

        if (!type || !id) {
            this.core.log(3, 'Used remove document function without passing right arguements.');
            return;
        }

        switch(type) {
            case 'guild':
                this.core.dbConnection.collection('servers').deleteOne({ _id: id });
                break;

            case 'user':
                this.core.dbConnection.collection('users').deleteOne({ _id: id });
                break;
        }
    }
}

module.exports = dbManager;