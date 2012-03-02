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
 * Exceptions Class
 *
 * @package		CodeIgniter
 * @subpackage	Libraries
 * @category	Exceptions
 * @author		ExpressionEngine Dev Team
 * @link		http://codeigniter.com/user_guide/libraries/exceptions.html
 */
	var CI_Exceptions = {};
	
	CI_Exceptions = Object.create(Events.EventEmitter.prototype);
	
	CI_Exceptions.parent = Events.EventEmitter.prototype;
	CI_Exceptions.name = 'CI_Exceptions';
	
	CI_Exceptions.$action = '';
	CI_Exceptions.$severity = '';
	CI_Exceptions.$message = '';
	CI_Exceptions.$filename = '';
	CI_Exceptions.$line = '';
	CI_Exceptions.$ob_level = '';
	
	CI_Exceptions.$levels = {
		E_ERROR:	'Error',
		E_WARNING:	'Warning',
		E_PARSE:	'Parsing Error',
		E_NOTICE:	'Notice',
		E_CORE_ERROR:	'Core Error',
		E_CORE_WARNING:	'Core Warning',
		E_COMPILE_ERROR:	'Compile Error',
		E_COMPILE_WARNING:	'Compile Warning',
		E_USER_ERROR:	'User Error',
		E_USER_WARNING:	'User Warning',
		E_USER_NOTICE:	'User Notice',
		E_STRICT:	'Runtime Notice'
	};
	
	/**
	 * Constructor
	 *
	 */	
	CI_Exceptions.__construct = function() {
		this.$ob_level = PHP.ob_get_level();
		// Note:  Do not log messages from this constructor.
		return this;
	}
	
	CI_Exceptions.__load = function(random) {
		console.log('emitting ' + this.name + '.__load event... (' + random + ')');
		this.emit('__load', this);
		
		return this;
	}
	  	
	// --------------------------------------------------------------------

	/**
	 * Exception Logger
	 *
	 * This function logs PHP generated error messages
	 *
	 * @access	private
	 * @param	string	the error severity
	 * @param	string	the error string
	 * @param	string	the error filepath
	 * @param	string	the error line number
	 * @return	string
	 */
	CI_Exceptions.log_exception = function($severity, $message, $filepath, $line) {	
		this.$severity = ( !this.$levels[$severity]) ? $severity : this.$levels[$severity];
		
		CI_Common.log_message('error', 'Severity: ' + $severity + '  --> ' + $message +  ' ' + $filepath + ' ' + $line, true);
	}
	
	// --------------------------------------------------------------------

	/**
	 * 404 Page Not Found Handler
	 *
	 * @access	private
	 * @param	string
	 * @return	string
	 */
	CI_Exceptions.show_404 = function($page) {	
		$page = $page || '';
			
		var $heading = "404 Page Not Found";
		var $message = "The page you requested was not found.";

		CI_Common.log_message('error', '404 Page Not Found --> ' + $page);
		
		return this.show_error($heading, $message, 'error_404', 404);
	}
	  	
	// --------------------------------------------------------------------

	/**
	 * General Error Page
	 *
	 * This function takes an error message as input
	 * (either as a string or an array) and displays
	 * it using the specified template.
	 *
	 * @access	private
	 * @param	string	the heading
	 * @param	string	the message
	 * @param	string	the template name
	 * @return	string
	 */
	CI_Exceptions.show_error = function($heading, $message, $template, $status_code) {
		$template = $template || 'error_general';
		$status_code = $status_code || 500;

		CI_Common.set_status_header($status_code, $message);

		$message = '<p>' + PHP.implode('</p><p>', ( ! PHP.is_array($message)) ? $message : $message) + '</p>';

		var file = PHP.constant('APPPATH') + 'errors/' + $template + '.html';

		var html = CI_View.load(file, { message: $message, heading: $heading }, true);

		return html;
	}
	
	// --------------------------------------------------------------------

	/**
	 * Native PHP error handler
	 *
	 * @access	private
	 * @param	string	the error severity
	 * @param	string	the error string
	 * @param	string	the error filepath
	 * @param	string	the error line number
	 * @return	string
	 */
	CI_Exceptions.show_php_error = function($severity, $message, $filepath, $line) {	
		$severity = (! this.$levels[$severity]) ? $severity : this.$levels[$severity];
	
		$filepath = PHP.str_replace("\\", "/", $filepath);
		
		// For safety reasons we do not show the full file path
		if (false !== PHP.strpos($filepath, '/')) {
			var $x = PHP.explode('/', $filepath);
			$filepath = $x[PHP.count($x)-2] + '/' + PHP.end($x);
		}

		var file = PHP.constant('APPPATH') + 'errors/error_php.html';
		
		var html = CI_View.load(file, { severity: $severity, message: $message, filepath: $filepath, line: $line }, true);
		
		return html;
	}

	module.exports = CI_Exceptions;
})();
// END Exceptions Class

/* End of file Exceptions.php */
/* Location: ./system/libraries/Exceptions.php */