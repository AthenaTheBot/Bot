// Classes
import Logger from "./Logger";
import DatabaseManager from "./DatabaseManager";
import User, { UserOptionsInterface } from "./User";

class UserManager {
  private logger: Logger;
  private dbManager: DatabaseManager;
  protected userCache: User[];

  constructor(dbManager: DatabaseManager) {
    this.logger = new Logger();
    this.dbManager = dbManager;
    this.userCache = [];
  }

  async create(
    id: string,
    options?: UserOptionsInterface
  ): Promise<User | null> {
    const user = new User(id, options);
    const success = await this.dbManager.createDocument("users", user);
    if (success) {
      this.userCache.push(user);
      return user;
    } else {
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
    const cacheIncludes =
      this.userCache.filter((x) => x._id === id).length == 1 ? true : false;
    if (cacheIncludes) {
      return <User>this.userCache.find((x) => x._id === id);
    } else {
      const userDocument = await (<any>this.dbManager.getDocument("users", id));
      const user = new User(userDocument?._id, userDocument?.settings);
      if (!user._id) {
        if (createUserIfNotExists) {
          return await this.create(id);
        } else {
          return null;
        }
      }

      this.userCache.push(user);
      return user;
    }
  }
}

export default UserManager;
