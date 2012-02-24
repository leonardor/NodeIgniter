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
 * Language Class
 *
 * @package		CodeIgniter
 * @subpackage	Libraries
 * @category	Language
 * @author		ExpressionEngine Dev Team
 * @link		http://codeigniter.com/user_guide/libraries/language.html
 */
	function CI_Language() {
		var $language	= [];
		var $is_loaded	= [];
	
		/**
		 * Constructor
		 *
		 * @access	public
		 */
		this.__construct = function() {
			CI_Common.log_message('debug', "Language Class Initialized");
			return this;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Load a language file
		 *
		 * @access	public
		 * @param	mixed	the name of the language file to be loaded. Can be an array
		 * @param	string	the language (english, etc.)
		 * @return	mixed
		 */
		this.load = function($langfile, $idiom, $return) {
			$langfile = $langfile || '';
			$idiom = $idiom || '';
			$return = $return || false;
			
			$langfile = $langfile || '';
			$idiom = $idiom || '';
			$return = $return || false;
			
			$langfile = PHP.str_replace(PHP.constant('EXT'), '', PHP.str_replace('_lang.', '', $langfile)) + '_lang' + PHP.constant('EXT');
	
			if (PHP.in_array($langfile, $is_loaded, true)) {
				return;
			}
	
			if ($idiom == '') {
				$deft_lang = CI_Common.config_item('language');
				$idiom = ($deft_lang == '') ? 'english' : $deft_lang;
			}
	
			// Determine where the language file is and load it
			if (PHP.file_exists(PHP.constant('APPPATH') + 'language/' + $idiom + '/' + $langfile)) {
				var $lang = require(PHP.constant('APPPATH') + 'language/' + $idiom + '/' + $langfile);
			} else {
				if (PHP.file_exists(PHP.constant('BASEPATH') + 'language/' + $idiom + '/' + $langfile)) {
					var $lang = require(PHP.constant('BASEPATH') + 'language/' + $idiom + '/' + $langfile);
				} else {
					CI_Common.show_error('Unable to load the requested language file: language/' + $idiom + '/' + $langfile, 500);
					PGP.exit('Unable to load the requested language file: language/' + $idiom + '/' + $langfile, 500);
				}
			}
	
			if ( ! $lang) {
				CI_Common.log_message('error', 'Language file contains no data: language/' + $idiom + '/' + $langfile);
			}
	
			if ($return == true) {
				return $lang;
			}
	
			$is_loaded.push($langfile);
			$language = PHP.array_merge($language, $lang);
			PHP.unset($lang);
	
			CI_Common.log_message('debug', 'Language file loaded: language/' + $idiom + '/' + $langfile);
			return true;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Fetch a single line of text from the language array
		 *
		 * @access	public
		 * @param	string	$line 	the language line
		 * @return	string
		 */
		this.line = function($line) {
			$line = $line || '';
			
			$line = ($line == '' || ! $language[$line]) ? false : $language[$line];
			return $line;
		}

		return this;
	}
	
	module.exports = CI_Language;
})();
// END Language Class

/* End of file Language.php */
/* Location: ./system/libraries/Language.php */