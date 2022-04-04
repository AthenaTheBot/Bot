import { MessageReaction, ReactionUserManager, User } from "discord.js";
import AthenaClient from "../AthenaClient";
import Event from "../Structures/Event";

export default new Event(
  "messageReactionAdd",
  async (
    client: AthenaClient,
    reaction: MessageReaction,
    reactionUser: User
  ): Promise<boolean> => {
    if (reactionUser?.id === client?.user?.id) return false;

    const pollExists =
      client.pollManager.polls.filter((x) => x.id).length > 0 ? true : false;

    if (pollExists) {
      if (reaction.emoji.name !== "👍" && reaction.emoji.name !== "👎") {
        reaction.users.remove(reactionUser.id).catch(() => {});
        return false;
      }

      const isVotedYes = (await (
        await reaction?.message?.reactions?.cache?.get("👍")
      )?.users.cache.get(reactionUser?.id))
        ? true
        : false;

      const isVotedNo = (await (
        await reaction?.message?.reactions?.cache?.get("👎")
      )?.users.cache.get(reactionUser?.id))
        ? true
        : false;

      if (reaction.emoji.name === "👍" && isVotedNo) {
        reaction.users.remove(reactionUser.id).catch(() => {});
        return false;
      } else if (reaction.emoji.name === "👎" && isVotedYes) {
        reaction.users.remove(reactionUser.id).catch(() => {});
        return false;
      }
    }

    return true;
  }
);
