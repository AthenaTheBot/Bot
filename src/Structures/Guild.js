class Guild {
    constructor(guildID){
        if (guildID) {

            this._id = guildID;
        }
        else {

            throw new Error('Cannot create a guild instance without a guild id.');
        }
        
        this.data = {
            preferences: {
                prefix: 'at!',
                language: 'en-US'
            },
            moderationModule: {
                autoRole: {
                    status: false,
                    role: ''
                },
                linkProtection: {
                    status: false,
                    whitelist: {
                        users: [],
                        channels: []
                    }
                },
                warnings: []
            }
        }
    }
}

module.exports = Guild;