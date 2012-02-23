var mysql_close = function(client) {
	client.end();
}

module.exports = mysql_close;