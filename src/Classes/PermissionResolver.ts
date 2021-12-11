import { GuildMember } from "discord.js";

enum Permissions {
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
  "MANAGE_EMOJIS_AND_STICKERS",
  "USE_APPLICATION_COMMANDS",
  "REQUEST_TO_SPEAK",
  "MANAGE_EVENTS",
  "MANAGE_THREADS",
  "CREATE_PUBLIC_THREADS",
  "CREATE_PRIVATE_THREADS",
  "USE_EXTERNAL_STICKERS",
  "SEND_MESSAGES_IN_THREADS",
  "START_EMBEDDED_ACTIVITIES",
}

enum TextPerms {
  "CREATE_INSTANT_INVITE",
  "MANAGE_CHANNELS",
  "ADD_REACTIONS",
  "VIEW_CHANNEL",
  "SEND_MESSAGES",
  "SEND_TTS_MESSAGES",
  "MANAGE_MESSAGES",
  "EMBED_LINKS",
  "ATTACH_FILES",
  "READ_MESSAGE_HISTORY",
  "MENTION_EVERYONE",
  "USE_EXTERNAL_EMOJIS",
  "MANAGE_ROLES",
  "MANAGE_WEBHOOKS",
  "USE_APPLICATION_COMMANDS",
  "MANAGE_THREADS",
  "CREATE_PUBLIC_THREADS",
  "CREATE_PRIVATE_THREADS",
  "USE_EXTERNAL_STICKERS",
  "SEND_MESSAGES_IN_THREADS",
}

enum VoicePerms {
  "CREATE_INSTANT_INVITE",
  "MANAGE_CHANNELS",
  "PRIORITY_SPEAKER",
  "STREAM",
  "VIEW_CHANNEL",
  "CONNECT",
  "SPEAK",
  "MUTE_MEMBERS",
  "DEAFEN_MEMBERS",
  "MOVE_MEMBERS",
  "USE_VAD",
  "MANAGE_ROLES",
  "MANAGE_EVENTS",
  "START_EMBEDDED_ACTIVITIES",
}

enum RolePerms {
  "KICK_MEMBERS",
  "BAN_MEMBERS",
  "ADMINISTRATOR",
  "MANAGE_GUILD",
  "VIEW_AUDIT_LOG",
  "VIEW_GUILD_INSIGHTS",
  "CHANGE_NICKNAME",
  "MANAGE_EMOJIS_AND_STICKERS",
}

class PermissionResolver {
  all: Permissions[];

  perms: {
    text: TextPerms[];
    voice: VoicePerms[];
    role: RolePerms[];
  };

  constructor(permissions: Permissions[]) {
    this.all = [];
    this.perms = {
      text: [],
      voice: [],
      role: [],
    };

    permissions.forEach((x) => {
      const permission = Permissions[x] as any;

      if (!permission) return;

      this.all.push(permission);

      if (TextPerms[permission] != null) {
        this.perms.text.push(permission);
      }

      if (VoicePerms[permission] != null) {
        this.perms.voice.push(permission);
      }

      if (RolePerms[permission] != null) {
        this.perms.role.push(permission);
      }
    });
  }

  convertPermsToIndexNums(permissions: Permissions[]): Permissions[] {
    const result: Permissions[] = [];
    permissions.forEach((perm) => {
      result.push(Permissions[perm] as any);
    });

    return result;
  }

  getMemberRolePerms(gMember: GuildMember) {
    const rolePerms: string[] = [];

    gMember.roles.cache.forEach((user) => {
      user.permissions.toArray().forEach((perm) => {
        if (!rolePerms.includes(perm)) rolePerms.push(perm);
      });
    });

    return rolePerms;
  }

  checkRequirements(cp: Permissions[]): [boolean, Permissions[] | null] {
    const currentPerms = new PermissionResolver(
      this.convertPermsToIndexNums(cp)
    );

    if (currentPerms.all.includes(Permissions.ADMINISTRATOR))
      return [true, null];

    let passedRequirements = true;
    let passFailPerms: Permissions[] = [];

    // Check text channel perms
    for (var i = 0; i < this.perms.text.length; i++) {
      if (!currentPerms.perms.text.includes(this.perms.text[i])) {
        passedRequirements = false;
        passFailPerms.push(this.perms.text[i] as any);
      }
    }

    // Check voice channel perms if exists
    for (var i = 0; i < this.perms.voice.length; i++) {
      if (!currentPerms.perms.voice.includes(this.perms.voice[i])) {
        passedRequirements = false;
        passFailPerms.push(this.perms.voice[i] as any);
      }
    }

    // Check role perms
    for (var i = 0; i < this.perms.role.length; i++) {
      if (!currentPerms.perms.role.includes(this.perms.role[i])) {
        passedRequirements = false;
        passFailPerms.push(this.perms.role[i] as any);
      }
    }

    return [passedRequirements, passFailPerms];
  }
}

export default PermissionResolver;
export { PermissionResolver, Permissions, TextPerms, VoicePerms, RolePerms };
