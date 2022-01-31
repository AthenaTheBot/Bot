import { UserOpitons } from "../constants";
import { AthenaConfig } from "../../index";

class User {
  _id: string;
  settings: UserOpitons;

  constructor(id: string, settings?: UserOpitons) {
    this._id = id;

    this.settings = {
      language: settings?.language || AthenaConfig.defaults.language,
      premium: settings?.premium || false,
    };
  }
}

export default User;
export { User };
