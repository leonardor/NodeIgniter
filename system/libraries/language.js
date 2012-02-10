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
	var CI_Language = new function CI_Language() {

		var $language	= [];
		var $is_loaded	= [];
	
		/**
		 * Constructor
		 *
		 * @access	public
		 */
		CI_Language.__construct = function() {
			CI_Common.log_message('debug', "Language Class Initialized");
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
			$langfile = PHP.str_replace(PHP.constant('EXT'), '', PHP.str_replace('_lang.', '', $langfile)) + '_lang' + PHP.constant('EXT');
	
			if (PHP.in_array($langfile, this.$is_loaded, true)) {
				return;
			}
	
			if ($idiom == '') {
				$CI = CI.get_instance();
				$deft_lang = $CI.config.item('language');
				$idiom = ($deft_lang == '') ? 'english' : $deft_lang;
			}
	
			// Determine where the language file is and load it
			if (PHP.file_exists(PHP.constant('APPPATH') + 'language/' + $idiom + '/' + $langfile)) {
				require(PHP.constant('APPPATH') + 'language/' + $idiom + '/' + $langfile);
			} else {
				if (PHP.file_exists(PHP.constant('BASEPATH') + 'language/' + $idiom + '/' + $langfile)) {
					require(PHP.constant('BASEPATH') + 'language/' + $idiom + '/' + $langfile);
				} else {
					CI_Common.show_error('Unable to load the requested language file: language/' + $idiom + '/' + $langfile);
				}
			}
	
			if ( ! PHP.isset($lang)) {
				CI_Common.log_message('error', 'Language file contains no data: language/' + $idiom + '/' + $langfile);
				return;
			}
	
			if ($return == true) {
				return $lang;
			}
	
			this.$is_loaded.push($langfile);
			this.$language = PHP.array_merge(this.$language, $lang);
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
		this.line = function($line)
		{
			$line = ($line == '' || ! PHP.isset(this.language[$line])) ? false : this.language[$line];
			return $line;
		}
	
		return CI_Language;
	}
	
	//CI_Language.prototype.constructor = CI_Language.__construct();
	
	module.exports = CI_Language;
})();
// END Language Class

/* End of file Language.php */
/* Location: ./system/libraries/Language.php */