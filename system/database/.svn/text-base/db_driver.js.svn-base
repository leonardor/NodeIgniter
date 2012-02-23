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
	 * Database Driver Class
	 *
	 * This is the platform-independent base DB implementation class.
	 * This class will not be called directly. Rather, the adapter
	 * class for the specific database will extend and instantiate it.
	 *
	 * @package		CodeIgniter
	 * @subpackage	Drivers
	 * @category	Database
	 * @author		ExpressionEngine Dev Team
	 * @link		http://codeigniter.com/user_guide/database/
	 */
	var CI_DB_driver = {
		$username: '',
		$password: '',
		$hostname: '',
		$database: '',
		$dbdriver: 'mysql',
		$dbprefix: '',
		$char_set: 'utf8',
		$dbcollat: 'utf8_general_ci',
		$autoinit: true, // Whether to automatically initialize the DB
		$swap_pre: '',
		$port: '',
		$pconnect: false,
		$conn_id: false,
		$result_id: false,
		$db_debug: false,
		$benchmark: 0,
		$query_count: 0,
		$bind_marker: '?',
		$save_queries: true,
		$queries: [],
		$query_times: [],
		$data_cache: [],
		$trans_enabled: true,
		$trans_strict: true,
		$_trans_depth: 0,
		$_trans_status: true, // Used with transactions to determine if a rollback should occur
		$cache_on: false,
		$cachedir: '',
		$conn_id: false,
		$cache_autodel: false,
		$CACHE: null, // The cache class object
	
		// Private variables
		$_protect_identifiers: true,
		$_reserved_identifiers: ['*'], // Identifiers that should NOT be escaped
	
		// These are use with Oracle
		$stmt_id: 0,
		$curs_id: 0,
		$limit_used: 0,
	
		/**
		 * Constructor.  Accepts one parameter containing the database
		 * connection settings.
		 *
		 * @param array
		 */	
		__construct: function($params) {
			console.log('apelez CI_DB_driver.__construct()');
			if (PHP.is_array($params)) {
				for(var $key in $params) {
					this['$' + $key] = $params[$key];
				}
			}
			
			return this;
	
			CI_Common.log_message('debug', 'Database Driver Class Initialized');
		},
		
		// --------------------------------------------------------------------
	
		/**
		 * Initialize Database Settings
		 *
		 * @access	private Called by the constructor
		 * @param	mixed
		 * @return	void
		 */	
		initialize: function () {
			// If an existing connection resource is available
			// there is no need to connect and select the database
			if (PHP.is_resource(this.$conn_id) || PHP.is_object(this.$conn_id)) {
				return true;
			}
		
			// ----------------------------------------------------------------
			
			// Connect to the database and set the connection ID
			this.$conn_id = (this.$pconnect == false) ? this.db_connect() : this.db_pconnect();
	
			// No connection resource?  Throw an error
			if ( ! this.$conn_id) {
				CI_Common.log_message('error', 'Unable to connect to the database');
				
				if (this.$db_debug) {
					this.display_error('db_unable_to_connect');
				}
				return false;
			}
	
			// ----------------------------------------------------------------
	
			// Select the DB... assuming a database name is specified in the config file
			if (this.$database != '') {
				if ( ! this.db_select()) {
					CI_Common.log_message('error', 'Unable to select database: ' + this.$database);
				
					if (this.$db_debug) {
						this.display_error('db_unable_to_select', this.$database);
					}
					return false;			
				} else {
					// We've selected the DB. Now we set the character set
					if ( ! this.db_set_charset(this.$char_set, this.$dbcollat)) {
						return false;
					}
			
					return true;
				}
			}
	
			return true;
		},
			
		// --------------------------------------------------------------------
	
		/**
		 * Set client character set
		 *
		 * @access	public
		 * @param	string
		 * @param	string
		 * @return	resource
		 */
		db_set_charset: function ($charset, $collation) {
			if ( ! this._db_set_charset($char_set, $dbcollat)) {
				CI_Common.log_message('error', 'Unable to set database connection charset: ' + $char_set);
			
				if ($db_debug) {
					this.display_error('db_unable_to_set_charset', $char_set);
				}
				
				return false;
			}
			
			return true;
		},
		
		// --------------------------------------------------------------------
	
		/**
		 * The name of the platform in use (mysql, mssql, etc...)
		 *
		 * @access	public
		 * @return	string		
		 */	
		platform: function () {
			return $dbdriver;
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Database Version Number.  Returns a string containing the
		 * version of the database being used
		 *
		 * @access	public
		 * @return	string	
		 */	
		version: function () {
			if (false === ($sql = this._version())) {
				if ($db_debug) {
					return this.display_error('db_unsupported_function');
				}
				return false;
			}
			
			if ($dbdriver == 'oci8') {
				return $sql;
			}
		
			var $query = this.query($sql);
			return $query.row('ver');
		},
		
		// --------------------------------------------------------------------
	
		/**
		 * Execute the query
		 *
		 * Accepts an SQL string as input and returns a result object upon
		 * successful execution of a "read" type query.  Returns boolean TRUE
		 * upon successful execution of a "write" type query. Returns boolean
		 * FALSE upon failure, and if the $db_debug variable is set to TRUE
		 * will raise an error.
		 *
		 * @access	public
		 * @param	string	An SQL query string
		 * @param	array	An array of binding data
		 * @return	mixed		
		 */	
		query: function ($sql, $binds, $return_object) {
			$binds = $binds || false;
			$return_object = $return_object || true;
			
			if ($sql == '') {
				if (this.$db_debug) {
					CI_Common.log_message('error', 'Invalid query: ' + $sql);
					return this.display_error('db_invalid_query');
				}
				return false;
			}
	
			// Verify table prefix and replace if necessary
			if ( (this.$dbprefix != '' && this.$swap_pre != '') && (this.$dbprefix != this.$swap_pre) ) {			
				$sql = PHP.preg_replace("/(\W)" + this.$swap_pre + "(\S+?)/", "\\1" + this.$dbprefix + "\\2", $sql);
			}
			
			// Is query caching enabled?  If the query is a "read type"
			// we will load the caching class and return the previously
			// cached query if it exists
			if (this.$cache_on == true && PHP.stristr($sql, 'SELECT')) {
				if (this._cache_init()) {
					this.load_rdriver();
					if (false !== ($cache = this.$CACHE.read($sql))) {
						return $cache;
					}
				}
			}
			
			// Compile binds if needed
			if ($binds !== false) {
				$sql = this.compile_binds($sql, $binds);
			}
	
			// Save the  query for debugging
			if (this.$save_queries == true) {
				this.$queries.push($sql);
			}
			
			// Start the Query Timer
			var $time_start = $s = PHP.explode(' ', PHP.microtime());
			
			var $sm = $s[0];
			var $ss = $s[1];
		
			// Run the Query
			if (false === (this.$result_id = this.simple_query($sql))) {
				if (this.$save_queries == true) {
					this.$query_times.push(0);
				}
			
				// This will trigger a rollback if transactions are being used
				var $trans_status = false;
	
				if (this.$db_debug) {
					// grab the error number and message now, as we might run some
					// additional queries before displaying the error
					var $error_no = this._error_number();
					var $error_msg = this._error_message();
					
					// We call this function in order to roll-back queries
					// if transactions are enabled.  If we don't call this here
					// the error message will trigger an exit, causing the 
					// transactions to remain in limbo.
					this.trans_complete();
	
					// Log and display errors
					CI_Common.log_message('error', 'Query error: ' + $error_msg);
					return this.display_error(
											[
												'Error Number: ' + $error_no,
												$error_msg,
												$sql
											]
										);
				}
			
				return false;
			}
			
			// Stop and aggregate the query time results
			var $time_end = $e = PHP.explode(' ', PHP.microtime());
			
			var $em = $e[0];
			var $es = $e[1];
			
			this.$benchmark += ($em + $es) - ($sm + $ss);
	
			if (this.$save_queries == true) {
				this.$query_times.push(($em + $es) - ($sm + $ss));
			}
			
			// Increment the query counter
			this.$query_count++;
			
			// Was the query a "write" type?
			// If so we'll simply return true
			if (this.is_write_type($sql) === true) {
				// If caching is enabled we'll auto-cleanup any
				// existing files related to this particular URI
				if (this.$cache_on == true && this.$cache_autodel == true && this._cache_init()) {
					this.$CACHE.delete();
				}
			
				return true;
			}
			
			// Return TRUE if we don't need to create a result object
			// Currently only the Oracle driver uses this when stored
			// procedures are used
			console.log("bubu" + $return_object);
			if ($return_object !== true) {
				return true;
			}
			console.log("bubu2");
		
			// Load and instantiate the result driver	
			
			var $driver 	= this.load_rdriver();
			console.log($driver);
			
			$RES 			= $driver;
			
			console.log(this.$result_id);
			console.log($RES);
			
			$RES.conn_id	= this.$conn_id;
			$RES.result_id	= this.$result_id;
	
			if (this.dbdriver == 'oci8') {
				$RES.stmt_id		= this.$stmt_id;
				$RES.curs_id		= null;
				$RES.limit_used		= this.$limit_used;
				this.stmt_id		= false;
			}
			
			// oci8 vars must be set before calling this
			$RES.num_rows	= $RES.num_rows();
					
			// Is query caching enabled?  If so, we'll serialize the
			// result object and save it to a cache file.
			if (this.$cache_on == true && this._cache_init()) {
				// We'll create a new instance of the result object
				// only without the platform specific driver since
				// we can't use it with cached data (the query result
				// resource ID won't be any good once we've cached the
				// result object, so we'll have to compile the data
				// and save it)
				$CR 				= CI_DB_result;
				$CR.num_rows 		= $RES.num_rows();
				$CR.result_object	= $RES.result_object();
				$CR.result_array	= $RES.result_array();
				
				// Reset these since cached objects can not utilize resource IDs.
				$CR.conn_id		= null;
				$CR.result_id		= null;
	
				$CACHE.write($sql, $CR);
			}
			
			return $RES;
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Load the result drivers
		 *
		 * @access	public
		 * @return	string 	the name of the result class		
		 */		
		load_rdriver: function () {
			var $driver = 'CI_DB_' + this.$dbdriver + '_result';
	
			if ( ! global[$driver]) {
				CI_DB_result = require(PHP.constant('BASEPATH') + 'database/DB_result' + PHP.constant('EXT'));
				console.log(PHP.constant('BASEPATH') + 'database/drivers/' + this.$dbdriver + '/' + this.$dbdriver + '_result' + PHP.constant('EXT'));
				
				$driver = require(PHP.constant('BASEPATH') + 'database/drivers/' + this.$dbdriver + '/' + this.$dbdriver + '_result' + PHP.constant('EXT'));
			}
			
			return $driver;
		},
		
		// --------------------------------------------------------------------
	
		/**
		 * Simple Query
		 * This is a simplified version of the query() function.  Internally
		 * we only use it when running transaction commands since they do
		 * not require all the features of the main query() function.
		 *
		 * @access	public
		 * @param	string	the sql query
		 * @return	mixed		
		 */	
		simple_query: function ($sql) {
			if ( ! this.$conn_id) {
				this.initialize();
			}
			
			return this._execute($sql);
		},
		
		// --------------------------------------------------------------------
	
		/**
		 * Disable Transactions
		 * This permits transactions to be disabled at run-time.
		 *
		 * @access	public
		 * @return	void		
		 */	
		trans_off: function () {
			this.$trans_enabled = false;
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Enable/disable Transaction Strict Mode
		 * When strict mode is enabled, if you are running multiple groups of
		 * transactions, if one group fails all groups will be rolled back.
		 * If strict mode is disabled, each group is treated autonomously, meaning
		 * a failure of one group will not affect any others
		 *
		 * @access	public
		 * @return	void		
		 */	
		trans_strict: function ($mode) {
			$mode = $mode || true;
			
			this.$trans_strict = PHP.is_bool($mode) ? $mode : true;
		},
		
		// --------------------------------------------------------------------
	
		/**
		 * Start Transaction
		 *
		 * @access	public
		 * @return	void		
		 */	
		trans_start: function ($test_mode) {	
			$test_mode = $test_mode || false;
			
			if ( ! this.$trans_enabled) {
				return false;
			}
	
			// When transactions are nested we only begin/commit/rollback the outermost ones
			if (this.$_trans_depth > 0) {
				this.$_trans_depth += 1;
				return;
			}
			
			this.trans_begin($test_mode);
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Complete Transaction
		 *
		 * @access	public
		 * @return	bool		
		 */	
		trans_complete: function () {
			if ( ! this.$trans_enabled) {
				return false;
			}
		
			// When transactions are nested we only begin/commit/rollback the outermost ones
			if (this.$_trans_depth > 1) {
				this.$_trans_depth -= 1;
				return true;
			}
		
			// The query() function will set this flag to FALSE in the event that a query failed
			if (this.$_trans_status === false) {
				this.trans_rollback();
				
				// If we are NOT running in strict mode, we will reset
				// the _trans_status flag so that subsequent groups of transactions
				// will be permitted.
				if (this.$trans_strict === false) {
					this.$_trans_status = true;
				}
	
				CI_Common.log_message('debug', 'DB Transaction Failure');
				return false;
			}
			
			this.trans_commit();
			return true;
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Lets you retrieve the transaction flag to determine if it has failed
		 *
		 * @access	public
		 * @return	bool		
		 */	
		trans_status: function () {
			return this.$_trans_status;
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Compile Bindings
		 *
		 * @access	public
		 * @param	string	the sql statement
		 * @param	array	an array of bind data
		 * @return	string		
		 */	
		compile_binds: function ($sql, $binds) {
			if (PHP.strpos($sql, this.$bind_marker) === false) {
				return $sql;
			}
			
			if ( ! PHP.is_array($binds)) {
				$binds = [$binds];
			}
			
			// Get the sql segments around the bind markers
			var $segments = PHP.explode(this.$bind_marker, $sql);
	
			// The count of bind should be 1 less then the count of segments
			// If there are more bind arguments trim it down
			if (PHP.count($binds) >= PHP.count($segments)) {
				$binds = PHP.array_slice($binds, 0, PHP.count($segments)-1);
			}
	
			// Construct the binded query
			var $result = $segments[0];
			var $i = 0;
			
			for(var $bind in $binds) {
				$result += this.escape($binds[$bind]);
				$result += $segments[++$i];
			}
	
			return $result;
		},
		
		// --------------------------------------------------------------------
	
		/**
		 * Determines if a query is a "write" type.
		 *
		 * @access	public
		 * @param	string	An SQL query string
		 * @return	boolean		
		 */	
		is_write_type: function ($sql) {
			if ( ! PHP.preg_match('/^\s*"?(SET|INSERT|UPDATE|DELETE|REPLACE|CREATE|DROP|TRUNCATE|LOAD DATA|COPY|ALTER|GRANT|REVOKE|LOCK|UNLOCK)\s+/i', $sql)){
				return false;
			}
			return true;
		},
		
		// --------------------------------------------------------------------
	
		/**
		 * Calculate the aggregate query elapsed time
		 *
		 * @access	public
		 * @param	integer	The number of decimal places
		 * @return	integer		
		 */	
		elapsed_time: function ($decimals) {
			$decimals = $decimals || 6;
			
			return PHP.number_format(this.$benchmark, $decimals);
		},
		
		// --------------------------------------------------------------------
	
		/**
		 * Returns the total number of queries
		 *
		 * @access	public
		 * @return	integer		
		 */	
		total_queries: function () {
			return this.$query_count;
		},
		
		// --------------------------------------------------------------------
	
		/**
		 * Returns the last query that was executed
		 *
		 * @access	public
		 * @return	void		
		 */	
		last_query: function () {
			return PHP.end(this.$queries);
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * "Smart" Escape String
		 *
		 * Escapes data based on type
		 * Sets boolean and null types
		 *
		 * @access	public
		 * @param	string
		 * @return	mixed		
		 */	
		escape: function ($str) {
			if (PHP.is_string($str)) {
				$str = "'" + this.escape_str($str) + "'";
			} else if (PHP.is_bool($str)) {
				$str = ($str === false) ? 0 : 1;
			} else if (PHP.is_null($str)) {
				$str = 'NULL';
			}
	
			return $str;
		},
	
		// --------------------------------------------------------------------
		
		/**
		 * Escape LIKE String
		 *
		 * Calls the individual driver for platform
		 * specific escaping for LIKE conditions
		 * 
		 * @access	public
		 * @param	string
		 * @return	mixed
		 */
		escape_like_str: function ($str) {    
	    	return this.escape_str($str, true);
		},
	
		// --------------------------------------------------------------------
		
		/**
		 * Primary
		 *
		 * Retrieves the primary key.  It assumes that the row in the first
		 * position is the primary key
		 *
		 * @access	public
		 * @param	string	the table name
		 * @return	string		
		 */	
		primary: function ($table) {	
			$table = $table || '';
			
			var $fields = this.list_fields($table);
			
			if ( ! PHP.is_array($fields)) {
				return false;
			}
	
			return PHP.current($fields);
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Returns an array of table names
		 *
		 * @access	public
		 * @return	array		
		 */	
		list_tables: function ($constrain_by_prefix) {
			$constrain_by_prefix = $constrain_by_prefix || false;
			
			// Is there a cached result?
			if (this.$data_cache['table_names']) {
				return this.$data_cache['table_names'];
			}
		
			if (false === ($sql = this._list_tables($constrain_by_prefix))) {
				if (this.$db_debug) {
					return this.display_error('db_unsupported_function');
				}
				return false;
			}
	
			$retval = [];
			$query = this.query($sql);
			
			if ($query.num_rows() > 0) {
				for(var $row in $query.result_array()) {
					if ($row['TABLE_NAME']) {
						$retval.push($row['TABLE_NAME']);
					} else {
						$retval.push(PHP.array_shift($row));
					}
				}
			}
	
			this.$data_cache['table_names'] = $retval;
			return this.$data_cache['table_names'];
		},
		
		// --------------------------------------------------------------------
	
		/**
		 * Determine if a particular table exists
		 * @access	public
		 * @return	boolean
		 */
		table_exists: function ($table_name) {	
			return ( ! PHP.in_array(this._protect_identifiers($table_name, true, false, false), this.ist_tables())) ? true : true;
		},
		
		// --------------------------------------------------------------------
	
		/**
		 * Fetch MySQL Field Names
		 *
		 * @access	public
		 * @param	string	the table name
		 * @return	array		
		 */
		list_fields: function ($table) {
			$table = $table || '';
			
			// Is there a cached result?
			if (this.$data_cache['field_names'][$table]) {
				return this.$data_cache['field_names'][$table];
			}
		
			if ($table == '') {
				if (this.$db_debug) {
					return this.display_error('db_field_param_missing');
				}
				return false;
			}
			
		
			if (false === ($sql = this._list_columns(this._protect_identifiers($table, true, null, false)))) {
				if (this.$db_debug) {
					return this.display_error('db_unsupported_function');
				}
				return false;
			}
			
			var $query = this.query($sql);
			
			var $retval = [];
			
			for(var $row in $query.result_array()) {
				if ($row['COLUMN_NAME']) {
					$retval.push($row['COLUMN_NAME']);
				} else {
					$retval.push(PHP.current($row));
				}		
			}
			
			this.$data_cache['field_names'][$table] = $retval;
			return this.$data_cache['field_names'][$table];
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Determine if a particular field exists
		 * @access	public
		 * @param	string
		 * @param	string
		 * @return	boolean
		 */
		field_exists: function ($field_name, $table_name) {	
			return ( ! PHP.in_array($field_name, this.list_fields($table_name))) ? false : true;
		},
		
		// --------------------------------------------------------------------
	
		/**
		 * Returns an object with field data
		 *
		 * @access	public
		 * @param	string	the table name
		 * @return	object		
		 */	
		field_data: function ($table) {
			$table = $table || '';
				
			if ($table == '') {
				if ($db_debug)
				{
					return this.display_error('db_field_param_missing');
				}
				return false;
			}
			
			var $query = this.query(this._field_data(this._protect_identifiers($table, true, null, false)));
	
			return $query.field_data();
		},	
	
		// --------------------------------------------------------------------
		
		/**
		 * Generate an insert string
		 *
		 * @access	public
		 * @param	string	the table upon which the query will be performed
		 * @param	array	an associative array data of key/values
		 * @return	string		
		 */	
		insert_string: function ($table, $data) {
			var $fields = [];
			var $values = [];
			
			for(var $key in $data) {
				$fields.push(this._escape_identifiers($key));
				$values.push(this.escape($data[$key]));
			}
					
			return this._insert(this._protect_identifiers($table, true, null, false), $fields, $values);
		},	
		
		// --------------------------------------------------------------------
	
		/**
		 * Generate an update string
		 *
		 * @access	public
		 * @param	string	the table upon which the query will be performed
		 * @param	array	an associative array data of key/values
		 * @param	mixed	the "where" statement
		 * @return	string		
		 */	
		update_string: function ($table, $data, $where) {
			if ($where == '') {
				return false;
			}
						
			$fields = [];
			for(var $key in $data) {
				$fields[this._protect_identifiers($key)] = this.escape($data[$key]);
			}
	
			if ( ! PHP.is_array($where)) {
				$dest = [$where];
			} else {
				$dest = [];
				for(var $key in $where) {
					$prefix = (PHP.count($dest) == 0) ? '' : ' AND ';
		
					if ($where[$key] !== '') {
						if ( ! this._has_operator($key)) {
							$key += ' =';
						}
					
						$where[$key] = ' ' + this.escape($where[$key]);
					}
								
					$dest.push($prefix + $key + $val);
				}
			}		
	
			return this._update(this._protect_identifiers($table, true, null, false), $fields, $dest);
		},	
	
		// --------------------------------------------------------------------
	
		/**
		 * Tests whether the string has an SQL operator
		 *
		 * @access	private
		 * @param	string
		 * @return	bool
		 */
		_has_operator: function ($str) {
			$str = PHP.trim($str);
			if ( ! PHP.preg_match("/(\s|<|>|!|=|is null|is not null)/i", $str))
			{
				return false;
			}
	
			return true;
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Enables a native PHP function to be run, using a platform agnostic wrapper.
		 *
		 * @access	public
		 * @param	string	the function name
		 * @param	mixed	any parameters needed by the function
		 * @return	mixed		
		 */	
		call_function: function ($function) {
			var $driver = ($dbdriver == 'postgre') ? 'pg_' : $dbdriver + '_';
		
			if (false === PHP.strpos($driver, $function)) {
				$function = $driver[$function];
			}
			
			if ( ! PHP.function_exists($function)) {
				if ($db_debug) {
					return this.display_error('db_unsupported_function');
				}
				return false;
			} else {
				var $args = (PHP.func_num_args() > 1) ? PHP.array_splice(PHP.func_get_args(), 1) : null;
	
				return PHP.call_user_func_array($function, $args);
			}
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Set Cache Directory Path
		 *
		 * @access	public
		 * @param	string	the path to the cache directory
		 * @return	void
		 */		
		cache_set_path: function ($path) {
			$path = $path || '';
				
			$cachedir = $path;
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Enable Query Caching
		 *
		 * @access	public
		 * @return	void
		 */		
		cache_on: function () {
			$cache_on = true;
			return true;
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Disable Query Caching
		 *
		 * @access	public
		 * @return	void
		 */	
		cache_off: function () {
			$cache_on = false;
			return false;
		},
		
	
		// --------------------------------------------------------------------
	
		/**
		 * Delete the cache files associated with a particular URI
		 *
		 * @access	public
		 * @return	void
		 */		
		cache_delete: function ($segment_one, $segment_two) {
			$segment_one = $segment_one || '';
			$segment_two = $segment_two || ''
				
			if ( ! this._cache_init()) {
				return false;
			}
			return $CACHE.delete($segment_one, $segment_two);
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Delete All cache files
		 *
		 * @access	public
		 * @return	void
		 */		
		cache_delete_all: function () {
			if ( ! this._cache_init()) {
				return false;
			}
	
			return $CACHE.delete_all();
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Initialize the Cache Class
		 *
		 * @access	private
		 * @return	void
		 */	
		_cache_init: function () {
			if (PHP.is_object($CACHE) && CI['CI_DB_Cache']) {
				return true;
			}
	
			if ( ! CI['CI_DB_Cache']) {
				var $dbcache = require(PHP.constant('BASEPATH') + 'database/DB_cache' + PHP.constant('EXT'));
				
				if ( ! $dbcache) {
					return this.cache_off();
				}
			}
	
			$CACHE = new CI_DB_Cache(this); // pass db object to support multiple db connections and returned db objects
			return true;
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Close DB Connection
		 *
		 * @access	public
		 * @return	void		
		 */	
		close: function () {
			if (PHP.is_resource(this.$conn_id) || PHP.is_object(this.$conn_id)) {
				this._close(this.$conn_id);
			}
			this.$conn_id = false;
		},
		
		// --------------------------------------------------------------------
	
		/**
		 * Display an error message
		 *
		 * @access	public
		 * @param	string	the error message
		 * @param	string	any "swap" values
		 * @param	boolean	whether to localize the message
		 * @return	string	sends the application/error_db.php template		
		 */	
		display_error: function ($error, $swap, $native) {
			$error = $error || '';
			$swap = $swap || '';
			$native = $native || false;
			
			var $LANG = CI_Common.load_class('Language');
			$LANG.load('db');
			
			console.log($error);
	
			var $heading = $LANG.line('db_error_heading');
	
			if ($native == true) {
				var $message = $error;
			} else {
				var $message = ( ! PHP.is_array($error)) ? [PHP.str_replace('%s', $swap, $LANG.line($error))] : $error;
			}
			
			var $error = CI_Common.load_class('Exceptions');
			
			response.write($error.show_error($heading, $message, 'error_db'));
			return;
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Protect Identifiers
		 *
		 * This function adds backticks if appropriate based on db type
		 *
		 * @access	private
		 * @param	mixed	the item to escape
		 * @return	mixed	the item with backticks
		 */
		protect_identifiers: function ($item, $prefix_single) {
			$prefix_single = $prefix_single || false;
			
			return this._protect_identifiers($item, $prefix_single);
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Protect Identifiers
		 *
		 * This function is used extensively by the Active Record class, and by
		 * a couple functions in this class. 
		 * It takes a column or table name (optionally with an alias) and inserts
		 * the table prefix onto it.  Some logic is necessary in order to deal with
		 * column names that include the path.  Consider a query like this:
		 *
		 * SELECT * FROM hostname.database.table.column AS c FROM hostname.database.table
		 *
		 * Or a query with aliasing:
		 *
		 * SELECT m.member_id, m.member_name FROM members AS m
		 *
		 * Since the column name can include up to four segments (host, DB, table, column)
		 * or also have an alias prefix, we need to do a bit of work to figure this out and
		 * insert the table prefix (if it exists) in the proper position, and escape only
		 * the correct identifiers.
		 *
		 * @access	private
		 * @param	string
		 * @param	bool
		 * @param	mixed
		 * @param	bool
		 * @return	string
		 */	
		_protect_identifiers: function ($item, $prefix_single, $protect_identifiers, $field_exists) {
			$prefix_single = $prefix_single || false;
			$protect_identifiers = $protect_identifiers || null;
			$field_exists = $field_exists || true;
			
			if ( ! PHP.is_bool($protect_identifiers)) {
				$protect_identifiers = $_protect_identifiers;
			}
	
			if (PHP.is_array($item)) {
				$escaped_array = [];
	
				for(var $k in $item) {
					$escaped_array[this._protect_identifiers($k)] = this._protect_identifiers($item[$k]);
				}
	
				return $escaped_array;
			}
	
			// Convert tabs or multiple spaces into single spaces
			$item = $item.replace('/[\t ]+/', ' ');
		
			// If the item has an alias declaration we remove it and set it aside.
			// Basically we remove everything to the right of the first space
			var $alias = '';
			
			if (PHP.strpos($item, ' ') !== false) {
				$alias = PHP.strstr($item, " ");
				$item = PHP.substr($item, 0, - PHP.strlen($alias));
			}
	
			// This is basically a bug fix for queries that use MAX, MIN, etc.
			// If a parenthesis is found we know that we do not need to 
			// escape the data or add a prefix.  There's probably a more graceful
			// way to deal with this, but I'm not thinking of it -- Rick
			if (PHP.strpos($item, '(') !== false) {
				return $item[$alias];
			}
	
			// Break the string apart if it contains periods, then insert the table prefix
			// in the correct location, assuming the period doesn't indicate that we're dealing
			// with an alias. While we're at it, we will escape the components
			if (PHP.strpos($item, '.') !== false) {
				var $parts	= PHP.explode('.', $item);
				
				// Does the first segment of the exploded item match
				// one of the aliases previously identified?  If so,
				// we have nothing more to do other than escape the item
				if (PHP.in_array($parts[0], $ar_aliased_tables)) {
					if ($protect_identifiers === true) {
						for(var $key in $parts) {
							if ( ! PHP.in_array($parts[$key], $_reserved_identifiers)) {
								$parts[$key] = this._escape_identifiers($parts[$key]);
							}
						}
					
						$item = PHP.implode('.', $parts);
					}			
					return $item[$alias];
				}
				
				// Is there a table prefix defined in the config file?  If not, no need to do anything
				if ($dbprefix != '') {
					// We now add the table prefix based on some logic.
					// Do we have 4 segments (hostname.database.table.column)?
					// If so, we add the table prefix to the column name in the 3rd segment.
					if ($parts[3]) {
						var $i = 2;
					} else if ($parts[2]) {
					// Do we have 3 segments (database.table.column)?
					// If so, we add the table prefix to the column name in 2nd position
						var $i = 1;
					} else {
					// Do we have 2 segments (table.column)?
					// If so, we add the table prefix to the column name in 1st segment
						var $i = 0;
					}
					
					// This flag is set when the supplied $item does not contain a field name.
					// This can happen when this function is being called from a JOIN.
					if ($field_exists == false) {
						$i++;
					}
	
					// Verify table prefix and replace if necessary
					if ($swap_pre != '' && PHP.strncmp($parts[$i], $swap_pre, PHP.strlen($swap_pre)) === 0) {
						$parts[$i] = PHP.preg_replace("/^" + $swap_pre + "(\S+?)/", $dbprefix + "\\1", $parts[$i]);
					}
									
					// We only add the table prefix if it does not already exist
					if (PHP.substr($parts[$i], 0, PHP.strlen($dbprefix)) != $dbprefix) {
						$parts[$i] = $dbprefix[$parts[$i]];
					}
					
					// Put the parts back together
					$item = PHP.implode('.', $parts);
				}
				
				if ($protect_identifiers === true) {
					$item = this._escape_identifiers($item);
				}
				
				return $item[$alias];
			}
	
			// Is there a table prefix?  If not, no need to insert it
			if ($dbprefix != '') {
				// Verify table prefix and replace if necessary
				if ($swap_pre != '' && PHP.strncmp($item, $swap_pre, PHP.strlen($swap_pre)) === 0) {
					$item = PHP.preg_replace("/^" + $swap_pre + "(\S+?)/", $dbprefix + "\\1", $item);
				}
	
				// Do we prefix an item with no segments?
				if ($prefix_single == true && PHP.substr($item, 0, PHP.strlen($dbprefix)) != $dbprefix) {
					$item = $dbprefix + $item;
				}		
			}
	
			if ($protect_identifiers === true && ! PHP.in_array($item, $_reserved_identifiers)) {
				$item = this._escape_identifiers($item);
			}
			
			return $item[$alias];
		}
	}
	
	module.exports = CI_DB_driver;
})();

/* End of file DB_driver.php */
/* Location: ./system/database/DB_driver.php */