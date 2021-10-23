import AthenaClient from "../AthenaClient";

class Event {
  name: string;
  exec: (client: AthenaClient, data: any) => boolean | Promise<boolean>;

  constructor(
    name: string,
    exec: (client: AthenaClient, data: any) => boolean | Promise<boolean>
  ) {
    this.name = name;
    this.exec = exec;
  }
}

export default Event;
