"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubcommandGroup = exports.Subcommand = exports.Command = void 0;
class Command {
    get execute() {
        return (interaction) => {
            if (interaction.options.getSubcommand(false)) {
                if (interaction.options.getSubcommandGroup(false)) {
                    if (this.subcommandGroups.length === 0)
                        return this._execute(interaction);
                    if (!this.subcommandGroups.find(subcommandGroup => subcommandGroup.data.name === interaction.options.getSubcommandGroup()))
                        throw new Error(`Subcommand group ${interaction.options.getSubcommand()} not found under command ${this.data.name}.`);
                    return this.subcommandGroups.find(subcommandGroup => subcommandGroup.data.name === interaction.options.getSubcommandGroup()).execute(interaction);
                }
                if (interaction.options.getSubcommand(false)) {
                    if (this.subcommands.length === 0)
                        return this._execute(interaction);
                    if (!this.subcommands.find(subcommand => subcommand.data.name === interaction.options.getSubcommand()))
                        throw new Error(`Subcommand ${interaction.options.getSubcommand()} not found under command ${this.data.name}.`);
                    return this.subcommands.find(subcommand => subcommand.data.name === interaction.options.getSubcommand()).execute(interaction);
                }
                return this._execute(interaction);
            }
            return this._execute(interaction);
        };
    }
    set execute(fn) {
        this._execute = fn;
    }
    constructor(opt) {
        this.subcommandGroups = [];
        this.subcommands = [];
        Object.assign(this, opt);
        for (const command of this.subcommands) {
            this.data.addSubcommand(command.data);
        }
        for (const commandGroup of this.subcommandGroups) {
            this.data.addSubcommandGroup(commandGroup.data);
        }
    }
}
exports.Command = Command;
class Subcommand {
    constructor(opt) {
        Object.assign(this, opt);
    }
    ;
}
exports.Subcommand = Subcommand;
class SubcommandGroup {
    get execute() {
        return (interaction) => {
            if (interaction.options.getSubcommand(false)) {
                console.log(this.subcommands);
                if (!this.subcommands.find(subcommand => subcommand.data.name === interaction.options.getSubcommand()))
                    throw new Error(`Subcommand ${interaction.options.getSubcommand()} not found under subcommand group ${this.data.name}.`);
                return this.subcommands.find(subcommand => subcommand.data.name === interaction.options.getSubcommand()).execute(interaction);
            }
            return this._execute(interaction);
        };
    }
    set execute(fn) {
        this._execute = fn;
    }
    constructor(opt) {
        this.subcommands = [];
        Object.assign(this, opt);
        for (const command of this.subcommands) {
            this.data.addSubcommand(command.data);
        }
    }
}
exports.SubcommandGroup = SubcommandGroup;
//# sourceMappingURL=types.js.map