const { connection } = require('mongoose');

class dbFunctions {
    constructor(config, userCache, serverCache) {
        this.config = config;
        this.serverCache = serverCache;
        this.userCache = userCache
    }

    async createGuild(guild) {

        if (!guild || typeof guild !== 'object') return { error: 'Guild variable must be a valid object.' };

        const guildSchema = {
            _id: guild.id,
            data: {
                preferences: {
                    prefix: this.config.defaults.PREFIX,
                    language: this.config.defaults.LANGUAGE
                },
                moderationModule: {
                    autoRole: {
                        status: false,
                        role: ""
                    },
                    linkProtection: {
                        status: false,
                        whitelist: {
                            users: [],
                            channels: []
                        }
                    },
                    warnings: []
                },
                musicModule: {
                    playing: false,
                    queue: []
                }
            }
        }

        try {
            await connection.collection('servers').insertOne(guildSchema);
        } catch (err) {
            console.log(`[dbFunctions/createGuild]: ${err} (Guild: ${guild.id})`.red);
            return { error: err };
        }

        return guildSchema;

    }

    async createUser(user) {
        
        if (!user || typeof user !== 'object') return { error: 'User variable must be a valid object.' };

        const defaultUser = {
            _id: user.id,
            preferences: {
                language: null,
                tips: true,
                notifications: true
            }
        }

        try {
            await connection.collection('users').insertOne(defaultUser);
        } catch (err) {
            console.log(`[dbFunctions/createUser]: ${err} (User: ${user.id})`.red);
            return { error: err };
        }

        return defaultUser;

    }

    async getGuild(guild) {

        if (!guild || typeof guild !== 'object') return { error: 'Guild variable must be a valid object.' };

        if (!this.serverCache.get(guild.id)) {

            let result = await connection.collection('servers').findOne({ _id: guild.id });

            if (!result || result === undefined || result === null) result =  await this.createGuild(guild);
            
            this.serverCache.set(guild.id, result);

            return result;
        }
        else {

            return await (this.serverCache.get(guild.id));
        }

    }

    async getUser(user) {

        if (!user || typeof user !== 'object') return { error: 'User variable must be a valid object.' };

        if (!this.userCache.get(user.id)) {

            let result = await connection.collection('users').findOne({ _id: user.id });

            if (!result || result === undefined || result === null) result = await this.createUser(user);
    
            this.userCache.set(user.id, result);

            return result;

        }
        else {

            return await (this.userCache.get(user.id));
        };

    }

    async setValue(data) {

        if (!data) return { error: 'Invalid data varaible provided.' };

        try {

            await connection.collection(data.collection).updateOne(data.query, data.operation);

            await this.updateCache(data.collection, data.query);

        }
        catch (err) {

            console.log(`[setValue]: ${err}`.red);
            return { error: err };
        }

    }

    async updateCache(type, query) {

        if (!type || !query) return { error: 'Invalid type and query varaible provided.' };

        switch (type) {
            case 'servers':
                const newGuildData = await connection.collection('servers').findOne(query);
                this.serverCache.set(query._id, newGuildData);
                break;        
            case 'users':
                const newUserData = await connection.collection('users').findOne(query);
                this.userCache.set(query._id, newUserData);
                break;
        }
    }

    async nullCheck(message) {}
}

module.exports = dbFunctions;