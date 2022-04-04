import { Message } from "discord.js";
import { EventEmitter } from "events";

class Poll extends EventEmitter {
  id: string;
  question: string;
  message: Message;
  timeLeft: number;
  locales: any;

  constructor(
    id: string,
    question: string,
    message: Message,
    timeLeft: number,
    locales: any
  ) {
    super();
    this.id = id;
    this.question = question;
    this.message = message;
    this.timeLeft = timeLeft;
    this.locales = locales;

    setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft = this.timeLeft - 100;
      } else {
        if (this.timeLeft === -9999) return;
        this.emit("pollFinished", this);
        this.timeLeft = -9999;
      }
    }, 100);
  }
}

export default Poll;
