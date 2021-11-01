module.exports = {
  DEBUG: true,
  DEBUG_PORT: 3000,
  TOKEN: "",

  DB_URL: "mongodb://localhost:27017/Athena",

  PATHS: {
    COMMANDS: "Commands",
    EVENTS: "Events",
    LOCALES: "Locales",
  },

  DASHBOARD: {
    CLIENT_SECRET: "",
    REDIRECT_URI: "http://localhost:3000/oauth/callback",
    LOGIN_LINK:
      "https://discord.com/api/oauth2/authorize?client_id=$CLIENTID&redirect_uri=$REDIRECTURI&response_type=code&scope=identify%20email%20guilds",
    INVITE_LINK:
      "https://discord.com/api/oauth2/authorize?client_id=$CLIENTID&permissions=8&redirect_uri=$REDIRECTURI&scope=bot",
  },

  API_KEYS: {
    KSOFT: "",
  },

  LOG_CHANNELS: {
    COMMAND_USAGE: "",
    GUILD: "",
  },
};
