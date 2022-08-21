import * as DJS from "discord.js";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class InteractionCreateEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "interactionCreate");
  }

  async execute(
    client: AuroraClient,
    interaction: DJS.ChatInputCommandInteraction<"cached" | "raw">
  ) {
    if (!interaction || !interaction.guild) return;
    if (interaction.type !== DJS.InteractionType.ApplicationCommand) return;
    if (interaction.commandType !== DJS.ApplicationCommandType.ChatInput)
      return;
    if (!interaction.inGuild()) return;

    const command = client.interactions.get(this.getCommand(interaction));
    if (!command) return;

    const locale = await client.locales.getLocale(
      interaction.guild.id,
      interaction.user.id
    );

    try {
      await command.execute(interaction, locale);
    } catch (error) {
      await interaction.followUp({
        content: client.reply(
          locale("misc:error", { error: `${error.name}` }),
          ":x:"
        ),
      });
      console.log(`[error] ${error?.stack}`);
    }
  }

  getCommand(interaction: DJS.ChatInputCommandInteraction<"cached" | "raw">) {
    let command: string;

    const commandName = interaction.commandName;
    const group = interaction.options.getSubcommandGroup(false);
    const subCommand = interaction.options.getSubcommand(false);

    if (subCommand) {
      if (group) {
        command = `${commandName}-${group}-${subCommand}`;
      } else {
        command = `${commandName}-${subCommand}`;
      }
    } else {
      command = commandName;
    }

    return command;
  }
}
