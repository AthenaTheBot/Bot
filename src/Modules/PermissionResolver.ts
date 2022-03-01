import { GuildMember } from "discord.js";
import { Permissions, TextPerms, VoicePerms, RolePerms } from "../constants";

/**
 * Helper class for converting permissions
 */
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
