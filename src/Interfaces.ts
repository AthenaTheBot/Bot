export interface configInterface {
  debugMode: boolean;
  bot: {
    token: string;
  };
  webhooks: {
    error: string;
  };
  db_url: string;
}
