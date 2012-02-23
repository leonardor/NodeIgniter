(function() {
	exports.strip_slashes = function($str) {
		response.write('am incarcat strip_slashes');
		
		if (PHP.is_array($str)){	
			for(var $key in $str) {
				$str[$key] = strip_slashes($str[$key]);
			}
		} else {
			$str = PHP.stripslashes($str);
		}
	
		return $str;
	}
})();