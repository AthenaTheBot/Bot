const express = require("express");
const fs = require("fs");
const path = require("path");
const encryptor = require("simple-encryptor")(
  "aaüv.?ğğdlvmpqewmfnıpasd124863133u"
);
const { Permissions } = require("discord.js");
const fetch = require("node-fetch");
const Athena = require("../../../Athena");

const router = express.Router();

// Cache
const commandsCache = new Array();
const guildsCache = new Map();

// Helper Functions
const wait = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const getUserGuilds = async (sesKey) => {
  if (!sesKey) return;

  if (guildsCache.get(sesKey)) return guildsCache.get(sesKey);

  let userCurrentGuilds = await fetch(
    "https://discord.com/api/users/@me/guilds",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${sesKey}`,
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => {});

  if (userCurrentGuilds?.retry_after) {
    await wait(userCurrentGuilds.retry_after);
    return getUserGuilds(sesKey);
  }

  for (var i = 0; i < userCurrentGuilds.length; i++) {
    userCurrentGuilds[i].permissions = new Permissions(
      userCurrentGuilds[i].permissions_new
    ).toArray();
    const guild = Athena.guilds.resolve(userCurrentGuilds[i].id);
    if (!guild) userCurrentGuilds[i].available = false;
    else userCurrentGuilds[i].available = true;

    if (userCurrentGuilds[i].available) {
      userCurrentGuilds[i].memberCount = guild.memberCount;
      userCurrentGuilds[i].channelCount = guild.channels.cache.size;
    }

    if (userCurrentGuilds[i].icon)
      userCurrentGuilds[
        i
      ].icon = `https://cdn.discordapp.com/icons/${userCurrentGuilds[i].id}/${userCurrentGuilds[i].icon}`;
  }

  guildsCache.set(sesKey, userCurrentGuilds);

  setTimeout(() => {
    guildsCache.delete(sesKey);
  }, 5 * 1000);

  return userCurrentGuilds;
};

// General routers
router.get("/getStats", (req, res) => {
  res.json({
    serverCount: Athena.guilds.cache.size,
    cachedUserCount: Athena.users.cache.size,
  });
});

router.get("/commands", (req, res) => {
  if (!commandsCache || commandsCache.length == 0) {
    const categories = fs.readdirSync(
      path.join(__dirname, "..", "..", "..", "Commands")
    );
    categories.forEach((category) => {
      const categoryCommands = [];
      const categoryCommandFiles = fs
        .readdirSync(
          path.join(__dirname, "..", "..", "..", "Commands", category)
        )
        .filter((file) => file.endsWith(".js"));
      categoryCommandFiles.forEach((categoryCommandFile) => {
        let categoryCommand;
        try {
          categoryCommand = new (require(path.join(
            __dirname,
            "..",
            "..",
            "..",
            "Commands",
            category,
            categoryCommandFile
          )))();
        } catch (err) {
          return;
        }

        if (
          !categoryCommand.name ||
          !categoryCommand.required_perms ||
          !categoryCommand.required_bot_perms
        )
          return;
        delete categoryCommand["locales"];
        delete categoryCommand["options"];
        delete categoryCommand["aliases"];
        categoryCommands.push(categoryCommand);
      });

      commandsCache.push({ category: category, commands: categoryCommands });
    });
  }

  res.status(200).json({ status: 200, data: commandsCache }).end();
});

// Users routers
router.get("/users/@me", (req, res) => {
  if (!req.cookies?.session)
    return res.status(400).json({ status: 400, message: "Bad Request" }).end();
  else {
    const data = encryptor.decrypt(req.cookies.session);
    if (!data)
      return res.status(400).json({ status: 400, message: "Bad Requet" }).end();
    delete data["key"];
    return res.status(200).json({ status: 200, data: data }).end();
  }
});

router.get("/users/:id", (req, res) => {
  if (!req.params?.id || req.params?.id.length != 18 || isNaN(req.params.id))
    return res.status(400).json({ status: 400, message: "Bad Requst" }).end();

  return res
    .status(503)
    .json({ status: 503, message: "Service Unavailable" })
    .end();
});

router.get("/users/@me/guilds", async (req, res) => {
  if (!req.cookies?.session)
    return res.status(400).json({ status: 400, message: "Bad Request" }).end();

  const session = await encryptor.decrypt(req.cookies.session);

  if (!session?.key)
    return res.status(400).json({ status: 400, message: "Bad Request" }).end();

  const currentGuilds = await getUserGuilds(session.key);

  if (req?.query?.selectManageable?.toLowerCase() == "true") {
    return res
      .status(200)
      .json({
        status: 200,
        data: currentGuilds.filter(
          (x) => x.owner == true || x.permissions.includes("ADMINISTRATOR")
        ),
      })
      .end();
  }

  return res.status(200).json({ status: 200, data: currentGuilds }).end();
});

// Guilds routers
router.all("/guilds/:id", async (req, res) => {
  if (!req.params?.id || req.params?.id.length != 18 || isNaN(req.params.id))
    return res.status(400).json({ status: 400, message: "Bad Request" }).end();

  if (!req.cookies?.session)
    return res.status(401).json({ status: 401, message: "Unauthorized" }).end();

  const session = encryptor.decrypt(req.cookies.session);

  if (!session.key)
    return res.status(401).json({ status: 401, message: "Unauthorized" }).end();

  if (req.method == "GET") {
    const userGuilds = (await getUserGuilds(session.key)).filter(
      (x) => x.owner == true || x.permissions.includes("ADMINISTRATOR")
    );

    let canAccess = false;
    userGuilds.forEach((guild) => {
      if (guild.id == req.params.id) canAccess = true;
    });

    if (!canAccess)
      return res
        .status(401)
        .json({ status: 401, message: "Unauthorized" })
        .end();

    try {
      const guildData =
        (await Athena.dbManager.getGuild(req.params.id, true)).data || null;

      res
        .status(200)
        .json({ status: 200, data: guildData || null })
        .end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 500, message: "Server Error" }).end();
    }
  } else if (req.method == "POST") {
    if (
      !req.body ||
      !req.body.guild ||
      !req.body?.prefix ||
      !req.body?.language
    )
      return res
        .status(400)
        .json({ status: 400, message: "Bad Request" })
        .end();

    switch (req.body.language) {
      case "English":
        req.body.language = "en-US";
        break;

      case "Türkçe":
        req.body.language = "tr-TR";
        break;

      default:
        req.body.language = undefined;
    }

    if (!req.body.language)
      return res
        .status(400)
        .json({ status: 400, message: "Bad Request" })
        .end();

    try {
      Athena.dbManager.updateDocument("guild", req.body.guild, {
        $set: { "data.preferences.prefix": req.body.prefix.trim() },
      });
      Athena.dbManager.updateDocument("guild", req.body.guild, {
        $set: { "data.preferences.language": req.body.language },
      });
    } catch (err) {
      Athena.log(2, err);
      res.status(500).json({ status: 500, message: "Server Error" }).end();
      return;
    }

    res.status(200).json({ status: 200, message: "Successful" }).end();
  }
});

module.exports = router;
