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
 * CodeIgniter Config Class
 *
 * This class contains functions that enable config files to be managed
 *
 * @package		CodeIgniter
 * @subpackage	Libraries
 * @category	Libraries
 * @author		ExpressionEngine Dev Team
 * @link		http://codeigniter.com/user_guide/libraries/config.html
 */
	function CI_Config() {
		var $config = {};
		var $is_loaded = [];

		/**
		 * Constructor
		 *
		 * Sets the $config data from the primary config.php file as a class variable
		 *
		 * @access   public
		 * @param   string	the config file name
		 * @param   boolean  if configuration values should be loaded into their own section
		 * @param   boolean  true if errors should just return false, false if an error message should be displayed
		 * @return  boolean  if the file was successfully loaded or not
		 */
		this.__construct = function() {
			$config = CI_Common.get_config();
			CI_Common.log_message('debug', "Config Class Initialized");
		}
	  	
		// --------------------------------------------------------------------
	
		/**
		 * Load Config File
		 *
		 * @access	public
		 * @param	string	the config file name
		 * @return	boolean	if the file was loaded correctly
		 */	
		this.load = function($file, $use_sections, $fail_gracefully) {
			$file = $file || '';
			$use_sections = $use_sections || false;
			$fail_gracefully = $fail_gracefully || false;
			
			var $file = ($file == '') ? 'config' : PHP.str_replace(PHP.constant('EXT'), '', $file);
		
			if(PHP.in_array($file, $is_loaded, true)) {
				return true;
			}
	
			if ( ! PHP.file_exists(PHP.constant('APPPATH') + 'config/' + $file + PHP.constant('EXT'))) {
				if ($fail_gracefully === true) {
					return false;
				}
				CI_Common.show_error('The configuration file ' + $file + PHP.constant('EXT') + ' does not exist.');
				return;
			}
		
			var $cfg = require(PHP.constant('APPPATH') + 'config/' + $file + PHP.constant('EXT'));
	
			if ( ! $cfg || ! PHP.is_array($cfg)) {
				if ($fail_gracefully === true) {
					return false;
				}
				CI_Common.show_error('Your ' + $file + PHP.constant('EXT') + ' file does not appear to contain a valid configuration array.');
				return;
			}
	
			if ($use_sections === true) {
				if ($config[$file]) {
					$config[$file] = PHP.array_merge($config[$file], $cfg);
				} else {
					$config[$file] = $cfg;
				}
			} else {
				$config = PHP.array_merge($config, $cfg);
			}
	
			$is_loaded.push($file);
			PHP.unset($cfg);
	
			CI_Common.log_message('debug', 'Config file loaded: config/' + $file + PHP.constant('EXT'));
			return true;
		}
	  	
		// --------------------------------------------------------------------
	
		/**
		 * Fetch a config file item
		 *
		 *
		 * @access	public
		 * @param	string	the config item name
		 * @param	string	the index name
		 * @param	bool
		 * @return	string
		 */
		this.item = function($item, $index) {	
			$index = $index || '';
			
			if ($index == '') {	
				if ( ! $config[$item]) {
					return false;
				}
	
				var $pref = $config[$item];
			} else {
				if ( !$config[$index]) {
					return false;
				}
	
				if ( ! $config[$index][$item]) {
					return false;
				}
	
				var $pref = $config[$index][$item];
			}
			
			return $pref;
		}
	  	
	  	// --------------------------------------------------------------------
	
		/**
		 * Fetch a config file item - adds slash after item
		 *
		 * The second parameter allows a slash to be added to the end of
		 * the item, in the case of a path.
		 *
		 * @access	public
		 * @param	string	the config item name
		 * @param	bool
		 * @return	string
		 */
		this.slash_item = function($item) {
			if ( ! $config[$item]) {
				return false;
			}
	
			var $pref = $config[$item];
	
			if ($pref != '' && PHP.substr($pref, -1) != '/') {	
				$pref += '/';
			}
	
			return $pref;
		}
	  	
		// --------------------------------------------------------------------
	
		/**
		 * Site URL
		 *
		 * @access	public
		 * @param	string	the URI string
		 * @return	string
		 */
		this.site_url = function($uri) {
			$uri = $uri || '';
			
			if (PHP.is_array($uri)) {
				$uri = PHP.implode('/', $uri);
			}
	
			if ($uri == '') {
				return this.slash_item('base_url') + this.item('index_page');
			} else {
				var $suffix = (this.item('url_suffix') == false) ? '' : this.item('url_suffix');
				return this.slash_item('base_url') + $this.slash_item('index_page') + PHP.trim($uri, '/') + $suffix; 
			}
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * System URL
		 *
		 * @access	public
		 * @return	string
		 */
		this.system_url = function() {
			var $x = PHP.explode("/", PHP.preg_replace("|/*(.+?)/*$|", "\\1", PHP.constant('BASEPATH')));
			return this.slash_item('base_url') + PHP.end($x) + '/';
		}
	  	
		// --------------------------------------------------------------------
	
		/**
		 * Set a config file item
		 *
		 * @access	public
		 * @param	string	the config item key
		 * @param	string	the config item value
		 * @return	void
		 */
		this.set_item = function($item, $value) {
			$config[$item] = $value;
		}

		return this;
	}

	module.exports = CI_Config;
})();
// END CI_Config class

/* End of file Config.php */
/* Location: ./system/libraries/Config.php */