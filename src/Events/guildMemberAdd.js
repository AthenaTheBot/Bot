module.exports = {
    name: 'guildMemberAdd',
    async run(base, member) {

        return;

        const guildData = await base.db.manager.getGuild(member.guild);
    
        if (!guildData.data.moderationModule.autoRole.status || guildData.data.moderationModule.autoRole.role === "") return;
    
        const role = member.guild.roles.cache.get(guildData.data.moderationModule.autoRole.role);
    
        if (member.guild.me.hasPermission('MANAGE_ROLES') && role.rawPosition < member.guild.roles.highest.rawPosition) {
    
            member.roles.add(role).catch(err => {});
    
        } else {
            return;
        }
    }
}