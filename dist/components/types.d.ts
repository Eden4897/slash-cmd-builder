import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { AutocompleteInteraction, CommandInteraction } from "discord.js";
export declare class Command {
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    private _execute?;
    get execute(): (interaction: CommandInteraction) => any;
    set execute(fn: (interaction: CommandInteraction) => any);
    constructor(opt: Command);
    subcommandGroups?: SubcommandGroup[];
    subcommands?: Subcommand[];
    autocompleter?: (interaction: AutocompleteInteraction) => string[] | Promise<string[]> | {
        name: string;
        value: string;
    }[] | Promise<{
        name: string;
        value: string;
    }[]>;
}
export declare class Subcommand {
    data: SlashCommandSubcommandBuilder;
    execute: (interaction: CommandInteraction) => any;
    constructor(opt: Subcommand);
    autocompleter?: (interaction: AutocompleteInteraction) => string[] | Promise<string[]> | {
        name: string;
        value: string;
    }[] | Promise<{
        name: string;
        value: string;
    }[]>;
}
export declare class SubcommandGroup {
    data: SlashCommandSubcommandGroupBuilder;
    private _execute?;
    get execute(): (interaction: CommandInteraction) => any;
    set execute(fn: (interaction: CommandInteraction) => any);
    constructor(opt: SubcommandGroup);
    subcommands?: Subcommand[];
}
