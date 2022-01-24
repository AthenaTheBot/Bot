import { CommandManager, CommandData } from "../Classes/CommandManager";
import { Permissions } from "../Classes/PermissionResolver";
import { MessageAttachment, MessageEmbed } from "discord.js";
import canvacord from "canvacord";
import fetch from "cross-fetch";

// TODO Commands: comment

export default (commandManager: CommandManager) => {
  commandManager.registerCommand(
    "cat",
    [],
    "Sends random cute cat images.",
    [],
    4,
    [],
    [Permissions.SEND_MESSAGES, Permissions.ATTACH_FILES],
    async (commandData: CommandData): Promise<boolean> => {
      const data = await fetch(
        "https://api.thecatapi.com/v1/images/search"
      ).then((res) => res.json());

      if (!data) {
        commandData.respond(commandData.locales.ERROR, true);
        return false;
      }

      const attachment = new MessageAttachment(data[0].url, "random_cat.png");

      commandData.respond({ files: [attachment] });

      return true;
    }
  );

  commandManager.registerCommand(
    "dog",
    [],
    "Sends random cute dog images.",
    [],
    4,
    [],
    [Permissions.SEND_MESSAGES, Permissions.ATTACH_FILES],
    async (commandData: CommandData): Promise<boolean> => {
      const data = await fetch("https://dog.ceo/api/breeds/image/random").then(
        (res) => res.json()
      );

      if (!data) {
        commandData.respond(commandData.locales.ERROR, true);
        return false;
      }

      const attachment = new MessageAttachment(data.message, "random_dog.png");

      commandData.respond({ files: [attachment] });

      return true;
    }
  );

  commandManager.registerCommand(
    "meme",
    [],
    "Fetches random memes from reddit.",
    [],
    4,
    [],
    [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
    async (commandData: CommandData): Promise<boolean> => {
      const data = await fetch("https://api.ksoft.si/images/random-meme", {
        headers: {
          Authorization: `Bearer ${commandData.client.config.apiKeys.KSOFT}`,
        },
      }).then((res) => res.json());

      if (!data) {
        commandData.respond(commandData.locales.ERROR, true);
        return false;
      }

      const Embed = new MessageEmbed();
      Embed.setAuthor(data.author)
        .setURL(data.source)
        .setTitle(data.title)
        .setImage(data.image_url)
        .setFooter(
          `👍 ${data.upvotes} | 👎 ${data.downvotes} | 💬 ${data.comments}`
        );

      commandData.respond(Embed);

      return true;
    }
  );

  commandManager.registerCommand(
    "coinflip",
    [],
    "Flip the coin see the result..",
    [],
    4,
    [],
    [Permissions.SEND_MESSAGES],
    async (commandData: CommandData): Promise<boolean> => {
      const result = Math.round(Math.random());

      if (result) {
        commandData.respond(commandData.locales.TAILS);
      } else {
        commandData.respond(commandData.locales.HEADS);
      }

      return true;
    }
  );

  commandManager.registerCommand(
    "hitler",
    [],
    "Worse than hitler",
    [
      {
        type: "USER",
        name: "User",
        description: "The user that you want to use in this meme.",
        required: true,
      },
    ],
    4,
    [],
    [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
    async (commandData: CommandData): Promise<boolean> => {
      const targetUser = await commandData.parseUserFromArgs(0);

      if (!targetUser) {
        commandData.respond(commandData.locales.SPECIFY_USER, true);
        return false;
      }

      const hitler = await canvacord.Canvacord.hitler(
        targetUser.displayAvatarURL({ format: "png", dynamic: false })
      );

      const attachment = new MessageAttachment(hitler, "worseThanHitler.png");

      commandData.respond({ files: [attachment] });

      return true;
    }
  );

  commandManager.registerCommand(
    "jail",
    [],
    "Put someone in jail.",
    [
      {
        type: "USER",
        name: "User",
        description: "The user that you want to use in this meme.",
        required: true,
      },
    ],
    4,
    [],
    [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
    async (commandData: CommandData): Promise<boolean> => {
      const targetUser = await commandData.parseUserFromArgs(0);

      if (!targetUser) {
        commandData.respond(commandData.locales.SPECIFY_USER, true);
        return false;
      }

      const jail = await canvacord.Canvacord.jail(
        targetUser.displayAvatarURL({ format: "png", dynamic: false }),
        true
      );

      const attachment = new MessageAttachment(jail, "jail.png");

      commandData.respond({ files: [attachment] });

      return true;
    }
  );

  commandManager.registerCommand(
    "jokeoverhead",
    [],
    "Don't just don't make jokes",
    [
      {
        type: "USER",
        name: "User",
        description: "The user that you want to use in this meme.",
        required: true,
      },
    ],
    4,
    [],
    [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
    async (commandData: CommandData): Promise<boolean> => {
      const targetUser = await commandData.parseUserFromArgs(0);

      if (!targetUser) {
        commandData.respond(commandData.locales.SPECIFY_USER, true);
        return false;
      }

      const jokeOverHead = await canvacord.Canvacord.jokeOverHead(
        targetUser.displayAvatarURL({ format: "png", dynamic: false })
      );

      const attachment = new MessageAttachment(
        jokeOverHead,
        "jokeOverHead.png"
      );

      commandData.respond({ files: [attachment] });

      return true;
    }
  );

  commandManager.registerCommand(
    "rip",
    [],
    "R.I.P",
    [
      {
        type: "USER",
        name: "User",
        description: "The user that you want to use in this meme.",
        required: true,
      },
    ],
    4,
    [],
    [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
    async (commandData: CommandData): Promise<boolean> => {
      const targetUser = await commandData.parseUserFromArgs(0);

      if (!targetUser) {
        commandData.respond(commandData.locales.SPECIFY_USER, true);
        return false;
      }

      const rip = await canvacord.Canvacord.rip(
        targetUser.displayAvatarURL({ format: "png", dynamic: false })
      );

      const attachment = new MessageAttachment(rip, "rip.png");

      commandData.respond({ files: [attachment] });

      return true;
    }
  );

  commandManager.registerCommand(
    "trash",
    [],
    "Don't be a trash",
    [
      {
        type: "USER",
        name: "User",
        description: "The user that you want to use in this meme.",
        required: true,
      },
    ],
    4,
    [],
    [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
    async (commandData: CommandData): Promise<boolean> => {
      const targetUser = await commandData.parseUserFromArgs(0);

      if (!targetUser) {
        commandData.respond(commandData.locales.SPECIFY_USER, true);
        return false;
      }

      const trash = await canvacord.Canvacord.trash(
        targetUser.displayAvatarURL({ format: "png", dynamic: false })
      );

      const attachment = new MessageAttachment(trash, "trash.png");

      commandData.respond({ files: [attachment] });

      return true;
    }
  );

  commandManager.registerCommand(
    "wanted",
    [],
    "Try it but a sheriff may find you one time",
    [
      {
        type: "USER",
        name: "User",
        description: "The user that you want to use in this meme.",
        required: true,
      },
    ],
    4,
    [],
    [Permissions.SEND_MESSAGES, Permissions.EMBED_LINKS],
    async (commandData: CommandData): Promise<boolean> => {
      const targetUser = await commandData.parseUserFromArgs(0);

      if (!targetUser) {
        commandData.respond(commandData.locales.SPECIFY_USER, true);
        return false;
      }

      const wanted = await canvacord.Canvacord.wanted(
        targetUser.displayAvatarURL({ format: "png", dynamic: false })
      );

      const attachment = new MessageAttachment(wanted, "wanted.png");

      commandData.respond({ files: [attachment] });

      return true;
    }
  );
};
