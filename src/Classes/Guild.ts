class Guild {
  _id: string;
  settings: object;
  modules: object;

  constructor(id: string) {
    this._id = id;
    this.settings = {
      premium: false,
      prefix: "at!",
      language: "en-US",
    };
    this.modules = {
      moderationModule: {},
      funModule: {},
      utilsModule: {},
    };
  }
}

export default Guild;
