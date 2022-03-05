import axios from "axios";
import AthenaClient from "../AthenaClient";

/**
 * Posts bot stats to discord bot list sites.
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
    if (this.client.config.debug.enabled) return false;

    let postStatErrors = [];

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
        postStatErrors.push({
          site: botlist.name,
          error: err,
        });
      }
    }

    if (postStatErrors.length > 0) {
      for (let i = 0; i < postStatErrors.length; i++) {
        this.client.logger.warn(
          `An error occured while posting bot stats to the site ${postStatErrors[i].site}`
        );
      }
    }

    this.client.logger.success(
      "Finished posting guild counts to the bot lists."
    );

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
