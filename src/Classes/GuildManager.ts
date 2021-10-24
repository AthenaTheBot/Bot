// Modules
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

// Classes
import Logger from "./Logger";
import DatabaseManager from "./DatabaseManager";
import Guild, { GuildOptionsInterface } from "./Guild";

class GuildManager {
  private logger: Logger;
  private dbManager: DatabaseManager;
  protected guildCache: Guild[];

  constructor(dbManager: DatabaseManager) {
    this.logger = new Logger();
    this.dbManager = dbManager;
    this.guildCache = [];
  }

  async create(
    id: string,
    options?: GuildOptionsInterface
  ): Promise<Guild | null> {
    const guild = new Guild(id, options);
    const success = await this.dbManager.createDocument("guilds", guild);
    if (success) {
      this.guildCache.push(guild);
      return guild;
    } else {
      this.logger.error(
        "An error occured while trying to create a guild with id " + id + "."
      );
      return null;
    }
  }

  async edit(id: string): Promise<Guild | null> {
    return null;
  }

  async delete(id: string): Promise<boolean> {
    return await this.dbManager.removeDocument("guilds", id);
  }

  async fetch(
    id: string,
    createGuildIfNotExists?: boolean
  ): Promise<Guild | null> {
    const cacheIncludes =
      this.guildCache.filter((x) => x._id === id).length == 1 ? true : false;
    if (cacheIncludes) {
      return <Guild>this.guildCache.find((x) => x._id === id);
    } else {
      const guildDocument = await (<any>(
        this.dbManager.getDocument("guilds", id)
      ));
      const guild = new Guild(guildDocument?._id, guildDocument?.settings);
      if (!guild._id) {
        if (createGuildIfNotExists) {
          return await this.create(id);
        } else {
          return null;
        }
      }

      this.guildCache.push(guild);
      return guild;
    }
  }
}

export default GuildManager;
