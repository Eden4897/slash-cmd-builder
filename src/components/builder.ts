import { Collection } from "discord.js";
import { readdirSync, existsSync } from "fs";
import path from "path";
import { Command, Subcommand, SubcommandGroup } from "./types";
import { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";

const commands: Collection<string, Command> = new Collection<string, Command>();

const commandsDir = existsSync(path.join(process.cwd(), "/commands")) ? path.join(process.cwd(), "/commands") : path.join(process.cwd(), "/build/commands");
const commandFiles: string[] = readdirSync(path.join(commandsDir));
commandFiles.forEach(file => {
  if (!file.endsWith(`.js`)) return;
 
  const command: Command = require(path.join(commandsDir, file)).default;
  commands.set(command.data.name, command);
});

const subcommandFolders = readdirSync(commandsDir, { withFileTypes: true }).filter(dirent => dirent.isDirectory());
subcommandFolders.forEach(subcommandFolder => {
  const commandName = subcommandFolder.name;
  
  if (!commandName.match(/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u))
    throw new Error(`Invalid command file name: ${commandName}`);

  const subcommandObjs: Subcommand[] = [];
  const subcommandGrpObjs: SubcommandGroup[] = [];

  const childItems = readdirSync(path.join(commandsDir, commandName), { withFileTypes: true });

  const subcommandFiles = childItems.filter(childItem => !childItem.isDirectory()).filter(childItem => childItem.name.endsWith(`.js`));
  subcommandFiles.forEach(subcommandFile => {
    const subcommandName = subcommandFile.name.split(`.`)[0];
   
    const subcommand: Subcommand = require(path.join(commandsDir, commandName, subcommandName)).default;
    if (!subcommand) throw new Error(`Invalid subcommand file: ${subcommandName} (under the "${commandName}" command)`);
    subcommandObjs.push(subcommand);
  });

  const subcommandGroupFolders = childItems.filter(childItem => childItem.isDirectory());
  subcommandGroupFolders.forEach(subcommandGroupFolder => {
    const subcommandGroupName = subcommandGroupFolder.name;
    
    if (!subcommandGroupName.match(/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u))
      throw new Error(`Invalid subcommand group file name: ${subcommandGroupName} (under the "${commandName}" command)`);

    const childItems = readdirSync(path.join(commandsDir, commandName, subcommandGroupName), { withFileTypes: true });
    const subcommandFiles = childItems.filter(childItem => !childItem.isDirectory()).filter(childItem => childItem.name.endsWith(`.js`));

    const subcommandObjs: Subcommand[] = [];

    subcommandFiles.forEach(subcommandFile => {
      const subcommandName = subcommandFile.name.split(`.`)[0];
     
      const subcommand: Subcommand = require(path.join(commandsDir, commandName, subcommandGroupName, subcommandName)).default;
      if (!subcommand) throw new Error(`Invalid subcommand file: ${subcommandName} (under the "${subcommandGroupName}" subcommand group under the "${commandName}" command)`);
      subcommandObjs.push(subcommand);
    });

    const subcommandGroup = new SubcommandGroup({
      data: new SlashCommandSubcommandGroupBuilder()
        .setName(subcommandGroupName)
        .setDescription('nah'),
      execute: () => { },
      subcommands: subcommandObjs,
    });
    subcommandGrpObjs.push(subcommandGroup);
  });

  const command = new Command({
    data: new SlashCommandBuilder()
      .setName(commandName)
      .setDescription('nah'),
    execute: () => { },
    subcommands: subcommandObjs,
    subcommandGroups: subcommandGrpObjs,
  });
  commands.set(command.data.name, command);
});
export { commands };