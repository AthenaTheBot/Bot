// Modules
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

// Classes
import Logger from "./Logger";
import DatabaseManager from "./DatabaseManager";
import Guild from "../Structures/Guild";
import { GuildModules } from "../constants";

/**
 * Handles all of the guilds
 */
class GuildManager {
  private logger: Logger;
  private dbManager: DatabaseManager;

  constructor(dbManager: DatabaseManager) {
    this.logger = new Logger();
    this.dbManager = dbManager;
  }

  // Creates a guild inside of the db
  async create(id: string, modules?: GuildModules): Promise<Guild | null> {
    const guild = new Guild(id, modules);
    const success = await this.dbManager.createDocument("guilds", guild);
    if (success) return guild;
    else {
      this.logger.error(
        "An error occured while trying to create a guild with id " + id + "."
      );
      return null;
    }
  }

  // Deletes a guild from database
  async delete(id: string): Promise<boolean> {
    return await this.dbManager.removeDocument("guilds", id);
  }

  // Fetches a guild
  async fetch(
    id: string,
    createGuildIfNotExists?: boolean
  ): Promise<Guild | null> {
    const guildDocument = await (<any>this.dbManager.getDocument("guilds", id));
    const guild = new Guild(guildDocument?._id, guildDocument?.modules);
    if (!guild._id) {
      if (createGuildIfNotExists) {
        return await this.create(id);
      } else {
        return null;
      }
    }

    return guild;
  }

  // Updates a guild
  async updateGuild(id: string, mongoQuery: object): Promise<boolean> {
    let guild = (await this.dbManager.getDocument("guilds", id)) as Guild;
    if (!guild) {
      guild = (await this.create(id)) as Guild;
      if (!guild) return false;
    }

    const success = await this.dbManager.updateDocument(
      "guilds",
      guild._id,
      mongoQuery
    );
    if (success) return true;
    else return false;
  }
}

export default GuildManager;
