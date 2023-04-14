import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { AutocompleteInteraction, CommandInteraction } from "discord.js";

export class Command {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  private _execute?: (interaction: CommandInteraction) => any;
  get execute() {
    return (interaction: CommandInteraction) => {
      if (interaction.options.getSubcommand(false)) {
        if (!this.subcommands.find(subcommand => subcommand.data.name === interaction.options.getSubcommand())) {
          console.log(this.subcommands);
          throw new Error(`Subcommand ${interaction.options.getSubcommand()} not found under command ${this.data.name}.`);
        }
        return this.subcommands.find(subcommand => subcommand.data.name === interaction.options.getSubcommand()).execute(interaction);
      }
      return this._execute(interaction);
    };
  }
  set execute(fn: (interaction: CommandInteraction) => any) {
    this._execute = fn;
  }

  constructor(opt: Command) {
    Object.assign(this, opt);
    for (const command of this.subcommands) {
      (<SlashCommandBuilder>this.data).addSubcommand(command.data);
    }
    for (const commandGroup of this.subcommandGroups) {
      (<SlashCommandBuilder>this.data).addSubcommandGroup(commandGroup.data);
    }
  }
  subcommandGroups?: SubcommandGroup[] = [];
  subcommands?: Subcommand[] = [];
  autocompleter?: (interaction: AutocompleteInteraction) => string[] | Promise<string[]>;
}

export class Subcommand {
  data: SlashCommandSubcommandBuilder;
  execute: (interaction: CommandInteraction) => any;
  constructor(opt: Subcommand) {
    Object.assign(this, opt);
  };
  autocompleter?: (interaction: AutocompleteInteraction) => string[] | Promise<string[]>;
}

export class SubcommandGroup {
  data: SlashCommandSubcommandGroupBuilder;
  private _execute?: (interaction: CommandInteraction) => any;
  get execute() {
    return (interaction: CommandInteraction) => {
      if (interaction.options.getSubcommand(false)) {
        if (!this.subcommands.find(subcommand => subcommand.data.name === interaction.options.getSubcommand()))
          throw new Error(`Subcommand ${interaction.options.getSubcommand()} not found under subcommand group ${this.data.name}.`);
        return this.subcommands.find(subcommand => subcommand.data.name === interaction.options.getSubcommand()).execute(interaction);
      }
      return this._execute(interaction);
    };
  }
  set execute(fn: (interaction: CommandInteraction) => any) {
    this._execute = fn;
  }

  constructor(opt: SubcommandGroup) {
    Object.assign(this, opt);
    for (const command of this.subcommands) {
      this.data.addSubcommand(command.data);
    }
  }
  subcommands?: Subcommand[] = [];
}