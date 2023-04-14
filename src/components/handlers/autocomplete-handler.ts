import { AutocompleteInteraction } from "discord.js";
import { commands } from "../builder";

export async function handleAutocomplete(interaction: AutocompleteInteraction) {
  const command = commands.get(interaction.commandName);

  // If command not found
  if (!commands.get(interaction.commandName)) throw new Error(`Cannot find the ${interaction.commandName} command but got an autocomplete request.`);

  const subcommandGroupName = interaction.options.getSubcommandGroup(false);
  if (subcommandGroupName) {
    const subcommandGroup = command.subcommandGroups.find(subcommandGroup => subcommandGroup.data.name == subcommandGroupName);
    const subcommandName = interaction.options.getSubcommand();
    if (subcommandName) {
      const subcommand = subcommandGroup.subcommands.find(subcommand => subcommand.data.name == subcommandName);
      if (subcommand.autocompleter) {
        const choices = (await subcommand.autocompleter(interaction)).map(choice => ({ name: choice, value: choice })).splice(0, 25);
        return await interaction.respond(choices);
      }
    }
  }
  // If it is a subcommand
  const subcommandName = interaction.options.getSubcommand(false);
  if (subcommandName) {
    const subcommand = command.subcommands.find(subcommand => subcommand.data.name == subcommandName);
    if (subcommand.autocompleter) {
      const choices = (await subcommand.autocompleter(interaction)).map(choice => ({ name: choice, value: choice })).splice(0, 25);
      return await interaction.respond(choices);
    }
  }
  if (command.autocompleter) {
    const choices = (await command.autocompleter(interaction)).map(choice => ({ name: choice, value: choice })).splice(0, 25);
    return await interaction.respond(choices);
  }
}