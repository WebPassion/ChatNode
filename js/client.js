$(document).ready(function() {

	// On affiche le formulaire de login
	var leftLogin = (screen.width - $('#loginForm').width() ) /2;
	var topLogin = (screen.height - $('#loginForm').height() ) /2 - 30;	
	$('#loginForm').css({'left':leftLogin, 'top':topLogin}).fadeIn();


	// On ouvre la connexion au socket
	var socket = io.connect('http://37.187.51.220:8080');

	// Login
	$('#loginForm').submit(function(e){
		e.preventDefault();
		socket.emit('login', {
			pseudo : $('#pseudo').val()			
		});
	});

	// Message
	$('#message').keyup(function(e){
		if(e.keyCode == '13'){
			socket.emit('message', {
				message : $(this).val()			
			});

			// On vide l'input
			$(this).val("");
		}
	});

	// Events
	socket.on('erreur', function(message){
		$('.form').append('<div class="erreur"><p class="warning"><span class="label-warning">Erreur</span> '+message.message+'</p></div>');
	});

	socket.on('logged', function(){
		$('#loginForm').remove();
	});

	socket.on('newUser', function(user){		
		$('#users').append('<div class="user" id="user_' + user.id + '"><span>' + user.pseudo + "</span></div>");
	});

	socket.on('newMessage', function(message){		
		$('#messages').append('<div class="message"><span class="date">' + message.date + '</span><span class="auteur">' + message.auteur + '</span><p>' + message.message + '</p></div>');
		$('#messages').animate({scrollTop : $('#messages').prop('scrollHeight')}, 500);
	});

	socket.on('disUser', function(user){
		$('#user_'+ user.id).remove();
		date = new Date();
		date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		$('#messages').append('<div class="message"><span class="date">' + (date) + '</span><span class="auteur">BOT</span><p>' + user.pseudo + ' vient de se déconnecter.</p></div>');
	});

});