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
 * Initialize the database
 *
 * @category	Database
 * @author		ExpressionEngine Dev Team
 * @link		http://codeigniter.com/user_guide/database/
 */
	var DB = new function DB($params, $active_record_override) {
		$params = $params || '';
		$active_record_override = $active_record_override || false;
		
		// Load the DB config file if a DSN string wasn't passed
		if (PHP.is_string($params) && PHP.strpos($params, '://') === false) {
			var $database = require(PHP.constant('APPPATH') + 'config/database' + PHP.constant('EXT'));
			
			if ( ! $database || PHP.count($database) == 0) {
				CI_Common.show_error('No database connection settings were found in the database config file.');
				return;
			}
			
			if ($params != '') {
				$active_group = $params;
			}
			
			if ( !$active_group || ! $database[$active_group]){
				CI_Common.show_error('You have specified an invalid database connection group.');
				return;
			}
			
			$params = $database[$active_group];
		} else if (PHP.is_string($params)) {
			/* parse the URL from the DSN string
			*  Database settings can be passed as discreet
		 	*  parameters or as a data source name in the first
		 	*  parameter. DSNs must have this prototype:
		 	*  $dsn = 'driver://username:password@hostname/database';
			*/
		
			if (($database.dns = PHP.parse_url($params)) === false) {
				CI_Common.show_error('Invalid DB Connection String');
				return;
			}
			
			$params = {
				'dbdriver': $database.dns['scheme'],
				'hostname': ($database.dns['host']) ? PHP.rawurldecode($database.dns['host']) : '',
				'port': ($database.dns['port']) ? PHP.rawurldecode($database.dns['port']) : '',
				'username': ($database.dns['user']) ? PHP.rawurldecode($database.dns['user']) : '',
				'password': ($database.dns['pass']) ? PHP.rawurldecode($database.dns['pass']) : '',
				'database': ($database.dns['path']) ? PHP.rawurldecode(PHP.substr($database.dns['path'], 1)) : ''
			}
			
			// were additional config items set?
			if ($database.dns['query']) {
				PHP.parse_str($database.dns['query'], $database.extra);
	
				for(var $val in $database.extra) {
					// booleans please
					if (PHP.strtoupper($database.extra[$val]) == "TRUE") {
						$database.extra[$val] = true;
					} else if (PHP.strtoupper($database.extra[$val]) == "FALSE") {
						$database.extra[$val] = false;
					}
	
					$params[$val] = $database.extra[$val];
				}
			}
		}

		// No DB specified yet?  Beat them senseless...
		if ( !$params.dbdriver || $params.dbdriver == '') {
			CI_Common.show_error('You have not selected a database type to connect to.');
			return;
		}
	
		// Load the DB classes.  Note: Since the active record class is optional
		// we need to dynamically create a class that extends proper parent class
		// based on whether we're using the active record class or not.
		// Kudos to Paul for discovering this clever use of eval()
		
		if ($active_record_override == true) {
			$active_record = true;
		}
		
		CI_DB_driver = require(PHP.constant('BASEPATH') + 'database/DB_driver' + PHP.constant('EXT'));
	
		if ( !$active_record || $active_record == true) {
			CI_DB_active_record = require(PHP.constant('BASEPATH') + 'database/DB_active_rec' + PHP.constant('EXT'));
			
			if ( !global.CI_DB) {
				Util.inherits(DB, CI_DB_active_record);
			}
		} else {
			if ( !CI_DB) {
				Util.inherits(DB, CI_DB_driver);
			}
		}
				
		var $driver = require(PHP.constant('BASEPATH') + 'database/drivers/' + $params['dbdriver'] + '/' + $params['dbdriver'] + '_driver' + PHP.constant('EXT'));
	
		// Instantiate the DB adapter
		var $db = $driver($params);
		
		if($db.$autoinit == true) {
			$db.initialize();
		}
		
		return $db;
	}	
	
	module.exports = DB;

})();

/* End of file DB.php */
/* Location: ./system/database/DB.php */