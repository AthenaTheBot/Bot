// Modules
import { model } from "mongoose";
import dayjs from "dayjs";

// Classes
import Logger from "./Logger";
import DatabaseManager from "./DatabaseManager";
import Guild, { GuildOptionsInterface } from "./Guild";

// Schemas
import GuildSchema from "../Schemas/GuildSchema";

class GuildManager {
  private logger: Logger;
  private dbManager: DatabaseManager;
  protected guildCache: Guild[];

  constructor(dbManager: DatabaseManager) {
    this.logger = new Logger();
    this.dbManager = dbManager;
    this.guildCache = [];
  }

  async create(id: string, options?: GuildOptionsInterface): Promise<void> {
    const guildModel = model("Guild", GuildSchema);
    const guild = new guildModel(new Guild(id, options));
    guild.save((err) => {
      if (err) this.logger.error(err);
    });
  }

  async edit(id: string): Promise<void> {}

  async delete(id: string): Promise<void> {
    this.dbManager.removeDocument("guilds", id).then((state) => {
      if (!state) {
        this.logger.error(
          `An error occured during deletion process on guild '${id}'. Error Date: [${dayjs().format(
            "L LT"
          )}]`
        );
      }
    });
  }
}

export default GuildManager;
