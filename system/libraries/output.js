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
 * Output Class
 *
 * Responsible for sending final output to browser
 *
 * @package		CodeIgniter
 * @subpackage	Libraries
 * @category	Output
 * @author		ExpressionEngine Dev Team
 * @link		http://codeigniter.com/user_guide/libraries/output.html
 */
	var CI_Output = {};
	
	CI_Output = Object.create(Events.EventEmitter.prototype);
	
	CI_Output.parent = Events.EventEmitter.prototype;
	CI_Output.name = 'CI_Output';
	
	CI_Output.$final_output 	= '';
	CI_Output.$cache_expiration	= 0;
	CI_Output.$headers 			= [];
	CI_Output.$enable_profiler 	= false;
	
	CI_Output.__construct = function() {
		console.log('CI_Output.__construct()');
		
		CI_Common.log_message('debug', "Output Class Initialized");
		
		return this;
	}
	
	CI_Output.__load = function(random) {
		console.log('emitting ' + this.name + '.__load event... (' + random + ')');
		this.emit('__load', this);
		
		return this;
	}
		
	// --------------------------------------------------------------------
	
	/**
	 * Get Output
	 *
	 * Returns the current output string
	 *
	 * @access	public
	 * @return	string
	 */	
	CI_Output.get_output = function() {
		return this.$final_output;
	}

	// --------------------------------------------------------------------
	
	/**
	 * Set Output
	 *
	 * Sets the output string
	 *
	 * @access	public
	 * @param	string
	 * @return	void
	 */	
	CI_Output.set_output = function($output) {
		this.$final_output = $output;
	}

	// --------------------------------------------------------------------

	/**
	 * Append Output
	 *
	 * Appends data onto the output string
	 *
	 * @access	public
	 * @param	string
	 * @return	void
	 */	
	CI_Output.append_output = function($output) {
		if (this.$final_output == '') {
			this.$final_output = $output;
		} else {
			this.$final_output += $output;
		}
	}
	
	// --------------------------------------------------------------------

	/**
	 * Set Header
	 *
	 * Lets you set a server header which will be outputted with the final display.
	 *
	 * Note:  If a file is cached, headers will not be sent.  We need to figure out
	 * how to permit header data to be saved with the cache data...
	 *
	 * @access	public
	 * @param	string
	 * @return	void
	 */	
	CI_Output.set_header = function($header, $replace) {
		$replace = $replace || true;
		
		this.$headers.push([$header, $replace]);
	}
	
	// --------------------------------------------------------------------
	
	/**
	 * Set HTTP Status Header
	 * moved to Common procedural functions in 1.7.2
	 * 
	 * @access	public
	 * @param	int 	the status code
	 * @param	string	
	 * @return	void
	 */	
	CI_Output.set_status_header = function($code, $text) {
		$code = $code || '200';
		$text = $text || '';
			
		CI_Common.set_status_header($code, $text);
	}
		
	// --------------------------------------------------------------------
	
	/**
	 * Enable/disable Profiler
	 *
	 * @access	public
	 * @param	bool
	 * @return	void
	 */	
	CI_Output.enable_profiler = function($val) {
		$val = $val || true;
		
		this.$enable_profiler = (PHP.is_bool($val)) ? $val : true;
	}
	
	// --------------------------------------------------------------------
	
	/**
	 * Set Cache
	 *
	 * @access	public
	 * @param	integer
	 * @return	void
	 */	
	CI_Output.cache = function($time) {
		this.$cache_expiration = ( ! PHP.is_numeric($time)) ? 0 : $time;
	}
		
	// --------------------------------------------------------------------
	
	/**
	 * Display Output
	 *
	 * All "view" data is automatically put into this variable by the controller class:
	 *
	 * $this->final_output
	 *
	 * This function sends the finalized output data to the browser along
	 * with any server headers and profile data.  It also stops the
	 * benchmark timer so the page rendering speed and memory usage can be shown.
	 *
	 * @access	public
	 * @return	mixed
	 */		
	CI_Output._display = function($output) {	
		$output = $output || '';
		// Note:  We use globals because we can't use $CI =& get_instance()
		// since this function is sometimes called by the caching mechanism,
		// which happens before the CI super object is available.

		// --------------------------------------------------------------------
		
		// Set the output data
		if ($output == '') {
			$output = this.$final_output;
		}
		
		// --------------------------------------------------------------------
		
		// Do we need to write a cache file?
		if (this.$cache_expiration > 0) {
			this._write_cache($output);
		}
		
		// --------------------------------------------------------------------

		// Parse out the elapsed time and memory usage,
		// then swap the pseudo-variables with the data

		var $elapsed = CI_Benchmark.elapsed_time('total_execution_time_start', 'total_execution_time_end', 3);		
		$output = PHP.str_replace('{elapsed_time}', $elapsed, $output);
		
		var $memory	 = ( ! PHP.method_exists(CI_Benchmark, 'memory_get_usage')) ? '0' : Math.round(CI_Benchmark.memory_get_usage()/1024/1024, 2) + 'MB';
		$output = PHP.str_replace('{memory_usage}', $memory, $output);		

		// --------------------------------------------------------------------
		
		// Is compression requested?
		if (CI_Config.item('compress_output') == true) {
			if (PHP.extension_loaded('zlib')) {
				if (PHP.$_SERVER['HTTP_ACCEPT_ENCODING'] || PHP.strpos(PHP.$_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip') != false) {
					PHP.ob_start('ob_gzhandler');
				}
			}
		}

		// --------------------------------------------------------------------
		
		// Are there any server headers to send?
		if (PHP.count(this.$headers) > 0) {
			for (var $header in this.$headers) {
				PHP.header($headers[$header][0], $headers[$header][1]);
			}
		}		

		// --------------------------------------------------------------------
		
		// Does the get_instance() function exist?
		// If not we know we are dealing with a cache file so we'll
		// simply echo out the data and exit.
		if ( ! PHP.method_exists(CI_Base, 'get_instance')) {
			PHP.echo($output);
			CI_Common.log_message('debug', "Final output sent to browser");
			CI_Common.log_message('debug', "Total execution time: " + $elapsed);
			return true;
		}
	
		// --------------------------------------------------------------------

		// Do we need to generate profile data?
		// If so, load the Profile class and run it.
		if (this.$enable_profiler == true) {
			var CI_Profiler = CI_Common.load_class('Profiler');	
			CI_Profiler.__construct();
										
			// If the output data contains closing </body> and </html> tags
			// we will remove them and add them back after we insert the profile data
			if (PHP.preg_match(new RegExp("</body>.*?</html>", "is"), $output)) {
				$output  = $output.replace(new RegExp("</body>.*?</html>", "is"), '');
				$output += CI_Profiler.run();
				$output += '</body></html>';
			} else {
				$output += CI_Profiler.run();
			}
		}
		
		// --------------------------------------------------------------------

		// Does the controller contain a function named _output()?
		// If so send the output there.  Otherwise, echo it.
		
		if (PHP.method_exists(CI_Base, '_output')) {
			CI_Base._output($output);
		} else {
			console.log('sending final output...');
			response.write($output);
			response.end();
		}
		
		CI_Common.log_message('debug', "Final output sent to browser");
		CI_Common.log_message('debug', "Total execution time: " + $elapsed);	
	}
	
	// --------------------------------------------------------------------
	
	/**
	 * Write a Cache File
	 *
	 * @access	public
	 * @return	void
	 */	
	CI_Hooks._write_cache = function($output) {
		var $path = CI_Common.config_item('cache_path');
	
		var $cache_path = ($path == '') ? PHP.constant('BASEPATH') + 'cache/' : $path;
		
		if ( ! PHP.file_exists($cache_path) || ! CI_Common.is_really_writable($cache_path)) {
			return;
		}
		
		var $uri = CI_Common.config_item('base_url') + CI_Common.config_item('index_page') + CI_URI.uri_string();
		
		$cache_path += PHP.md5($uri);
		
		$fp = PHP.fopen($cache_path, PHP.constant('FOPEN_WRITE_CREATE_DESTRUCTIVE'));

		if ( ! $fp) {
			CI_Common.log_message('error', "Unable to write cache file: " + $cache_path);
			return;
		}
		
		var $expire = PHP.time() + (this.$cache_expiration * 60);
		
		if (PHP.flock($fp, PHP.flag('LOCK_EX'))) {
			PHP.fwrite($fp, $expire + 'TS--->' + $output);
			PHP.flock($fp, PHP.flag('LOCK_UN'));
		} else {
			CI_Common.log_message('error', "Unable to secure a file lock for file at: " + $cache_path);
			return;
		}
		
		PHP.fclose($fp);
		PHP.chmod($cache_path, PHP.constant('DIR_WRITE_MODE'));

		CI_Common.log_message('debug', "Cache file written: " + $cache_path);
	}

	// --------------------------------------------------------------------
	
	/**
	 * Update/serve a cached file
	 *
	 * @access	public
	 * @return	void
	 */	
	CI_Output._display_cache = function($CFG, $URI) {
		var $cache_path = (CI_Common.config_item('cache_path') == '') ? PHP.constant('BASEPATH') + 'cache/' : CI_Common.config_item('cache_path');
			
		if ( ! PHP.file_exists($cache_path) || ! CI_Common.is_really_writable($cache_path)) {
			return false;
		}
		
		// Build the file path.  The file name is an MD5 hash of the full URI
		var $uri =	CI_Common.config_item('base_url') + CI_Common.config_item('index_page') + CI_URI.uri_string();
				
		var $filepath = $cache_path + PHP.md5($uri);
		
		if ( ! PHP.file_exists($filepath)) {
			return false;
		}
	
		if ( ! $fp = PHP.fopen($filepath, PHP.constant('FOPEN_READ'))) {
			return false;
		}
			
		PHP.flock($fp, PHP.flag('LOCK_SH'));
		
		var $cache = '';
		
		if (PHP.filesize($filepath) > 0) {
			$cache = PHP.fread($fp, PHP.filesize($filepath));
		}
	
		PHP.flock($fp, PHP.flag('LOCK_UN'));
		PHP.fclose($fp);
					
		// Strip out the embedded timestamp		
		if ( ! PHP.preg_match(new RegExp("(\d+TS--->)"), $cache, $match)) {
			return false;
		}
		
		// Has the file expired? If so we'll delete it.
		if (PHP.time() >= PHP.trim(PHP.str_replace('TS--->', '', $match['1']))) { 		
			PHP.unlink($filepath);
			CI_Common.log_message('debug', "Cache file has expired. File deleted");
			return false;
		}

		// Display the cache
		this._display(PHP.str_replace($match['0'], '', $cache));
		CI_Common.log_message('debug', "Cache file is current. Sending it to browser.");		
		return true;
	}

	module.exports = CI_Output;
})();
// END Output Class

/* End of file Output.php */
/* Location: ./system/libraries/Output.php */