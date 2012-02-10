(function () {
	var PHP = (function PHP(){
		var request = null;
		var response = null;
		
		this.$_COOKIES = {};
		this.$_ENV = {};
		this.$_SESSION = {};
		this.$_GET = {};
		this.$_POST = {};
		this.$_FILES = {};
		this.$_REQUEST = {};
		this.$_SERVER = {};
		this.$GLOBALS = {};
		
		/* predefined constants */
		
		this.E_STRICT = 2048;
		this.PHP_VERSION = '5.0';
		this.PHP_VERSION_ID = '5.0';
		this.DIRECTORY_SEPARATOR = '/';
		this.PATH_SEPARATOR = ':';
		this.PHP_INI_SCAN_DIR = __dirname;
		
		this.conf = {
			configuration: {
				core: {
					ini: this.PHP_INI_SCAN_DIR + this.DIRECTORY_SEPARATOR + 'php.ini.js',
				}
			},
			xdebug: {
				ini: this.PHP_INI_SCAN_DIR + this.DIRECTORY_SEPARATOR + 'modules' + this.DIRECTORY_SEPARATOR + 'xdebug' + this.DIRECTORY_SEPARATOR + 'xdebug.ini.js',
				directives: {}
			}
		}
		
		this.flags = { 
			SCANDIR_SORT_ASCENDING: 1,
			SCANDIR_SORT_DESCENDING: 2,
			SCANDIR_SORT_NONE: 0,
			
			PATHINFO_DIRNAME: 0,
			PATHINFO_BASENAME: 1,
			PATHINFO_EXTENSION: 2,
			PATHINFO_FILENAME: 3,
			
			PHP_OUTPUT_HANDLER_START: 0,
			PHP_OUTPUT_HANDLER_CONT: 1,
			PHP_OUTPUT_HANDLER_END: 2,
			
			LOCK_SH: 0,
			LOCK_EX: 1,
			LOCK_UN: 2,
			
			PREG_SPLIT_NO_EMPTY: 0,
			
			ENT_COMPAT: 0,
			ENT_QUOTES: 1,
			ENT_NOQUOTES: 2,
			ENT_IGNORE: 3,
			ENT_SUBSTITUTE: 4,
			ENT_DISALLOWED: 5,
			ENT_HTML401: 6,
			ENT_XML1: 7,
			ENT_XHTML: 8,
			ENT_HTML5: 9,
			
			HTML_ENTITIES: 0,
			HTML_SPECIALCHARS: 1,
			
			PREG_OFFSET_CAPTURE: 0
		};
		
		this.modules = {}
		
		var _dl = function(name) {
			var module = {};
			
			for(i in this.conf[name]) {
				var mainconf = this.conf[name][i];
					
				if(typeof(mainconf) == 'object') {
					for(m in mainconf) {
						if(m == 'ini') {
							var file = mainconf[m];
							var conf = require(file);
							
							module[m] = {};
							
							for(k in conf) {
								module[m][k] = conf[k];
							}
						}
					}
				} else {
					if(i == 'ini') {
						var file = mainconf;
						var conf = require(file);
							
						module[i] = {};
						
						for(k in conf) {
							module[i][k] = conf[k];
						}
					}
				}
			}
			
			this.modules[name] = module;
			
			return module;
		}
		
		this.init = function(request, response) {
			this.request = request;
			this.response = response;
			
			_init_server(request);
			_init_cookies(request);
			_init_environment(request);
			_init_globals(request);
			
			_init_modules();
		}
		
		var _init_modules = function() {
			_dl('configuration');
			_dl('xdebug');
		}
		
		var _init_server = function(request) {
			var headers = request.headers;
	    	
	    	for(header in headers) {
	    		switch(header) {
	    			case 'some_header':
	    			break;
	    			default:
	    				this.$_SERVER['HTTP_' + header.toUpperCase().replace('-', '_')] = headers[header];
	    		}
	    	}
	    	
	    	this.$_SERVER['REQUEST_METHOD']		= request.method;
	    	this.$_SERVER['REQUEST_URI']		= request.url;
	    	this.$_SERVER['GATEWAY_PROTOCOL']	= 'CGI/1.1';
	    	this.$_SERVER['SERVER_SOFTWARE']	= 'nodejs ' + process.version;
	    	
	    	Url = require('url');
	    	
	    	var queryString = [];
	    	
	    	for(key in Url.parse(request.url, true).query) {
	    		queryString.push(key+'='+Url.parse(request.url, true).query[key]);
	    	}
	    	
	    	this.$_SERVER['QUERY_STRING']		= queryString.join('&');
	    	this.$_SERVER['PATH_INFO']			= Url.parse(request.url, true).pathname;
	    	this.$_SERVER['ORIG_PATH_INFO']		= Url.parse(request.url, true).path;
	    	this.$_SERVER['SCRIPT_NAME']		= Url.parse(request.url, true).pathname;
	    	this.$_SERVER['SCRIPT_FILENAME']	= process.cwd() + Url.parse(request.url, true).pathname;
	    	this.$_SERVER['PHP_SELF']			= Url.parse(request.url, true).pathname;

	    	var Net = require('net');
	    	
	    	this.$_SERVER['REMOTE_ADDR'] 		= request.socket.remoteAddress;
		}
		
		var _init_cookies = function(request) {
	    	var cookie = request.headers.cookie;
	    	
	    	if(cookie != undefined) {
	    		cookie.split(';').forEach(function(cookie) {
	    			var parts = cookie.split('=');
	    			this.$_COOKIES[parts[0].trim()] = (parts[1] || '').trim();
	    		});
	    	}
	    }
		
		var _init_environment = function(request) {
			for(i in process.env) {
				this.$_ENV[i] = process.env[i];
			}
		}
		
		var _init_globals = function(request) {
			
		}
		
		this.constant = function(name) {
	    	return this.$GLOBALS[name];
	    }
		
		this.flag = function(name) {
	    	return this.flags[name];
	    }
		
		/*
		########################
		# PHP Public Functions #
		########################
		*/

		this.array_diff = function (array1) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/array_diff.js')(array1);  
		}
		
		this.array_map = function (callback, array) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/array_map.js')(callback, array);  
		}

		this.array_keys = function(input, search_value, argStrict) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/array_keys.js')(input, search_value, argStrict); 
		}
		
		this.array_merge = function(array1, array2) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/array_merge.js')(array1, array2); 
		}
		
		this.array_slice = function(arr, offst, lgth, preserve_keys) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/array_slice.js')(arr, offst, lgth, preserve_keys); 
		}
		
		this.array_values = function(input) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/array_values.js')(input); 
		}
		
		this.array_unshift = function(array) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/array_unshift.js')(array); 
		}
		
		this.chmod = function(filename, mode) {
			FileSystem.chmod(filename, mode, function(err, changed) {
				if(err) throw err;
				
				return changed;
			});
		}
		
		this.call_user_func_array = function(cb, parameters) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/call_user_func_array.js')(cb, parameters); 
		}
		
		this.count = function(mixed_var, mode) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/count.js')(mixed_var, mode); 
		}
		
		this.date = function(format, timestamp) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/date.js')(format, timestamp);
		}
		
		this.define = function($name, $value) {
	    	this.$GLOBALS[$name] = $value;
	    }
	    
		this.defined = function($name) {
	    	if(this.$GLOBALS[$name]) {
	    		return true;
	    	} else {
	    		return false;
	    	}
	    }
	    
		this.echo = function(str) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/echo.js')(str, response);
	    }
		
		this.end = function(array) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/end.js')(array);
		}
	    
		this.exit = function(status) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/exit.js')(status, this.response);
	    }
		
		this.explode = function(delimiter, string, limit) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/explode.js')(delimiter, string, limit);
		}
		
		this.extract = function(array, type, prefix) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/extract.js')(array, type, prefix);
		}
		
		this.file_exists = function(filename) {
			try {
				var stat = FileSystem.lstatSync(filename);
				
				if(stat.isFile()) {
					return true;
				} else {
					return false;
				}
			} catch(e) {
				//console.log(e);
				return false;
			}
		}
		
		this.file_get_contents = function(url, flags, context, offset, maxlen) {
			FileSystem.readFile(url, undefined, function (err, data) {
				if (err) throw err;
				
				return data;
			})
		}
	    
		this.fclose = function(handle) {
			try {
				var fc = FileSystem.closeSync(handle);
				
				return fc;
			} catch(e) {
				console.log(e);
				return false;
			}
		}

		this.flock = function(handle, operation, wouldblock) {
			return true;
		}
		
		this.fopen = function(filename, mode, use_include_path, context) {
			var file = (use_include_path != null)?use_include_path + filename:filename;
			
			try {
				var fd = FileSystem.openSync(file, mode, 0777);

				return fd;
			} catch(e) {
				console.log(e);
				return false;
			}
	    }
			
		this.fwrite = function(handle, string, length) {
			try {
				var bytes = FileSystem.writeSync(handle, string, null, undefined);
				
				return bytes;
			} catch(e) {
				console.log(e);
				return false;
			}
		}
	    
		this.function_exists = function(function_name) {
	    	return this[function_name];
	    }
	    
		this.get_class_methods = function (obj) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/get_class_methods.js')(obj);  
		}
		
		this.get_constants = function(key) {
	    	return this.$GLOBALS;
	    }
		
		this.get_object_vars = function(obj) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/get_object_vars.js')(obj);
		}
	    
		this.getenv = function(value) {
			return (this.$_ENV[value] || '');
		}
		
		this.get_magic_quotes_gpc = function() {
			return false;
		}
		
		this.headr = function(string, replace, http_response_code, response) {
			console.log('STATUS:' + http_response_code);
			
	    	var header = string.split(':');
	    	console.log(header[0] + ':' + header[1]);
	    }

		this.implode = function(glue, pieces) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/implode.js')(glue, pieces);
		}
		
		this.in_array = function(needle, haystack, argStrict) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/in_array.js')(needle, haystack, argStrict); 
		}
	    
		this.is_array = function(mixed_var) {
			return (typeof(mixed_var) == 'object') || (mixed_var instanceof Array);
	    }

		this.is_dir = function(directory) {
			try {
				var stat = FileSystem.statSync(directory);
				
				if(stat.isDirectory()) {
					return true;
				} else {
					return false;
				}
			} catch(e) {
				console.log(e);
				return false;
			}
		}
	    
		this.is_numeric = function(mixed_var) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/is_numeric.js')(mixed_var);
	    }
		
		this.is_null = function(mixed_var) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/is_null.js')(mixed_var);
		}
		
		this.is_object = function(mixed_var) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/is_object.js')(mixed_var);
		}
	    
		this.is_string = function(mixed_var) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/is_string.js')(mixed_var);
	    }
	    
		this.is_writable = function(filename) {
	    	return true;
	    }
	    
		this.isset = function(mixed_var) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/isset.js')(mixed_var);
	    }
	    
		this.ini_get = function(varname) {
	        if (this.modules['configuration'].ini && this.modules['configuration'].ini[varname] && this.modules['configuration'].ini[varname].local_value !== undefined) {
	            if (this.modules['configuration'].ini[varname].local_value === null) {
	                return '';
	            }
	            
	            return this.modules['configuration'].ini[varname].local_value;
	        }
	        
	        return '';
	    }
	    
		this.ini_set = function (varname, newvalue) {
	        var oldval = '',
	            that = this;
	        
	        this.modules['configuration'].ini[varname] = this.modules['configuration'].ini[varname] || {};
	        oldval = this.modules['configuration'].ini[varname].local_value || undefined;
	     
	        var _set = function (oldval) {
	            if (typeof oldval == undefined) {
	                that.modules['configuration'].ini[varname].local_value = [];
	            }
	            
	            that.modules['configuration'].ini[varname].local_value.push(newvalue);
	        };
	     
	        this.modules['configuration'].ini[varname].local_value = newvalue;
	        
	        return oldval;
	    }
		
		this.key = function(array) {
			return false;
		}
	    
		this.md5 = function(str) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/md5.js')(str);
	    }
		
		this.method_exists = function(obj, method) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/method_exists.js')(obj, method);
		}
		
		this.microtime = function(get_as_float) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/microtime.js')(get_as_float);
		}
		
		this.number_format = function(number, decimals, dec_point, thousands_sep) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/number_format.js')(number, decimals, dec_point, thousands_sep);
		}
		
		this.ob_end_clean = function() {
			return require(this.PHP_INI_SCAN_DIR + '/functions/ob_end_clean.js');
		}
		
		this.ob_end_flush = function() {
			return require(this.PHP_INI_SCAN_DIR + '/functions/ob_end_flush.js');
		}
		
		this.ob_get_contents = function() {
			return require(this.PHP_INI_SCAN_DIR + '/functions/ob_get_contents.js');
		}
		
		this.ob_start = function (output_callback, chunk_size, erase) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/ob_start.js')(output_callback, chunk_size, erase);
		}
		
		this.ob_get_level = function() {
			return (this.ini_get('output_buffering') == '')? 0: this.ini_get('output_buffering');
		}
		
		this.pathinfo = function(path, options) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/pathinfo.js')(path, options);
		}

		this.php_sapi_name = function() {
	    	
	    }
		
		this.phpinfo = function() {
			var file = __dirname + '/templates/phpinfo.ejs';
			var str = FileSystem.readFileSync(file, 'utf8');
			
			var html = Ejs.render(str, {
				modules: this.modules,
				server: this.$_SERVER,
				env: this.$_ENV,
				cookies: this.$_COOKIES,
				globals: this.$GLOBALS
			});
			
			return html;
		}
		
		this.preg_replace = function(pattern, replacement, subject, limit, count) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/preg_replace.js')(pattern, replacement, subject, limit, count);
		}
		
		this.print_r = function(array, return_val) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/print_r.js')(array, return_val);
		}
	    
		this.phpversion = function($extension) {
			return this.PHP_VERSION_ID;
		}
		
		this.preg_match = function(pattern, subject, matches, flags, offset) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/preg_match.js')(pattern, subject, matches, flags, offset);
		}
		
		this.preg_quote = function(str, delimiter) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/preg_quote.js')(str, delimiter);
		}
		
		this.rand = function(min, max) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/rand.js')(min, max);
	    }
	    
		this.rtrim = function(str, charlist) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/rtrim.js')(str, charlist);
	    }
		
		this.set_error_handler = function(error_handler, error_types) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/set_error_handler.js')(error_handler, error_types);
		}
		
		this.str_replace = function(search, replace, subject, count) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/str_replace.js')(search, replace, subject, count);
		}
		
		this.strncmp = function(str1, str2, lgth) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/strncmp.js')(str1, str2, lgth);
		}
		
		this.strtolower = function(str) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/strtolower.js')(str);
		}
		
		this.strtoupper = function(str) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/strtoupper.js')(str);
		}
	    
		this.strpos = function(haystack, needle, offset) {
			require(this.PHP_INI_SCAN_DIR + '/functions/strpos.js')(haystack, needle, offset);
		}
		
		this.substr = function(str, start, len) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/substr.js')(str, start, len);
	    }
	    
		this.trim = function(str, charlist) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/trim.js')(str, charlist);
	    }
		
		this.ucfirst = function(str) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/ucfirst.js')(str);
		}
	    
		this.unlink = function($filename, $context) {
			
	    }
		
		this.unset = function(mixed_var) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/unset.js')(mixed_var);
		}
		
		this.var_dump = function($expression) {
			var out = '';
			
			if(typeof($expression) == 'object') {
				out += '<pre class="xdebug-var-dump" dir="ltr">\n';
				
				out += "<b>" + typeof($expression) + "</b>\n";
				
			    for (var i in $expression) {
			        out += "\t'" + i + '\' <font color"#888a85">=&gt;</font>' + " <small>" + typeof($expression[i]) + "</small> ";
	
			        switch(typeof($expression[i])) {
			        	case 'number':
			        		out += '<font color="#4e9a06">' + $expression[i] + '</font>\n';
			        	break;
			        	default:
			        		out += '<font color="#cc0000">\'' + $expression[i] + '\'</font> <i>(length=' + $expression[i].length + ')</i>\n';
			        }
			    }
			    
			    out += '<pre>';
			}
			    
			return out;
		}
	    
		this.version_compare = function(v1, v2, operator) {
			return require(this.PHP_INI_SCAN_DIR + '/functions/version_compare.js')(v1, v2, operator);
	    }
		
	    
	    return this;
	})();
	    
	module.exports = PHP;
}());