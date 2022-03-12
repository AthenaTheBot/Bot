// Modules
import { readdirSync } from "fs";
import { join } from "path";

// Classes
import AthenaClient from "../AthenaClient";
import Event from "../Structures/Event";

/**
 * Handles all of the event registirations also listens the registered events and executes them when they get triggered.
 */
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

  // Registers event
  registerEvent(eventName: string, eventFunction: () => boolean) {
    this.events.push(new Event(eventName, eventFunction));
  }

  // Reads every event file inside of events folder then registers every exported event from event files.
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

  // Listens registered evenets
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
            this.client.config.debug.enabled
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
