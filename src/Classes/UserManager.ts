// Classes
import Logger from "./Logger";
import DatabaseManager from "./DatabaseManager";
import User, { UserOptionsInterface } from "./User";

class UserManager {
  private logger: Logger;
  private dbManager: DatabaseManager;

  constructor(dbManager: DatabaseManager) {
    this.logger = new Logger();
    this.dbManager = dbManager;
  }

  async create(
    id: string,
    options?: UserOptionsInterface
  ): Promise<User | null> {
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

  async edit(): Promise<User | null> {
    return null;
  }

  async delete(id: string): Promise<boolean> {
    return await this.dbManager.removeDocument("users", id);
  }

  /* 
    TODO: Fetch user using db manager.
    TODO: Implement cache system.
  */
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
}

export default UserManager;
