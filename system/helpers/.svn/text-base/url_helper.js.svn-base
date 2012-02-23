(function() {
	console.log('loading url helper...');
	
	exports.site_url = function($uri) {
		$uri = $uri || '';
		
		return CI_Config.item($uri);
	}
	
	exports.server_name = function($string) {
		$string = $string || '';
		
		if($string == '') {
			$string = PHP.$_SERVER['SERVER_NAME'];
		}

		$slash = (PHP.strpos($string, '.', 0) === false)?PHP.strlen($string):PHP.strpos($string, '.', 0);
		
		$domain = PHP.substr($string, 0, $slash);

		return $domain;
	}
	
	exports.base_domain = function($string) {
		$string = $string || '';
			
		if($string == '') {
			$string = 'http://'.PHP.$_SERVER['SERVER_NAME'];
		}
		
		PHP.preg_match('/http(s?)\:\/\//', $string, $matches, PHP.flag('PREG_OFFSET_CAPTURE'));
		
		$http = (!$matches)?0:($matches[0][1] + PHP.strlen($matches[0][0]));
		
		$slash = (PHP.strpos($string, '/', $http))?PHP.strpos($string, '/', $http)-$http:PHP.strlen($string);
		
		$domain = PHP.substr($string, $http, $slash);
		
		$reversed_full_domain = PHP.array_reverse(PHP.explode('.', $domain));
	
		$domain = PHP.join('.', PHP.array_reverse(PHP.array_splice($reversed_full_domain, 0, 2)));
		
		return $domain;
	}
	
	exports.base_url = function() {
		return CI_Config.slash_item('base_url');
	}
	
	exports.current_url = function() {
		return site_url(CI_URI.uri_string());
	}
	
	exports.uri_string = function() {
		return CI_URI.uri_string();
	}
	
	exports.index_page = function () {
		return CI_Config.item('index_page');
	}
	
	exports.anchor = function ($uri, $title, $attributes) {
		$uri = $uri || '';
		$title = $title || '';
		$attributes = $attributes || '';
	
		if ( ! PHP.is_array($uri)) {
			$site_url = ( ! PHP.preg_match('!^\w+://! i', $uri)) ? site_url($uri) : $uri;
		} else {
			$site_url = site_url($uri);
		}

		if ($title == '') {
			$title = $site_url;
		}

		if ($attributes != '') {
			$attributes = _parse_attributes($attributes);
		}

		return '<a href="' + $site_url + '"' + $attributes + '>' + $title + '</a>';
	}
	
	exports.anchor_popup = function ($uri, $title, $attributes) {
		$uri = $uri || '';
		$title = $title || '';
		$attributes = $attributes || false;
		
		$site_url = ( ! PHP.preg_match('!^\w+://! i', $uri)) ? site_url($uri) : $uri;

		if ($title == '') {
			$title = $site_url;
		}

		if ($attributes === false) {
			return "<a href='javascript:void(0);' onclick=\"window.open('" + $site_url + "', '_blank');\">" + $title + "</a>";
		}

		if ( ! PHP.is_array($attributes)) {
			$attributes = {};
		}

		var $attrs = {
			'width': '800',
			'height': '600',
			'scrollbars': 'yes',
			'status': 'yes',
			'resizable': 'yes',
			'screenx': '0',
			'screeny': '0'
		};
		
		var $atts = {};
		
		for(var $key in $attrs) {
			$atts[$key] = ( !$attributes[$key]) ? $attrs[$key] : $attributes[$key];
			PHP.unset($attributes[$key]);
		}

		if ($attributes != '') {
			$attributes = _parse_attributes($attributes);
		}

		return "<a href='javascript:void(0);' onclick=\"window.open('" + $site_url + "', '_blank', '" + _parse_attributes($atts, true) + "');\" " + $attributes + ">" + $title + "</a>";
	}
	
	exports.mailto = function ($email, $title, $attributes) {
		$title = $title || '';
		$attributes = $attributes || '';

		if ($title == "") {
			$title = $email;
		}

		$attributes = _parse_attributes($attributes);

		return '<a href="mailto:' + $email + '"' + $attributes + '>' + $title + '</a>';
	}
	
	exports.safe_mailto = function ($email, $title, $attributes) {
		$title = $title || '';
		$attributes = $attributes || '';
	
		if ($title == "") {
			$title = $email;
		}

		var $x = [];
		
		for (var $i = 0; $i < 16; $i++) {
			$x.push(PHP.substr('<a href="mailto:', $i, 1));
		}

		for (var $i = 0; $i < PHP.strlen($email); $i++) {
			$x.push("|" + PHP.ord(PHP.substr($email, $i, 1)));
		}

		$x.push('"');

		if ($attributes != '') {
			if (PHP.is_array($attributes)) {
				for(var $key in $attributes) {
					$x.push(' ' + $key + '="');
					
					for (var $i = 0; $i < PHP.strlen($attributes[$key]); $i++) {
						$x.push("|" + PHP.ord(PHP.substr($attributes[$key], $i, 1)));
					}
					$x.push('"');
				}
			} else {
				for (var $i = 0; $i < PHP.strlen($attributes); $i++) {
					$x.push(PHP.substr($attributes, $i, 1));
				}
			}
		}

		$x.push('>');

		var $temp = [];
		
		for (var $i = 0; $i < PHP.strlen($title); $i++) {
			var $ordinal = PHP.ord($title[$i]);

			if ($ordinal < 128) {
				$x.push("|" + $ordinal);
			} else {
				if (PHP.count($temp) == 0) {
					$count = ($ordinal < 224) ? 2 : 3;
				}
	
				$temp.push($ordinal);
				
				if (PHP.count($temp) == $count) {
					$number = ($count == 3) ? (($temp['0'] % 16) * 4096) + (($temp['1'] % 64) * 64) + ($temp['2'] % 64) : (($temp['0'] % 32) * 64) + ($temp['1'] % 64);
					$x.push("|" + $number);
					$count = 1;
					$temp = [];
				}
			}
		}

		$x.push('<'); $x.push('/'); $x.push('a'); $x.push('>');

		$x = PHP.array_reverse($x);

		var $js = '<script type="text/javascript">';
		$js += '//<![CDATA[';
		$js += 'var l=new Array();';
		
		var $i = 0;
		
		for(var $val in $x){ 
			$js += "l[" + ($i++) + "]='" + $val + "';";
		}

		$js += 'for (var i = l.length-1; i >= 0; i=i-1){';
			$js += 'if (l[i].substring(0, 1) == '|') document.write("&#"+unescape(l[i].substring(1))+";");';
			$js += 'else document.write(unescape(l[i]));';
		$js += '}';
		$js += '//]]>';
		$js += '</script>';
		
		return $js;
	}
	
	exports.auto_link = function ($str, $type, $popup) {
		$type = $type || 'both';
		$popup = $popup || false;
		
		if ($type != 'email') {
			if (PHP.preg_match_all("#(^|\s|\()((http(s?)://)|(www\.))(\w+[^\s\)\<]+)#i", $str, $matches)) {
				$pop = ($popup == true) ? " target=\"_blank\" " : "";
	
				for (var $i = 0; $i < PHP.count($matches['0']); $i++) {
					var $period = '';
					if (PHP.preg_match("|\.$|", $matches['6'][$i])) {
						$period = '.';
						$matches['6'][$i] = PHP.substr($matches['6'][$i], 0, -1);
					}
		
					$str = PHP.str_replace(
							$matches['0'][$i],
							$matches['1'][$i] + '<a href="http' + 
							$matches['4'][$i] + '://'.
							$matches['5'][$i] + 
							$matches['6'][$i] + '"' + $pop + '>http' +
							$matches['4'][$i] + '://' +
							$matches['5'][$i] + 
							$matches['6'][$i] + '</a>' + 
							$period,
							$str
						);
				}
			}
		}

		if ($type != 'url') {
			if (PHP.preg_match_all("/([a-zA-Z0-9_\.\-\+]+)@([a-zA-Z0-9\-]+)\.([a-zA-Z0-9\-\.]*)/i", $str, $matches)) {
				for (var $i = 0; $i < PHP.count($matches['0']); $i++) {
					var $period = '';
					if (PHP.preg_match("|\.$|", $matches['3'][$i])) {
						$period = '.';
						$matches['3'][$i] = PHP.substr($matches['3'][$i], 0, -1);
					}
		
					$str = PHP.str_replace(
							$matches['0'][$i],
							safe_mailto($matches['1'][$i] + '@' + $matches['2'][$i] + '.' + $matches['3'][$i]) +
							$period,
							$str
						);
				}
			}
		}

		return $str;
	}
	
	exports.prep_url = function ($str) {
		$str = str || '';
		
		if ($str == 'http://' || $str == '') {
			return '';
		}

		if (PHP.substr($str, 0, 7) != 'http://' && PHP.substr($str, 0, 8) != 'https://') {
			$str = 'http://' + $str;
		}

		return $str;
	}
	
	exports.url_title = function($str, $separator, $lowercase) {
		$separator = $separator || 'dash';
		$lowercase = $lowercase || true;
		
		if ($separator == 'dash') {
			var $search		= '_';
			var $replace	= '-';
		} else {
			var $search		= '-';
			var $replace	= '_';
		}

		var $trans = {};
		
		$trans[$search] = $replace;
		$trans["Ă"] = 'a';
		$trans["Î"] = 'i';
		$trans["A"] = 'a';
		$trans["Â"] = 'a';
		$trans["Ş"] = 's';
		$trans["Ţ"] = 't';
		$trans["á"] = 'a';
		$trans["ä"] = 'a';
		$trans["a"] = 'a';
		$trans["ă"] = 'a';
		$trans["â"] = 'a';
		$trans["e"] = 'e';
		$trans["ë"] = 'e';
		$trans["é"] = 'e';
		$trans["í"] = 'i';
		$trans["i"] = 'i';
		$trans["i"] = 'i';
		$trans["î"] = 'i';
		$trans["n"] = 'n';
		$trans["ş"] = 's';
		$trans["ó"] = 'o';
		$trans["o"] = 'o';
		$trans["ö"] = 'o';
		$trans["ü"] = 'u';  
		$trans["u"] = 'u';
		$trans["ú"] = 'u';
		$trans["ţ"] = 't';
		$trans["&\\#\\d+?;"] = '';
		$trans["&\\S+?;"] = '';
		$trans["\\s+"] = $replace;
		$trans["[^a-z0-9\\-\\._\\/]"] = '';
		$trans[$replace + "+"] = $replace;
		$trans[$replace + "$"] = $replace;
		$trans["^" + $replace] = $replace;
		$trans["\\.+$"] = '';

		$str = PHP.strip_tags($str);
		
		for (var $key in $trans) {
			var regex = new RegExp($key, 'gi');
			$str = $str.replace(regex, $trans[$key]);
		}

		if ($lowercase === true) {
			$str = PHP.strtolower($str);
		}
	
		return PHP.trim(PHP.stripslashes($str));
	}
	
	exports.redirect = function ($uri, $method, $http_response_code) {
		$uri = $uri || '';
		$method = $method || 'location';
		$http_response_code = $http_response_code || 302;
		
		if ( ! PHP.preg_match('#^https?://#i', $uri)) {
			$uri = site_url($uri);
		}
		
		switch($method) {
			case 'refresh':
				PHP.header("Refresh:0;url=" + $uri);
				break;
			default:
				PHP.header("Location: " + $uri, true, $http_response_code);
				break;
		}
		
		return;
	}
	
	exports._parse_attributes = function($attributes, $javascript) {
		$javascript = $javascript || false;
		
		if (PHP.is_string($attributes)) {
			return ($attributes != '') ? ' '.$attributes : '';
		}

		var $att = '';
		
		for(var $key in $attributes) {
			if ($javascript == true) {
				$att += $key + '=' + $attributes[$key] + ',';
			} else {
				$att += ' ' + $key + '="' + $val + '"';
			}
		}

		if ($javascript == true && $att != '') {
			$att = PHP.substr($att, 0, -1);
		}

		return $att;
	}
})();