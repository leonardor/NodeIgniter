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
 * Logging Class
 *
 * @package		CodeIgniter
 * @subpackage	Libraries
 * @category	Logging
 * @author		ExpressionEngine Dev Team
 * @link		http://codeigniter.com/user_guide/general/errors.html
 */
	function CI_Log() {
		var $log_path;
		var $_threshold	= 1;
		var $_date_fmt	= 'Y-m-d H:i:s';
		var $_enabled	= true;
		var $_levels	= {'ERROR': '1', 'DEBUG': '2',  'INFO': '3', 'ALL': '4' };

		/**
		 * Constructor
		 *
		 * @access	public
		 */
		this.__construct = function() {
			$log_path = (CI_Common.config_item('log_path') != '') ? CI_Common.config_item('log_path') : PHP.constant('BASEPATH') + 'logs/';
			
			if ( ! PHP.is_dir($log_path) || ! CI_Common.is_really_writable($log_path)) {
				$_enabled = false;
			}
			
			if (PHP.is_numeric(CI_Common.config_item('log_threshold'))) {
				$_threshold = CI_Common.config_item('log_threshold');
			}
				
			if (CI_Common.config_item('log_date_format') != '') {
				$_date_fmt = CI_Common.config_item('log_date_format');
			}
		}
		
		// --------------------------------------------------------------------
		
		/**
		 * Write Log File
		 *
		 * Generally this function will be called using the global log_message() function
		 *
		 * @access	public
		 * @param	string	the error level
		 * @param	string	the error message
		 * @param	bool	whether the error is a native PHP error
		 * @return	bool
		 */		
		this.write_log = function($level, $msg, $php_error) {		
			if ($_enabled == false) {
				return false;
			}
		
			$level = PHP.strtoupper($level);
			
			if ( ! $_levels[$level] || ($_levels[$level] > $_threshold)) {
				return false;
			}
		
			var $filepath = $log_path + 'log-' + PHP.date('Y-m-d') + PHP.constant('EXT');
			var $message  = '';
			
			if ( ! PHP.file_exists($filepath)) {
				$message += "<" + "?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed'); ?" + ">\n\n";
			}
		
			var $fp = PHP.fopen($filepath, PHP.constant('FOPEN_WRITE_CREATE'));
			
			if ( ! $fp) {
				
				return false;
			}
	
			$message += $level + ' ' + (($level == 'INFO') ? ' -' : '-') + ' ' + PHP.date($_date_fmt) + ' --> ' + $msg + "\n";
			
			PHP.flock($fp, PHP.flag('LOCK_EX'));	
			PHP.fwrite($fp, $message);
			PHP.flock($fp, PHP.flag('LOCK_UN'));
			PHP.fclose($fp);
		
			PHP.chmod($filepath, PHP.constant('FILE_WRITE_MODE')); 		
			return true;
		}
	
		return this;
	}
	
	module.exports = CI_Log;
})();
// END Log Class

/* End of file Log.php */
/* Location: ./system/libraries/Log.php */