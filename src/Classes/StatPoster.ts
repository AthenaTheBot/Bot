import axios from "axios";
import AthenaClient from "../AthenaClient";

/**
 * Posts current stats to discord bot sites.
 */
class StatPoster {
  client: AthenaClient;
  postInterval: number;
  continue: boolean;

  constructor(client: AthenaClient, interval: number) {
    this.client = client;
    this.postInterval = interval;
    this.continue = true;
  }

  async postStats(): Promise<boolean> {
    if (this.client.config.debugMode) return false;

    let error = false;
    for (var i = 0; i < this.client.config.botlists.length; i++) {
      const botlist = this.client.config.botlists[i];

      if (!this.client?.guilds?.cache?.size) return false;

      try {
        await axios(
          botlist.url.replace("$client_id", (this.client.user as any).id),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...JSON.parse(
                JSON.stringify(botlist.header).replace("$token", botlist.token)
              ),
            },
            data: JSON.stringify(botlist.body).replace(
              "$guild_count",
              (this.client?.guilds?.cache as any).size
            ),
          }
        );
      } catch (err) {
        this.client.errorHandler.recordError(err as Error);
        error = true;
        break;
      }
    }

    if (error) {
      this.client.logger.warn(
        "Guild count post process wasn't completed unsuccessfully."
      );
      return false;
    }

    this.client.logger.success("Successfully posted guild count to bot lists.");

    return true;
  }

  async startPosting(): Promise<void> {
    while (this.continue) {
      this.postStats();
      await this.client.utils.sleep(this.postInterval * 60 * 1000);
    }
  }
}

export default StatPoster;
