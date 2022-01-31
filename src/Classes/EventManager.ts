// Modules
import { readdirSync } from "fs";
import { join } from "path";

// Classes
import AthenaClient from "../AthenaClient";
import Event from "./Event";

class EventManager {
  client: AthenaClient;
  eventsFolder: string;
  events: Event[];

  constructor(client: AthenaClient, evFolder?: string) {
    this.client = client;

    if (evFolder) {
      this.eventsFolder = evFolder;
    } else {
      this.eventsFolder = join(__dirname, "..", "Events");
    }

    this.events = [];
  }

  registerEvent(eventName: string, eventFunction: () => boolean) {
    this.events.push(new Event(eventName, eventFunction));
  }

  async registerEventsFromEventFolder(): Promise<object> {
    const eventFiles = await readdirSync(this.eventsFolder, "utf-8").filter(
      (x) => x.endsWith(".js")
    );

    for (var i = 0; i < eventFiles.length; i++) {
      const eventFile = eventFiles[i];
      const event = await import(join(this.eventsFolder, eventFile)).then(
        (d) => d.default
      );
      this.events.push(new Event(event.name, event.exec));
    }

    return this.events;
  }

  listenEvents() {
    for (var i = 0; i < this.events.length; i++) {
      const event = this.events[i];
      try {
        this.client.on(event.name, async (data) => {
          await event.exec(this.client, data);
        });
      } catch (err) {
        this.client.logger.error(
          `An error happened while loading event ${event.name}. ${
            this.client.config.debugMode
              ? "\n \n" + this.client.utils.parseError(<Error>err)
              : ""
          }`
        );

        break;
      }
    }
  }
}

export default EventManager;
