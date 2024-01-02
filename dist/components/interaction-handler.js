"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInteraction = void 0;
const autocomplete_handler_1 = require("./handlers/autocomplete-handler");
const command_handler_1 = require("./handlers/command-handler");
async function handleInteraction(interaction) {
    if (interaction.isChatInputCommand()) {
        (0, command_handler_1.handleCommand)(interaction);
    }
    else if (interaction.isAutocomplete()) {
        (0, autocomplete_handler_1.handleAutocomplete)(interaction);
    }
}
exports.handleInteraction = handleInteraction;
//# sourceMappingURL=interaction-handler.js.map