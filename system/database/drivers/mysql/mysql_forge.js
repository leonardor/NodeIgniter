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
	 * MySQL Forge Class
	 *
	 * @category	Database
	 * @author		ExpressionEngine Dev Team
	 * @link		http://codeigniter.com/user_guide/database/
	 */
	var CI_DB_mysql_forge = {};
	
	CI_DB_mysql_forge = Object.create(CI_DB_forge);
	
	CI_DB_mysql_forge._create_database = function ($name) {
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
	CI_DB_mysql_forge._drop_database = function ($name) {
			return "DROP DATABASE " + $name;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Process Fields
		 *
		 * @access	private
		 * @param	mixed	the fields
		 * @return	string
		 */
	CI_DB_mysql_forge._process_fields = function ($fields) {
			var $current_field_count = 0;
			var $sql = '';
	
			for(var $field in $fields) {
				// Numeric field names aren't allowed in databases, so if the key is
				// numeric, we know it was assigned by PHP and the developer manually
				// entered the field information, so we'll simply add it to the list
				if (PHP.is_numeric($field)) {
					$sql += "\n\t" + $fields[$field];
				} else {
					$fields[$field] = PHP.array_change_key_case($fields[$field], PHP.flag('CASE_UPPER'));
					
					$sql += "\n\t" + this.$db._protect_identifiers($field);
	
					if (PHP.array_key_exists('NAME', $fields[$field])) {
						$sql += ' ' + this.$db._protect_identifiers($fields[$field]['NAME']) + ' ';
					}
					
					if (PHP.array_key_exists('TYPE', $fields[$field])) {
						$sql +=  ' ' + $fields[$field]['TYPE'];
					}
		
					if (PHP.array_key_exists('CONSTRAINT', $fields[$field]))
					{
						$sql += '(' + $fields[$field]['CONSTRAINT'] + ')';
					}
		
					if (PHP.array_key_exists('UNSIGNED', $fields[$field]) && $fields[$field]['UNSIGNED'] === TRUE)
					{
						$sql += ' UNSIGNED';
					}
		
					if (PHP.array_key_exists('DEFAULT', $fields[$field]))
					{
						$sql += ' DEFAULT \'' + $fields[$field]['DEFAULT'].'\'';
					}
		
					if (PHP.array_key_exists('NULL', $fields[$field]))
					{
						$sql += ($fields[$field]['NULL'] === true) ? ' NULL' : ' NOT NULL';
					}
		
					if (PHP.array_key_exists('AUTO_INCREMENT', $fields[$field]) && $fields[$field]['AUTO_INCREMENT'] === TRUE)
					{
						$sql += ' AUTO_INCREMENT';
					}
				}
				
				// don't add a comma on the end of the last field
				if (++$current_field_count < PHP.count($fields))
				{
					$sql += ',';
				}
			}
			
			return $sql;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Create Table
		 *
		 * @access	private
		 * @param	string	the table name
		 * @param	mixed	the fields
		 * @param	mixed	primary key(s)
		 * @param	mixed	key(s)
		 * @param	boolean	should 'IF NOT EXISTS' be added to the SQL
		 * @return	bool
		 */
	CI_DB_mysql_forge._create_table = function ($table, $fields, $primary_keys, $keys, $if_not_exists) {
			var $sql = 'CREATE TABLE ';
			
			if ($if_not_exists === true) {
				$sql += 'IF NOT EXISTS ';
			}
			
			$sql += this.$db._escape_identifiers($table) + " (";
	
			$sql += this._process_fields($fields);
	
			if (PHP.count($primary_keys) > 0) {
				var $key_name = this.$db._protect_identifiers(PHP.implode('_', $primary_keys));
				$primary_keys = this.$db._protect_identifiers($primary_keys);
				$sql += ",\n\tPRIMARY KEY " + $key_name + " (" + PHP.implode(', ', $primary_keys) + ")";
			}
	
			if (PHP.is_array($keys) && PHP.count($keys) > 0) {
				for (var $key in $keys) {
					if (PHP.is_array($key)) {
						var $key_name = this.$db._protect_identifiers(PHP.implode('_', $key));
						$key = this.$db._protect_identifiers($key);	
					} else {
						var $key_name = this.$db._protect_identifiers($key);
						$key = [$key_name];
					}
					
					$sql += ",\n\tKEY " + $key_name + " (" + PHP.implode(', ', $key) + ")";
				}
			}
	
			$sql += "\n) DEFAULT CHARACTER SET " + this.$db.char_set + " COLLATE " + this.$db.dbcollat;
	
			return $sql;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Drop Table
		 *
		 * @access	private
		 * @return	string
		 */
	CI_DB_mysql_forge._drop_table = function ($table) {
			return "DROP TABLE IF EXISTS " + this.$db._escape_identifiers($table);
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Alter table query
		 *
		 * Generates a platform-specific query so that a table can be altered
		 * Called by add_column(), drop_column(), and column_alter(),
		 *
		 * @access	private
		 * @param	string	the ALTER type (ADD, DROP, CHANGE)
		 * @param	string	the column name
		 * @param	array	fields
		 * @param	string	the field after which we should add the new field
		 * @return	object
		 */
	CI_DB_mysql_forge._alter_table = function ($alter_type, $table, $fields, $after_field) {
			$after_field = $after_field || '';
			
			var $sql = 'ALTER TABLE ' + this.$db._protect_identifiers($table) + " $alter_type ";
	
			// DROP has everything it needs now.
			if ($alter_type == 'DROP') {
				return $sql + this.$db._protect_identifiers($fields);
			}
	
			$sql += this._process_fields($fields);
	
			if ($after_field != '') {
				$sql += ' AFTER ' + this.$db._protect_identifiers($after_field);
			}
			
			return $sql;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Rename a table
		 *
		 * Generates a platform-specific query so that a table can be renamed
		 *
		 * @access	private
		 * @param	string	the old table name
		 * @param	string	the new table name
		 * @return	string
		 */
	CI_DB_mysql_forge._rename_table = function ($table_name, $new_table_name) {
			var $sql = 'ALTER TABLE ' + this.$db._protect_identifiers($table_name) + " RENAME TO " + this.$db._protect_identifiers($new_table_name);
			return $sql;
		}
	
	module.exports = CI_DB_mysql_forge;
})();

/* End of file mysql_forge.php */
/* Location: ./system/database/drivers/mysql/mysql_forge.php */