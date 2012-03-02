(function(){
	var MY_Output = {};
	
	MY_Output = Object.create(CI_Output).__construct();
	
	MY_Output.parent = CI_Output;
	MY_Output.name = 'MY_Output';
	
	MY_Output.__construct = function() {
		console.log('MY_Output.__construct()');
		return this;
	}
	
	MY_Output._display = function($output) {
		console.log('MY_Output._display()');
		
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
			MY_View.on('load', function(html) {
				console.log('intercepting my_view.load event...');
				
				console.log('sending final output...');
				response.write(html);
				response.end();
			});
		}
		
		console.log('emitting my_output.ready event...');
		this.emit('ready');
		
		CI_Common.log_message('debug', "Final output sent to browser");
		CI_Common.log_message('debug', "Total execution time: " + $elapsed);
	}
	
	module.exports = MY_Output;
})();