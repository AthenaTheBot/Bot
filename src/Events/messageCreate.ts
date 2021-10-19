import Event from "../Classes/Event";

export default new Event("messageCreate", (client, data): boolean => {
  return true;
});
