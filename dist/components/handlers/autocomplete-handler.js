"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAutocomplete = void 0;
const builder_1 = require("../builder");
async function handleAutocomplete(interaction) {
    const command = builder_1.commands.get(interaction.commandName);
    // If command not found
    if (!builder_1.commands.get(interaction.commandName))
        throw new Error(`Cannot find the ${interaction.commandName} command but got an autocomplete request.`);
    if (command.autocompleter) {
        const choices = (await command.autocompleter(interaction)).map((choice) => ({ name: choice, value: choice }));
        return await interaction.respond(choices.slice(0, 25));
    }
    // If it is a subcommand
    const subcommandName = interaction.options.getSubcommand();
    if (subcommandName) {
        const subcommand = command.subcommands.find(subcommand => subcommand.data.name == subcommandName);
        if (subcommand.autocompleter) {
            const choices = (await subcommand.autocompleter(interaction)).map((choice) => ({ name: choice, value: choice }));
            return await interaction.respond(choices.slice(0, 25));
        }
    }
    // If it is a subcommand in a subcommand group
    const subcommandGroupName = interaction.options.getSubcommandGroup();
    if (subcommandGroupName) {
        const subcommandGroup = command.subcommandGroups.find((subcommandGroup) => subcommandGroup.data.name == subcommandGroupName);
        const subcommandName = interaction.options.getSubcommand();
        if (subcommandName) {
            const subcommand = subcommandGroup.subcommands.find((subcommand) => subcommand.data.name == subcommandName);
            if (subcommand.autocompleter) {
                const choices = (await subcommand.autocompleter(interaction)).map((choice) => ({ name: choice, value: choice }));
                return await interaction.respond(choices.slice(0, 25));
            }
        }
    }
}
exports.handleAutocomplete = handleAutocomplete;
//# sourceMappingURL=autocomplete-handler.js.map