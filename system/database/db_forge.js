(function() {
	/**
	 * Code Igniter
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
	 * Database Utility Class
	 *
	 * @category	Database
	 * @author		ExpressionEngine Dev Team
	 * @link		http://codeigniter.com/user_guide/database/
	 */
	var CI_DB_forge = {
		$fields: [],
		$keys: [],
		$primary_keys: [],
		$db_char_set:	'',
		$db = null,
	
		/**
		 * Constructor
		 *
		 * Grabs the CI super object instance so we can access it.
		 *
		 */	
		__construct: function() {
			// Assign the main database object to $this->db
			this.$db = CI.db;
			CI_Common.log_message('debug', "Database Forge Class Initialized");
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Create database
		 *
		 * @access	public
		 * @param	string	the database name
		 * @return	bool
		 */
		create_database: function ($db_name) {
			var $sql = this._create_database($db_name);
			
			if (PHP.is_bool($sql)) {
				return $sql;
			}
		
			return this.$db.query($sql);
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Drop database
		 *
		 * @access	public
		 * @param	string	the database name
		 * @return	bool
		 */
		drop_database: function ($db_name) {
			var $sql = this._drop_database($db_name);
			
			if (PHP.is_bool($sql)) {
				return $sql;
			}
		
			return this.$db.query($sql);
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Add Key
		 *
		 * @access	public
		 * @param	string	key
		 * @param	string	type
		 * @return	void
		 */
		add_key: function ($key, $primary) {
			$primary = $primary || false;
		
			if (PHP.is_array($key)) {
				for(var $one in $key) {
					this.add_key($one, $primary);
				}
				
				return;
			}
		
			if ($key == '') {
				CI_Common.show_error('Key information is required for that operation.');
			}
			
			if ($primary === true) {
				$primary_keys.push($key);
			} else {
				$keys.push($key);
			}
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Add Field
		 *
		 * @access	public
		 * @param	string	collation
		 * @return	void
		 */
		add_field: function ($field) {
			$field = $field || '';
		
			if ($field == '') {
				CI_Common.show_error('Field information is required.');
			}
			
			if (PHP.is_string($field)) {
				if ($field == 'id') {
					this.add_field({
									'id': {
										'type': 'INT',
										'constraint': 9,
										'auto_increment': true
									}
								});
					this.add_key('id', true);
				} else {
					if (PHP.strpos($field, ' ') === false) {
						CI_Common.show_error('Field information is required for that operation.');
					}
					
					this.$fields.push($field);
				}
			}
			
			if (PHP.is_array($field)) {
				this.$fields = PHP.array_merge(this.$fields, $field);
			}
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Create Table
		 *
		 * @access	public
		 * @param	string	the table name
		 * @return	bool
		 */
		create_table: function ($table, $if_not_exists) {	
			$table = $table || '';
			$if_not_exists = $if_not_exists || false;
		
			if ($table == '') {
				CI_Common.show_error('A table name is required for that operation.');
			}
				
			if (PHP.count(this.$fields) == 0) {	
				CI_Common.show_error('Field information is required.');
			}
	
			var $sql = this._create_table(this.$db.dbprefix + $table, this.$fields, this.$primary_keys, this.$keys, $if_not_exists);
			
			this._reset();
			return $db.query($sql);
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Drop Table
		 *
		 * @access	public
		 * @param	string	the table name
		 * @return	bool
		 */
		drop_table: function ($table_name) {
			var $sql = this._drop_table(this.$db.dbprefix + $table_name);
			
			if (PHP.is_bool($sql)) {
				return $sql;
			}
		
			return this.$db.query($sql);
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Rename Table
		 *
		 * @access	public
		 * @param	string	the old table name
		 * @param	string	the new table name
		 * @return	bool
		 */
		rename_table: function ($table_name, $new_table_name) {
			if ($table_name == '' || $new_table_name == '') {
				CI_Common.show_error('A table name is required for that operation.');
			}
				
			var $sql = this._rename_table($table_name, $new_table_name);
			return this.$db.query($sql);
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Column Add
		 *
		 * @access	public
		 * @param	string	the table name
		 * @param	string	the column name
		 * @param	string	the column definition
		 * @return	bool
		 */
		add_column: function ($table, $field, $after_field) {
			$table = $table || '';
			$field = $field || [];
			$after_field = $after_field || '';
				
			if ($table == '') {
				CI_Common.show_error('A table name is required for that operation.');
			}
	
			// add field info into field array, but we can only do one at a time
			// so we cycle through
	
			for(var $k in $field) {
				this.add_field([$k: $field[$k]]);		
	
				if (PHP.count($fields) == 0) {	
					CI_Common.show_error('Field information is required.');
				}
				
				var $sql = this._alter_table('ADD', this.$db.dbprefix + $table, $fields, $after_field);
	
				this._reset();
		
				if (this.$db.query($sql) === false) {
					return false;
				}
			}
			
			return true;
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Column Drop
		 *
		 * @access	public
		 * @param	string	the table name
		 * @param	string	the column name
		 * @return	bool
		 */
		drop_column: function ($table, $column_name) {
			$table = $table || '';
			$column_name = $column_name || '';
		
			if ($table == '') {
				CI_Common.show_error('A table name is required for that operation.');
			}
	
			if ($column_name == '') {
				CI_Common.show_error('A column name is required for that operation.');
			}
	
			var $sql = this._alter_table('DROP', this.$db.dbprefix + $table, $column_name);
		
			return this.$db.query($sql);
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Column Modify
		 *
		 * @access	public
		 * @param	string	the table name
		 * @param	string	the column name
		 * @param	string	the column definition
		 * @return	bool
		 */
		modify_column: function ($table, $field) {
			$table = $table || '';
			$field = $field || [];
			
			if ($table == '') {
				CI_Common.show_error('A table name is required for that operation.');
			}
	
			// add field info into field array, but we can only do one at a time
			// so we cycle through
	
			for(var $k in $field) {
				this.add_field([$k: $field[$k]]);
	
				if (PHP.count(this.$fields) == 0) {	
					CI_Common.show_error('Field information is required.');
				}
			
				var $sql = this._alter_table('CHANGE', this.$db.dbprefix + $table, this.$fields);
	
				this._reset();
		
				if (this.$db.query($sql) === false) {
					return false;
				}
			}
			
			return true;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Reset
		 *
		 * Resets table creation vars
		 *
		 * @access	private
		 * @return	void
		 */
		_reset: function () {
			this.$fields 		= [];
			this.$keys			= [];
			this.$primary_keys 	= [];
		}
	
	module.exports = CI_DB_forge;
})();
/* End of file DB_forge.php */
/* Location: ./system/database/DB_forge.php */