const Discord = require('discord.js');
const client = new Discord.Client();
var Jimp = require("jimp");

var sqlite3 = require('sqlite3').verbose();
var file = "vanbotDB";
var db = new sqlite3.Database(file);

var trigger = "v!";//trigger that the bot looks for at the start of each message to see if the message is a command
var privRole = "Bot Permissions";//role that the bot checks for commands you don't want all users to have access to

function commandIs(str, msg) {
	return msg.content.toLowerCase().startsWith(trigger + str);
}

function pluck(array) {
	return array.map(function (item) { return item["name"]; });
}

function hasRole(mem, role) {//checks if user has appropriate role
	if (pluck(mem.roles).includes(role)) {
		return true;
	} else {
		return false;
	}
}

client.on('ready', () => {//on startup
	console.log('Goliath Online');
	client.user.setGame("try " + trigger + "help");
});

client.on('message', message => {
	var args = message.content.split(/[ ]+/);
	if (commandIs("hello", message)) {//hello
		message.channel.send('Greetings, ' + message.author.username);
	}//hello
	else if (commandIs("help", message)) {//help
		message.channel.send('Public Commands: ' + trigger + 'hello, ' + trigger + 'help, ' + trigger + 'info [command], ' + trigger + '8ball [question], ' + trigger + 'smug, ' + trigger + 'wolverine, ' + trigger + 'custom [custom command], ' + trigger + 'checkcounter [counterName]');
		message.channel.send(privRole+' Commands: ' + trigger + 'createcustom [customCommand] [URL], ' + trigger + 'deletecustom [customCommand], ' + trigger + 'createcounter [counterName] [startingValue], ' + trigger + 'deletecounter [counterName], ' + trigger + 'counter++ [counterName], ' + trigger + 'counter-- [counterName]');

		var customList = 'Custom Commands: ';

		db.all("SELECT command FROM commands WHERE guild = " + message.guild.id + "", function (err, rows) {
			rows.forEach(function (row) {
				customList += (row.command + ', ');
			})
			var redux = customList.substr(0, customList.length - 2);
			message.channel.send(redux);
		});

		var counterList = 'Counters: ';

		db.all("SELECT name FROM counters WHERE guild = " + message.guild.id + "", function (err, rows) {
			rows.forEach(function (row) {
				counterList += (row.name + ', ');
			})
			var redux1 = counterList.substr(0, counterList.length - 2);
			message.channel.send(redux1);
		});
	}//help
	else if (commandIs("8ball", message)) {//8ball
		if (args.length === 1) {//if no question
			message.channel.send('You didn\'t ask a question...');
		}//if no question
		else {//else
			var responses = ['Yes','For sure, my dude','Meh, probably', 'Hard no', 'Nope', 'Math.random says no', 'Fuck if I know', 'Maybe? IDK lol']
			var j = Math.floor(Math.random() * 8);
			message.channel.send(responses[j])
		}//else
	}//8ball
	else if (commandIs("info", message)) {//info
		if (args.length === 1) {//if no command
			message.channel.send('You didn\'t specify a command...');
		}//if no command
		else if (args.length === 2) {
			var documentation = {
				'hello' : 'returns a friendly greeting',
				'helo' : 'provides a list of commands',
				'info' : 'provides information about a specific command',
				'8ball' : 'answers a yes or no question',
				'counter++' : 'increments the specified counter using the format !counter++ [counterName] ('+privRole+' role only)',
				'counter--' : 'increments the specified counter using the format !counter++ [counterName] ('+privRole+' role only)',
				'cry' : 'links a random GIF of a crying anime person',
				'smug': 'creates a "smug aura" meme using your profile picture',
				'wolverine' : 'creates a Wolverine meme using your profile picture',
				'custom' : 'executes custom commands using the format: !custom [commandName]',
				'createcustom' : 'creates a custom command using the format: !createcustom [commandName] [URL] ('+privRole+' only)',
				'deletecustom' : 'deletes custom command using the format: !deletecustom [commandName] ('+privRole+' only)',
				'createcounter' : 'creates a new counter using the format: !createcounter [counterName] [startingValue] ('+privRole+' only)',
				'deletecounter' : 'deletes counter using the format: !deletecounter [counterName] ('+privRole+' only)',
				'checkcounter' : 'returns the specified counters current value using the format: !checkcounter[counterName]'
			}

			if(Object.keys(documentation).indexOf(args[1]) > -1) {
				message.channel.send([args[1], documentation[args[1]]].join(' : '))
			} else {
				message.channel.send('I don\'t recognize that command...');
			}
		}
		else {//else
			message.channel.send('Incorrect number of arguments');
		}//else
	}//info
	else if (commandIs("cry", message)) {//cry

		var i = Math.floor(Math.random() * 16);
		var gifs = [
			'https://i.imgur.com/oPIEjtA.gif',
			'https://i.imgur.com/TmjFAIn.gif',
			'https://i.imgur.com/22eOqjO.gif',
			'https://i.imgur.com/fKGapsX.gif',
			'https://i.imgur.com/lFje0mw.gif',
			'https://i.imgur.com/dNagorM.gif',
			'https://i.imgur.com/ce7Okth.gif',
			'https://i.imgur.com/8YbmJAq.gif',
			'https://i.imgur.com/onmlVGH.gif',
			'https://i.imgur.com/Njk8OC0.gif',
			'https://i.imgur.com/THVvEO8.gif',
			'https://i.imgur.com/anYD1Vm.gif',
			'https://i.imgur.com/kh78L86.gif',
			'https://i.imgur.com/cAEI1B9.gif',
			'https://i.imgur.com/zGyiwQj.gif',
			'https://i.imgur.com/HwasTsq.gif'
		]
		message.channel.send(gifs[i])
	}//cry
	else if (commandIs("smug", message)) {//smug
		Jimp.read("images/smug.png", function (err, background) {
			if (err) throw err;
			Jimp.read("images/backdrop.png", function (err, backdrop) {
				if (err) throw err;
				Jimp.read(message.author.avatarURL, function (err, image) {
					if (err) throw err;

					image.resize(188, 300);
					backdrop.composite(image, 92, 16).composite(background, 0, 0).write("images/result.png", printMeme);
				});
			});
		});

		function printMeme() {
			message.channel.send("images/result.png");
		}
	}//smug
	else if (commandIs("wolverine", message)) {//wolverine
		Jimp.read("images/wolverine.png", function (err, background) {
			if (err) throw err;
			Jimp.read("images/backdrop1.png", function (err, backdrop) {
				if (err) throw err;
				Jimp.read(message.author.avatarURL, function (err, image) {
					if (err) throw err;

					image.resize(246, 308);
					backdrop.composite(image, 132, 375).composite(background, 0, 0).write("images/result.png", printMeme);
				});
			});
		});

		function printMeme() {
			message.channel.send("images/result.png");
		}
	}//wolverine
	else if (commandIs("custom", message)) {//custom
		if (args.length === 2) {

			var found = 0;

			db.all("SELECT command FROM commands WHERE guild = " + message.guild.id + "", function (err, rows) {
				rows.forEach(function (row) {
					if (row.command === args[1]) { found = 1; }
				})
				if (found == 1) {
					var stmt = db.prepare("SELECT return FROM commands WHERE command=(?) AND guild=(?)");
					stmt.get(args[1], message.guild.id, function (err, row) {
						var reply = (row.return);
						message.channel.send(reply);
					});
					stmt.finalize();
				} else {
					message.channel.send("I don\'t think that\'s a real command...");
				}
			});
		} else {
			message.channel.send("Incorrect number of arguments");
		}
	}//custom
	else if (commandIs("checkcounter", message)) {//checkcounter
		if (args.length === 2) {

			var found = 0;

			db.all("SELECT name FROM counters WHERE guild = " + message.guild.id + "", function (err, rows) {
				rows.forEach(function (row) {
					if (row.name === args[1]) { found = 1; }
				})
				if (found == 1) {
					var stmt = db.prepare("SELECT count FROM counters WHERE name=(?) AND guild=(?)");
					stmt.get(args[1], message.guild.id, function (err, row) {
						var reply = (row.count);
						message.channel.send("The current " + args[1] + " count is: " + reply);
					});
					stmt.finalize();
				} else {
					message.channel.send("I don\'t think that counter exists...");
				}
			});
		} else {
			message.channel.send("Incorrect number of arguments");
		}
	}//checkcounter
	if (message.content.toLocaleLowerCase().includes("cyber")) {//cyber alert
		message.channel.send(':rotating_light: C Y B E R :rotating_light:');
	}//cyber alert
	if (hasRole(message.member, privRole)) {//the bot will check for this role before executing the following commands
		if (commandIs("counter++", message)) {//counter++
			if (args.length === 2) {
				var found = 0;

				db.all("SELECT name FROM counters WHERE guild = " + message.guild.id + "", function (err, rows) {
					rows.forEach(function (row) {
						if (row.name === args[1]) { found = 1; }
					})
					if (found == 1) {
						var stmt = db.prepare("SELECT count FROM counters WHERE name=(?) AND guild=(?)");
						stmt.get(args[1], message.guild.id, function (err, row) {
							var reply = (row.count);

							reply++;

							var stmt = db.prepare("UPDATE counters SET count=(?) WHERE name=(?) AND guild=(?)");
							stmt.run(reply, args[1], message.guild.id);
							stmt.finalize();
							message.channel.send('Another One');
						});
					} else {
						message.channel.send("I don\'t think that counter exists...");
					}
				});
			} else {
				message.channel.send("Incorrect number of arguments. Arguments are seperated by spaces. Append only the counter name");
			}
		}//counter++
		else if (commandIs("counter--", message)) {//counter--
			if (args.length === 2) {
				var found = 0;

				db.all("SELECT name FROM counters WHERE guild = " + message.guild.id + "", function (err, rows) {
					rows.forEach(function (row) {
						if (row.name === args[1]) { found = 1; }
					})
					if (found == 1) {
						var stmt = db.prepare("SELECT count FROM counters WHERE name=(?) AND guild=(?)");
						stmt.get(args[1], message.guild.id, function (err, row) {
							var reply = (row.count);

							reply--;

							var stmt = db.prepare("UPDATE counters SET count=(?) WHERE name=(?) AND guild=(?)");
							stmt.run(reply, args[1], message.guild.id);
							stmt.finalize();
							message.channel.send('Removed');
						});
					} else {
						message.channel.send("I don\'t think that counter exists...");
					}
				});
			} else {
				message.channel.send("Incorrect number of arguments. Arguments are seperated by spaces. Append only the counter name");
			}
		}//counter--
		else if (commandIs("createcustom", message)) {//createcommand
			if (args.length === 3) {
				var stmt = db.prepare("INSERT OR IGNORE INTO commands(command, return, guild) VALUES (?,?,?)");
				stmt.run(args[1], args[2], message.guild.id);
				stmt.finalize();

				message.channel.send("Command Added");
			} else {
				message.channel.send("Incorrect number of arguments. Arguments are seperated by spaces. Both your command and return URL must be one word (no spaces)");
			}
		}//createcommand
		else if (commandIs("deletecustom", message)) {//deletecommand
			var found = 0;
			if (args.length === 2) {
				db.all("SELECT command FROM commands WHERE guild = " + message.guild.id + "", function (err, rows) {
					rows.forEach(function (row) {
						if (row.command === args[1]) { found = 1; }
					})
					if (found == 1) {
						var stmt = db.prepare("DELETE FROM commands WHERE command=(?) AND guild=(?)");
						stmt.run(args[1], message.guild.id);
						stmt.finalize();

						message.channel.send("Command Deleted");
					} else {
						message.channel.send("I don\'t think that\'s a real command...");
					}
				});

			} else {
				message.channel.send("Incorrect number of arguments. Arguments are seperated by spaces. Append only the command name");
			}
		}//deletecommand
		else if (commandIs("createcounter", message)) {//createcounter
			var startVal = parseInt(args[2]);
			if (args.length === 3 && isNaN(startVal) === false) {
				var stmt = db.prepare("INSERT OR IGNORE INTO counters(name, count, guild) VALUES (?,?,?)");
				stmt.run(args[1], startVal, message.guild.id);
				stmt.finalize();

				message.channel.send("Counter Added");
			} else {
				message.channel.send("Incorrect number of arguments or incorrect argument type. Arguments are seperated by spaces. Your starting value must be an integer. Your counter name should be one word (no spaces)");
			}
		}//createcounter
		else if (commandIs("deletecounter", message)) {//deletecounter
			if (args.length === 2) {
				var found = 0;
				db.all("SELECT name FROM counters WHERE guild = " + message.guild.id + "", function (err, rows) {
					rows.forEach(function (row) {
						if (row.name === args[1]) { found = 1; }
					})
					if (found == 1) {
						var stmt = db.prepare("DELETE FROM counters WHERE name=(?) AND guild=(?)");
						stmt.run(args[1], message.guild.id);
						stmt.finalize();

						message.channel.send("Counter Deleted");
					} else {
						message.channel.send("I don\'t think that counter exists...");
					}
				});
			} else {
				message.channel.send("Incorrect number of arguments. Arguments are seperated by spaces. Append only the command name");
			}
		}//deletecounter
	}//role specific commands
});

//insert your token here
client.login('your_token_here');
