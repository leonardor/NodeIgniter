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
 * Input Class
 *
 * Pre-processes global input data for security
 *
 * @package		CodeIgniter
 * @subpackage	Libraries
 * @category	Input
 * @author		ExpressionEngine Dev Team
 * @link		http://codeigniter.com/user_guide/libraries/input.html
 */
	function CI_Input() {
		var $use_xss_clean		= false;
		var $xss_hash			= '';
		var $ip_address			= false;
		var $user_agent			= false;
		var $allow_get_array	= false;
	
		/* never allowed, string replacement */
		var $never_allowed_str = {
			'document.cookie': '[removed]',
			'document.write': '[removed]',
			'.parentNode': '[removed]',
			'.innerHTML': '[removed]',
			'window.location': '[removed]',
			'-moz-binding': '[removed]',
			'<!--': '&lt;!--',
			'-->': '--&gt;',
			'<![CDATA[': '&lt;![CDATA['
		};
		
		/* never allowed, regex replacement */
		var $never_allowed_regex = {
			"javascript\s*:": '[removed]',
			"expression\s*(\(|&\#40;)": '[removed]', // CSS and IE
			"vbscript\s*:": '[removed]', // IE, surprise!
			"Redirect\s+302": '[removed]'
		};
	
		/**
		* Constructor
		*
		* Sets whether to globally enable the XSS processing
		* and whether to allow the $_GET array
		*
		* @access	public
		*/
		this.__construct = function() {
			CI_Common.log_message('debug', "Input Class Initialized");
	
			$use_xss_clean	= (CI_Common.config_item('global_xss_filtering') === true) ? true : false;
			$allow_get_array	= (CI_Common.config_item('enable_query_strings') === true) ? true : false;
			this._sanitize_globals();
		}
	
		// --------------------------------------------------------------------
	
		/**
		* Sanitize Globals
		*
		* This function does the following:
		*
		* Unsets $_GET data (if query strings are not enabled)
		*
		* Unsets all globals if register_globals is enabled
		*
		* Standardizes newline characters to \n
		*
		* @access	private
		* @return	void
		*/
		this._sanitize_globals = function() {
			// Would kind of be "wrong" to unset any of these GLOBALS
			var $protected = ['_SERVER', '_GET', '_POST', '_FILES', '_REQUEST', '_SESSION', '_ENV', 'GLOBALS', 'HTTP_RAW_POST_DATA',
								'system_folder', 'application_folder', 'BM', 'EXT', 'CFG', 'URI', 'RTR', 'OUT', 'IN'];
	
			// Unset globals for security. 
			// This is effectively the same as register_globals = off
			for(var $global in [PHP.$_GET, PHP.$_POST, PHP.$_COOKIE, PHP.$_SERVER, PHP.$_FILES, PHP.$_ENV, (PHP.$_SESSION && PHP.is_array(PHP.$_SESSION)) ? PHP.$_SESSION : {}]) {
				if ( ! PHP.is_array($global)) {
					if ( ! PHP.in_array($global, $protected)) {
						PHP.unset(PHP.$GLOBALS[$global]);
					}
				} else {
					for($key in $global) {
						if ( ! PHP.in_array($key, $protected)) {
							PHP.unset(PHP.$GLOBALS[$key]);
						}
	
						if (PHP.is_array($globa[$key])) {
							for($k in $globa[$key]) {
								if ( ! PHP.in_array($k, $protected)) {
									PHP.unset($GLOBALS[$k]);
								}
							}
						}
					}
				}
			}
	
			// Is $_GET data allowed? If not we'll set the $_GET to an empty array
			if ($allow_get_array == false) {
				PHP.$_GET = {};
			} else {
				PHP.$_GET = this._clean_input_data(PHP.$_GET);
			}
	
			// Clean $_POST Data
			PHP.$_POST = this._clean_input_data(PHP.$_POST);
	
			// Clean $_COOKIE Data
			// Also get rid of specially treated cookies that might be set by a server
			// or silly application, that are of no use to a CI application anyway
			// but that when present will trip our 'Disallowed Key Characters' alarm
			// http://www.ietf.org/rfc/rfc2109.txt
			// note that the key names below are single quoted strings, and are not PHP variables
			try {
				PHP.unset(PHP.$_COOKIES['$Version']);
			} catch(e) {
				
			}
			try {
				PHP.unset(PHP.$_COOKIES['$Path']);
			} catch(e) {
				
			}
			try {
				PHP.unset(PHP.$_COOKIES['$Domain']);
			} catch(e) {
				
			}
			PHP.$_COOKIES = this._clean_input_data(PHP.$_COOKIES);
	
			CI_Common.log_message('debug', "Global POST and COOKIE data sanitized");
		}
	
		// --------------------------------------------------------------------
	
		/**
		* Clean Input Data
		*
		* This is a helper function. It escapes data and
		* standardizes newline characters to \n
		*
		* @access	private
		* @param	string
		* @return	string
		*/
		this._clean_input_data = function($str) {
			if (PHP.is_array($str)) {
				var $new_array = [];
				for($key in $str) {
					$new_array[this._clean_input_keys($key)] = this._clean_input_data($str[$key]);
				}
				return $new_array;
			}
	
			// We strip slashes if magic quotes is on to keep things consistent
			if (PHP.get_magic_quotes_gpc()) {
				$str = PHP.stripslashes($str);
			}
	
			// Should we filter the input data?
			if ($use_xss_clean === true) {
				$str = this.xss_clean($str);
			}
	
			// Standardize newlines
			if (PHP.strpos($str, "\r") !== false) {
				$str = PHP.str_replace(["\r\n", "\r"], "\n", $str);
			}
	
			return $str;
		}
	
		// --------------------------------------------------------------------
	
		/**
		* Clean Keys
		*
		* This is a helper function. To prevent malicious users
		* from trying to exploit keys we make sure that keys are
		* only named with alpha-numeric text and a few other items.
		*
		* @access	private
		* @param	string
		* @return	string
		*/
		this._clean_input_keys = function($str) {
			if ( ! PHP.preg_match("/^[a-z0-9:_\/-]+$/i", $str))
			{
				PHP.exit('Disallowed Key Characters.');
			}
	
			return $str;
		}
	
		// --------------------------------------------------------------------
	
		/**
		* Fetch from array
		*
		* This is a helper function to retrieve values from global arrays
		*
		* @access	private
		* @param	array
		* @param	string
		* @param	bool
		* @return	string
		*/
		this._fetch_from_array = function($array, $index, $xss_clean) {
			if ( ! PHP.isset($array[$index])) {
				return false;
			}
	
			if ($xss_clean === true) {
				return this.xss_clean($array[$index]);
			}
	
			return $array[$index];
		}
	
		// --------------------------------------------------------------------
	
		/**
		* Fetch an item from the GET array
		*
		* @access	public
		* @param	string
		* @param	bool
		* @return	string
		*/
		this.get = function($index, $xss_clean) {
			return this._fetch_from_array(PHP.$_GET, $index, $xss_clean);
		}
	
		// --------------------------------------------------------------------
	
		/**
		* Fetch an item from the POST array
		*
		* @access	public
		* @param	string
		* @param	bool
		* @return	string
		*/
		this.post = function($index, $xss_clean) {
			return this._fetch_from_array(PHP.$_POST, $index, $xss_clean);
		}
	
		// --------------------------------------------------------------------
	
		/**
		* Fetch an item from either the GET array or the POST
		*
		* @access	public
		* @param	string	The index key
		* @param	bool	XSS cleaning
		* @return	string
		*/
		this.get_post = function($index, $xss_clean) {
			if ( ! PHP.isset(PHP.$_POST[$index]) ) {
				return this.get($index, $xss_clean);
			}
			else
			{
				return this.post($index, $xss_clean);
			}
		}
	
		// --------------------------------------------------------------------
	
		/**
		* Fetch an item from the COOKIE array
		*
		* @access	public
		* @param	string
		* @param	bool
		* @return	string
		*/
		this.cookie = function($index, $xss_clean) {
			return this._fetch_from_array(PHP.$_COOKIE, $index, $xss_clean);
		}
	
		// --------------------------------------------------------------------
	
		/**
		* Fetch an item from the SERVER array
		*
		* @access	public
		* @param	string
		* @param	bool
		* @return	string
		*/
		this.server = function($index, $xss_clean) {
			return this._fetch_from_array(PHP.$_SERVER, $index, $xss_clean);
		}
	
		// --------------------------------------------------------------------
	
		/**
		* Fetch the IP Address
		*
		* @access	public
		* @return	string
		*/
		this.ip_address = function() {
			if ($ip_address !== false) {
				return $ip_address;
			}
			
			if (CI_Common.config_item('proxy_ips') != '' && this.server('HTTP_X_FORWARDED_FOR') && this.server('REMOTE_ADDR')) {
				$proxies = PHP.preg_split('/[\s,]/', CI_Common.config_item('proxy_ips'), -1, PHP.flag.PREG_SPLIT_NO_EMPTY);
				$proxies = PHP.is_array($proxies) ? $proxies : [];
	
				$ip_address = PHP.in_array(PHP.$_SERVER['REMOTE_ADDR'], $proxies) ? PHP.$_SERVER['HTTP_X_FORWARDED_FOR'] : PHP.$_SERVER['REMOTE_ADDR'];
			} else if (this.server('REMOTE_ADDR') && this.server('HTTP_CLIENT_IP')) {
				$ip_address = PHP.$_SERVER['HTTP_CLIENT_IP'];
			} else if (this.server('REMOTE_ADDR')) {
				$ip_address = PHP.$_SERVER['REMOTE_ADDR'];
			} else if (this.server('HTTP_CLIENT_IP')) {
				$ip_address = PHP.$_SERVER['HTTP_CLIENT_IP'];
			} else if (this.server('HTTP_X_FORWARDED_FOR')) {
				$ip_address = PHP.$_SERVER['HTTP_X_FORWARDED_FOR'];
			}
	
			if ($ip_address == false) {
				$ip_address = '0.0.0.0';
				return $ip_address;
			}
	
			if(PHP.strstr($ip_address, ',')) {
				$x = PHP.explode(',', $ip_address);
				$ip_address = PHP.trim(PHP.end($x));
			}
	
			if ( ! this.valid_ip($ip_address)) {
				$ip_address = '0.0.0.0';
			}
	
			return $ip_address;
		}
	
		// --------------------------------------------------------------------
	
		/**
		* Validate IP Address
		*
		* Updated version suggested by Geert De Deckere
		* 
		* @access	public
		* @param	string
		* @return	string
		*/
		this.valid_ip = function($ip) {
			var $ip_segments = PHP.explode('.', $ip);
	
			// Always 4 segments needed
			if (PHP.count($ip_segments) != 4) {
				return false;
			}
			// IP can not start with 0
			if ($ip_segments[0][0] == '0') {
				return false;
			}
			// Check each segment
			for($segment in $ip_segments)
			{
				// IP segments must be digits and can not be 
				// longer than 3 digits or greater then 255
				if ($segment == '' || PHP.preg_match("/[^0-9]/", $segment) || $segment > 255 || PHP.strlen($segment) > 3) {
					return false;
				}
			}
	
			return true;
		}
	
		// --------------------------------------------------------------------
	
		/**
		* User Agent
		*
		* @access	public
		* @return	string
		*/
		this.user_agent = function() {
			if ($user_agent != false) {
				return $user_agent;
			}
	
			$user_agent = ( ! PHP.isset(PHP.$_SERVER['HTTP_USER_AGENT'])) ? false : PHP.$_SERVER['HTTP_USER_AGENT'];
	
			return $user_agent;
		}
	
		// --------------------------------------------------------------------
	
		/**
		* Filename Security
		*
		* @access	public
		* @param	string
		* @return	string
		*/
		this.filename_security = function($str) {
			var $bad = [
							"../",
							"./",
							"<!--",
							"-->",
							"<",
							">",
							"'",
							'"',
							'&',
							'$',
							'#',
							'{',
							'}',
							'[',
							']',
							'=',
							';',
							'?',
							"%20",
							"%22",
							"%3c",		// <
							"%253c", 	// <
							"%3e", 		// >
							"%0e", 		// >
							"%28", 		// (  
							"%29", 		// ) 
							"%2528", 	// (
							"%26", 		// &
							"%24", 		// $
							"%3f", 		// ?
							"%3b", 		// ;
							"%3d"		// =
						];
	
			return PHP.stripslashes(PHP.str_replace($bad, '', $str));
		}
	
		// --------------------------------------------------------------------
	
		/**
		* XSS Clean
		*
		* Sanitizes data so that Cross Site Scripting Hacks can be
		* prevented.  This function does a fair amount of work but
		* it is extremely thorough, designed to prevent even the
		* most obscure XSS attempts.  Nothing is ever 100% foolproof,
		* of course, but I haven't been able to get anything passed
		* the filter.
		*
		* Note: This function should only be used to deal with data
		* upon submission.  It's not something that should
		* be used for general runtime processing.
		*
		* This function was based in part on some code and ideas I
		* got from Bitflux: http://blog.bitflux.ch/wiki/XSS_Prevention
		*
		* To help develop this script I used this great list of
		* vulnerabilities along with a few other hacks I've
		* harvested from examining vulnerabilities in other programs:
		* http://ha.ckers.org/xss.html
		*
		* @access	public
		* @param	string
		* @return	string
		*/
		this.xss_clean = function($str, $is_image) {
			/*
			* Is the string an array?
			*
			*/
			if (PHP.is_array($str)) {
				while ([$key] = PHP.each($str)) {
					$str[$key] = this.xss_clean($str[$key]);
				}
	
				return $str;
			}
	
			/*
			* Remove Invisible Characters
			*/
			$str = this._remove_invisible_characters($str);
	
			/*
			* Protect GET variables in URLs
			*/
	
			// 901119URL5918AMP18930PROTECT8198
	
			$str = PHP.preg_replace('|\&([a-z\_0-9]+)\=([a-z\_0-9]+)|i', this.xss_hash() + "\\1=\\2", $str);
	
			/*
			* Validate standard character entities
			*
			* Add a semicolon if missing.  We do this to enable
			* the conversion of entities to ASCII later.
			*
			*/
			$str = PHP.preg_replace('#(&\#?[0-9a-z]{2,})([\x00-\x20])*;?#i', "\\1;\\2", $str);
	
			/*
			* Validate UTF16 two byte encoding (x00) 
			*
			* Just as above, adds a semicolon if missing.
			*
			*/
			$str = PHP.preg_replace('#(&\#x?)([0-9A-F]+);?#i',"\\1\\2;", $str);
	
			/*
			* Un-Protect GET variables in URLs
			*/
			$str = $str.replace(this.xss_hash(), '&');
	
			/*
			* URL Decode
			*
			* Just in case stuff like this is submitted:
			*
			* <a href="http://%77%77%77%2E%67%6F%6F%67%6C%65%2E%63%6F%6D">Google</a>
			*
			* Note: Use rawurldecode() so it does not remove plus signs
			*
			*/
			$str = PHP.rawurldecode($str);
	
			/*
			* Convert character entities to ASCII 
			*
			* This permits our tests below to work reliably.
			* We only convert entities that are within tags since
			* these are the ones that will pose security problems.
			*
			*/
	
			$str = PHP.preg_replace_callback("/[a-z]+=([\'\"]).*?\\1/si", [this, '_convert_attribute'], $str);
	
			$str = PHP.preg_replace_callback("/<\w+.*?(?=>|<|$)/si", [this, '_html_entity_decode_callback'], $str);
	
			/*
			* Remove Invisible Characters Again!
			*/
			$str = this._remove_invisible_characters($str);
	
			/*
			* Convert all tabs to spaces
			*
			* This prevents strings like this: ja	vascript
			* NOTE: we deal with spaces between characters later.
			* NOTE: preg_replace was found to be amazingly slow here on large blocks of data,
			* so we use str_replace.
			*
			*/
	
	 		if (PHP.strpos($str, "\t") !== false)
			{
				$str = $str.replace("\t", ' ');
			}
	
			/*
			* Capture converted string for later comparison
			*/
			$converted_string = $str;
	
			/*
			* Not Allowed Under Any Conditions
			*/
	
			for($key in $never_allowed_str) {
				$str = $str.replace($key, $never_allowed_str[$key]);   
			}
	
			for($key in $never_allowed_regex) {
				$str = $str.replace("#" + $key + "#i", $never_allowed_regex[$key]);   
			}
	
			/*
			* Makes PHP tags safe
			*
			*  Note: XML tags are inadvertently replaced too:
			*
			*	<?xml
			*
			* But it doesn't seem to pose a problem.
			*
			*/
			if ($is_image === true) {
				// Images have a tendency to have the PHP short opening and closing tags every so often
				// so we skip those and only do the long opening tags.
				$str = PHP.preg_replace('/<\?(php)/i', "&lt;?\\1", $str);
			}
			else
			{
				$str = PHP.str_replace(['<?', '?' + '>'],  ['&lt;?', '?&gt;'], $str);
			}
	
			/*
			* Compact any exploded words
			*
			* This corrects words like:  j a v a s c r i p t
			* These words are compacted back to their correct state.
			*
			*/
			$words = ['javascript', 'expression', 'vbscript', 'script', 'applet', 'alert', 'document', 'write', 'cookie', 'window'];
			
			for($word in $words) {
				$temp = '';
	
				for ($i = 0, $wordlen = strlen($word); $i < $wordlen; $i++) {
					$temp += PHP.substr($word, $i, 1) + "\s*";
				}
	
				// We only want to do this when it is followed by a non-word character
				// That way valid stuff like "dealer to" does not become "dealerto"
				$str = PHP.preg_replace_callback('#(' + PHP.substr($temp, 0, -3) + ')(\W)#is', [this, '_compact_exploded_words'], $str);
			}
	
			/*
			* Remove disallowed Javascript in links or img tags
			* We used to do some version comparisons and use of stripos for PHP5, but it is dog slow compared
			* to these simplified non-capturing preg_match(), especially if the pattern exists in the string
			*/
			do {
				$original = $str;
	
				if (PHP.preg_match("/<a/i", $str)) {
					$str = PHP.preg_replace_callback("#<a\s+([^>]*?)(>|$)#si", [this, '_js_link_removal'], $str);
				}
	
				if (PHP.preg_match("/<img/i", $str)) {
					$str = PHP.preg_replace_callback("#<img\s+([^>]*?)(\s?/?>|$)#si", [this, '_js_img_removal'], $str);
				}
	
				if (PHP.preg_match("/script/i", $str) || PHP.preg_match("/xss/i", $str)) {
					$str = PHP.preg_replace("#<(/*)(script|xss)(.*?)\>#si", '[removed]', $str);
				}
			}
			while($original != $str);
	
			PHP.unset($original);
	
			/*
			* Remove JavaScript Event Handlers
			*
			* Note: This code is a little blunt.  It removes
			* the event handler and anything up to the closing >,
			* but it's unlikely to be a problem.
			*
			*/
			$event_handlers = ['[^a-z_\-]on\w*','xmlns'];
	
			if ($is_image == true) {
				/*
				* Adobe Photoshop puts XML metadata into JFIF images, including namespacing, 
				* so we have to allow this for images. -Paul
				*/
				PHP.unset($event_handlers[PHP.array_search('xmlns', $event_handlers)]);
			}
	
			$str = PHP.preg_replace("#<([^><]+?)(" + PHP.implode('|', $event_handlers) + ")(\s*=\s*[^><]*)([><]*)#i", "<\\1\\4", $str);
	
			/*
			* Sanitize naughty HTML elements
			*
			* If a tag containing any of the words in the list
			* below is found, the tag gets converted to entities.
			*
			* So this: <blink>
			* Becomes: &lt;blink&gt;
			*
			*/
			$naughty = 'alert|applet|audio|basefont|base|behavior|bgsound|blink|body|embed|expression|form|frameset|frame|head|html|ilayer|iframe|input|isindex|layer|link|meta|object|plaintext|style|script|textarea|title|video|xml|xss';
			$str = PHP.preg_replace_callback('#<(/*\s*)(' + $naughty + ')([^><]*)([><]*)#is', [this, '_sanitize_naughty_html'], $str);
	
			/*
			* Sanitize naughty scripting elements
			*
			* Similar to above, only instead of looking for
			* tags it looks for PHP and JavaScript commands
			* that are disallowed.  Rather than removing the
			* code, it simply converts the parenthesis to entities
			* rendering the code un-executable.
			*
			* For example:	eval('some code')
			* Becomes:		eval&#40;'some code'&#41;
			*
			*/
			$str = PHP.preg_replace('#(alert|cmd|passthru|eval|exec|expression|system|fopen|fsockopen|file|file_get_contents|readfile|unlink)(\s*)\((.*?)\)#si', "\\1\\2&#40;\\3&#41;", $str);
	
			/*
			* Final clean up
			*
			* This adds a bit of extra precaution in case
			* something got through the above filters
			*
			*/
			for($key in $never_allowed_str) {
				$str = $str.replace($key, $never_allowed_str[$key]);   
			}
	
			for($key in $never_allowed_regex) {
				$str = $str.replace("#" + $key + "#i", $never_allowed_regex[$key]);
			}
	
			/*
			*  Images are Handled in a Special Way
			*  - Essentially, we want to know that after all of the character conversion is done whether
			*  any unwanted, likely XSS, code was found.  If not, we return TRUE, as the image is clean.
			*  However, if the string post-conversion does not matched the string post-removal of XSS,
			*  then it fails, as there was unwanted XSS code found and removed/changed during processing.
			*/
	
			if ($is_image == true) {
				if ($str == $converted_string) {
					return true;
				} else {
					return false;
				}
			}
	
			CI_Common.log_message('debug', "XSS Filtering completed");
			return $str;
		}
	
		// --------------------------------------------------------------------
	
		/**
		* Random Hash for protecting URLs
		*
		* @access	public
		* @return	string
		*/
		this.xss_hash = function() {
			if ($xss_hash == '') {
				if (PHP.phpversion() >= 4.2) {
					PHP.mt_srand();
				} else {
					PHP.mt_srand(PHP.hexdec(PHP.substr(PHP.md5(PHP.microtime()), -8)) & 0x7fffffff);
				}
				
				$xss_hash = PHP.md5(PHP.time() + PHP.mt_rand(0, 1999999999));
			}
	
			return $xss_hash;
		}
	
		// --------------------------------------------------------------------
	
		/**
		* Remove Invisible Characters
		*
		* This prevents sandwiching null characters
		* between ascii characters, like Java\0script.
		*
		* @access	public
		* @param	string
		* @return	string
		*/
		this._remove_invisible_characters = function($str) {
			var $non_displayables;
	
			if ( ! PHP.isset($non_displayables)) {
				// every control character except newline (dec 10), carriage return (dec 13), and horizontal tab (dec 09),
				$non_displayables = [
										'/%0[0-8bcef]/',			// url encoded 00-08, 11, 12, 14, 15
										'/%1[0-9a-f]/',				// url encoded 16-31
										'/[\x00-\x08]/',			// 00-08
										'/\x0b/', '/\x0c/',			// 11, 12
										'/[\x0e-\x1f]/'				// 14-31
									];
			}
	
			do {
				$cleaned = $str;
				$str = PHP.preg_replace($non_displayables, '', $str);
			}
			while ($cleaned != $str);
	
			return $str;
		}
	
		// --------------------------------------------------------------------
	
		/**
		* Compact Exploded Words
		*
		* Callback function for xss_clean() to remove whitespace from
		* things like j a v a s c r i p t
		*
		* @access	public
		* @param	type
		* @return	type
		*/
		this._compact_exploded_words = function($matches) {
			return PHP.preg_replace('/\s+/s', '', $matches[1]).$matches[2];
		}
	
		// --------------------------------------------------------------------
	
		/**
		* Sanitize Naughty HTML
		*
		* Callback function for xss_clean() to remove naughty HTML elements
		*
		* @access	private
		* @param	array
		* @return	string
		*/
		this._sanitize_naughty_html = function($matches) {
			// encode opening brace
			var $str = '&lt;' + $matches[1] + $matches[2] + $matches[3];
	
			// encode captured opening or closing brace to prevent recursive vectors
			$str += PHP.str_replace(['>', '<'], ['&gt;', '&lt;'], $matches[4]);
	
			return $str;
		}
	
		// --------------------------------------------------------------------
	
		/**
		* JS Link Removal
		*
		* Callback function for xss_clean() to sanitize links
		* This limits the PCRE backtracks, making it more performance friendly
		* and prevents PREG_BACKTRACK_LIMIT_ERROR from being triggered in
		* PHP 5.2+ on link-heavy strings
		*
		* @access	private
		* @param	array
		* @return	string
		*/
		this._js_link_removal = function($match) {
			var $attributes = this._filter_attributes(PHP.str_replace(['<', '>'], '', $match[1]));
			return PHP.str_replace($match[1], PHP.preg_replace("#href=.*?(alert\(|alert&\#40;|javascript\:|charset\=|window\.|document\.|\.cookie|<script|<xss|base64\s*,)#si", "", $attributes), $match[0]);
		}
	
		/**
		* JS Image Removal
		*
		* Callback function for xss_clean() to sanitize image tags
		* This limits the PCRE backtracks, making it more performance friendly
		* and prevents PREG_BACKTRACK_LIMIT_ERROR from being triggered in
		* PHP 5.2+ on image tag heavy strings
		*
		* @access	private
		* @param	array
		* @return	string
		*/
		this._js_img_removal = function($match) {
			var $attributes = this._filter_attributes(PHP.str_replace(['<', '>'], '', $match[1]));
			return PHP.str_replace($match[1], PHP.preg_replace("#src=.*?(alert\(|alert&\#40;|javascript\:|charset\=|window\.|document\.|\.cookie|<script|<xss|base64\s*,)#si", "", $attributes), $match[0]);
		}
	
		// --------------------------------------------------------------------
	
		/**
		* Attribute Conversion
		*
		* Used as a callback for XSS Clean
		*
		* @access	public
		* @param	array
		* @return	string
		*/
		this._convert_attribute = function($match) {
			return PHP.str_replace(['>', '<', '\\'], ['&gt;', '&lt;', '\\\\'], $match[0]);
		}
	
		// --------------------------------------------------------------------
	
		/**
		* HTML Entity Decode Callback
		*
		* Used as a callback for XSS Clean
		*
		* @access	public
		* @param	array
		* @return	string
		*/
		this._html_entity_decode_callback = function($match) {
			var $charset = CI_Common.config_item('charset');
	
			return this._html_entity_decode($match[0], PHP.strtoupper($charset));
		}
	
		// --------------------------------------------------------------------
	
		/**
		* HTML Entities Decode
		*
		* This function is a replacement for html_entity_decode()
		*
		* In some versions of PHP the native function does not work
		* when UTF-8 is the specified character set, so this gives us
		* a work-around.  More info here:
		* http://bugs.php.net/bug.php?id=25670
		*
		* @access	private
		* @param	string
		* @param	string
		* @return	string
		*/
		/* -------------------------------------------------
		/*  Replacement for html_entity_decode()
		/* -------------------------------------------------*/
	
		/*
		NOTE: html_entity_decode() has a bug in some PHP versions when UTF-8 is the
		character set, and the PHP developers said they were not back porting the
		fix to versions other than PHP 5.x.
		*/
		this._html_entity_decode = function($str, $charset) {
			if (PHP.stristr($str, '&') == false) return $str;
	
			// The reason we are not using html_entity_decode() by itself is because
			// while it is not technically correct to leave out the semicolon
			// at the end of an entity most browsers will still interpret the entity
			// correctly.  html_entity_decode() does not convert entities without
			// semicolons, so we are left with our own little solution here. Bummer.
	
			if (PHP.function_exists('html_entity_decode') && (PHP.strtolower($charset) != 'utf-8' || PHP.version_compare(PHP.phpversion(), '5.0.0', '>='))) {
				$str = PHP.html_entity_decode($str, PHP.flag.ENT_COMPAT, $charset);
				$str = PHP.preg_replace('~&#x(0*[0-9a-f]{2,5})~ei', 'chr(hexdec("\\1"))', $str);
				return PHP.preg_replace('~&#([0-9]{2,4})~e', 'chr(\\1)', $str);
			}
	
			// Numeric Entities
			$str = PHP.preg_replace('~&#x(0*[0-9a-f]{2,5});{0,1}~ei', 'chr(hexdec("\\1"))', $str);
			$str = PHP.preg_replace('~&#([0-9]{2,4});{0,1}~e', 'chr(\\1)', $str);
	
			// Literal Entities - Slightly slow so we do another check
			if (PHP.stristr($str, '&') == false) {
				$str = PHP.strtr($str, PHP.array_flip(PHP.get_html_translation_table(PHP.flag('HTML_ENTITIES'))));
			}
	
			return $str;
		}
	
		// --------------------------------------------------------------------
	
		/**
		* Filter Attributes
		*
		* Filters tag attributes for consistency and safety
		*
		* @access	public
		* @param	string
		* @return	string
		*/
		this._filter_attributes = function($str) {
			var $out = '';
	
			if (PHP.preg_match_all('#\s*[a-z\-]+\s*=\s*(\042|\047)([^\\1]*?)\\1#is', $str, $matches)) {
				for($match in $matches[0]) {
					$out += PHP.preg_replace("#/\*.*?\*/#s", '', $match);
				}
			}
	
			return $out;
		}
	
		// --------------------------------------------------------------------
	
		return this;
	}

	module.exports = CI_Input;
})();
// END Input class

/* End of file Input.php */
/* Location: ./system/libraries/Input.php */