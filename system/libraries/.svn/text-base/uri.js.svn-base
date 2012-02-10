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
 * URI Class
 *
 * Parses URIs and determines routing
 *
 * @package		CodeIgniter
 * @subpackage	Libraries
 * @category	URI
 * @author		ExpressionEngine Dev Team
 * @link		http://codeigniter.com/user_guide/libraries/uri.html
 */
	var CI_URI = new function CI_URI() {
		var	$keyval			= [];
		
		var $segment_array = null;
		var $rsegment_array = null;
		
		CI_URI.$uri_string	= '';
		CI_URI.$segments		= [];
		CI_URI.$rsegments		= [];
		
		this.$config = null;
	
		/**
		 * Constructor
		 *
		 * Simply globalizes the $RTR object.  The front
		 * loads the Router class early on so it's not available
		 * normally as other classes are.
		 *
		 * @access	public
		 */
		CI_URI.__construct = function() {
			this.$config = CI_Config;
			this.$segments = [];
			this.$rsegments = [];
			CI_Common.log_message('debug', "URI Class Initialized");
		}
	
	
		// --------------------------------------------------------------------
	
		/**
		 * Get the URI String
		 *
		 * @access	private
		 * @return	string
		 */
		CI_URI._fetch_uri_string = function() {
			if (PHP.strtoupper(this.$config.item('uri_protocol')) == 'AUTO') {
				// If the URL has a question mark then it's simplest to just
				// build the URI string from the zero index of the $_GET array.
				// This avoids having to deal with $_SERVER variables, which
				// can be unreliable in some environments
				
				if (PHP.is_array(PHP.$_GET) && PHP.count(PHP.$_GET) == 1 && PHP.trim(PHP.key(PHP.$_GET), '/') != '') {
					this.$uri_string = PHP.key(PHP.$_GET);
					return;
				}
	
				// Is there a PATH_INFO variable?
				// Note: some servers seem to have trouble with getenv() so we'll test it two ways
				$path = (PHP.$_SERVER['PATH_INFO']) ? PHP.$_SERVER['PATH_INFO'] : PHP.getenv('PATH_INFO');
				
				if (PHP.trim($path, '/') != '' && $path != "/" + PHP.constant('SELF')) {
					this.$uri_string = $path;
					return;
				}
	
				// No PATH_INFO?... What about QUERY_STRING?
				$path =  (PHP.$_SERVER['QUERY_STRING']) ? PHP.$_SERVER['QUERY_STRING'] : PHP.getenv('QUERY_STRING');
				if (PHP.trim($path, '/') != '') {
					this.$uri_string = $path;
					return;
				}
				
				// No QUERY_STRING?... Maybe the ORIG_PATH_INFO variable exists?
				$path = PHP.str_replace(PHP.$_SERVER['SCRIPT_NAME'], '', (PHP.$_SERVER['ORIG_PATH_INFO']) ? PHP.$_SERVER['ORIG_PATH_INFO'] : PHP.getenv('ORIG_PATH_INFO'));
				if (PHP.trim($path, '/') != '' && $path != "/" + PHP.constant('SELF')) {
					// remove path and script information so we have good URI data
					this.$uri_string = $path;
					return;
				}
	
				// We've exhausted all our options...
				this.$uri_string = '';
			} else {
				$uri = PHP.strtoupper(this.$config.item('uri_protocol'));
	
				if ($uri == 'REQUEST_URI') {
					this.$uri_string = this._parse_request_uri();
					return;
				}
	
				this.$uri_string = (PHP.$_SERVER[$uri]) ? PHP.$_SERVER[$uri] : PHP.getenv($uri);
			}
	
			// If the URI contains only a slash we'll kill it
			if (this.$uri_string == '/') {
				this.$uri_string = '';
			}
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Parse the REQUEST_URI
		 *
		 * Due to the way REQUEST_URI works it usually contains path info
		 * that makes it unusable as URI data.  We'll trim off the unnecessary
		 * data, hopefully arriving at a valid URI that we can use.
		 *
		 * @access	private
		 * @return	string
		 */
		CI_URI._parse_request_uri = function() {
			if ( ! PHP.$_SERVER['REQUEST_URI'] || PHP.$_SERVER['REQUEST_URI'] == '') {
				return '';
			}
	
			$request_uri = PHP.preg_replace("|/(.*)|", "\\1", PHP.str_replace("\\", "/", PHP.$_SERVER['REQUEST_URI']));
	
			if ($request_uri == '' || $request_uri == PHP.SELF) {
				return '';
			}
	
			$fc_path = PHP.constant('FCPATH').PHP.constant('SELF');
			
			if (PHP.strpos($request_uri, '?') != false) {
				$fc_path += '?';
			}
	
			$parsed_uri = PHP.explode("/", $request_uri);
	
			$i = 0;
			
			for($segment in PHP.explode("/", $fc_path)) {
				if (PHP.isset($parsed_uri[$i]) && $segment == $parsed_uri[$i]) {
					$i++;
				}
			}
	
			$parsed_uri = PHP.implode("/", PHP.array_slice($parsed_uri, $i));
	
			if ($parsed_uri != '')
			{
				$parsed_uri = '/' + $parsed_uri;
			}
	
			return $parsed_uri;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Filter segments for malicious characters
		 *
		 * @access	private
		 * @param	string
		 * @return	string
		 */
		CI_URI._filter_uri = function($str) {
			if ($str != '' && this.$config.item('permitted_uri_chars') != '' && this.$config.item('enable_query_strings') == false) {
				// preg_quote() in PHP 5.3 escapes -, so the str_replace() and addition of - to preg_quote() is to maintain backwards
				// compatibility as many are unaware of how characters in the permitted_uri_chars will be parsed as a regex pattern
				if ( ! PHP.preg_match("|^[" + PHP.str_replace(['\\-', '\-'], '-', PHP.preg_quote(this.$config.item('permitted_uri_chars'), '-')) + "]+$|i", $str)) {
					PHP.show_error('The URI you submitted has disallowed characters.', 400);
				}
			}
	
			// Convert programatic characters to entities
			$bad	= ['$', 		'(', 		')',	 	'%28', 		'%29'];
			$good	= ['&#36;',	'&#40;',	'&#41;',	'&#40;',	'&#41;'];
	
			return PHP.str_replace($bad, $good, $str);
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Remove the suffix from the URL if needed
		 *
		 * @access	private
		 * @return	void
		 */
		CI_URI._remove_url_suffix = function() {
			if (this.$config.item('url_suffix') != "") {
				this.$uri_string = PHP.preg_replace("|" + PHP.preg_quote(this.$config.item('url_suffix')) + "$|", "", this.$uri_string);
			}
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Explode the URI Segments. The individual segments will
		 * be stored in the $this->segments array.
		 *
		 * @access	private
		 * @return	void
		 */
		CI_URI._explode_segments = function() {
			var segments = PHP.explode("/", this.$uri_string.replace(/\/*(.+?)\/*$/, "$1"));
			
			for($val in segments) {
				// Filter segments for security
				segments[$val] = PHP.trim(this._filter_uri(segments[$val]));
				
				if ($val != '') {
					this.$segments.push(segments[$val]);
				}
			}
		}
	
		// --------------------------------------------------------------------
		/**
		 * Re-index Segments
		 *
		 * This function re-indexes the $this->segment array so that it
		 * starts at 1 rather than 0.  Doing so makes it simpler to
		 * use functions like $this->uri->segment(n) since there is
		 * a 1:1 relationship between the segment array and the actual segments.
		 *
		 * @access	private
		 * @return	void
		 */
		CI_URI._reindex_segments = function() {
			PHP.array_unshift(this.$segments, null);
			PHP.array_unshift(this.$rsegments, null);
			
			PHP.unset(this.$segments[0]);
			PHP.unset(this.$rsegments[0]);
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Fetch a URI Segment
		 *
		 * This function returns the URI segment based on the number provided.
		 *
		 * @access	public
		 * @param	integer
		 * @param	bool
		 * @return	string
		 */
		CI_URI.segment = function($n, $no_result) {
			return ( ! PHP.isset(this.$segments[$n])) ? $no_result : this.$segments[$n];
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Fetch a URI "routed" Segment
		 *
		 * This function returns the re-routed URI segment (assuming routing rules are used)
		 * based on the number provided.  If there is no routing this function returns the
		 * same result as $this->segment()
		 *
		 * @access	public
		 * @param	integer
		 * @param	bool
		 * @return	string
		 */
		CI_URI.rsegment = function($n, $no_result) {
			return ( ! PHP.isset(this.$rsegments[$n])) ? $no_result : this.$rsegments[$n];
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Generate a key value pair from the URI string
		 *
		 * This function generates and associative array of URI data starting
		 * at the supplied segment. For example, if this is your URI:
		 *
		 *	example.com/user/search/name/joe/location/UK/gender/male
		 *
		 * You can use this function to generate an array with this prototype:
		 *
		 * array (
		 *			name => joe
		 *			location => UK
		 *			gender => male
		 *		 )
		 *
		 * @access	public
		 * @param	integer	the starting segment number
		 * @param	array	an array of default values
		 * @return	array
		 */
		CI_URI.uri_to_assoc = function($n, $default) {
		 	return this._uri_to_assoc($n, $default, 'segment');
		}
		/**
		 * Identical to above only it uses the re-routed segment array
		 *
		 */
		CI_URI.ruri_to_assoc = function($n, $default) {
		 	return this._uri_to_assoc($n, $default, 'rsegment');
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Generate a key value pair from the URI string or Re-routed URI string
		 *
		 * @access	private
		 * @param	integer	the starting segment number
		 * @param	array	an array of default values
		 * @param	string	which array we should use
		 * @return	array
		 */
		CI_URI._uri_to_assoc = function($n, $default, $which) {
			if ($which == 'segment') {
				$total_segments = 'total_segments';
				$segment_array = 'segment_array';
			} else {
				$total_segments = 'total_rsegments';
				$segment_array = 'rsegment_array';
			}
	
			if ( ! PHP.is_numeric($n)) {
				return $default;
			}
	
			if ($keyval[$n]) {
				return $keyval[$n];
			}
	
			if (this.$total_segments() < $n) {
				if (PHP.count($default) == 0) {
					return [];
				}
	
				$retval = [];
				
				for($val in $default) {
					$retval[$val] = false;
				}
				
				return $retval;
			}
	
			this.$segments = PHP.array_slice(this[$segment_array], ($n - 1));
	
			$i = 0;
			$lastval = '';
			$retval  = [];
			for($seg in this.$segments) {
				if ($i % 2) {
					$retval[$lastval] = $seg;
				} else {
					$retval[$seg] = false;
					$lastval = $seg;
				}
	
				$i++;
			}
	
			if (PHP.count($default) > 0) {
				for($val in $default) {
					if ( ! PHP.array_key_exists($val, $retval)) {
						$retval[$val] = false;
					}
				}
			}
	
			// Cache the array for reuse
			$keyval[$n] = $retval;
			return $retval;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Generate a URI string from an associative array
		 *
		 *
		 * @access	public
		 * @param	array	an associative array of key/values
		 * @return	array
		 */
		CI_URI.assoc_to_uri = function($array) {
			$temp = [];
			for($key in $array) {
				$temp.push($key);
				$temp.push($array[$key]);
			}
	
			return PHP.implode('/', $temp);
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Fetch a URI Segment and add a trailing slash
		 *
		 * @access	public
		 * @param	integer
		 * @param	string
		 * @return	string
		 */
		CI_URI.slash_segment = function($n, $where) {
			return this._slash_segment($n, $where, 'segment');
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Fetch a URI Segment and add a trailing slash
		 *
		 * @access	public
		 * @param	integer
		 * @param	string
		 * @return	string
		 */
		CI_URI.slash_rsegment = function($n, $where) {
			return this._slash_segment($n, $where, 'rsegment');
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Fetch a URI Segment and add a trailing slash - helper function
		 *
		 * @access	private
		 * @param	integer
		 * @param	string
		 * @param	string
		 * @return	string
		 */
		CI_URI._slash_segment = function($n, $where, $which) {
			if ($where == 'trailing') {
				$trailing	= '/';
				$leading	= '';
			} else if ($where == 'leading') {
				$leading	= '/';
				$trailing	= '';
			} else {
				$leading	= '/';
				$trailing	= '/';
			}
			return $leading + this.$which($n) + $trailing;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Segment Array
		 *
		 * @access	public
		 * @return	array
		 */
		CI_URI.segment_array = function() {
			return this.$segments;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Routed Segment Array
		 *
		 * @access	public
		 * @return	array
		 */
		CI_URI.rsegment_array = function() {
			return this.$rsegments;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Total number of segments
		 *
		 * @access	public
		 * @return	integer
		 */
		CI_URI.total_segments = function() {
			return PHP.count(this.$segments);
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Total number of routed segments
		 *
		 * @access	public
		 * @return	integer
		 */
		CI_URI.total_rsegments = function() {
			return PHP.count(this.$rsegments);
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Fetch the entire URI string
		 *
		 * @access	public
		 * @return	string
		 */
		CI_URI.uri_string = function() {
			return this.$uri_string;
		}
	
	
		// --------------------------------------------------------------------
	
		/**
		 * Fetch the entire Re-routed URI string
		 *
		 * @access	public
		 * @return	string
		 */
		CI_URI.ruri_string = function() {
			return '/' + PHP.implode('/', this[$rsegment_array]) + '/';
		}
	
		return CI_URI;
	}
	
	//CI_URI.prototype.constructor = CI_URI.__construct();

	module.exports = CI_URI;
})();
// END URI Class

/* End of file URI.php */
/* Location: ./system/libraries/URI.php */