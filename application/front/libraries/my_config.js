(function() {
	function MY_Config() {
		MY_Config.super_.call(this).__construct();
		
		var $config = {};
		var $is_loaded = [];
		
		this.load = function($file, $use_sections, $fail_gracefully) {
			$file = $file || '';
			$use_sections = $use_sections || false;
			$fail_gracefully = $fail_gracefully || false;
			
			var $file = ($file == '') ? 'config' : PHP.str_replace(PHP.constant('EXT'), '', $file);
		
			if(PHP.in_array($file, $is_loaded, true)) {
				return true;
			}
	
			if ( ! PHP.file_exists(PHP.constant('APPPATH') + 'config/' + $file + PHP.constant('EXT'))) {
				if ( ! PHP.file_exists(PHP.constant('BASEPATH') + 'config/' + $file + PHP.constant('EXT'))) {
					if ($fail_gracefully === TRUE) {
						return false;
					}
					CI_Common.show_error('The configuration file ' + $file + PHP.constant('EXT') + ' does not exist.');
					return;
				} else {
					var path = PHP.constant('BASEPATH');
				}
			} else {
				var path = PHP.constant('APPPATH')
			}
		
			var $cfg = require(path + 'config/' + $file + PHP.constant('EXT'));
	
			if ( ! $cfg || ! PHP.is_array($cfg)) {
				if ($fail_gracefully === true) {
					return false;
				}
				CI_Common.show_error('Your ' + $file + PHP.constant('EXT') + ' file does not appear to contain a valid configuration array.');
				return;
			}
	
			if ($use_sections === true) {
				if ($config[$file]) {
					$config[$file] = PHP.array_merge($config[$file], $cfg);
				} else {
					$config[$file] = $cfg;
				}
			} else {
				$config = PHP.array_merge($config, $cfg);
			}
	
			$is_loaded.push($file);
			PHP.unset($cfg);
	
			CI_Common.log_message('debug', 'Config file loaded: config/' + $file + PHP.constant('EXT'));
			return true;
		}
	}
	
	Util.inherits(MY_Config, CI_Config);
	
	module.exports = MY_Config;
})();