/**
 * Discord Platform Connector for CITIZEN
 * Handles Discord bot interactions and community management
 */

export interface DiscordConfig {
  botToken: string;
  guildId: string;
  governanceChannelId?: string;
  announcementsChannelId?: string;
  clientId?: string;
}

export interface DiscordMessage {
  content: string;
  embeds?: {
    title?: string;
    description?: string;
    color?: number;
    url?: string;
    fields?: { name: string; value: string; inline?: boolean }[];
    timestamp?: string;
  }[];
  components?: any[];
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  displayName?: string;
  roles: string[];
  joinedAt?: Date;
}

export class DiscordConnector {
  private config: DiscordConfig;
  private baseUrl = 'https://discord.com/api/v10';

  constructor(config: DiscordConfig) {
    this.config = config;
  }

  // Community Analysis
  async analyzeCommunityActivity(channelId?: string): Promise<{
    recentMessages: any[];
    activeUsers: DiscordUser[];
    sentiment: number;
    engagementRate: number;
  }> {
    try {
      const targetChannelId = channelId || this.config.governanceChannelId || this.config.announcementsChannelId;
      
      if (!targetChannelId) {
        throw new Error('No channel ID specified for analysis');
      }

      // Get recent messages
      const recentMessages = await this.getChannelMessages(targetChannelId, 100);
      
      // Analyze active users
      const activeUsers = await this.getActiveGuildUsers();
      
      // Calculate metrics
      const sentiment = this.analyzeSentiment(recentMessages);
      const engagementRate = this.calculateEngagementRate(recentMessages);

      return {
        recentMessages,
        activeUsers,
        sentiment,
        engagementRate
      };
    } catch (error) {
      console.error('[Discord] Community analysis failed:', error);
      throw error;
    }
  }

  // Messaging
  async sendMessage(channelId: string, message: DiscordMessage): Promise<{ id: string; success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/channels/${channelId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bot ${this.config.botToken}`
        },
        body: JSON.stringify(message)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Discord API error: ${response.status} ${error}`);
      }

      const result = await response.json();
      console.log('[Discord] Message sent successfully:', result.id);

      return {
        id: result.id,
        success: true
      };
    } catch (error) {
      console.error('[Discord] Message sending failed:', error);
      return { id: '', success: false };
    }
  }

  async sendGovernanceAnnouncement(proposal: {
    title: string;
    description: string;
    type: string;
    votingEnd: Date;
    snapshotUrl?: string;
  }): Promise<{ success: boolean }> {
    const channelId = this.config.governanceChannelId || this.config.announcementsChannelId;
    
    if (!channelId) {
      throw new Error('No governance or announcements channel configured');
    }

    const embed = {
      title: `🗳️ New ${proposal.type} Proposal`,
      description: proposal.title,
      color: 0x5865F2, // Discord blue
      fields: [
        {
          name: 'Description',
          value: proposal.description.substring(0, 1000),
          inline: false
        },
        {
          name: 'Voting Deadline',
          value: proposal.votingEnd.toLocaleString(),
          inline: true
        },
        {
          name: 'Type',
          value: proposal.type.charAt(0).toUpperCase() + proposal.type.slice(1),
          inline: true
        }
      ],
      timestamp: new Date().toISOString()
    };

    if (proposal.snapshotUrl) {
      embed.fields.push({
        name: 'Vote on Snapshot',
        value: `[Cast your vote here](${proposal.snapshotUrl})`,
        inline: false
      });
    }

    const message: DiscordMessage = {
      content: `@everyone A new governance proposal requires your attention!`,
      embeds: [embed]
    };

    const result = await this.sendMessage(channelId, message);
    return { success: result.success };
  }

  // Community Engagement
  async reactToMessage(channelId: string, messageId: string, emoji: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}/@me`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bot ${this.config.botToken}`
          }
        }
      );

      return { success: response.ok };
    } catch (error) {
      console.error('[Discord] Reaction failed:', error);
      return { success: false };
    }
  }

  async replyToMessage(
    channelId: string, 
    messageId: string, 
    replyContent: string
  ): Promise<{ success: boolean }> {
    const message: DiscordMessage = {
      content: replyContent,
      // Reference to original message
      components: [{
        type: 1,
        components: [{
          type: 2,
          style: 5,
          label: 'Original Message',
          url: `https://discord.com/channels/${this.config.guildId}/${channelId}/${messageId}`
        }]
      }]
    };

    const result = await this.sendMessage(channelId, message);
    return { success: result.success };
  }

  // Data Retrieval
  private async getChannelMessages(channelId: string, limit: number = 50): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/channels/${channelId}/messages?limit=${limit}`,
        {
          headers: {
            'Authorization': `Bot ${this.config.botToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Messages fetch error: ${response.statusText}`);
      }

      const messages = await response.json();
      return messages || [];
    } catch (error) {
      console.error('[Discord] Failed to get channel messages:', error);
      return [];
    }
  }

  private async getActiveGuildUsers(): Promise<DiscordUser[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/guilds/${this.config.guildId}/members?limit=1000`,
        {
          headers: {
            'Authorization': `Bot ${this.config.botToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Guild members error: ${response.statusText}`);
      }

      const members = await response.json();
      
      return members.map((member: any) => ({
        id: member.user.id,
        username: member.user.username,
        discriminator: member.user.discriminator,
        displayName: member.nick || member.user.display_name,
        roles: member.roles || [],
        joinedAt: member.joined_at ? new Date(member.joined_at) : undefined
      }));
    } catch (error) {
      console.error('[Discord] Failed to get guild members:', error);
      return [];
    }
  }

  private analyzeSentiment(messages: any[]): number {
    // Simple sentiment analysis based on reactions and content
    const positiveEmojis = ['👍', '❤️', '🎉', '🔥', '💯', '✅'];
    const negativeEmojis = ['👎', '😠', '😢', '❌', '😞'];
    
    let totalScore = 0;
    let totalMessages = messages.length;

    for (const message of messages) {
      let messageScore = 0;
      
      // Analyze reactions
      if (message.reactions) {
        for (const reaction of message.reactions) {
          if (positiveEmojis.includes(reaction.emoji.name)) {
            messageScore += reaction.count;
          } else if (negativeEmojis.includes(reaction.emoji.name)) {
            messageScore -= reaction.count;
          }
        }
      }

      // Simple keyword analysis
      const content = message.content?.toLowerCase() || '';
      const positiveWords = ['great', 'love', 'awesome', 'amazing', 'excellent'];
      const negativeWords = ['bad', 'hate', 'awful', 'terrible', 'disappointed'];

      positiveWords.forEach(word => {
        if (content.includes(word)) messageScore += 1;
      });

      negativeWords.forEach(word => {
        if (content.includes(word)) messageScore -= 1;
      });

      totalScore += messageScore;
    }

    return totalMessages > 0 ? Math.max(-1, Math.min(1, totalScore / totalMessages / 10)) : 0;
  }

  private calculateEngagementRate(messages: any[]): number {
    if (messages.length === 0) return 0;

    const totalReactions = messages.reduce((sum, message) => {
      return sum + (message.reactions?.reduce((reactSum: number, reaction: any) => 
        reactSum + reaction.count, 0) || 0);
    }, 0);

    const totalReplies = messages.filter(msg => msg.referenced_message).length;
    
    return (totalReactions + totalReplies) / messages.length / 10; // Normalize to 0-1
  }

  // Connection Testing
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/users/@me`, {
        headers: {
          'Authorization': `Bot ${this.config.botToken}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('[Discord] Connection test failed:', error);
      return false;
    }
  }

  // Utility Methods
  async getGuildInfo(): Promise<{
    name: string;
    memberCount: number;
    channels: { id: string; name: string; type: number }[];
  }> {
    try {
      const [guildResponse, channelsResponse] = await Promise.all([
        fetch(`${this.baseUrl}/guilds/${this.config.guildId}`, {
          headers: { 'Authorization': `Bot ${this.config.botToken}` }
        }),
        fetch(`${this.baseUrl}/guilds/${this.config.guildId}/channels`, {
          headers: { 'Authorization': `Bot ${this.config.botToken}` }
        })
      ]);

      const guild = await guildResponse.json();
      const channels = await channelsResponse.json();

      return {
        name: guild.name,
        memberCount: guild.member_count || 0,
        channels: channels.map((ch: any) => ({
          id: ch.id,
          name: ch.name,
          type: ch.type
        }))
      };
    } catch (error) {
      console.error('[Discord] Failed to get guild info:', error);
      throw error;
    }
  }

  formatDailyInsight(insight: string, topic: string): DiscordMessage {
    return {
      embeds: [{
        title: `💡 Daily ${topic} Insight`,
        description: insight,
        color: 0x00D4AA, // Teal
        timestamp: new Date().toISOString(),
        footer: {
          text: 'CITIZEN • DAO Governance Coordinator'
        }
      }]
    };
  }
}