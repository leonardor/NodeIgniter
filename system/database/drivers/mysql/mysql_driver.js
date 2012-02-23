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
	 * MySQL Database Adapter Class
	 *
	 * Note: _DB is an extender class that the app controller
	 * creates dynamically based on whether the active record
	 * class is being used or not.
	 *
	 * @package		CodeIgniter
	 * @subpackage	Drivers
	 * @category	Database
	 * @author		ExpressionEngine Dev Team
	 * @link		http://codeigniter.com/user_guide/database/
	 */
	var CI_DB_mysql_driver = {};
	
	CI_DB_mysql_driver = Object.create(CI_DB);
	
	CI_DB_mysql_driver.$dbdriver = 'mysql';
	
		// The character used for escaping
	CI_DB_mysql_driver$_escape_char = '`';
	
		// clause and character used for LIKE escape sequences - not used in MySQL
	CI_DB_mysql_driver.$_like_escape_str = '';
	CI_DB_mysql_driver.$_like_escape_chr = '';
	
		/**
		 * Whether to use the MySQL "delete hack" which allows the number
		 * of affected rows to be shown. Uses a preg_replace when enabled,
		 * adding a bit more processing to all queries.
		 */	
	CI_DB_mysql_driver.$delete_hack = true;
		
		/**
		 * The syntax to count rows is slightly different across different
		 * database engines, so this string appears in each driver and is
		 * used for the count_all() and count_all_results() functions.
		 */
	CI_DB_mysql_driver.$_count_string = 'SELECT COUNT(*) AS ';
	CI_DB_mysql_driver.$_random_keyword = ' RAND()'; // database specific random keyword
	
		/**
		 * Non-persistent database connection
		 *
		 * @access	private called by the base class
		 * @return	resource
		 */	
		CI_DB_mysql_driver.db_connect = function () {
			if (this.$port != '') {
				//this.$hostname += ':' + this.$port;
			}
			
			return PHP.mysql_connect(this.$hostname, this.$username, this.$password, true, {});
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Persistent database connection
		 *
		 * @access	private called by the base class
		 * @return	resource
		 */	
		CI_DB_mysql_driver.db_pconnect = function () {
			if (this.$port != '') {
				this.$hostname += ':' + this.$port;
			}
	
			return PHP.mysql_pconnect(this.$hostname, this.$username, this.$password, true, {});
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Reconnect
		 *
		 * Keep / reestablish the db connection if no queries have been
		 * sent for a length of time exceeding the server's idle timeout
		 *
		 * @access	public
		 * @return	void
		 */
		CI_DB_mysql_driver.reconnect = function () {
			if (PHP.mysql_ping(this.$conn_id) === false) {
				this.$conn_id = false;
			}
		}
	
		// --------------------------------------------------------------------
		
		/**
		 * Select the database
		 *
		 * @access	private called by the base class
		 * @return	resource
		 */	
		CI_DB_mysql_driver.db_select = function () {
			return PHP.mysql_select_db(this.$database, this.$conn_id);
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Set client character set
		 *
		 * @access	public
		 * @param	string
		 * @param	string
		 * @return	resource
		 */
		CI_DB_mysql_driver.db_set_charset = function ($charset, $collation) {
			return PHP.mysql_query("SET NAMES '" + this.escape_str($charset) + "' COLLATE '" + this.escape_str($collation) + "'", [], this.$conn_id, false);
		}
	
		// --------------------------------------------------------------------
		
		/**
		 * Version number query string
		 *
		 * @access	public
		 * @return	string
		 */
		CI_DB_mysql_driver._version = function () {
			return "SELECT version() AS ver";
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Execute the query
		 *
		 * @access	private called by the base class
		 * @param	string	an SQL query
		 * @return	resource
		 */	
		CI_DB_mysql_driver._execute = function ($sql) {
			$sql = this._prep_query($sql);
			
			var $results = PHP.mysql_query($sql, this.$conn_id);
	
			return $results;
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Prep the query
		 *
		 * If needed, each database adapter can prep the query string
		 *
		 * @access	private called by execute()
		 * @param	string	an SQL query
		 * @return	string
		 */	
		CI_DB_mysql_driver._prep_query = function ($sql) {
			// "DELETE FROM TABLE" returns 0 affected rows This hack modifies
			// the query so that it returns the number of affected rows
			if (this.$delete_hack === true) {
				if (PHP.preg_match('/^\s*DELETE\s+FROM\s+(\S+)\s*$/i', $sql)) {
					$sql = PHP.preg_replace("/^\s*DELETE\s+FROM\s+(\S+)\s*$/", "DELETE FROM \\1 WHERE 1=1", $sql);
				}
			}
			
			return $sql;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Begin Transaction
		 *
		 * @access	public
		 * @return	bool		
		 */	
		CI_DB_mysql_driver.trans_begin = function ($test_mode) {
			$test_mode = $test_mode || false;
			
			if ( ! this.$trans_enabled) {
				return true;
			}
			
			// When transactions are nested we only begin/commit/rollback the outermost ones
			if (this.$_trans_depth > 0) {
				return true;
			}
	
			// Reset the transaction failure flag.
			// If the $test_mode flag is set to TRUE transactions will be rolled back
			// even if the queries produce a successful result.
			this.$_trans_failure = ($test_mode === true) ? true : false;
			
			this.simple_query('SET AUTOCOMMIT=0');
			this.simple_query('START TRANSACTION'); // can also be BEGIN or BEGIN WORK
			return true;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Commit Transaction
		 *
		 * @access	public
		 * @return	bool		
		 */	
		CI_DB_mysql_driver.trans_commit = function () {
			if ( ! this.$trans_enabled) {
				return true;
			}
	
			// When transactions are nested we only begin/commit/rollback the outermost ones
			if (this.$_trans_depth > 0) {
				return true;
			}
	
			this.simple_query('COMMIT');
			this.simple_query('SET AUTOCOMMIT=1');
			return true;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Rollback Transaction
		 *
		 * @access	public
		 * @return	bool		
		 */	
		CI_DB_mysql_driver.trans_rollback = function () {
			if ( ! $trans_enabled) {
				return true;
			}
	
			// When transactions are nested we only begin/commit/rollback the outermost ones
			if ($_trans_depth > 0) {
				return true;
			}
	
			this.simple_query('ROLLBACK');
			this.simple_query('SET AUTOCOMMIT=1');
			return true;
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Escape String
		 *
		 * @access	public
		 * @param	string
		 * @param	bool	whether or not the string will be used in a LIKE condition
		 * @return	string
		 */
		CI_DB_mysql_driver.escape_str = function ($str, $like) {	
			$like = $like || false;
			
			if (PHP.is_array($str)) {
				for(var $key in $str) {
					$str[$key] = this.escape_str($str[$key], $like);
		   		}
	   		
		   		return $str;
		   	}
	
			if (PHP.function_exists('mysql_real_escape_string') && PHP.is_resource(this.$conn_id)) {
				$str = PHP.mysql_real_escape_string($str, this.$conn_id);
			} else if (PHP.function_exists('mysql_escape_string')) {
				$str = PHP.mysql_escape_string($str);
			} else {
				$str = PHP.addslashes($str);
			}
			
			// escape LIKE condition wildcards
			if ($like === true) {
				$str = PHP.str_replace(['%', '_'], ['\\%', '\\_'], $str);
			}
			
			return $str;
		}
			
		// --------------------------------------------------------------------
	
		/**
		 * Affected Rows
		 *
		 * @access	public
		 * @return	integer
		 */
		CI_DB_mysql_driver.affected_rows = function () {
			return PHP.mysql_affected_rows(this.$conn_id);
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Insert ID
		 *
		 * @access	public
		 * @return	integer
		 */
		CI_DB_mysql_driver.insert_id = function () {
			return PHP.mysql_insert_id(this.$conn_id);
		}
		
		CI_DB_mysql_driver.next_result = function() {
			return PHP.mysql_next_result(this.$conn_id);
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * "Count All" query
		 *
		 * Generates a platform-specific query string that counts all records in
		 * the specified database
		 *
		 * @access	public
		 * @param	string
		 * @return	string
		 */
		CI_DB_mysql_driver.count_all = function ($table) {
			$table = $table || '';
				
			if ($table == '') {
				return 0;
			}
		
			var $query = this.query($_count_string + this._protect_identifiers('numrows') + " FROM " + this._protect_identifiers($table, true, null, false));
	
			if ($query.num_rows() == 0) {
				return 0;
			}
	
			$row = $query.row();
			return $row.numrows;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * List table query
		 *
		 * Generates a platform-specific query string so that the table names can be fetched
		 *
		 * @access	private
		 * @param	boolean
		 * @return	string
		 */
		CI_DB_mysql_driver._list_tables = function ($prefix_limit) {
			$prefix_limit = $prefix_limit || false;
			
			var $sql = "SHOW TABLES FROM " + $_escape_char + $database + $_escape_char;	
	
			if ($prefix_limit !== false && $dbprefix != '') {
				$sql += " LIKE '" + this.escape_like_str($dbprefix) + "%'";
			}
	
			return $sql;
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Show column query
		 *
		 * Generates a platform-specific query string so that the column names can be fetched
		 *
		 * @access	public
		 * @param	string	the table name
		 * @return	string
		 */
		CI_DB_mysql_driver._list_columns = function ($table) {
			$table = $table || '';
				
			return "SHOW COLUMNS FROM " + $table;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Field data query
		 *
		 * Generates a platform-specific query so that the column data can be retrieved
		 *
		 * @access	public
		 * @param	string	the table name
		 * @return	object
		 */
		CI_DB_mysql_driver._field_data = function ($table) {
			return "SELECT * FROM " + $table + " LIMIT 1";
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * The error message string
		 *
		 * @access	private
		 * @return	string
		 */
		CI_DB_mysql_driver._error_message = function () {
			return PHP.mysql_error(this.$conn_id);
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * The error message number
		 *
		 * @access	private
		 * @return	integer
		 */
		CI_DB_mysql_driver._error_number = function () {
			return PHP.mysql_errno(this.$conn_id);
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Escape the SQL Identifiers
		 *
		 * This function escapes column and table names
		 *
		 * @access	private
		 * @param	string
		 * @return	string
		 */
		CI_DB_mysql_driver._escape_identifiers = function ($item) {
			if ($_escape_char == '') {
				return $item;
			}
	
			for($id in $_reserved_identifiers) {
				if (PHP.strpos($item, '.' + $id) !== false) {
					var $str = $_escape_char + PHP.str_replace('.', $_escape_char + '.', $item);  
					
					// remove duplicates if the user already included the escape
					return PHP.preg_replace('/[' + $_escape_char + ']+/', $_escape_char, $str);
				}		
			}
			
			if (PHP.strpos($item, '.') !== false) {
				var $str = $_escape_char + PHP.str_replace('.', $_escape_char + '.' + $_escape_char, $item) + $_escape_char;			
			} else {
				var $str = $_escape_char + $item + $_escape_char;
			}
		
			// remove duplicates if the user already included the escape
			return PHP.preg_replace('/[' + $_escape_char + ']+/', $_escape_char, $str);
		}
				
		// --------------------------------------------------------------------
	
		/**
		 * From Tables
		 *
		 * This function implicitly groups FROM tables so there is no confusion
		 * about operator precedence in harmony with SQL standards
		 *
		 * @access	public
		 * @param	type
		 * @return	type
		 */
		CI_DB_mysql_driver._from_tables = function ($tables) {
			if ( ! PHP.is_array($tables)) {
				$tables = [$tables];
			}
			
			return '(' + PHP.implode(', ', $tables) + ')';
		}
	
		// --------------------------------------------------------------------
		
		/**
		 * Insert statement
		 *
		 * Generates a platform-specific insert string from the supplied data
		 *
		 * @access	public
		 * @param	string	the table name
		 * @param	array	the insert keys
		 * @param	array	the insert values
		 * @return	string
		 */
		CI_DB_mysql_driver._insert = function ($table, $keys, $values) {	
			return "INSERT INTO " + $table + " (" + PHP.implode(', ', $keys) + ") VALUES (" + PHP.implode(', ', $values) + ")";
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Update statement
		 *
		 * Generates a platform-specific update string from the supplied data
		 *
		 * @access	public
		 * @param	string	the table name
		 * @param	array	the update data
		 * @param	array	the where clause
		 * @param	array	the orderby clause
		 * @param	array	the limit clause
		 * @return	string
		 */
		CI_DB_mysql_driver._update = function ($table, $values, $where, $orderby, $limit) {
			$orderby = $orderby || [];
			$limit = $limit || false;
			
			var $valstr = [];
			
			for(var $key in $values) {
				$valstr.push($key + " = " + $values[$key]);
			}
			
			$limit = ( ! $limit) ? '' : ' LIMIT ' + $limit;
			
			$orderby = (PHP.count($orderby) >= 1)?' ORDER BY ' + PHP.implode(", ", $orderby):'';
		
			$sql = "UPDATE " + $table + " SET " + PHP.implode(', ', $valstr);
	
			$sql += ($where != '' && PHP.count($where) >=1) ? " WHERE " + PHP.implode(" ", $where) : '';
	
			$sql += $orderby + $limit;
			
			return $sql;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Truncate statement
		 *
		 * Generates a platform-specific truncate string from the supplied data
		 * If the database does not support the truncate() command
		 * This function maps to "DELETE FROM table"
		 *
		 * @access	public
		 * @param	string	the table name
		 * @return	string
		 */	
		CI_DB_mysql_driver._truncate = function ($table) {
			return "TRUNCATE " + $table;
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Delete statement
		 *
		 * Generates a platform-specific delete string from the supplied data
		 *
		 * @access	public
		 * @param	string	the table name
		 * @param	array	the where clause
		 * @param	string	the limit clause
		 * @return	string
		 */	
		CI_DB_mysql_driver._delete = function ($table, $where, $like, $limit) {
			$where = $where || [];
			$like = $like || [];
			$limit = $limit || false;
		
			var $conditions = '';
	
			if (PHP.count($where) > 0 || HP.count($like) > 0) {
				$conditions = "\nWHERE ";
				$conditions += PHP.implode("\n", $ar_where);
	
				if (PHP.count($where) > 0 && PHP.count($like) > 0) {
					$conditions += " AND ";
				}
				
				$conditions += PHP.implode("\n", $like);
			}
	
			$limit = ( ! $limit) ? '' : ' LIMIT ' + $limit;
		
			return "DELETE FROM " + $table + $conditions + $limit;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Limit string
		 *
		 * Generates a platform-specific LIMIT clause
		 *
		 * @access	public
		 * @param	string	the sql query string
		 * @param	integer	the number of rows to limit the query to
		 * @param	integer	the offset value
		 * @return	string
		 */
		CI_DB_mysql_driver._limit = function ($sql, $limit, $offset) {	
			if ($offset == 0) {
				$offset = '';
			} else {
				$offset += ", ";
			}
			
			return $sql + "LIMIT " + $offset + $limit;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Close DB Connection
		 *
		 * @access	public
		 * @param	resource
		 * @return	void
		 */
		CI_DB_mysql_driver._close = function ($conn_id) {
			PHP.mysql_close($conn_id);
		}
		
	
	module.exports = CI_DB_mysql_driver;
})();

/* End of file mysql_driver.php */
/* Location: ./system/database/drivers/mysql/mysql_driver.php */