(function() {
	/**
	* Determines if the current version of PHP is greater then the supplied value
	*
	* Since there are a few places where we conditionally test for PHP > 5
	* we'll set a static variable.
	*
	* @access	public
	* @param	string
	* @return	bool
	*/
	var CI_Common = new function CI_Common() {
		// ------------------------------------------------------------------------
		
		/**
		 * Tests for file writability
		 *
		 * is_writable() returns TRUE on Windows servers when you really can't write to 
		 * the file, based on the read-only attribute.  is_writable() is also unreliable
		 * on Unix servers if safe_mode is on. 
		 *
		 * @access	private
		 * @return	void
		 */
		CI_Common.is_really_writable = function($file) {	
			// If we're on a Unix server with safe_mode off we call is_writable
			if (PHP.DIRECTORY_SEPARATOR == '/' || PHP.ini_get('safe_mode') == false) {
				return PHP.is_writable($file);
			}
		
			// For windows servers and safe_mode "on" installations we'll actually
			// write a file then read it.  Bah...
			if (PHP.is_dir($file)) {
				$file = PHP.rtrim($file, '/') + '/' + PHP.md5(PHP.rand(1,100));
		
				if (($fp = PHP.fopen($file, PHP.constant('FOPEN_WRITE_CREATE'))) == false) {
					return false;
				}
		
				PHP.fclose($fp);
				
				PHP.chmod($file, PHP.constant('DIR_WRITE_MODE'));
				PHP.unlink($file);
				
				return true;
			} else if (($fp = PHP.fopen($file, PHP.constant('FOPEN_WRITE_CREATE'))) == false) {
				return false;
			}
		
			PHP.fclose($fp);
			
			return true;
		}
		
		// ------------------------------------------------------------------------
		
		/**
		* Class registry
		*
		* This function acts as a singleton.  If the requested class does not
		* exist it is instantiated and set to a static variable.  If it has
		* previously been instantiated the variable is returned.
		*
		* @access	public
		* @param	string	the class name being requested
		* @param	bool	optional flag that lets classes get loaded but not instantiated
		* @return	object
		*/
		CI_Common.load_class = function($class, $instantiate) {
			var $objects = [];
		
			// Does the class exist?  If so, we're done...
			if (PHP.isset($objects[$class])) {
				return $objects[$class];
			}
		
			// If the requested class does not exist in the application/libraries
			// folder we'll load the native class from the system/libraries folder.	
			if (PHP.file_exists(PHP.constant('APPPATH') + 'libraries/' + this.config_item('subclass_prefix') + $class + PHP.constant('EXT'))) {
				var $c = require(PHP.constant('BASEPATH') + 'libraries/' + $class + PHP.constant('EXT'));
				var $sc = require(PHP.constant('APPPATH') + 'libraries/' + this.config_item('subclass_prefix') + $class + PHP.constant('EXT'));
				$is_subclass = true;
			} else {
				if (PHP.file_exists(PHP.constant('APPPATH') + 'libraries/' + $class + PHP.constant('EXT'))) {
					var $c = require(PHP.constant('APPPATH') + 'libraries/' + $class + PHP.constant('EXT'));
					$is_subclass = false;
				} else {
					var $c = require(PHP.constant('BASEPATH') + 'libraries/' + $class + PHP.constant('EXT'));
					$is_subclass = false;
				}
				
			}
		
			if ($instantiate == false) {
				$objects[$class] = true;
				return $objects[$class];
			}
		
			if($is_subclass == true) {
				$name = this.config_item('subclass_prefix') + $class;
		
				$objects[$class] = this.instantiate_class($sc);
				
				return $objects[$class];
			}
		
			$name = ($class != 'Controller') ? 'CI_' + $class : $class;
		
			$objects[$class] = this.instantiate_class($c);
			
			return $objects[$class];
		}
		
		/**
		 * Instantiate Class
		 *
		 * Returns a new class object by reference, used by load_class() and the DB class.
		 * Required to retain PHP 4 compatibility and also not make PHP 5.3 cry.
		 *
		 * Use: $obj =& instantiate_class(new Foo());
		 * 
		 * @access	public
		 * @param	object
		 * @return	object
		 */
		CI_Common.instantiate_class = function($class_object) {
			return $class_object;
		}
		
		/**
		* Loads the main config.php file
		*
		* @access	private
		* @return	array
		*/
		CI_Common.get_config = function() {
			var $main_conf = [];
		
			if ($main_conf.length == 0) {
				if (!PHP.file_exists(PHP.constant('APPPATH') + 'config/config' + PHP.constant('EXT'))) {
					PHP.exit('The configuration file config' + PHP.constant('EXT') + ' does not exist.');
				}
		
				var $config = require(PHP.constant('APPPATH') + 'config/config' + PHP.constant('EXT'));
		
				if (!$config || !PHP.is_array($config)) {
					PHP.exit('Your config file does not appear to be formatted correctly.');
				}
		
				$main_conf[0] = $config;
			}
			
			return $main_conf[0];
		}
		
		/**
		* Gets a config item
		*
		* @access	public
		* @return	mixed
		*/
		CI_Common.config_item = function($item) {
			var $config_item = [];
		
			if (!PHP.isset($config_item[$item])) {
				$config = this.get_config();
				
				if (!$config[$item]) {
					return false;
				}
				
				$config_item[$item] = $config[$item];
			}
		
			return $config_item[$item];
		}
		
		
		/**
		* Error Handler
		*
		* This function lets us invoke the exception class and
		* display errors using the standard error template located
		* in application/errors/errors.php
		* This function will send the error page directly to the
		* browser and exit.
		*
		* @access	public
		* @return	void
		*/
		CI_Common.show_error = function($message, $status_code) {
			$error = this.load_class('Exceptions');
			$error.__construct();
			
			PHP.echo($error.show_error('An Error Was Encountered', $message, 'error_general', $status_code));
			PHP.exit();
		}
		
		
		/**
		* 404 Page Handler
		*
		* This function is similar to the show_error() function above
		* However, instead of the standard error template it displays
		* 404 errors.
		*
		* @access	public
		* @return	void
		*/
		CI_Common.show_404 = function($page) {
			$error = this.load_class('Exceptions');
			$error.__construct();
			
			$error.show_404($page);
			PHP.exit();
		}
		
		/**
		* Error Logging Interface
		*
		* We use this as a simple mechanism to access the logging
		* class and send messages to be logged.
		*
		* @access	public
		* @return	void
		*/
		CI_Common.log_message = function($level, $message, $php_error) {
			$config = this.get_config();
			
			if ($config['log_threshold'] == 0) {
				return;
			}
		
			$LOG = this.load_class('Log');
			$LOG.__construct();
			$LOG.write_log($level, $message, $php_error);
		}
		
		/**
		 * Set HTTP Status Header
		 *
		 * @access	public
		 * @param	int 	the status code
		 * @param	string	
		 * @return	void
		 */
		CI_Common.set_status_header = function($code, $text) {
			$stati = {
				200: 'OK',
				201: 'Created',
				202: 'Accepted',
				203: 'Non-Authoritative Information',
				204: 'No Content',
				205: 'Reset Content',
				206: 'Partial Content',
		
				300: 'Multiple Choices',
				301: 'Moved Permanently',
				302: 'Found',
				304: 'Not Modified',
				305: 'Use Proxy',
				307: 'Temporary Redirect',
		
				400: 'Bad Request',
				401: 'Unauthorized',
				403: 'Forbidden',
				404: 'Not Found',
				405: 'Method Not Allowed',
				406: 'Not Acceptable',
				407: 'Proxy Authentication Required',
				408: 'Request Timeout',
				409: 'Conflict',
				410: 'Gone',
				411: 'Length Required',
				412: 'Precondition Failed',
				413: 'Request Entity Too Large',
				414: 'Request-URI Too Long',
				415: 'Unsupported Media Type',
				416: 'Requested Range Not Satisfiable',
				417: 'Expectation Failed',
		
				500: 'Internal Server Error',
				501: 'Not Implemented',
				502: 'Bad Gateway',
				503: 'Service Unavailable',
				504: 'Gateway Timeout',
				505: 'HTTP Version Not Supported'
			}

			if ($code == '' || !PHP.is_numeric($code)) {
				this.show_error('Status codes must be numeric', 500);
			}
		
			if ($stati[$code] && $text == '') {				
				$text = $stati[$code];
			}
			
			if($text == '') {
				this.show_error('No status text available.  Please check your status code number or supply your own message text.', 500);
			}
			
			$server_protocol = (PHP.$_SERVER['SERVER_PROTOCOL']) ? PHP.$_SERVER['SERVER_PROTOCOL'] : false;
		
			if (PHP.substr(PHP.php_sapi_name(), 0, 3) == 'cgi') {
				PHP.header("Status: " + $code + " " + $text, true);
			} else if ($server_protocol == 'HTTP/1.1' || $server_protocol == 'HTTP/1.0') {
				PHP.header($server_protocol + " " + $code + " " + $text, true, $code);
			} else {
				PHP.headr("HTTP/1.1 " + $code + " " + $text, true, $code);
			}
		}
		
		
		/**
		* Exception Handler
		*
		* This is the custom exception handler that is declaired at the top
		* of Codeigniter.php.  The main reason we use this is permit
		* PHP errors to be logged in our own log files since we may
		* not have access to server logs. Since this function
		* effectively intercepts PHP errors, however, we also need
		* to display errors based on the current error_reporting level.
		* We do that with the use of a PHP error template.
		*
		* @access	private
		* @return	void
		*/
		this._exception_handler = function($severity, $message, $filepath, $line) {	
			 // We don't bother with "strict" notices since they will fill up
			 // the log file with information that isn't normally very
			 // helpful.  For example, if you are running PHP 5 and you
			 // use version 4 style class functions (without prefixes
			 // like "public", "private", etc.) you'll get notices telling
			 // you that these have been deprecated.
			
			if ($severity == PHP.E_STRICT) {
				return;
			}
		
			var CI_Exceptions = this.load_class('Exceptions');
			CI_Exceptions.__construct();
		
			// Should we display the error?
			// We'll get the current error_reporting level and add its bits
			// with the severity bits to find out.
			
			if (($severity & PHP.error_reporting()) == $severity) {
				CI_Exceptions.show_php_error($severity, $message, $filepath, $line);
			}
			
			// Should we log the error?  No?  We're done...
			$config = this.get_config();
			
			if ($config['log_threshold'] == 0) {
				return;
			}
		
			//$error->log_exception($severity, $message, $filepath, $line);
		}
		
		return CI_Common;
	}
	
	module.exports = CI_Common;
})();