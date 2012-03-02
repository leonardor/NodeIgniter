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
	 * CodeIgniter Profiler Class
	 *
	 * This class enables you to display benchmark, query, and other data
	 * in order to help with debugging and optimization.
	 *
	 * Note: At some point it would be good to move all the HTML in this class
	 * into a set of template files in order to allow customization.
	 *
	 * @package		CodeIgniter
	 * @subpackage	Libraries
	 * @category	Libraries
	 * @author		ExpressionEngine Dev Team
	 * @link		http://codeigniter.com/user_guide/general/profiling.html
	 */
	var CI_Profiler = {};
	
	CI_Profiler = Object.create(Events.EventEmitter.prototype);
	
	CI_Profiler.parent = Events.EventEmitter.prototype;
	CI_Profiler.name = 'CI_Profiler';
	
	CI_Profiler.__construct = function() {
	 	CI.load.language('profiler');
	}
	 	
	CI_Profiler.__load = function(random) {
		console.log('emitting ' + this.name + '.__load event... (' + random + ')');
		this.emit('__load', this);
		
		return this;
	}
	
	// --------------------------------------------------------------------

	/**
	 * Auto Profiler
	 *
	 * This function cycles through the entire array of mark points and
	 * matches any two points that are named identically (ending in "_start"
	 * and "_end" respectively).  It then compiles the execution times for
	 * all points and returns it as an array
	 *
	 * @access	private
	 * @return	array
	 */
	CI_Profiler._compile_benchmarks = function() {
  		var $profile = {};
  		
 		for(var $key in CI_Benchmark.marker) {
 			// We match the "end" marker so that the list ends
 			// up in the order that it was defined
 			if (preg_match("/(.+?)_end/i", $key, $match)) { 			
 				if (CI_Benchmark.marker[$match[1] + '_end']) && CI_Benchmark.marker[$match[1] + '_start'])) {
 					$profile[$match[1]] = CI_Benchmark.elapsed_time($match[1] + '_start', $key);
 				}
 			}
 		}

		// Build a table containing the profile data.
		// Note: At some point we should turn this into a template that can
		// be modified.  We also might want to make this data available to be logged
	
		var $output  = "\n\n";
		$output += '<fieldset style="border:1px solid #990000;padding:6px 10px 10px 10px;margin:0 0 20px 0;background-color:#eee">';
		$output += "\n";
		$output += '<legend style="color:#990000;">&nbsp;&nbsp;' + CI.lang.line('profiler_benchmarks') + '&nbsp;&nbsp;</legend>';
		$output += "\n";			
		$output += "\n\n<table cellpadding='4' cellspacing='1' border='0' width='100%'>\n";
		
		for (var $key in $profile) {
			$key = PHP.ucwords(PHP.str_replace(['_', '-'], ' ', $key));
			$output += "<tr><td width='50%' style='color:#000;font-weight:bold;background-color:#ddd;'>" + $key + "&nbsp;&nbsp;</td><td width='50%' style='color:#990000;font-weight:normal;background-color:#ddd;'>" + $profile[$key] + "</td></tr>\n";
		}
		
		$output += "</table>\n";
		$output += "</fieldset>";
 		
 		return $output;
 	}
 	
	// --------------------------------------------------------------------

	/**
	 * Compile Queries
	 *
	 * @access	private
	 * @return	string
	 */	
	CI_Profiler._compile_queries = function() {
		var $dbs = [];

		// Let's determine which databases are currently connected to
		for(var $CI_object in PHP.get_object_vars(CI)) {
			if (PHP.is_object($CI_object) && PHP.is_subclass_of(PHP.get_class($CI_object), 'CI_DB') ) {
				$dbs.push($CI_object);
			}
		}
					
		if (PHP.count($dbs) == 0) {
			var $output  = "\n\n";
			$output += '<fieldset style="border:1px solid #0000FF;padding:6px 10px 10px 10px;margin:20px 0 20px 0;background-color:#eee">';
			$output += "\n";
			$output += '<legend style="color:#0000FF;">&nbsp;&nbsp;' + CI.lang.line('profiler_queries') + '&nbsp;&nbsp;</legend>';
			$output += "\n";		
			$output += "\n\n<table cellpadding='4' cellspacing='1' border='0' width='100%'>\n";
			$output +="<tr><td width='100%' style='color:#0000FF;font-weight:normal;background-color:#eee;'>" + CI.lang.line('profiler_no_db') + "</td></tr>\n";
			$output += "</table>\n";
			$output += "</fieldset>";
			
			return $output;
		}
		
		// Load the text helper so we can highlight the SQL
		CI.load.helper('text');

		// Key words we want bolded
		var $highlight = ['SELECT', 'DISTINCT', 'FROM', 'WHERE', 'AND', 'LEFT&nbsp;JOIN', 'ORDER&nbsp;BY', 'GROUP&nbsp;BY', 'LIMIT', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'OR', 'HAVING', 'OFFSET', 'NOT&nbsp;IN', 'IN', 'LIKE', 'NOT&nbsp;LIKE', 'COUNT', 'MAX', 'MIN', 'ON', 'AS', 'AVG', 'SUM', '(', ')'];

		var $output  = "\n\n";
			
		for(var $db in $dbs) {
			$output += '<fieldset style="border:1px solid #0000FF;padding:6px 10px 10px 10px;margin:20px 0 20px 0;background-color:#eee">';
			$output += "\n";
			$output += '<legend style="color:#0000FF;">&nbsp;&nbsp;' + CI.lang.line('profiler_database') + ':&nbsp; ' + $dbs[$db].database + '&nbsp;&nbsp;&nbsp;' + CI.lang.line('profiler_queries') + ': ' + PHP.count(CI.db.queries) + '&nbsp;&nbsp;&nbsp;</legend>';
			$output += "\n";		
			$output += "\n\n<table cellpadding='4' cellspacing='1' border='0' width='100%'>\n";
		
			if (PHP.count($dbs[$db].queries) == 0) {
				$output += "<tr><td width='100%' style='color:#0000FF;font-weight:normal;background-color:#eee;'>" + CI.lang.line('profiler_no_queries') + "</td></tr>\n";
			} else {				
				for(var $key in $dbs[$db].queries) {					
					var $time = PHP.number_format($dbs[$db].query_times[$key], 4);

					$dbs[$db].queries[$key] = PHP.highlight_code($dbs[$db].queries[$key], PHP.flag('ENT_QUOTES'));
	
					for(var $bold in $highlight) {
						$dbs[$db].queries[$key] = PHP.str_replace($highlight[$bold], '<strong>' + $highlight[$bold] + '</strong>', $dbs[$db].queries[$key]);	
					}
					
					$output += "<tr><td width='1%' valign='top' style='color:#990000;font-weight:normal;background-color:#ddd;'>" + $time + "&nbsp;&nbsp;</td><td style='color:#000;font-weight:normal;background-color:#ddd;'>" + $dbs[$db].queries[$key] + "</td></tr>\n";
				}
			}
			
			$output += "</table>\n";
			$output += "</fieldset>";
			
		}
		
		return $output;
	}

	// --------------------------------------------------------------------

	/**
	 * Compile $_GET Data
	 *
	 * @access	private
	 * @return	string
	 */	
	CI_Profiler._compile_get = function() {	
		var $output  = "\n\n";
		$output += '<fieldset style="border:1px solid #cd6e00;padding:6px 10px 10px 10px;margin:20px 0 20px 0;background-color:#eee">';
		$output += "\n";
		$output += '<legend style="color:#cd6e00;">&nbsp;&nbsp;' + CI.lang.line('profiler_get_data') + '&nbsp;&nbsp;</legend>';
		$output += "\n";
				
		if (PHP.count(PHP.$_GET) == 0) {
			$output += "<div style='color:#cd6e00;font-weight:normal;padding:4px 0 4px 0'>" + CI.lang.line('profiler_no_get') + "</div>";
		} else {
			$output += "\n\n<table cellpadding='4' cellspacing='1' border='0' width='100%'>\n";
		
			for(var $key in PHP.$_GET) {
				if ( ! PHP.is_numeric($key)) {
					$key = "'" + $key + "'";
				}
			
				$output += "<tr><td width='50%' style='color:#000;background-color:#ddd;'>&#36;_GET[" + $key + "]&nbsp;&nbsp; </td><td width='50%' style='color:#cd6e00;font-weight:normal;background-color:#ddd;'>";
				
				if (PHP.is_array(PHP.$_GET[$key])) {
					$output += "<pre>" + PHP.htmlspecialchars(PHP.stripslashes(PHP.print_r(PHP.$_GET[$key], true))) + "</pre>";
				} else {
					$output += PHP.htmlspecialchars(PHP.stripslashes(PHP.$_GET[$key]));
				}
				
				$output += "</td></tr>\n";
			}
			
			$output += "</table>\n";
		}
		
		$output += "</fieldset>";

		return $output;	
	}
	
	// --------------------------------------------------------------------
	
	/**
	 * Compile $_POST Data
	 *
	 * @access	private
	 * @return	string
	 */	
	CI_Profiler._compile_post = function() {	
		var $output  = "\n\n";
		$output += '<fieldset style="border:1px solid #009900;padding:6px 10px 10px 10px;margin:20px 0 20px 0;background-color:#eee">';
		$output += "\n";
		$output += '<legend style="color:#009900;">&nbsp;&nbsp;' + CI.lang.line('profiler_post_data') + '&nbsp;&nbsp;</legend>';
		$output += "\n";
				
		if (PHP.count(PHP.$_POST) == 0) {
			$output += "<div style='color:#009900;font-weight:normal;padding:4px 0 4px 0'>" + CI.lang.line('profiler_no_post') + "</div>";
		} else {
			$output += "\n\n<table cellpadding='4' cellspacing='1' border='0' width='100%'>\n";
		
			for(var $key in PHP.$_POST) {
				if ( ! PHP.is_numeric($key)) {
					$key = "'" + $key + "'";
				}
			
				$output += "<tr><td width='50%' style='color:#000;background-color:#ddd;'>&#36;_POST[" + $key + "]&nbsp;&nbsp; </td><td width='50%' style='color:#009900;font-weight:normal;background-color:#ddd;'>";
				
				if (PHP.is_array(PHP.$_POST[$key])) {
					$output += "<pre>" + PHP.htmlspecialchars(PHP.stripslashes(PHP.print_r(PHP.$_POST[$key], true))) . "</pre>";
				} else {
					$output += PHP.htmlspecialchars(PHP.stripslashes(PHP.$_POST[$key]));
				}
				
				$output += "</td></tr>\n";
			}
			
			$output += "</table>\n";
		}
		
		$output += "</fieldset>";

		return $output;	
	}
	
	// --------------------------------------------------------------------
	
	/**
	 * Show query string
	 *
	 * @access	private
	 * @return	string
	 */	
	
	CI_Profiler._compile_uri_string = function() {	
		var $output  = "\n\n";
		$output += '<fieldset style="border:1px solid #000;padding:6px 10px 10px 10px;margin:20px 0 20px 0;background-color:#eee">';
		$output += "\n";
		$output += '<legend style="color:#000;">&nbsp;&nbsp;' + CI.lang.line('profiler_uri_string') + '&nbsp;&nbsp;</legend>';
		$output += "\n";
		
		if (CI.uri.$uri_string == '') {
			$output += "<div style='color:#000;font-weight:normal;padding:4px 0 4px 0'>" + CI.lang.line('profiler_no_uri') + "</div>";
		} else {
			$output += "<div style='color:#000;font-weight:normal;padding:4px 0 4px 0'>" + CI.uri.$uri_string + "</div>";				
		}
		
		$output += "</fieldset>";

		return $output;	
	}

	// --------------------------------------------------------------------
	
	/**
	 * Show the controller and function that were called
	 *
	 * @access	private
	 * @return	string
	 */	
	CI_Profiler._compile_controller_info = function() {	
		var $output  = "\n\n";
		$output += '<fieldset style="border:1px solid #995300;padding:6px 10px 10px 10px;margin:20px 0 20px 0;background-color:#eee">';
		$output += "\n";
		$output += '<legend style="color:#995300;">&nbsp;&nbsp;' + CI.lang.line('profiler_controller_info') + '&nbsp;&nbsp;</legend>';
		$output += "\n";
		
		$output += "<div style='color:#995300;font-weight:normal;padding:4px 0 4px 0'>" + CI.router.fetch_class() + "/" + CI.router.fetch_method() + "</div>";				

		$output += "</fieldset>";

		return $output;	
	}
	// --------------------------------------------------------------------
	
	/**
	 * Compile memory usage
	 *
	 * Display total used memory
	 *
	 * @access	public
	 * @return	string
	 */
	CI_Profiler._compile_memory_usage = function() {
		var $output  = "\n\n";
		$output += '<fieldset style="border:1px solid #5a0099;padding:6px 10px 10px 10px;margin:20px 0 20px 0;background-color:#eee">';
		$output += "\n";
		$output += '<legend style="color:#5a0099;">&nbsp;&nbsp;' + CI.lang.line('profiler_memory_usage') + '&nbsp;&nbsp;</legend>';
		$output += "\n";
		
		if (PHP.function_exists('memory_get_usage') && ( var $usage = PHP.memory_get_usage()) != '') {
			$output += "<div style='color:#5a0099;font-weight:normal;padding:4px 0 4px 0'>" + PHP.number_format($usage) + ' bytes</div>';
		} else {
			$output .= "<div style='color:#5a0099;font-weight:normal;padding:4px 0 4px 0'>" + CI.lang.line('profiler_no_memory_usage') + "</div>";				
		}
		
		$output += "</fieldset>";

		return $output;
	}

	// --------------------------------------------------------------------
	
	/**
	 * Run the Profiler
	 *
	 * @access	private
	 * @return	string
	 */	
	CI_profiler.run = function() {
		var $output = "<div id='codeigniter_profiler' style='clear:both;background-color:#fff;padding:10px;'>";

		$output += this._compile_uri_string();
		$output += this._compile_controller_info();
		$output += this._compile_memory_usage();
		$output += this._compile_benchmarks();
		$output += this._compile_get();
		$output += this._compile_post();
		$output += this._compile_queries();

		$output += '</div>';

		return $output;
	}
	
	module.exports = CI_Profiler;
})();

// END CI_Profiler class

/* End of file Profiler.php */
/* Location: ./system/libraries/Profiler.php */