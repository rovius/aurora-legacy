import { ChannelType } from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class ServerCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "server",
      topName: "info",
      description: "Get the info about this server",
    });
  }
  async execute(interaction) {
    const guild = interaction.guild;
    const serverOwner = await guild.fetchOwner();

    interaction.reply({
      content: interaction.client.functions.reply(
        `Here's some info about **${interaction.client.functions.escapeMd(
          guild.name
        )}**:`,
        ":white_check_mark:"
      ),
      embeds: [
        interaction.client.functions
          .embed(interaction)
          .setThumbnail(guild.iconURL())
          .setDescription(
            guild.description
              ? interaction.client.functions.escapeMd(guild.description)
              : `This server has no description.`
          )
          .addFields([
            {
              name: "Common info",
              value: `**Snowflake:** ${guild.id}
**Created by:** ${serverOwner.user} (ID ${serverOwner.user.id})
**Creation date:** ${interaction.client.functions.formatTime(
                guild.createdTimestamp,
                "R"
              )}
        `,
            },
            {
              name: "Members",
              value: `
**Total:** ${guild.members.cache.size}
**Humans:** ${guild.members.cache.filter((m) => !m.user.bot).size}
**Bots:** ${guild.members.cache.filter((m) => m.user.bot).size}
          `,
              inline: true,
            },
            {
              name: "Channels",
              value: `
**Total:** ${guild.channels.cache.size}
**Text:** ${
                guild.channels.cache.filter(
                  (c) => c.type === ChannelType.GuildText
                ).size
              }
**Voice:** ${
                guild.channels.cache.filter(
                  (c) => c.type === ChannelType.GuildVoice
                ).size
              }
**Stages:** ${
                guild.channels.cache.filter(
                  (c) => c.type === ChannelType.GuildStageVoice
                ).size
              }
    `,
              inline: true,
            },
            {
              name: "Boosts",
              value: `
**Boosts count:** ${guild.premiumSubscriptionCount}
**Level:** ${guild.premiumTier}`,
              inline: true,
            },
          ])
          .setImage(
            guild.bannerURL({
              size: 2048,
              extension: "png",
            })
          ),
      ],
    });
  }
}
