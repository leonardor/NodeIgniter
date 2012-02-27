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
 * Router Class
 *
 * Parses URIs and determines routing
 *
 * @package		CodeIgniter
 * @subpackage	Libraries
 * @author		ExpressionEngine Dev Team
 * @category	Libraries
 * @link		http://codeigniter.com/user_guide/general/routing.html
 */
	function CI_Router() {
			
		var $error_routes	= [];
		var $uri_protocol 	= 'auto';
		var $default_controller;
		var $scaffolding_request = false; // Must be set to FALSE
		
		var $route;
		this.routes		= {};
		
		
		var $directory		= '';
		var $method			= 'index';
		var $class			= '';
		
		/**
		 * Constructor
		 *
		 * Runs the route mapping function.
		 */
		this.__construct = function() {
			$directory		= '';
			this._set_routing();
			CI_Common.log_message('debug', "Router Class Initialized");
		}
		
		// --------------------------------------------------------------------
		
		/**
		 * Set the route mapping
		 *
		 * This function determines what should be served based on the URI request,
		 * as well as any "routes" that have been set in the routing config file.
		 *
		 * @access	private
		 * @return	void
		 */
		this._set_routing = function() {
			// Are query strings enabled in the config file?
			// If so, we're done since segment based URIs are not used with query strings.
			if (CI_Common.config_item('enable_query_strings') == true && PHP.$_GET[CI_Common.config_item('controller_trigger')]) {
				this.set_class(PHP.trim(CI_URI._filter_uri(PHP.$_GET[CI_Common.config_item('controller_trigger')])));
	
				if (PHP.$_GET[CI_Common.config_item('function_trigger')]) {
					this.set_method(PHP.trim(CI_URI._filter_uri(PHP.$_GET[CI_Common.config_item('function_trigger')])));
				}
				
				return;
			}
			
			// Load the routes.php file.
			$route = require(PHP.constant('APPPATH') + 'config/routes' + PHP.constant('EXT'));
			
			this.routes = ( ! $route.routes || ! PHP.is_array($route.routes)) ? {} : $route.routes;
			PHP.unset($route.routes);
	
			// Set the default controller so we can display it in the event
			// the URI doesn't correlated to a valid controller.
			$default_controller = ( ! $route['default_controller'] || $route['default_controller'] == '') ? false : PHP.strtolower($route['default_controller']);	

			// Fetch the complete URI string
			CI_URI._fetch_uri_string();

			// Is there a URI string? If not, the default controller specified in the "routes" file will be shown.
			if (CI_URI.uri_string() == '') {
				
				if ($default_controller == false) {
					CI_Common.show_error("Unable to determine what should be displayed. A default route has not been specified in the routing file.", 500);
					PHP.exit("Unable to determine what should be displayed. A default route has not been specified in the routing file.", 500);
				}
				
				if (PHP.strpos($default_controller, '/') != false) {
					var $x = PHP.explode('/', $default_controller);
	
					this.set_class(PHP.end($x));
					this.set_method('index');
					this._set_request($x);
				} else {
					this.set_class($default_controller);
					this.set_method('index');
					this._set_request([$default_controller, 'index']);
				}
				
				// re-index the routed segments array so it starts with 1 rather than 0
				CI_URI._reindex_segments();
				
				CI_Common.log_message('debug', "No URI present. Default controller set.");
				return;
			}
			
			PHP.unset($route['default_controller']);
			
			// Do we need to remove the URL suffix?
			CI_URI._remove_url_suffix();
			
			// Compile the segments into an array
			CI_URI._explode_segments();
			
			// Parse any custom routing that may exist
			this._parse_routes();		
			
			// Re-index the segment array so that it starts with 1 rather than 0
			CI_URI._reindex_segments();
		}
		
		// --------------------------------------------------------------------
		
		/**
		 * Set the Route
		 *
		 * This function takes an array of URI segments as
		 * input, and sets the current class/method
		 *
		 * @access	private
		 * @param	array
		 * @param	bool
		 * @return	void
		 */
		this._set_request = function($segments) {
			$segments = $segments || [];
			
			$segments = this._validate_request($segments);
			
			if (PHP.count($segments) == 0) {
				return;
			}
						
			this.set_class($segments[0]);
			
			if (PHP.isset($segments[1])) {
				// A scaffolding request. No funny business with the URL
				if ($route['scaffolding_trigger'] == $segments[1] && $segments[1] != '_ci_scaffolding') {
					$scaffolding_request = true;
					PHP.unset($route.config['scaffolding_trigger']);
				} else {
					// A standard method request
					this.set_method($segments[1]);
				}
			} else {
				// This lets the "routed" segment array identify that the default
				// index method is being used.
				$segments[1] = 'index';
				this.set_method($segments[1]);
			}
			
			// Update our "routed" segment array to contain the segments.
			// Note: If there is no custom routing, this array will be
			// identical to $this->uri->segments
			
			CI_URI.$rsegments = $segments;
		}
		
		// --------------------------------------------------------------------
		
		/**
		 * Validates the supplied segments.  Attempts to determine the path to
		 * the controller.
		 *
		 * @access	private
		 * @param	array
		 * @return	array
		 */	
		this._validate_request = function($segments) {
			// Does the requested controller exist in the root folder?
			if (PHP.file_exists(PHP.constant('APPPATH') + 'controllers/' + $segments[0] + PHP.constant('EXT'))) {
				return $segments;
			}
	
			console.log('#' + PHP.constant('APPPATH') + 'controllers/' + $segments[0]);
			
			// Is the controller in a sub-folder?
			if (PHP.is_dir(PHP.constant('APPPATH') + 'controllers/' + $segments[0])) {		
				// Set the directory and remove it from the segment array
				this.set_directory($segments[0]);
				$segments = PHP.array_slice($segments, 1);
				
				if (PHP.count($segments) > 0) {
					// Does the requested controller exist in the sub-folder?
					if ( ! PHP.file_exists(PHP.constant('APPPATH') + 'controllers/' + this.fetch_directory() + $segments[0] + PHP.constant('EXT'))) {
						CI_Common.show_404(this.fetch_directory() + $segments[0]);
						PHP.exit(this.fetch_directory() + $segments[0], 404);
					}
				} else {
					this.set_class($default_controller);
					this.set_method('index');
				
					// Does the default controller exist in the sub-folder?
					if ( ! PHP.file_exists(PHP.constant('APPPATH') + 'controllers/' + this.fetch_directory() + $default_controller + PHP.constant('EXT'))) {
						$directory = '';
						return [];
					}
				
				}
	
				return $segments;
			}
	
			// Can't find the requested controller...
			CI_Common.show_404($segments[0]);
			PHP.exit($segments[0], 404);
		}
	
		// --------------------------------------------------------------------
	
		/**
		 *  Parse Routes
		 *
		 * This function matches any routes that may exist in
		 * the config/routes.php file against the URI to
		 * determine if the class/method need to be remapped.
		 *
		 * @access	private
		 * @return	void
		 */
		this._parse_routes = function() {
			// Do we even have any custom routing to deal with?
			// There is a default scaffolding trigger, so we'll look just for 1

			if (PHP.count(this.routes) == 0) {
				this._set_request(CI_URI.$segments);
				return;
			}
			
			// Turn the segment array into a URI string
			var $uri = PHP.implode('/', CI_URI.$segments);
			
			// Is there a literal match?  If so we're done
			if (this.routes[$uri]) {
				this._set_request(PHP.explode('/', this.routes[$uri]));		
				return;
			}
			
			// Loop through the route array looking for wild-cards
			for(var $key in this.routes) {						
				// Convert wild-cards to RegEx
				
				$key = $key.replace('/:num/', '[0-9]+').replace('/:any/', '.+');

				// Does the RegEx match?
				if (PHP.preg_match('#^' + $key + '$#', $uri)) {			
					// Do we have a back-reference?
					if (PHP.strpos($val, '$') != false && PHP.strpos($key, '(') != false) {
						var $val = $uri.replace('#^' + $key + '$#', this.routes[$key]);
					}
					this._set_request(PHP.explode('/', $val));		
					return;
				}
			}
	
			// If we got this far it means we didn't encounter a
			// matching route so we'll set the site default route
			this._set_request(CI_URI.$segments);
		}
	
		// --------------------------------------------------------------------
		
		/**
		 * Set the class name
		 *
		 * @access	public
		 * @param	string
		 * @return	void
		 */	
		this.set_class = function($classname) {
			$class = $classname;
		}
		
		// --------------------------------------------------------------------
		
		/**
		 * Fetch the current class
		 *
		 * @access	public
		 * @return	string
		 */	
		this.fetch_class = function() {
			return $class;
		}
		
		// --------------------------------------------------------------------
		
		/**
		 *  Set the method name
		 *
		 * @access	public
		 * @param	string
		 * @return	void
		 */	
		this.set_method = function($methodname) {
			$method = $methodname;
		}
	
		// --------------------------------------------------------------------
		
		/**
		 *  Fetch the current method
		 *
		 * @access	public
		 * @return	string
		 */	
		this.fetch_method = function() {
			if ($method == this.fetch_class()) {
				return 'index';
			}
	
			return $method;
		}
	
		// --------------------------------------------------------------------
		
		/**
		 *  Set the directory name
		 *
		 * @access	public
		 * @param	string
		 * @return	void
		 */	
		this.set_directory = function($dir) {
			$directory = $dir + '/';
		}
	
		// --------------------------------------------------------------------
		
		/**
		 *  Fetch the sub-directory (if any) that contains the requested controller class
		 *
		 * @access	public
		 * @return	string
		 */	
		this.fetch_directory = function() {
			return $directory;
		}
	
		return this;
	}
	
	module.exports = CI_Router;
})();
// END Router Class

/* End of file Router.php */
/* Location: ./system/libraries/Router.php */