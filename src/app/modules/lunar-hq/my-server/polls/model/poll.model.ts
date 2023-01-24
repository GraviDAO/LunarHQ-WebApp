export interface PollModel {
  title?: string;
  description?: string;
  address?: string;
  votingSystem?: string;
  creatorDiscordId?: string;
  quorum?: string;
  discordChannelId?: string;
  discordChannelName?: string;
  startDate?: Date;
  endDate?: Date;
  discordServerId?: string;
  blockchainName?: string;
  numberPerVote?: 0;
  status?: string;
  ruleIds?: string [];
}
