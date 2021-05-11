module.exports = (channel, user, permission) => {

    if (user.hasPermission('ADMINISTRATOR')) return true;

    if (!channel) return null;

    const userPermOverwrites = channel.permissionOverwrites.get(user.id);

    if (!userPermOverwrites) {
        let canRun = true;

        user.roles.cache.forEach(role => {
            const rolePermOverwrites = channel.permissionOverwrites.get(role.id);
            if (rolePermOverwrites) {
                if (rolePermOverwrites.deny.toArray().includes(permission)) canRun = false;
            }
            else {

                if (!user.hasPermission(permission)) canRun = false;
            }
        });

        return canRun;
    }
    else {

        if (userPermOverwrites.deny.toArray().includes(permission)) return false;
        else {

            if (userPermOverwrites.allow.toArray().includes(permission)) return true;
            else {

                let canRun = true;

                user.roles.cache.forEach(role => {
                    const rolePermOverwrites = channel.permissionOverwrites.get(role.id);
                    if (rolePermOverwrites) {
                        if (rolePermOverwrites.deny.toArray().includes(permission)) canRun = false;
                    }
                    else {
        
                        if (!user.hasPermission(permission)) canRun = false;
                    }
                });

                return canRun;
            }
        }
    }

};

module.exports.textBasedPerms = [
    "SEND_MESSAGES",
    "SEND_TTS_MESSAGES",
    "EMBED_LINKS",
    "ADD_REACTIONS",
    "MANAGE_WEBHOOKS",
    "MANAGE_MESSAGES",
    "ATTACH_FILES",
    "READ_MESSAGE_HISTORY",
    "MENTION_EVERYONE",
    "USE_EXTERNAL_EMOJIS",
    "USE_SLASH_COMMANDS"
];

module.exports.allValidPerms = [
    "CREATE_INSTANT_INVITE",
    "KICK_MEMBERS",
    "BAN_MEMBERS",
    "ADMINISTRATOR",
    "MANAGE_CHANNELS",
    "MANAGE_GUILD",
    "ADD_REACTIONS",
    "VIEW_AUDIT_LOG",
    "PRIORITY_SPEAKER",
    "STREAM",
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "SEND_TTS_MESSAGES",
    "MANAGE_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "READ_MESSAGE_HISTORY",
    "MENTION_EVERYONE",
    "USE_EXTERNAL_EMOJIS",
    "VIEW_GUILD_INSIGHTS",
    "CONNECT",
    "SPEAK",
    "MUTE_MEMBERS",
    "DEAFEN_MEMBERS",
    "MOVE_MEMBERS",
    "USE_VAD",
    "CHANGE_NICKNAME",
    "MANAGE_NICKNAMES",
    "MANAGE_ROLES",
    "MANAGE_WEBHOOKS",
    "MANAGE_EMOJIS",
    "USE_SLASH_COMMANDS",
    "REQUEST_TO_SPEAK",
    "MANAGE_THREADS",
    "USE_PUBLIC_THREADS",
    "USE_PRIVATE_THREADS"
]