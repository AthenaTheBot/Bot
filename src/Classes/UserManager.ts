// Modules
import dayjs from "dayjs";
import { model } from "mongoose";

// Classes
import Logger from "./Logger";
import DatabaseManager from "./DatabaseManager";
import User, { UserOptionsInterface } from "./User";

// Schemas
import UserSchema from "../Schemas/UserSchema";

class UserManager {
  private logger: Logger;
  private dbManager: DatabaseManager;
  protected userCache: User[];

  constructor(dbManager: DatabaseManager) {
    this.logger = new Logger();
    this.dbManager = dbManager;
    this.userCache = [];
  }

  async create(id: string, options?: UserOptionsInterface): Promise<void> {
    const userModel = model("User", UserSchema);
    const user = new userModel(new User(id, options));
    user.save((err) => {
      if (err) this.logger.error(err);
    });
  }

  async edit(): Promise<void> {}

  async delete(id: string): Promise<void> {
    this.dbManager.removeDocument("users", id).then((state) => {
      if (!state) {
        this.logger.error(
          `An error occured during deletion process on user '${id}'. Error Date: [${dayjs().format(
            "L LT"
          )}]`
        );
      }
    });
  }
}

export default UserManager;
