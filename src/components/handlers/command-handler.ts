import { CommandInteraction } from "discord.js";
import { commands } from "../builder";

export async function handleCommand(interaction: CommandInteraction) {
	const command = commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
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
		throw error;
	}
}