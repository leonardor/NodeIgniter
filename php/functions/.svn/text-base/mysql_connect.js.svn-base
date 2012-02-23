var Mysql = require('mysql');

var mysql_connect = function(hostname, username, password, new_link, client_flags) {
	var client = Mysql.createClient({
		host: hostname,
		user: username,
		password: password,
		debug: false
	});

	client._connect(function(error, results) {
		if(error) {
		    console.log('Connection Error: ' + error.message);
		    return;
		}
		console.log('Connected to MySQL');
	});
	
	return client;
};

module.exports = mysql_connect;