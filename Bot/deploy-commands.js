var deploy = function deploy() {
  const { REST, Routes } = require('discord.js');
  const fs = require('node:fs');
  var console = require("./consolelogger");

  const servers = ['931851065832374272', '779066985761210369'];

  const commands = [];

  fs.readdir("../Extensions/", function (err, files) {
    if (err) {
      return console.logger('Unable to scan directory: ' + err, "error");
    }
    files.forEach(function (file) {
      const commandFilesExtension = fs.readdirSync(`../Extensions/${file}/commands/`).filter(file => file.endsWith('.command.js'));
      for (const file2 of commandFilesExtension) {
        const command = require(`../Extensions/${file}/commands/${file2}`);
        commands.push(command.data.toJSON());
      }
    });
  });

  const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.command.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  (async () => {
    try {
      console.logger(`Started refreshing ${commands.length} core application commands.`, "info");
      for (let i = 0; i < servers.length; i++) {
        var data = await rest.put(
          Routes.applicationGuildCommands(process.env.CLIENTID, servers[i]),
          { body: commands },
        );
      }
      console.logger(`Successfully reloaded ${data.length} core and extension application commands.`, "info");
    } catch (error) {
      console.logger(error, "error");
    }
  })();
};

module.exports.deploy = deploy;