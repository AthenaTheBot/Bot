import AthenaClient from "../AthenaClient";

class Event {
  name: string;
  exec: (
    client: AthenaClient,
    data: any,
    data2?: any,
    data3?: any
  ) => boolean | Promise<boolean>;

  constructor(
    name: string,
    exec: (
      client: AthenaClient,
      data: any,
      data2?: any,
      data3?: any
    ) => boolean | Promise<boolean>
  ) {
    this.name = name;
    this.exec = exec;
  }
}

export default Event;
