(function() {
/**
 * CodeIgniter
 *
 * An open source application development framework for PHP 4.3.2 or newer
 *
 * @package		CodeIgniter
 * @author		ExpressionEngine Dev Team
 * @copyright	Copyright (c) 2008, EllisLab, Inc.
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
	
	var DB = function($params, $active_record_override) {
		$params = $params || '';
		$active_record_override = $active_record_override || false;
	
		// Load the DB config file if a DSN string wasn't passed
		if (PHP.is_string($params) && PHP.strpos($params, '://') === false) {
			var $database = require(PHP.constant('APPPATH') + 'config/database' + PHP.constant('EXT'));
			
			if ( !$database ||PHP.count($database) == 0) {
				CI_Common.show_error('No database connection settings were found in the database config file.', 500);
				PHP.exit('No database connection settings were found in the database config file.', 500);
			}

			if($params != '') {
				$active_group = $params;
			} else {
				$active_group = $database.active_group;
			}

			if ( ! $active_group || ! $database.db[$active_group]) {
				CI_Common.show_error('You have specified an invalid database connection group.', 500);
				PHP.exit('You have specified an invalid database connection group.', 500);
			}
			
			$params = $database.db[$active_group];
		} else if (PHP.is_string($params)) {
			
			/* parse the URL from the DSN string
			*  Database settings can be passed as discreet
		 	*  parameters or as a data source name in the first
		 	*  parameter. DSNs must have this prototype:
		 	*  $dsn = 'driver://username:password@hostname/database';
			*/
		
			if ((PHP.dns = PHP.parse_url($params)) === false) {
				CI_Common.show_error('Invalid DB Connection String', 500);
				PHP.exit('Invalid DB Connection String', 500);
			}
			
			this.$params = {
						'dbdriver': $database.dns['scheme'],
						'hostname': ($database.dns['host']) ? rawurldecode(database.dns['host']) : '',
						'port': ($database.dns['port']) ? rawurldecode(database.dns['port']) : '',
						'username': ($database.dns['user']) ? rawurldecode(database.dns['user']) : '',
						'password': ($database.dns['pass']) ? rawurldecode(database.dns['pass']) : '',
						'database': ($database.dns['path']) ? rawurldecode(substr(database.dns['path'], 1)) : ''
			};
			
			// were additional config items set?
			if ($database.dns['query']) {
				PHP.parse_str($database.dns['query'], $database.extra);
	
				for(var $key in $database.extra) {
					// booleans please
					if (strtoupper($database.extra[$key]) == "TRUE") {
						$database.extra[$key] = true;
					} else if (strtoupper($database.extra[$key]) == "FALSE") {
						$database.extra[$key] = false;
					}
	
					$params[$key] = $database.extra[$key];
				}
			}
		}
		
		// No DB specified yet?  Beat them senseless...
		if ( !$params.dbdriver || $params.dbdriver == '') {
			CI_Common.show_error('You have not selected a database type to connect to.', 500);
			PHP.exit('You have not selected a database type to connect to.', 500);
		}
	
		// Load the DB classes.  Note: Since the active record class is optional
		// we need to dynamically create a class that extends proper parent class
		// based on whether we're using the active record class or not.
		// Kudos to Paul for discovering this clever use of eval()
		
		if ($active_record_override == true) {
			$active_record = true;
		} else {
			$active_record = $database.active_record;
		}
		
		CI_DB_driver = require(PHP.constant('BASEPATH') + 'database/db_driver' + PHP.constant('EXT'));
		
		var $driver = require(PHP.constant('BASEPATH') + 'database/drivers/' + $params.dbdriver + '/' + $params.dbdriver + '_driver' + PHP.constant('EXT'));

		var $db = $driver.__construct($params);
		
		if($db.$autoinit == true) {
			$db.initialize();
		}
		
		return $db;
	}
	
	module.exports = DB;
})();
/* End of file DB.php */
/* Location: ./system/database/DB.php */