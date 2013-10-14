const PORT = 8080;

var http = require('http'),
	IO = require('socket.io'),
	__ = require('underscore');

module.exports.listen = function(app){
	var server = http.createServer(app).listen(PORT, function(){
	  console.log("Serveur Node.js en ecoute sur le port " + PORT);
	});

	// On écoute un port
	server.listen(8080);

	var users = {}, 
		messages = {}, 
		history = 30;

	// Gestion sockets
	var io = IO.listen(server);

	io.sockets.on('connection', function(socket){
		var current = false, erreur = false, me = false, message = {};

		// On indique tous les utilisateurs connectés
		for(k in users){
			socket.emit('newUser', users[k]);
		}

		for(k in messages){
			socket.emit('newMessage', messages[k]);
		}

		// Login
		socket.on('login', function(logInfos){			
			for(k in users){
				if(users[k].pseudo == logInfos.pseudo){
					erreur = true;
					socket.emit('erreur', {message : "Ce pseudo est déjà utilisé."});
				}
			}
			if(!erreur){
				me = logInfos;
				me.id = __.uniqueId();				
				users[me.id] = me;

				// On signale à l'utilisateur qu'il est connecté
				socket.emit('logged');

				// On informe tous les connectés qu'il y a un nouvel utilisateur
				io.sockets.emit('newUser', me);
			}		
		});

		// Messages
		socket.on('message', function(messageInfos){
			message.message = messageInfos.message;
			message.auteur = me.pseudo;
			date = new Date();
			message.date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

			// On informe tous les connectés qu'il y a un nouveau message
			io.sockets.emit('newMessage', message);

			id = __.uniqueId();

			// On stocke le message
			messages[id] = message;

			if(messages.length > history){
				messages.shift();
			}
		});

		// Deconnexion
		socket.on('disconnect', function(){
			if(!me){
				return false;
			}
			delete users[me.id];
			io.sockets.emit('disUser', me);
		});

	});
}