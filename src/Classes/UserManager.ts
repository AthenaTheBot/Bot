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
  async fetch(id: string): Promise<User | null> {
    return null;
  }
}

export default UserManager;
