// Variable de configuration
const TITLE = "Chat Node.JS";

// Modules
var express = require('express'),	
	ejs = require('ejs'),
	sha1 = require('sha1'),
	path = require ('path'),	
	socket = require(__dirname +'/sockets.js');

// Création du serveur
var app = express();

// Configuration
app.configure(function(){ 
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '')));
 });

app.get('/', function(req, res){
	res.render(__dirname + '/chat.ejs', {title : TITLE});
});

socket.listen(app);