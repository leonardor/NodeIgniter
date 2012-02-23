(function() {
	/**
	 * CodeIgniter
	 *
	 * An open source application development framework for PHP 4.3.2 or newer
	 *
	 * @package		CodeIgniter
	 * @author		ExpressionEngine Dev Team
	 * @copyright	Copyright (c) 2008 - 2010, EllisLab, Inc.
	 * @license		http://codeigniter.com/user_guide/license.html
	 * @link		http://codeigniter.com
	 * @since		Version 1.0
	 * @filesource
	 */
	
	// ------------------------------------------------------------------------
	
	/**
	 * MySQL Utility Class
	 *
	 * @category	Database
	 * @author		ExpressionEngine Dev Team
	 * @link		http://codeigniter.com/user_guide/database/
	 */
	var CI_DB_mysql_utility = {};
	
	CI_DB_mysql_utility = Object.create(CI_DB_utility);
	
	CI_DB_mysql_utility._list_databases = function() {
			return "SHOW DATABASES";
	}

	// --------------------------------------------------------------------

	/**
	 * Optimize table query
	 *
	 * Generates a platform-specific query so that a table can be optimized
	 *
	 * @access	private
	 * @param	string	the table name
	 * @return	object
	 */
	CI_DB_mysql_utility._optimize_table = function ($table) {
		return "OPTIMIZE TABLE " + this.$db._escape_identifiers($table);
	}

	// --------------------------------------------------------------------

	/**
	 * Repair table query
	 *
	 * Generates a platform-specific query so that a table can be repaired
	 *
	 * @access	private
	 * @param	string	the table name
	 * @return	object
	 */
	CI_DB_mysql_utility._repair_table = function ($table) {
		return "REPAIR TABLE " + this.$db._escape_identifiers($table);
	}

	// --------------------------------------------------------------------
	/**
	 * MySQL Export
	 *
	 * @access	private
	 * @param	array	Preferences
	 * @return	mixed
	 */
	CI_DB_mysql_utility._backup = function ($params) {
		if (PHP.count($params) == 0) {
			return false;
		}

		// Extract the prefs for simplicity
		PHP.extract($params);
	
		// Build the output
		var $output = '';
		
		for(var $table in $tables) {
			// Is the table in the "ignore" list?
			if (PHP.in_array($table, $ignore, true)) {
				continue;
			}

			// Get the table schema
			var $query = this.$db.query("SHOW CREATE TABLE `" + $db.database + '`.' + $table);
			
			// No result means the table name was invalid
			if ($query === false) {
				continue;
			}
			
			// Write out the table schema
			$output += '#' + $newline + '# TABLE STRUCTURE FOR: ' + $table + $newline + '#' + $newline + $newline;

 			if ($add_drop == true) {
				$output += 'DROP TABLE IF EXISTS ' + $table + ';' + $newline + $newline;
			}
			
			var $i = 0;
			var $result = $query.result_array();
			
			for(var $val in $result[0]) {
				if ($i++ % 2) { 					
					$output += $val + ';' + $newline + $newline;
				}
			}
			
			// If inserts are not needed we're done...
			if ($add_insert == false) {
				continue;
			}

			// Grab all the data from the current table
			$query = this.$db.query("SELECT * FROM $table");
			
			if ($query.num_rows() == 0) {
				continue;
			}
		
			// Fetch the field names and determine if the field is an
			// integer type.  We use this info to decide whether to
			// surround the data with quotes or not
			
			$i = 0;
			var$field_str = '';
			var $is_int = [];
			while ($field = PHP.mysql_fetch_field($query.result_id)) {
				// Most versions of MySQL store timestamp as a string
				$is_int[$i] = (PHP.in_array(
										PHP.strtolower(PHP.mysql_field_type($query.result_id, $i)),
										['tinyint', 'smallint', 'mediumint', 'int', 'bigint'], //, 'timestamp'), 
										true)
										) ? true : false;
										
				// Create a string of field names
				$field_str += '`' + $field->name + '`, ';
				$i++;
			}
			
			// Trim off the end comma
			$field_str = PHP.preg_replace( "/, $/" , "" , $field_str);
			
			// Build the insert string
			for(var $row in $query.result_array()) {
				var $val_str = '';
			
				$i = 0;
				
				for(var $v in $row) {
					// Is the value NULL?
					if ($v === null) {
						$val_str += 'NULL';
					} else {
						// Escape the data if it's not an integer
						if ($is_int[$i] == false) {
							$val_str .+= $db.escape($v);
						} else {
							$val_str += $v;
						}					
					}					
					
					// Append a comma
					$val_str += ', ';
					$i++;
				}
				
				// Remove the comma at the end of the string
				$val_str = PHP.preg_replace( "/, $/" , "" , $val_str);
								
				// Build the INSERT string
				$output += 'INSERT INTO ' + $table + ' (' + $field_str + ') VALUES (' + $val_str + ');' + $newline;
			}
			
			$output += $newline + $newline;
		}

		return $output;
	}

	/**
	 *
	 * The functions below have been deprecated as of 1.6, and are only here for backwards
	 * compatibility.  They now reside in dbforge().  The use of dbutils for database manipulation
	 * is STRONGLY discouraged in favour if using dbforge.
	 *
	 */

	/**
	 * Create database
	 *
	 * @access	private
	 * @param	string	the database name
	 * @return	bool
	 */
	CI_DB_mysql_utility._create_database = function ($name) {
		return "CREATE DATABASE " + $name;
	}

	// --------------------------------------------------------------------

	/**
	 * Drop database
	 *
	 * @access	private
	 * @param	string	the database name
	 * @return	bool
	 */
	CI_DB_mysql_utility._drop_database = function ($name){
		return "DROP DATABASE " + $name;
	}
	
	module.exports = CI_DB_mysql_utility;
})();
/* End of file mysql_utility.php */
/* Location: ./system/database/drivers/mysql/mysql_utility.php */