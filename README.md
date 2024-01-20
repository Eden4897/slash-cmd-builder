# slash-commands
A NPM package to build SlashCommandBuilder discord.js objects

Slash commands are built according to the file structure inside the `commands` folder. This folder must be in the root of where the project is executed.

For example, the following file structure will create these commands:
```
commands
| group1
| | subgroup1
| | | command1.ts
| | command2.ts
| command3.ts
```

```
/command 3
/group1 command2
/group1 subgroup1 command 1 
```
