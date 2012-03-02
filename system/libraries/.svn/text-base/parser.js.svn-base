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
	 * Parser Class
	 *
	 * @package		CodeIgniter
	 * @subpackage	Libraries
	 * @category	Parser
	 * @author		ExpressionEngine Dev Team
	 * @link		http://codeigniter.com/user_guide/libraries/parser.html
	 */
	var CI_Parser = {};

	CI_Parser = Object.create(Events.EventEmitter.prototype);
	
	CI_Parser.parent = Events.EventEmitter.prototype;
	CI_Parser.name = 'CI_Parser';

	CI_Parser.$l_delim = '{';
	CI_Parser.$r_delim = '}';
	CI_Parser.$object;
			
	CI_Parser.__construct = function() {
		CI_Common.log_message('debug', "Parser Class Initialized");
		
		return this;
		
	}
	
	CI_Parser.__load = function(random) {
		console.log('emitting ' + this.name + '.__load event... (' + random + ')');
		this.emit('__load', this);
		
		return this;
	}
	/**
	 *  Parse a template
	 *
	 * Parses pseudo-variables contained in the specified template,
	 * replacing them with the data in the second param
	 *
	 * @access	public
	 * @param	string
	 * @param	array
	 * @param	bool
	 * @return	string
	 */
	CI_Parser.parse = function($template, $data, $return) {
		$return = $return || false;
	
		$template = CI.load.view($template, $data, true);
		
		if ($template == '') {
			return false;
		}
		
		for(var $key in $data) {
			if (PHP.is_array($data[$key])) {
				$template = this._parse_pair($key, $data[$key], $template);		
			} else {
				$template = this._parse_single($key, $data[$key], $template);
			}
		}
		
		if ($return == false) {
			CI_Output.append_output($template);
		}
		
		return $template;
	}
		
	// --------------------------------------------------------------------
	
	/**
	 *  Set the left/right variable delimiters
	 *
	 * @access	public
	 * @param	string
	 * @param	string
	 * @return	void
	 */
	CI_Parser.set_delimiters = function ($l, $r) {
		$l = $l || '{';
		$r = $r || '}';
			
		this.$l_delim = $l;
		this.$r_delim = $r;
	}
		
	// --------------------------------------------------------------------
	
	/**
	 *  Parse a single key/value
	 *
	 * @access	private
	 * @param	string
	 * @param	string
	 * @param	string
	 * @return	string
	 */
	CI_Parser._parse_single = function($key, $val, $string) {
		return PHP.str_replace(this.$l_delim + $key + this.$r_delim, $val, $string);
	}
	
	// --------------------------------------------------------------------
	
	/**
	 *  Parse a tag pair
	 *
	 * Parses tag pairs:  {some_tag} string... {/some_tag}
	 *
	 * @access	private
	 * @param	string
	 * @param	array
	 * @param	string
	 * @return	string
	 */
	CI_Parser._parse_pair = function ($variable, $data, $string) {	
		var $match = this._match_pair($string, $variable);

		if ($match === false) {
			return $string;
		}

		var $str = '';
		
		for(var $row in $data) {
			var $temp = $match[1];
			
			for(var $key in $row) {
				if ( ! PHP.is_array($row[$key])) {
					$temp = this._parse_single($key, $row[$key], $temp);
				} else {
					$temp = this._parse_pair($key, $row[$key], $temp);
				}
			}
			
			$str += $temp;
		}
		
		return PHP.str_replace($match[0], $str, $string);
	}
	
	// --------------------------------------------------------------------
	
	/**
	 *  Matches a variable pair
	 *
	 * @access	private
	 * @param	string
	 * @param	string
	 * @return	mixed
	 */
	CI_Parser._match_pair = function ($string, $variable) {
		var $matches = [];
		
		if ( ! PHP.preg_match("|" + this.$l_delim + $variable + this.$r_delim + "(.+?)" + this.$l_delim + '/' + $variable + this.$r_delim + "|s", $string, $matches)) {
			return false;
		}
		
		return $matches;
	}

	module.exports = CI_Parser;
})();
// END Parser Class

/* End of file Parser.php */
/* Location: ./system/libraries/Parser.php */