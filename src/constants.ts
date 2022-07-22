import { PermissionFlagsBits } from "discord.js";
import UserWarning from "./Structures/UserWarning";

interface Config {
  debug: {
    enabled: boolean;
    guild: string;
  };
  colors: {
    default: string;
    error: string;
    success: string;
  };
  bot: {
    token: string;
    activity: string;
    statPostInterval: number;
  };
  log: {
    command: string;
    guild: string;
    error: string;
  };
  defaults: {
    language: LanguageOptions;
    prefix: string;
  };
  actions: {
    warnKickCount: number;
    warnBanCount: number;
  };
  apis: {
    genius: Api;
  };
  botlists: Botlist[];
  dbUrl: string;
}

interface Botlist {
  name: string;
  url: string;
  header: any;
  body: any;
  token: string;
}

interface WelcomerEmbed {
  author: {
    name: string;
    icon: string;
    url: string;
  };
  title: string;
  description: string;
  thumbnail: string;
  image: string;
  url: string;
  color: string;
  footer: {
    icon: string;
    text: string;
  };
}

interface Welcomer {
  enabled: boolean;
  message: { content: string; embed: WelcomerEmbed };
  channel: string;
}

interface GuildModules {
  settings: {
    prefix: string;
    language: LanguageOptions;
  };
  moderation: {
    adminRole?: string | null;
    modRole?: string | null;
    warnings?: UserWarning[];
    autoRole: string | null;
  };
  welcomer: {
    messageToChannel: Welcomer | null;
  };
  fun?: {};
  utils?: {};
}

interface UserOpitons {
  language?: LanguageOptions;
  premium?: boolean;
}

interface Api {
  baseUrl: string;
  key: string;
}

interface SongSearchResultHit {
  highlights: any;
  index: string;
  type: string;
  result: {
    title: string;
    full_title: string;
    artist_names: string;
    header_image_thumbnail_url: string;
    header_image_url: string;
    id: number;
    lyrics_state: string;
    release_date_for_display: string;
    stats: {
      hot: boolean;
      pageviews: number;
    };
    url: string;
  };
}

interface SongSearchResult {
  meta: {
    status: number;
  };
  response: {
    hits: SongSearchResultHit[];
  };
}

interface SongLyrics {
  title: string;
  artists: string;
  thumbnail: string;
  content: string;
}

enum LanguageOptions {
  EN_US = "en_US",
  TR_TR = "tr_TR",
}

enum Permissions {
  "CreateInstantInvite",
  "KickMembers",
  "BanMembers",
  "Administrator",
  "ManageChannels",
  "ManageGuild",
  "AddReactions",
  "ViewAuditLog",
  "PrioritySpeaker",
  "Stream",
  "ViewChannel",
  "SendMessages",
  "SendTTSMessages",
  "ManageMessages",
  "EmbedLinks",
  "AttachFiles",
  "ReadMessageHistory",
  "MentionEveryone",
  "UseExternalEmojis",
  "ViewGuildInsights",
  "Connect",
  "Speak",
  "MuteMembers",
  "DeafenMembers",
  "MoveMembers",
  "UseVAD",
  "ChangeNickname",
  "ManageNickNames",
  "ManageRoles",
  "ManageWebhooks",
  "ManageEmojisAndStickers",
  "UseApplicationCommands",
  "RequestToSpeak",
  "ManageEvents",
  "ManageThreads",
  "CreatePublicThreads",
  "CreatePrivateThreads",
  "UseExternalStickers",
  "SendMessagesInThreads",
  "UseEmbeddedActivities",
}

enum TextPerms {
  "CreateInstantInvite",
  "ManageChannels",
  "AddReactions",
  "ViewChannel",
  "SendMessages",
  "SendTTSMessages",
  "ManageMessages",
  "EmbedLinks",
  "AttachFiles",
  "ReadMessageHistory",
  "MentionEveryone",
  "UseExternalEmojis",
  "ManageRoles",
  "ManageWebhooks",
  "UseApplicationCommands",
  "ManageThreads",
  "CreatePublicThreads",
  "CreatePrivateThreads",
  "UseExternalStickers",
  "SendMessagesInThreads",
}

enum VoicePerms {
  "CreateInstantInvite",
  "ManageChannels",
  "PrioritySpeaker",
  "Stream",
  "ViewChannel",
  "Connect",
  "Speak",
  "MuteMembers",
  "DeafenMembers",
  "MoveMembers",
  "UseVAD",
  "ManageRoles",
  "ManageEvents",
  "UseEmbeddedActivities",
}

enum RolePerms {
  "KickMembers",
  "BanMembers",
  "Administrator",
  "ManageGuild",
  "ViewAuditLog",
  "ViewGuildInsights",
  "ChangeNickname",
  "ManageNickNames",
  "ManageEmojisAndStickers",
}

export {
  Config,
  Botlist,
  UserOpitons,
  GuildModules,
  LanguageOptions,
  TextPerms,
  RolePerms,
  VoicePerms,
  Permissions,
  Api,
  SongLyrics,
  SongSearchResult,
  WelcomerEmbed,
};
