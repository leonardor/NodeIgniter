(function() {
	exports.character_limiter = function($str, $n, $end_char, $strict) {
		$n = $n || 500;
		$end_char = $end_char || '...';
		$strict = $strict || false;
		
		response.write('am incarcat character_limiter');
		return $str.substring(0, $n);
	}
})();