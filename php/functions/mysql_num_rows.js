var mysql_num_rows = function(result) {
	return result.num_rows();
}

module.exports = mysql_num_rows;