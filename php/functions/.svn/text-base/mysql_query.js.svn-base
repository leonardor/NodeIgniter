var mysql_query = function(sql, client) {
	var res = false;
	
	(function () {
		while(res != false) {
			client.query(
				sql,
				function(err, results, fields) {
					res = results;
				}
			).on('end', function() {
				
			});
		}
	})();
}

module.exports = mysql_query;