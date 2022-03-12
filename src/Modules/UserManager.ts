// Classes
import Logger from "./Logger";
import DatabaseManager from "./DatabaseManager";
import User from "../Structures/User";
import { GuildMember, TextChannel } from "discord.js";
import { UserOpitons, Permissions } from "../constants";

/**
 * Handles all of the users of Athena.
 */
class UserManager {
  private logger: Logger;
  private dbManager: DatabaseManager;

  constructor(dbManager: DatabaseManager) {
    this.logger = new Logger();
    this.dbManager = dbManager;
  }

  async create(id: string, options?: UserOpitons): Promise<User | null> {
    const user = new User(id, options);
    const success = await this.dbManager.createDocument("users", user);
    if (success) return user;
    else {
      this.logger.error(
        "An error occured while trying to create a user with id " + id + "."
      );
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    return await this.dbManager.removeDocument("users", id);
  }

  async fetch(
    id: string,
    createUserIfNotExists?: boolean
  ): Promise<User | null> {
    const userDocument = await (<any>this.dbManager.getDocument("users", id));
    const user = new User(userDocument?._id, userDocument?.settings);
    if (!user._id) {
      if (createUserIfNotExists) {
        return await this.create(id);
      } else {
        return null;
      }
    }

    return user;
  }

  async updateUser(id: string, mongoQuery: object): Promise<boolean> {
    let user = (await this.dbManager.getDocument("users", id)) as User;
    if (!user) {
      user = (await this.create(id)) as User;
      if (!user) return false;
    }

    const success = await this.dbManager.updateDocument(
      "users",
      user._id,
      mongoQuery
    );
    if (success) return true;
    else return false;
  }

  getAllPerms(user: GuildMember, channel: TextChannel): Permissions[] {
    const athenaPerms: any[] = [];

    user.roles.cache.forEach((role) => {
      role.permissions.toArray().forEach((perm) => {
        if (!athenaPerms.includes(perm)) athenaPerms.push(perm);
      });
    });

    user
      ?.permissionsIn(channel)
      .toArray()
      .forEach((item) => {
        if (!athenaPerms.includes(item)) athenaPerms.push(item);
      });

    if (user?.voice?.channel) {
      user
        ?.permissionsIn(user.voice.channel)
        .toArray()
        .forEach((item) => {
          if (!athenaPerms.includes(item)) athenaPerms.push(item);
        });
    }

    return athenaPerms;
  }
}

export default UserManager;
