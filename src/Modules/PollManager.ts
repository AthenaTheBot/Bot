import Poll from "../Structures/Poll";
import { Athena } from "../index";
import { v4 as uuid } from "uuid";
import { MessageEmbed, TextChannel } from "discord.js";

class PollManager {
  polls: Poll[];

  constructor() {
    this.polls = [];
  }

  generatePollId(): string {
    const uniqueId = uuid().replaceAll("-", "") + new Date().getMilliseconds();

    const idExists =
      this.polls.filter((x) => x.id === uniqueId).length > 0 ? true : false;

    if (idExists) return this.generatePollId();
    else return uniqueId;
  }

  getPoll(pollId: string): Poll | null {
    return this.polls.find((x) => x.id === pollId) || null;
  }

  async createPoll(
    channelId: string,
    question: string,
    time: number,
    locales: any
  ): Promise<boolean> {
    const pollId = this.generatePollId();
    const pollChannel = (await Athena.channels
      .fetch(channelId)
      .catch((err) => null)) as TextChannel;

    if (pollChannel) {
      const pollEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(locales.POLL_STARTED)
        .setFooter({ text: `Id: ${pollId}` })
        .setDescription(
          locales.POLL_BODY_1.replace("$question", question.trim()).replace(
            "$time",
            time / 1000
          )
        )

        .setTimestamp();

      try {
        const pollMessage = await pollChannel.send({ embeds: [pollEmbed] });

        if (!pollMessage) throw new Error("Cannot send poll message");

        await pollMessage.react("👍");
        await pollMessage.react("👎");

        const poll = new Poll(
          pollId,
          question.trim(),
          pollMessage,
          time,
          locales
        );

        poll.on("pollFinished", (p: Poll) => {
          this.handlePollFinish(p);
        });

        this.polls.push(poll);

        return true;
      } catch (err) {
        return false;
      }
    } else {
      return false;
    }
  }

  endPoll(pollId: string): boolean {
    const poll = this.polls.find((x) => x.id === pollId);

    if (poll) {
      poll.timeLeft = 0;
      return true;
    } else {
      return false;
    }
  }

  async handlePollFinish(poll: Poll) {
    if (poll.message.editable) {
      poll.message = await poll?.message?.fetch(true);

      if (poll.message) {
        const currentYes =
          ((await poll.message.reactions.cache.get("👍")?.count) as number) -
            1 || 0;

        const currentNo =
          ((await poll.message.reactions.cache.get("👎")?.count) as number) -
            1 || 0;

        const pollEmbed = new MessageEmbed()
          .setColor("RANDOM")
          .setTitle(poll.locales.POLL_ENDED)
          .setFooter({ text: `Id: ${poll.id}` })
          .setDescription(
            poll.locales.POLL_BODY_2.replace("$question", poll.question)
              .replace("$time", 0)
              .replace("$currentYes", currentYes)
              .replace("$currentNo", currentNo)
          )
          .setTimestamp();

        poll.message.edit({ embeds: [pollEmbed] }).catch((err) => {});
      }
    }

    this.polls = this.polls.filter((x) => x.id !== poll.id);
  }
}

export default PollManager;
