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
	var CI_Log = {};
	
	CI_Log = Object.create(Events.EventEmitter.prototype);
	
	CI_Log.parent = Events.EventEmitter.prototype;
	CI_Log.name = 'CI_Log';
	
	CI_Log.$log_path	= '';
	CI_Log.$_threshold	= 1;
	CI_Log.$_date_fmt	= 'Y-m-d H:i:s';
	CI_Log.$_enabled	= true;
	CI_Log.$_levels		= {'ERROR': '1', 'DEBUG': '2',  'INFO': '3', 'ALL': '4' };

		/**
		 * Constructor
		 *
		 * @access	public
		 */
	CI_Log.__construct = function() {
		this.$log_path = (CI_Common.config_item('log_path') != '') ? CI_Common.config_item('log_path') : PHP.constant('BASEPATH') + 'logs/';
		
		if ( ! PHP.is_dir(this.$log_path) || ! CI_Common.is_really_writable(this.$log_path)) {
			this.$_enabled = false;
		}
		
		if (PHP.is_numeric(CI_Common.config_item('log_threshold'))) {
			this.$_threshold = CI_Common.config_item('log_threshold');
		}
			
		if (CI_Common.config_item('log_date_format') != '') {
			this.$_date_fmt = CI_Common.config_item('log_date_format');
		}
		
		return this;
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
	CI_Log.write_log = function($level, $msg, $php_error) {	
		$level = $level || 'error';
		$php_error = $php_error || false;
		
		if (this.$_enabled == false) {
			return false;
		}
	
		$level = PHP.strtoupper($level);
		
		if ( ! this.$_levels[$level] || (this.$_levels[$level] > this.$_threshold)) {
			return false;
		}
	
		var $filepath = this.$log_path + 'log-' + PHP.date('Y-m-d') + PHP.constant('EXT');
		var $message  = '';
		
		if ( ! PHP.file_exists($filepath)) {
			$message += "<" + "?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed'); ?" + ">\n\n";
		}
	
		var $fp = PHP.fopen($filepath, PHP.constant('FOPEN_WRITE_CREATE'));
		
		if ( ! $fp) {
			
			return false;
		}

		$message += $level + ' ' + (($level == 'INFO') ? ' -' : '-') + ' ' + PHP.date(this.$_date_fmt) + ' --> ' + $msg + "\n";
		
		PHP.flock($fp, PHP.flag('LOCK_EX'));	
		PHP.fwrite($fp, $message);
		PHP.flock($fp, PHP.flag('LOCK_UN'));
		PHP.fclose($fp);
	
		PHP.chmod($filepath, PHP.constant('FILE_WRITE_MODE')); 		
		return true;
	}
	
	module.exports = CI_Log;
})();
// END Log Class

/* End of file Log.php */
/* Location: ./system/libraries/Log.php */