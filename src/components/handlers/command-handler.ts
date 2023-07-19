import { CommandInteraction } from "discord.js";
import { commands } from "../builder";

export async function handleCommand(interaction: CommandInteraction) {
    const command = commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        let subCommand: string | undefined = undefined;
        let subCommandGroup: string | undefined = undefined;

        // Try to fetch subcommand group, if it exists
        if (interaction.options.data.find((option) => option.type === 'SUB_COMMAND_GROUP')) {
            try {
                subCommandGroup = interaction.options.getSubcommandGroup();
            } catch (e) {
                subCommandGroup = undefined;
            }
        }

        // Try to fetch subcommand, if it exists
        if (interaction.options.data.find((option) => option.type === 'SUB_COMMAND')) {
            try {
                subCommand = interaction.options.getSubcommand();
            } catch (e) {
                subCommand = undefined;
            }
        }
        if (subCommandGroup) {
            console.error(`Error while executing "${interaction.commandName}" command in subcommand group "${subCommandGroup}":`, error);
        } else if (subCommand) {
            console.error(`Error while executing "${interaction.commandName}" command in subcommand "${subCommand}":`, error);
        } else {
            console.error(`Error while executing "${interaction.commandName}" command:`, error);
        }
        await interaction
            .reply({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            })
            .catch(() =>
                interaction.followUp({
                    content: 'There was an error while executing this command!',
                    ephemeral: true,
                })
            );

       
    }
}
