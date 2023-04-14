"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const types_1 = require("./types");
const builders_1 = require("@discordjs/builders");
const commands = new discord_js_1.Collection();
exports.commands = commands;
const commandsDir = (0, fs_1.existsSync)(path_1.default.join(process.cwd(), "/commands")) ? path_1.default.join(process.cwd(), "/commands") : path_1.default.join(process.cwd(), "/build/commands");
console.log(`Loading commands from ${commandsDir}`);
const commandFiles = (0, fs_1.readdirSync)(path_1.default.join(commandsDir));
commandFiles.forEach(file => {
    if (!file.endsWith(`.js`))
        return;
    console.log(`Loading command ${file}`);
    const command = require(path_1.default.join(commandsDir, file)).default;
    commands.set(command.data.name, command);
});
const subcommandFolders = (0, fs_1.readdirSync)(commandsDir, { withFileTypes: true }).filter(dirent => dirent.isDirectory());
subcommandFolders.forEach(subcommandFolder => {
    const commandName = subcommandFolder.name;
    console.log(`Loading subcommands for command ${commandName}`);
    if (!commandName.match(/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u))
        throw new Error(`Invalid command file name: ${commandName}`);
    const subcommandObjs = [];
    const subcommandGrpObjs = [];
    const childItems = (0, fs_1.readdirSync)(path_1.default.join(commandsDir, commandName), { withFileTypes: true });
    const subcommandFiles = childItems.filter(childItem => !childItem.isDirectory()).filter(childItem => childItem.name.endsWith(`.js`));
    subcommandFiles.forEach(subcommandFile => {
        const subcommandName = subcommandFile.name.split(`.`)[0];
        console.log(`Loading subcommand ${subcommandName} for command ${commandName}`);
        const subcommand = require(path_1.default.join(commandsDir, commandName, subcommandName)).default;
        if (!subcommand)
            throw new Error(`Invalid subcommand file: ${subcommandName} (under the "${commandName}" command)`);
        subcommandObjs.push(subcommand);
    });
    const subcommandGroupFolders = childItems.filter(childItem => childItem.isDirectory());
    subcommandGroupFolders.forEach(subcommandGroupFolder => {
        const subcommandGroupName = subcommandGroupFolder.name;
        console.log(`Loading subcommand group ${subcommandGroupName} for command ${commandName}`);
        if (!subcommandGroupName.match(/^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u))
            throw new Error(`Invalid subcommand group file name: ${subcommandGroupName} (under the "${commandName}" command)`);
        const childItems = (0, fs_1.readdirSync)(path_1.default.join(commandsDir, commandName, subcommandGroupName), { withFileTypes: true });
        const subcommandFiles = childItems.filter(childItem => !childItem.isDirectory()).filter(childItem => childItem.name.endsWith(`.js`));
        const subcommandObjs = [];
        subcommandFiles.forEach(subcommandFile => {
            const subcommandName = subcommandFile.name.split(`.`)[0];
            console.log(`Loading subcommand ${subcommandName} for command ${commandName} and subcommand group ${subcommandGroupName}`);
            const subcommand = require(path_1.default.join(commandsDir, commandName, subcommandGroupName, subcommandName)).default;
            if (!subcommand)
                throw new Error(`Invalid subcommand file: ${subcommandName} (under the "${subcommandGroupName}" subcommand group under the "${commandName}" command)`);
            subcommandObjs.push(subcommand);
        });
        const subcommandGroup = new types_1.SubcommandGroup({
            data: new builders_1.SlashCommandSubcommandGroupBuilder()
                .setName(subcommandGroupName)
                .setDescription('nah'),
            execute: () => { },
            subcommands: subcommandObjs,
        });
        subcommandGrpObjs.push(subcommandGroup);
    });
    const command = new types_1.Command({
        data: new builders_1.SlashCommandBuilder()
            .setName(commandName)
            .setDescription('nah'),
        execute: () => { },
        subcommands: subcommandObjs,
        subcommandGroups: subcommandGrpObjs,
    });
    commands.set(command.data.name, command);
});
//# sourceMappingURL=builder.js.map