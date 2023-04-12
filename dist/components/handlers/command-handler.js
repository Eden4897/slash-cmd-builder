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
        console.error(`Error while executing "${interaction.commandName}" command:`, error);
    }
}
exports.handleCommand = handleCommand;
//# sourceMappingURL=command-handler.js.map