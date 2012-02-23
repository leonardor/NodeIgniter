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
 * CodeIgniter Hooks Class
 *
 * Provides a mechanism to extend the base system without hacking.  Most of
 * this class is borrowed from Paul's Extension class in ExpressionEngine.
 *
 * @package		CodeIgniter
 * @subpackage	Libraries
 * @category	Libraries
 * @author		ExpressionEngine Dev Team
 * @link		http://codeigniter.com/user_guide/libraries/encryption.html
 */
	function CI_Hooks() {
		var $enabled 		= false;
		var $hooks   		= [];
		var $in_progress	= false;
	
		/**
		 * Constructor
		 *
		 */
		this.__construct = function() {
			this._initialize();
			CI_Common.log_message('debug', "Hooks Class Initialized");
		}
	  
		// --------------------------------------------------------------------
	
		/**
		 * Initialize the Hooks Preferences
		 *
		 * @access	private
		 * @return	void
		 */  
		this._initialize = function() {
			// If hooks are not enabled in the config file
			// there is nothing else to do
	
			if (CI_Common.config_item('enable_hooks') == false) {
				return;
			}
	
			// Grab the "hooks" definition file.
			// If there are no hooks, we're done.
	
			var $hook = require(PHP.constant('APPPATH') + 'config/hooks' + PHP.constant('EXT'));
	
			if ( ! $hook || ! PHP.is_array($hook)) {
				return;
			}
	
			$hooks = $hook;
			$enabled = true;
	  	}
	  
		// --------------------------------------------------------------------
	
		/**
		 * Call Hook
		 *
		 * Calls a particular hook
		 *
		 * @access	private
		 * @param	string	the hook name
		 * @return	mixed
		 */
		this._call_hook = function($which) {
			if ( ! $enabled || ! PHP.isset($hooks[$which])) {
				return false;
			}
	
			if ($hooks[$which][0] && PHP.is_array($hooks[$which][0])) {
				for($val in hooks[$which]) {
					this._run_hook($hooks[$which]);
				}
			} else {
				this._run_hook($hooks[$which]);
			}
	
			return true;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Run Hook
		 *
		 * Runs a particular hook
		 *
		 * @access	private
		 * @param	array	the hook details
		 * @return	bool
		 */
		this._run_hook = function($data) {
			if ( ! PHP.is_array($data)) {
				return false;
			}
	
			// -----------------------------------
			// Safety - Prevents run-away loops
			// -----------------------------------
	
			// If the script being called happens to have the same
			// hook call within it a loop can happen
	
			if ($in_progress == true) {
				return;
			}
	
			// -----------------------------------
			// Set file path
			// -----------------------------------
	
			if ( ! $data['filepath'] || ! $data['filename']) {
				return false;
			}
	
			$filepath = PHP.constant('APPPATH') + $data['filepath'] + '/' + $data['filename'];
	
			if ( ! PHP.file_exists($filepath)) {
				return false;
			}
	
			// -----------------------------------
			// Set class/function name
			// -----------------------------------
	
			$class		= false;
			$function	= false;
			$params		= '';
	
			if ($data['class'] && $data['class'] != '') {
				$class = $data['class'];
			}
	
			if ($data['function']) {
				$function = $data['function'];
			}
	
			if ($data['params']) {
				$params = $data['params'];
			}
	
			if ($class == false && $function == false) {
				return false;
			}
	
			// -----------------------------------
			// Set the in_progress flag
			// -----------------------------------
	
			$in_progress = true;
	
			// -----------------------------------
			// Call the requested class and/or function
			// -----------------------------------
	
			if ($class != false) {
				if ( ! PHP.class_exists($class)) {
					var $hook = require($filepath);
				}
	
				PHP.call_user_func_array([$hook, $function], $params);
			} else {
				if ( ! PHP.function_exists($function)) {
					require($filepath);
				}
	
				$function($params);
			}
	
			$in_progress = false;
			return true;
		}

		return this;
	}

	module.exports = CI_Hooks;
})();
// END CI_Hooks class

/* End of file Hooks.php */
/* Location: ./system/libraries/Hooks.php */