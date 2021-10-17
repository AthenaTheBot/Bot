import Event from "../Classes/Event";

export default new Event("interactionCreate", (client, data): boolean => {
  return true;
});
