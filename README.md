# Vanbot-Github
Vanbot Discord bot

This is a pretty basic Discord bot with a few features. If you want to use this thing feel free to add and delete commands. 

Default commands:
				hello: returns a friendly greeting
				help: provides a list of commands
			  info: provides information about a specific command
			  8ball: answers a yes or no question
			  counter++increments the specified counter using the format !counter++ [counterName] 
			  counter--increments the specified counter using the format !counter++ [counterName] 
			  cry: links a random GIF of a crying anime person
	  		smug: creates a "smug aura" meme using your profile picture
	  		wolverine: creates a Wolverine meme using your profile picture
	  		custom: executes custom commands using the format: !custom [commandName]
		  	createcustom: creates a custom command using the format: !createcustom [commandName] [URL] (bot permissions only)
		  	deletecustom: deletes custom command using the format: !deletecustom [commandName] (bot permissions only)
		  	createcounter: creates a new counter using the format: !createcounter [counterName] [startingValue] (bot permissions only)
		  	deletecounter: deletes counter using the format: !deletecounter [counterName] (bot permissions only)
		  	checkcounter: returns the specified counters current value using the format: !checkcounter[counterName]

How to get it working: 

1. Run create_db.js to create the database (node creat_db.js)
2. At the very bottom of bot.js with the token of whatever bot you want running this
3. Run or daemonize bot.js (node bot.js) or (pm2 bot.js) to get started
