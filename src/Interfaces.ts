export interface configInterface {
  debugMode: boolean;
  bot: {
    token: string;
    activity: string;
  };
  webhooks: {
    error: string;
  };
  db_url: string;
}
