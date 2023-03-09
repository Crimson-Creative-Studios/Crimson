var deploy = async function deploy(client) {
	const { REST, Routes } = require('discord.js')
	const fs = require('node:fs')
	var console = require("./consolelogger")

	const commands = []
	const Tcommands = []

	const exstate = require('../extensions.json')
	var enabled = exstate.enabled
	var test = exstate.test
	var disabled = exstate.disabled
	const config = require('../config.json')

	const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

	async function putCommands(id, body) {
		var data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENTID, id),
			{ body: body },
		);
	}

	fs.readdir("../Extensions/", async function (err, files) {
		if (err) {
			return console.logger('Unable to scan directory: ' + err, "error");
		}

		files.forEach(function (file) {
			var dep = require(`../Extensions/${file}/extension.json`)
			var dep = dep.dependencies
			if (enabled.includes(file)) {
				var state = "enabled"
			}

			else if (test.includes(file)) {
				var state = "test"
			}

			else if (disabled.includes(file)) {
				var state = "disabled"
			}

			else {
				var state = "disabled"
			}

			for (const depe of dep) {
				if (!files.includes(depe)) {
					var state = "disabled"
					console.logger(`The extension ${file} will not load, it is missing the dependency ${depe}, for the extension to work you must install that extension.`)
				}
			}

			if (state === "enabled") {
				var j = 0
				const commandFilesExtension = fs.readdirSync(`../Extensions/${file}/commands/`).filter(file => file.endsWith('.command.js'));
				var exCommands = []

				for (const file2 of commandFilesExtension) {
					const command = require(`../Extensions/${file}/commands/${file2}`);
					commands.push(command.data.toJSON());
					Tcommands.push(command.data.toJSON())
				}

				var metadata = require(`../Extensions/${file}/extension.json`)
				console.logger(`Started refreshing all application commands from ${metadata.name}, doing this globally`, "start")
			}

			else if (state === "test") {
				var j = 0
				const commandFilesExtension = fs.readdirSync(`../Extensions/${file}/commands/`).filter(file => file.endsWith('.command.js'));
				var exCommands = []
				for (const file2 of commandFilesExtension) {
					const command = require(`../Extensions/${file}/commands/${file2}`);
					Tcommands.push(command.data.toJSON());
				}
				var metadata = require(`../Extensions/${file}/extension.json`)
				console.logger(`Started refreshing all application commands from ${metadata.name}, doing this in the test server`, "start")
			}
		});
	});

	const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.command.js'));

	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		commands.push(command.data.toJSON());
		Tcommands.push(command.data.toJSON())
	}

	console.logger('Starting refreshing core application commands, doing this globally', "start")

	await new Promise(resolve => setTimeout(resolve, 10));

	client.guilds.cache.forEach(guild => {
		async function doStuff(guild) {
			if (guild.id === config.testServer) {
				await putCommands(guild.id, Tcommands)
				console.logger(`Successfully refreshed all application commands in ${guild.name}, this is the test server`, 'start')
			} else {
				await putCommands(guild.id, commands)
				console.logger(`Successfully refreshed all application commands in ${guild.name}`, 'start')
			}
		}
		doStuff(guild)
	})
};

module.exports = {
	deploy
}