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
	 * System Front Controller
	 *
	 * Loads the base classes and executes the request.
	 *
	 * @package		CodeIgniter
	 * @subpackage	codeigniter
	 * @category	Front-controller
	 * @author		ExpressionEngine Dev Team
	 * @link		http://codeigniter.com/user_guide/
		 */
	PHP.define('CI_VERSION', '1.0.0');
	
	var CI = new function CI(request, response) {
	    CI.__construct = function(request, response) {
	    	global.CI = this;
	    	
			// CI Version
			/*
			 * ------------------------------------------------------
			 *  Load the global functions
			 * ------------------------------------------------------
			 */
			
			CI_Common = require(PHP.constant('BASEPATH') + 'codeigniter/common' + PHP.constant('EXT'));
			CI_Common.__construct();
			
			/*
			 * ------------------------------------------------------
			 *  Load the compatibility override functions
			 * ------------------------------------------------------
			 */
			CI_Compat = require(PHP.constant('BASEPATH') + 'codeigniter/compat' + PHP.constant('EXT'));
			CI_Compat.__construct();
			
			/*
			 * ------------------------------------------------------
			 *  Load the framework constants
			 * ------------------------------------------------------
			 */
			var constants = require(PHP.constant('BASEPATH') + 'config/constants' + PHP.constant('EXT'));
			
			for(var c in constants) {
				PHP.define(c, constants[c]);
			}
			
			/*
			 * ------------------------------------------------------
			 *  Start the timer... tick tock tick tock...
			 * ------------------------------------------------------
			 */
			
			CI_Config = CI_Common.load_class('Config');
			CI_Config.__construct();
			
			CI_Benchmark = CI_Common.load_class('Benchmark');
			CI_Benchmark.__construct();
			
			CI_Benchmark.mark('total_execution_time_start');
			CI_Benchmark.mark('loading_time_base_classes_start');
		
			/*
			 * ------------------------------------------------------
			 *  Instantiate the hooks class
			 * ------------------------------------------------------
			 */
		
			CI_Hooks = CI_Common.load_class('Hooks');
			CI_Hooks.__construct();
		
			/*
			 * ------------------------------------------------------
			 *  Is there a "pre_system" hook?
			 * ------------------------------------------------------
			 */
			CI_Hooks._call_hook('pre_system');
		
			/*
			 * ------------------------------------------------------
			 *  Instantiate the base classes
			 * ------------------------------------------------------
			 */
		
			CI_URI = CI_Common.load_class('URI');
			CI_URI.__construct();
			
			CI_Router = CI_Common.load_class('Router');
			CI_Router.__construct();

			CI_Output = CI_Common.load_class('Output');
			CI_Output.__construct();
		
			/*
			 * ------------------------------------------------------
			 *	Is there a valid cache file?  If so, we're done...
			 * ------------------------------------------------------
			 */
		
			if (CI_Hooks._call_hook('cache_override') == false) {
				if (CI_Output._display_cache(CI_Config, CI_URI) == true) {
					return;
				}
			}
		
			/*
			 * ------------------------------------------------------
			 *  Load the remaining base classes
			 * ------------------------------------------------------
			 */
		
			CI_Input = CI_Common.load_class('Input');
			CI_Input.__construct();
			CI_Language = CI_Common.load_class('Language');
			CI_Language.__construct();
		
			/*
			 * ------------------------------------------------------
			 *  Load the app controller and local controller
			 * ------------------------------------------------------
			 *
			 *  Note: Due to the poor object handling in PHP 4 we'll
			 *  conditionally load different versions of the base
			 *  class.  Retaining PHP 4 compatibility requires a bit of a hack.
			 *
			 *  Note: The Loader class needs to be included first
			 *
			 */
		
			CI_Base = require(PHP.constant('BASEPATH') + 'codeigniter/base5' + PHP.constant('EXT'));	
			
			// Load the base controller class
			var Controller = CI_Common.load_class('Controller');
			
			// Load the local application controller
			// Note: The Router class automatically validates the controller path.  If this include fails it 
			// means that the default controller in the Routes.php file is not resolving to something valid.
			console.log(PHP.constant('APPPATH') + 'controllers/' + CI_Router.fetch_directory() + CI_Router.fetch_class() + PHP.constant('EXT'));
			
			if ( ! PHP.file_exists(PHP.constant('APPPATH') + 'controllers/' + CI_Router.fetch_directory() + CI_Router.fetch_class() + PHP.constant('EXT'))) {
				CI_Common.show_error('Unable to load your default controller.  Please make sure the controller specified in your Routes.php file is valid.', 404);
				PHP.exit('Unable to load your default controller.  Please make sure the controller specified in your Routes.php file is valid.', 500);
			}
		
			var $controller = require(PHP.constant('APPPATH') + 'controllers/' + CI_Router.fetch_directory() + CI_Router.fetch_class() + PHP.constant('EXT'));
			$controller.__construct();
			
			// Set a mark point for benchmarking
			CI_Benchmark.mark('loading_time_base_classes_end');
		
			/*
			 * ------------------------------------------------------
			 *  Security check
			 * ------------------------------------------------------
			 *
			 *  None of the functions in the app controller or the
			 *  loader class can be called via the URI, nor can
			 *  controller functions that begin with an underscore
			 */
			var $class  = CI_Router.fetch_class();
			var $method = CI_Router.fetch_method();
			
			if ( $method == 'controller' || PHP.strncmp($method, '_', 1) == 0 || PHP.in_array(PHP.strtolower($method), PHP.array_map('strtolower', PHP.get_class_methods($controller)))) {
				CI_Common.show_404($class + "/" + $method);
				PHP.exit($class + "/" + $method, 404);
			}
		
			/*
			 * ------------------------------------------------------
			 *  Is there a "pre_controller" hook?
			 * ------------------------------------------------------
			 */
			CI_Hooks._call_hook('pre_controller');
		
			/*
			 * ------------------------------------------------------
			 *  Instantiate the controller and call requested method
			 * ------------------------------------------------------
			 */
		
			// Mark a start point so we can benchmark the controller
			CI_Benchmark.mark('controller_execution_time_( ' + $class + ' / ' + $method + ' )_start');
	
			$CI = $controller;
			
			// Is this a scaffolding request?
			if (CI_Router.scaffolding_request == true) {
				if (CI_Hooks._call_hook('scaffolding_override') == false) {
					$CI._ci_scaffolding();
				}
			} else {
				/*
				 * ------------------------------------------------------
				 *  Is there a "post_controller_constructor" hook?
				 * ------------------------------------------------------
				 */
				CI_Hooks._call_hook('post_controller_constructor');
				
				// Is there a "remap" function?
				if (PHP.method_exists($CI, '_remap')) {
					$CI._remap($method);
				} else {
					// is_callable() returns TRUE on some versions of PHP 5 for private and protected
					// methods, so we'll use this workaround for consistent behavior
					
					var $keys = PHP.array_keys(PHP.get_class_methods($CI));
		
					if ( ! PHP.in_array(PHP.strtolower($method), PHP.array_map('strtolower', $keys))) {
						CI_Common.show_404($class + '/' + $method);
						return;
					}

					// Call the requested method.
					// Any URI segments present (besides the class/function) will be passed to the method for convenience

					PHP.call_user_func_array([$CI, $method], PHP.array_slice(CI_URI.$rsegments, 2));

				}
			}
			
			// Mark a benchmark end point
			CI_Benchmark.mark('controller_execution_time_( ' + $class + ' / ' + $method + ' )_end');
		
			/*
			 * ------------------------------------------------------
			 *  Is there a "post_controller" hook?
			 * ------------------------------------------------------
			 */
			CI_Hooks._call_hook('post_controller');
		
			/*
			 * ------------------------------------------------------
			 *  Send the final rendered output to the browser
			 * ------------------------------------------------------
			 */
			
			if (CI_Hooks._call_hook('display_override') == false) {
				CI_Output._display();
			}
		
			/*
			 * ------------------------------------------------------
			 *  Is there a "post_system" hook?
			 * ------------------------------------------------------
			 */
			CI_Hooks._call_hook('post_system');
		
			/*
			 * ------------------------------------------------------
			 *  Close the DB connection if one exists
			 * ------------------------------------------------------
			 */
		
			if (CI.db) {
				CI.db.on('end', function() {
					CI.db.close();
				});
			}
	    }
	    
	    return CI;
	}

	module.exports = CI;
})();