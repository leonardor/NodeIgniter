(function() {
	/*
	 * PHP versions prior to 5.0 don't support the E_STRICT constant
	 * so we need to explicitly define it otherwise the Exception class 
	 * will generate errors when running under PHP 4
	 *
	 */
	if (!PHP.E_STRICT) {
		PHP.E_STRICT = 2048;
	}
	
	var CI_Compat = new function CI_Compat() {
		CI_Compat.__construct = function() {
			
		}
		/**
		 * ctype_digit()
		 *
		 * Determines if a string is comprised only of digits
		 * http://us.php.net/manual/en/function.ctype_digit.php
		 *
		 * @access	public
		 * @param	string
		 * @return	bool
		 */
		CI_Compat.ctype_digit = function($str) {
			if (PHP.is_string($str) == false || $str == '') {
				return false;
			}
			
			var regex = new RegExp('/[^0-9]/');
			return ($str.test(regex) == false);
		}	
		
		// --------------------------------------------------------------------
		
		/**
		 * ctype_alnum()
		 *
		 * Determines if a string is comprised of only alphanumeric characters
		 * http://us.php.net/manual/en/function.ctype-alnum.php
		 *
		 * @access	public
		 * @param	string
		 * @return	bool
		 */
		CI_Compat.ctype_alnum = function($str) {
			if (PHP.is_string($str) == false || $str == '') {
				return false;
			}
			
			var regex = new RegExp('/[^0-9a-z]/i');
			return ($str.text(regex) == false);
		}	
		
		return CI_Compat;
	}
	
	CI_Compat.prototype.constructor = CI_Compat.__construct();
	
	module.exports = CI_Compat;
})();