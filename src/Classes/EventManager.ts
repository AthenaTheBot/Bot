/*
    TODO: Handler all events if event file exist.
*/

// Modules
import { readdirSync } from "fs";
import { join } from "path";

// Classes
import AthenaClient from "../AthenaClient";

class EventManager {
  eventsFolder: string;
  events: object[];

  constructor(AthenaClient: AthenaClient, evFolder?: string) {
    if (evFolder) {
      this.eventsFolder = evFolder;
    } else {
      this.eventsFolder = join(__dirname, "..", "Events");
    }

    this.events = [];
  }

  registerEvent(eventName: string, eventFunction: () => boolean) {
    this.events.push({
      eventName: eventName,
      eventFunction: eventFunction,
    });
  }

  registerEventsFromEventFolder() {
    const eventFiles = readdirSync(this.eventsFolder, "utf-8").filter((x) =>
      x.endsWith(".ts")
    );

    eventFiles.forEach((eventFile) => {
      import(join(this.eventsFolder, eventFile)).then((event) => {
        this.events.push({
          eventName: event.name,
          eventFunction: event.function,
        });
      });
    });
  }
}

export default EventManager;
