import AthenaClient from "../AthenaClient";
import { ActivitiesOptions } from "discord.js";

/**
 * Manages the presence of Athena.
 */
class PrecenceManager {
  client: AthenaClient;
  intervalAmount?: number;

  constructor(client: AthenaClient, intervalAmount?: number) {
    this.client = client;

    if (intervalAmount) {
      this.intervalAmount = intervalAmount;
    } else {
      this.intervalAmount = 5 * 60 * 1000;
    }
  }

  setPresence(activities: ActivitiesOptions[]): void {
    this.client.user?.setPresence({
      status: "online",
      afk: false,
      activities: activities,
    });

    setInterval(() => {
      this.client.user?.setPresence({
        status: "online",
        afk: false,
        activities: activities,
      });
    }, this.intervalAmount);
  }
}

export default PrecenceManager;
