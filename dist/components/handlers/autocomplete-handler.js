"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAutocomplete = void 0;
const builder_1 = require("../builder");
async function handleAutocomplete(interaction) {
    const command = builder_1.commands.get(interaction.commandName);
    // If command not found
    if (!command)
        throw new Error(`Cannot find the ${interaction.commandName} command but got an autocomplete request.`);
    let autocompleter;
    const subcommandGroupName = interaction.options.getSubcommandGroup(false);
    if (subcommandGroupName) {
        const subcommandGroup = command.subcommandGroups.find(subcommandGroup => subcommandGroup.data.name == subcommandGroupName);
        const subcommandName = interaction.options.getSubcommand();
        if (subcommandName) {
            const subcommand = subcommandGroup.subcommands.find(subcommand => subcommand.data.name == subcommandName);
            autocompleter = subcommand.autocompleter;
        }
    }
    else {
        const subcommandName = interaction.options.getSubcommand(false);
        if (subcommandName) {
            const subcommand = command.subcommands.find(subcommand => subcommand.data.name == subcommandName);
            autocompleter = subcommand.autocompleter;
        }
        else {
            autocompleter = command.autocompleter;
        }
    }
    if (autocompleter) {
        const choices = await autocompleter(interaction);
        if (typeof choices[0] === 'object' && choices[0] !== null) {
            return await interaction.respond(choices);
        }
        return await interaction.respond(choices.map(choice => ({ name: choice, value: choice })).splice(0, 25));
    }
}
exports.handleAutocomplete = handleAutocomplete;
//# sourceMappingURL=autocomplete-handler.js.map