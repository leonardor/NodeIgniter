var Mysql = require('mysql');

var mysql_connect = function(hostname, username, password, new_link, client_flags) {
	var client = Mysql.createClient({
		host: hostname,
		user: username,
		password: password,
		database: 'nodejs'
	});

	client.query(
	  'CALL a(1111)',
	  function selectCb(err, results, fields) {
	    if (err) {
	      throw err;
	    }

	    console.log(results);
	    client.end();
	  }
	);
};

mysql_connect('10.10.22.31', 'vlad', 'cemese', true, 65536);
