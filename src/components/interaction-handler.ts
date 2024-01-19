import { Interaction } from "discord.js";
import { handleAutocomplete } from "./handlers/autocomplete-handler";
import { handleCommand } from "./handlers/command-handler";

export async function handleInteraction(interaction: Interaction) {
  if (interaction.isChatInputCommand()) {
    handleCommand(interaction);
  }
  else if (interaction.isAutocomplete()) {
    handleAutocomplete(interaction);
  }
}