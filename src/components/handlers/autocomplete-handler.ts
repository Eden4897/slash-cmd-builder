import { AutocompleteInteraction } from "discord.js";
import { commands } from "../builder";

export async function handleAutocomplete(interaction: AutocompleteInteraction) {
  const command = commands.get(interaction.commandName);

  // If command not found
  if (!commands.get(interaction.commandName)) throw new Error(`Cannot find the ${interaction.commandName} command but got an autocomplete request.`);

  if (command.autocompleter) {
    const choices = (await command.autocompleter(interaction)).map((choice: any) => ({ name: choice, value: choice }));
    return await interaction.respond(
      choices.slice(0, 25)
    );
  }
  // If it is a subcommand
  const subcommandName = interaction.options.getSubcommand();
  if (subcommandName) {
    const subcommand = command.subcommands.find((subcommand: { data: { name: any; }; }) => subcommand.data.name == subcommandName);
    if (subcommand.autocompleter) {
      const choices = (await subcommand.autocompleter(interaction)).map((choice: any) => ({ name: choice, value: choice }));
      return await interaction.respond(
        choices.slice(0, 25)
      );
    }
  }

  // If it is a subcommand in a subcommand group
  const subcommandGroupName = interaction.options.getSubcommandGroup();
  if (subcommandGroupName) {
    const subcommandGroup = command.subcommandGroups.find((subcommandGroup: { data: { name: any; }; }) => subcommandGroup.data.name == subcommandGroupName);
    const subcommandName = interaction.options.getSubcommand();
    if (subcommandName) {
      const subcommand = subcommandGroup.subcommands.find((subcommand: { data: { name: any; }; }) => subcommand.data.name == subcommandName);
      if (subcommand.autocompleter) {
        const choices = (await subcommand.autocompleter(interaction)).map((choice: any) => ({ name: choice, value: choice }));
        return await interaction.respond(
          choices.slice(0, 25)
        );
      }
    }
  }
}