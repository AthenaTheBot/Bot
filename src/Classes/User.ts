enum languages {
  EN_US = "en-US",
  TR_TR = "tr-TR",
}

interface UserOptionsInterface {
  language?: languages;
  premium?: boolean;
}

class User {
  _id: string;
  settings: UserOptionsInterface;

  constructor(id: string, settings?: UserOptionsInterface) {
    this._id = id;
    this.settings = {};
    if (settings?.language) {
      this.settings.language = settings.language;
    } else {
      this.settings.language = languages.EN_US;
    }

    if (settings?.premium) {
      this.settings.premium = settings.premium;
    } else {
      this.settings.premium = false;
    }
  }
}

export default User;
export { UserOptionsInterface, User };
