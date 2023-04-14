"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAutocomplete = void 0;
const builder_1 = require("../builder");
async function handleAutocomplete(interaction) {
    const command = builder_1.commands.get(interaction.commandName);
    // If command not found
    if (!builder_1.commands.get(interaction.commandName))
        throw new Error(`Cannot find the ${interaction.commandName} command but got an autocomplete request.`);
    const subcommandGroupName = interaction.options.getSubcommandGroup(false);
    if (subcommandGroupName) {
        const subcommandGroup = command.subcommandGroups.find(subcommandGroup => subcommandGroup.data.name == subcommandGroupName);
        const subcommandName = interaction.options.getSubcommand();
        if (subcommandName) {
            const subcommand = subcommandGroup.subcommands.find(subcommand => subcommand.data.name == subcommandName);
            if (subcommand.autocompleter)
                return await interaction.respond((await subcommand.autocompleter(interaction)).map(choice => ({ name: choice, value: choice })));
        }
    }
    // If it is a subcommand
    const subcommandName = interaction.options.getSubcommand(false);
    if (subcommandName) {
        const subcommand = command.subcommands.find(subcommand => subcommand.data.name == subcommandName);
        if (subcommand.autocompleter)
            return await interaction.respond((await subcommand.autocompleter(interaction)).map(choice => ({ name: choice, value: choice })));
    }
    if (command.autocompleter)
        return await interaction.respond((await command.autocompleter(interaction)).map(choice => ({ name: choice, value: choice })));
}
exports.handleAutocomplete = handleAutocomplete;
//# sourceMappingURL=autocomplete-handler.js.map