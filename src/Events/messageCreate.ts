import Event from "../Classes/Event";

export default new Event("messageCreate", (client, data): boolean => {
  console.log(data.content);
  return true;
});
