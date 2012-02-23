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
	var CI_DB_utility = {};
	
	CI_DB_utility = Object.create(CI_DB_forge);
	
	CI_DB_utility.$db = null;
	CI_DB_utility.$data_cache = [];
	
	/**
	 * Constructor
	 *
	 * Grabs the CI super object instance so we can access it.
	 *
	 */	
	CI_DB_utility.__construct = function() {
		// Assign the main database object to $this->db
		this.$db = CI.db;
		
		CI_Common.log_message('debug', "Database Utility Class Initialized");
	},

	// --------------------------------------------------------------------

	/**
	 * List databases
	 *
	 * @access	public
	 * @return	bool
	 */
	CI_DB_utility.list_databases = function () {	
		// Is there a cached result?
		if (this.$data_cache['db_names'])) {
			return this.$data_cache['db_names'];
		}
	
		var $query = this.$db.query(this._list_databases());
		var $dbs = [];
		
		if ($query.num_rows() > 0) {
			for(var $row in $query.result_array()) {
				$dbs.push(PHP.current($row));
			}
		}
			
		this.$data_cache['db_names'] = $dbs;
		return this.$data_cache['db_names'];
	},

	// --------------------------------------------------------------------

	/**
	 * Optimize Table
	 *
	 * @access	public
	 * @param	string	the table name
	 * @return	bool
	 */
	CI_DB_utility.optimize_table = function ($table_name) {
		var $sql = this._optimize_table($table_name);
		
		if (PHP.is_bool($sql)) {
			CI_Common.show_error('db_must_use_set');
		}
	
		var $query = this.$db.query($sql);
		var $res = $query.result_array();
		
		// Note: Due to a bug in current() that affects some versions
		// of PHP we can not pass function call directly into it
		return PHP.current($res);
	},

	// --------------------------------------------------------------------

	/**
	 * Optimize Database
	 *
	 * @access	public
	 * @return	array
	 */
	CI_DB_utility.optimize_database = function () {
		var $result = [];
		
		for(var $table_name in this.$db.list_tables()) {
			var $sql = this._optimize_table($table_name);
			
			if (PHP.is_bool($sql)) {
				return $sql;
			}
			
			var $query = this.$db.query($sql);
			
			// Build the result array...
			// Note: Due to a bug in current() that affects some versions
			// of PHP we can not pass function call directly into it
			var $res = $query.result_array();
			$res = PHP.current($res);
			var $key = PHP.str_replace(this.$db.database + '.', '', PHP.current($res));
			var $keys = PHP.array_keys($res);
			PHP.unset($res[$keys[0]]);
			
			$result[$key] = $res;
		}

		return $result;
	},

	// --------------------------------------------------------------------

	/**
	 * Repair Table
	 *
	 * @access	public
	 * @param	string	the table name
	 * @return	bool
	 */
	CI_DB_utility.repair_table = function ($table_name) {
		var $sql = this._repair_table($table_name);
		
		if (PHP.is_bool($sql)) {
			return $sql;
		}
	
		var $query = this.$db.query($sql);
		
		// Note: Due to a bug in current() that affects some versions
		// of PHP we can not pass function call directly into it
		$res = $query.result_array();
		return PHP.current($res);
	},
	
	// --------------------------------------------------------------------

	/**
	 * Generate CSV from a query result object
	 *
	 * @access	public
	 * @param	object	The query result object
	 * @param	string	The delimiter - comma by default
	 * @param	string	The newline character - \n by default
	 * @param	string	The enclosure - double quote by default
	 * @return	string
	 */
	CI_DB_utility.csv_from_result = function ($query, $delim, $newline, $enclosure) {
		$delim = $delim || ',';
		$newline = $newline || "\n";
		$enclosure = $enclosure || '"';

		if ( ! PHP.is_object($query) || ! PHP.method_exists($query, 'list_fields')) {
			CI_Common.show_error('You must submit a valid result object');
			return;
		}	
	
		var $out = '';
		
		// First generate the headings from the table column names
		for(var $name in $query.list_fields()) {
			$out += $enclosure + PHP.str_replace($enclosure, $enclosure + $enclosure, $name) + $enclosure + $delim;
		}
		
		$out = PHP.rtrim($out);
		$out += $newline;
		
		// Next blast through the result array and build out the rows
		for(var $row in $query.result_array()) {
			for(var $item in $row) {
				$out += $enclosure + PHP.str_replace($enclosure, $enclosure + $enclosure, $item) + $enclosure + $delim;			
			}
			
			$out = PHP.rtrim($out);
			$out += $newline;
		}

		return $out;
	},
	
	// --------------------------------------------------------------------

	/**
	 * Generate XML data from a query result object
	 *
	 * @access	public
	 * @param	object	The query result object
	 * @param	array	Any preferences
	 * @return	string
	 */
	CI_DB_utility.xml_from_result = function ($query, $params) {
		$params = $params || [];
		
		if ( ! PHP.is_object($query) || ! PHP.method_exists($query, 'list_fields')) {
			CI_Common.show_error('You must submit a valid result object');
			return;
		}
		
		var $defaults = {'root': 'root', 'element': 'element', 'newline': "\n", 'tab': "\t"};
		
		// Set our default values
		for(var $key in $defaults) {
			if ( ! $params[$key]) {
				$params[$key] = $defaults[$key];
			}
		}
		
		// Create variables for convenience
		PHP.extract($params);
			
		// Load the xml helper
		CI.load.helper('xml');

		// Generate the result
		$xml = "<{$root}>" + $newline;
		
		for(var $row in $query->result_array()) {
			$xml += $tab + "<{$element}>" + $newline;
			
			for(var $val in $row) {
				$xml += $tab + $tab + "<{$key}>" + xml_convert($val) + "</{$key}>" + $newline;
			}
			
			$xml += $tab + "</{$element}>" + $newline;
		}
		$xml += "</$root>" + $newline;
		
		return $xml;
	},

	// --------------------------------------------------------------------

	/**
	 * Database Backup
	 *
	 * @access	public
	 * @return	void
	 */
	CI_DB_utility.backup = function ($params) {
		$params = $params || [];
		
		// If the parameters have not been submitted as an
		// array then we know that it is simply the table
		// name, which is a valid short cut.
		if (PHP.is_string($params)) {
			$params = {'tables': $params};
		}
		
		// ------------------------------------------------------
	
		// Set up our default preferences
		var $prefs = {
			'tables': [],
			'ignore': [],
			'filename': '',
			'format': 'gzip', // gzip, zip, txt
			'add_drop': true,
			'add_insert': true,
			'newline': "\n"
		];

		// Did the user submit any preferences? If so set them....
		if (PHP.count($params) > 0) {
			for(var $key in $prefs) {
				if ($params[$key]) {
					$prefs[$key] = $params[$key];
				}
			}
		}

		// ------------------------------------------------------

		// Are we backing up a complete database or individual tables?	
		// If no table names were submitted we'll fetch the entire table list
		if (PHP.count($prefs.tables) == 0) {
			$prefs.tables = this.$db.list_tables();
		}
		
		// ------------------------------------------------------

		// Validate the format
		if ( ! PHP.in_array($prefs.format, ['gzip', 'zip', 'txt'], true)) {
			$prefs.format = 'txt';
		}

		// ------------------------------------------------------

		// Is the encoder supported?  If not, we'll either issue an
		// error or use plain text depending on the debug settings
		if (($prefs.format == 'gzip' && ! PHP.function_exists('gzencode')) || ($prefs.format == 'zip' && ! PHP.function_exists('gzcompress'))) {
			if (this.$db.db_debug) {
				return this.$db.display_error('db_unsuported_compression');
			}
		
			$prefs.format = 'txt';
		}

		// ------------------------------------------------------

		// Set the filename if not provided - Only needed with Zip files
		if ($prefs.filename == '' && $prefs.format == 'zip') {
			$prefs.filename = (PHP.count($prefs.tables) == 1) ? $prefs.tables : $db.database;
			$prefs.filename += '_' + PHP.date('Y-m-d_H-i', PHP.time());
		}

		// ------------------------------------------------------
				
		// Was a Gzip file requested?
		if ($prefs.format == 'gzip') {
			return PHP.gzencode(this._backup($prefs));
		}

		// ------------------------------------------------------
		
		// Was a text file requested?
		if ($prefs.format == 'txt') {
			return this._backup($prefs);
		}

		// ------------------------------------------------------

		// Was a Zip file requested?		
		if ($prefs.format == 'zip') {
			// If they included the .zip file extension we'll remove it
			if (PHP.preg_match("|.+?\.zip$|", $prefs.filename)) {
				$prefs.filename = PHP.str_replace('.zip', '', $prefs.filename);
			}
			
			// Tack on the ".sql" file extension if needed
			if ( ! PHP.preg_match("|.+?\.sql$|", $prefs.filename)) {
				$prefs.filename += '.sql';
			}

			// Load the Zip class and output it
			
			CI.load.library('zip');
			CI.zip.add_data($prefs.filename, this._backup($prefs));							
			return CI.zip.get_zip();
		}
		
	}
	
	modules.exports = CI_DB_utility;
})();


/* End of file DB_utility.php */
/* Location: ./system/database/DB_utility.php */