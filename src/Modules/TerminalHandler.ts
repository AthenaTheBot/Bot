import AthenaClient from "../AthenaClient";
import fs from "fs-extra";
import path from "path";

/**
 * Listens terminal commands.
 */
class TerminalHandler {
  client: AthenaClient;

  constructor(client: AthenaClient) {
    this.client = client;
  }

  listenTerminal(): void {
    process.stdin.on("data", (data) => {
      const command = data.toString().trim();
      if (command.length == 0) return;
      switch (command) {
        case "guild-count":
          this.client.logger.log(
            `Current guild count: ${this.client.guilds.cache.size}`
          );
          break;

        case "user-count":
          this.client.logger.log(
            `Current cached user count: ${this.client.users.cache.size}`
          );
          break;

        case "is-playing":
          const listeners: string[] = [];
          this.client.player.listeners.forEach((listener) => {
            if (listener.listening) {
              listeners.push(listener.guildId);
            }
          });

          if (listeners.length == 0) {
            this.client.logger.log("Currently there isn't any song streams.");
          } else {
            this.client.logger.log(
              `Current song stream count: ${listeners.length}`
            );
            this.client.logger.log(`Guild(s): ${listeners.join(",")}`);
          }
          break;

        case "uptime":
          let uptime = process.uptime() * 1000;

          // Constants
          const second = 1000;
          const minute = second * 60;
          const hour = minute * 60;
          const day = hour * 24;

          const days = day > uptime ? 0 : Math.floor(uptime / day);
          uptime -= days * day;
          const hours = hour > uptime ? 0 : Math.floor(uptime / hour);
          uptime -= hours * hour;
          const minutes = minute > uptime ? 0 : Math.floor(uptime / minute);
          uptime -= minute * minutes;
          const seconds = second > uptime ? 0 : Math.floor(uptime / second);
          uptime -= second * seconds;
          const miliseconds = Math.floor(uptime);

          this.client.logger.log(
            `Uptime: ${days} days, ${hours} hourds, ${minutes} minutes, ${seconds} seconds, ${miliseconds} miliseconds`
          );
          break;

        case "memory-usage":
          const memUsage = process.memoryUsage();
          const usage = (memUsage.heapTotal / 1000000).toFixed(2);

          this.client.logger.log(`Approximate Memory Usage: ${usage} MB`);
          break;

        case "remove-errors":
          const errosFolder = path.join(__dirname, "..", "..", "errors");
          const errorFileCount =
            fs.readdirSync(errosFolder).filter((x) => x.endsWith(".log"))
              ?.length || 0;

          if (errorFileCount === 0)
            return this.client.logger.warn(
              "There isn't any error file to remove."
            );

          try {
            fs.emptyDirSync(errosFolder);

            this.client.logger.success(
              `Successfully removed ${errorFileCount} error file(s).`
            );
          } catch (err) {
            this.client.logger.error(
              "An error occured while removing error files."
            );
          }
          break;

        default:
          this.client.logger.warn("Invalid terminal command was specified!");
          break;
      }
    });
  }
}

export default TerminalHandler;
