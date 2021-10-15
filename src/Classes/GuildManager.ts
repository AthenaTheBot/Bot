/* 
    TODO: Create guild, delete user, update user
*/

// Modules
import { model } from "mongoose";
import dayjs from "dayjs";

// Classes
import Logger from "./Logger";
import DatabaseManager from "./DatabaseManager";
import { Guild, GuildSchema } from "./Guild";

class GuildManager {
  private logger: Logger;
  private dbManager: DatabaseManager;

  constructor(dbManager: DatabaseManager) {
    this.logger = new Logger();
    this.dbManager = dbManager;
  }

  async create(id: string): Promise<void> {
    const guildModel = model("Guild", GuildSchema);
    const guild = new guildModel(new Guild(id));
    guild.save((err) => {
      if (err) this.logger.error(err);
    });
  }

  async edit(id: string) {}

  async delete(id: string) {
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
