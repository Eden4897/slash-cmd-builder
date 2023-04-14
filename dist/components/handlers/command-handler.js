"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCommand = void 0;
const builder_1 = require("../builder");
async function handleCommand(interaction) {
    const command = builder_1.commands.get(interaction.commandName);
    if (!command)
        return;
    try {
        await command.execute(interaction);
    }
    catch (error) {
        await interaction
            .reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        })
            .catch(() => interaction.followUp({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        }));
        const subGroup = interaction.options.getSubcommandGroup();
        const subCommand = interaction.options.getSubcommand();
        if (subGroup) {
            console.error(`Error while executing "${interaction.commandName}" command in subcommand group "${subGroup}":`, error);
        }
        else if (subCommand) {
            console.error(`Error while executing "${interaction.commandName}" command in subcommand "${subCommand}":`, error);
        }
        else {
            console.error(`Error while executing "${interaction.commandName}" command:`, error);
        }
    }
}
exports.handleCommand = handleCommand;
//# sourceMappingURL=command-handler.js.map