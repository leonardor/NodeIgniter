(function() {
	var PHP = new function PHP(){
		PHP.$_COOKIES = {};
		PHP.$_ENV = {};
		PHP.$_SESSION = {};
		PHP.$_GET = {};
		PHP.$_POST = {};
		PHP.$_FILES = {};
		PHP.$_REQUEST = {};
		PHP.$_SERVER = {};
		PHP.$GLOBALS = {};
		
		/* predefined constants */
		
		PHP.E_STRICT = 2048;
		PHP.PHP_VERSION = '5.0';
		PHP.PHP_VERSION_ID = '5.0';
		PHP.DIRECTORY_SEPARATOR = '/';
		PHP.PATH_SEPARATOR = ':';
		PHP.PHP_INI_SCAN_DIR = __dirname;
		
		PHP.conf = {
			configuration: {
				core: {
					ini: PHP.PHP_INI_SCAN_DIR + PHP.DIRECTORY_SEPARATOR + 'php.ini.js',
				}
			},
			xdebug: {
				ini: PHP.PHP_INI_SCAN_DIR + PHP.DIRECTORY_SEPARATOR + 'modules' + PHP.DIRECTORY_SEPARATOR + 'xdebug' + PHP.DIRECTORY_SEPARATOR + 'xdebug.ini.js',
				directives: {}
			}
		}
		
		PHP.flags = { 
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
			PREG_OFFSET_CAPTURE: 1,
			
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
		
		PHP.modules = {}
		
		var _dl = function(name) {
			var module = {};
			
			for(var i in PHP.conf[name]) {
				var mainconf = PHP.conf[name][i];
					
				if(typeof(mainconf) == 'object') {
					for(var m in mainconf) {
						if(m == 'ini') {
							var file = mainconf[m];
							var conf = require(file);
							
							module[m] = {};
							
							for(var k in conf) {
								module[m][k] = conf[k];
							}
						}
					}
				} else {
					if(i == 'ini') {
						var file = mainconf;
						var conf = require(file);
							
						module[i] = {};
						
						for(var k in conf) {
							module[i][k] = conf[k];
						}
					}
				}
			}
			
			PHP.modules[name] = module;
			
			return module;
		}
		
		PHP.__construct = function(request, response) {
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
	    	
	    	for(var header in headers) {
	    		switch(header) {
	    			case 'some_header':
	    			break;
	    			default:
	    				PHP.$_SERVER['HTTP_' + header.toUpperCase().replace('-', '_')] = headers[header];
	    		}
	    	}
	    	
	    	PHP.$_SERVER['REQUEST_METHOD']		= request.method;
	    	PHP.$_SERVER['REQUEST_URI']		= request.url;
	    	PHP.$_SERVER['GATEWAY_PROTOCOL']	= 'CGI/1.1';
	    	PHP.$_SERVER['SERVER_SOFTWARE']	= 'nodejs ' + process.version;
	    	
	    	var Url = require('url');
	    	
	    	var queryString = [];
	    	
	    	for(var key in Url.parse(request.url, true).query) {
	    		queryString.push(key+'='+Url.parse(request.url, true).query[key]);
	    	}
	    	
	    	PHP.$_SERVER['QUERY_STRING']		= queryString.join('&');
	    	PHP.$_SERVER['PATH_INFO']			= Url.parse(request.url, true).pathname;
	    	PHP.$_SERVER['ORIG_PATH_INFO']		= Url.parse(request.url, true).path;
	    	PHP.$_SERVER['SCRIPT_NAME']		= Url.parse(request.url, true).pathname;
	    	PHP.$_SERVER['SCRIPT_FILENAME']	= process.cwd() + Url.parse(request.url, true).pathname;
	    	PHP.$_SERVER['PHP_SELF']			= Url.parse(request.url, true).pathname;

	    	var Net = require('net');
	    	
	    	PHP.$_SERVER['REMOTE_ADDR'] 		= request.socket.remoteAddress;
		}
		
		var _init_cookies = function(request) {
	    	var cookie = request.headers.cookie;
	    	
	    	if(cookie != undefined) {
	    		cookie.split(';').forEach(function(cookie) {
	    			var parts = cookie.split('=');
	    			PHP.$_COOKIES[parts[0].trim()] = (parts[1] || '').trim();
	    		});
	    	}
	    }
		
		var _init_environment = function(request) {
			for(var i in process.env) {
				PHP.$_ENV[i] = process.env[i];
			}
		}
		
		var _init_globals = function(request) {
			
		}
		
		PHP.constant = function(name) {
	    	return PHP.$GLOBALS[name];
	    }
		
		PHP.flag = function(name) {
	    	return PHP.flags[name];
	    }
		
		/*
		########################
		# PHP Public Functions #
		########################
		*/

		PHP.addslashes = function (str) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/addslashes.js')(str);  
		}
		
		PHP.array_diff = function (array1) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/array_diff.js')(array1);  
		}
		
		PHP.array_map = function (callback, array) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/array_map.js')(callback, array);  
		}

		PHP.array_keys = function(input, search_value, argStrict) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/array_keys.js')(input, search_value, argStrict); 
		}
		
		PHP.array_merge = function(array1, array2) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/array_merge.js')(array1, array2); 
		}
		
		PHP.array_slice = function(arr, offst, lgth, preserve_keys) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/array_slice.js')(arr, offst, lgth, preserve_keys); 
		}
		
		PHP.array_values = function(input) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/array_values.js')(input); 
		}
		
		PHP.array_unshift = function(array) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/array_unshift.js')(array); 
		}
		
		PHP.chmod = function(filename, mode) {
			FileSystem.chmod(filename, mode, function(err, changed) {
				if(err) throw err;
				
				return changed;
			});
		}
		
		PHP.call_user_func_array = function(cb, parameters) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/call_user_func_array.js')(cb, parameters); 
		}
		
		PHP.count = function(mixed_var, mode) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/count.js')(mixed_var, mode); 
		}
		
		PHP.date = function(format, timestamp) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/date.js')(format, timestamp);
		}
		
		PHP.define = function($name, $value) {
			PHP.$GLOBALS[$name] = $value;
	    }
	    
		PHP.defined = function($name) {
	    	if(PHP.$GLOBALS[$name]) {
	    		return true;
	    	} else {
	    		return false;
	    	}
	    }
	    
		PHP.echo = function(str) {
			response.write(str);
	    }
		
		PHP.end = function(array) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/end.js')(array);
		}
	    
		PHP.exit = function(status) {
			response.end(status);
	    }
		
		PHP.explode = function(delimiter, string, limit) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/explode.js')(delimiter, string, limit);
		}
		
		PHP.extract = function(array, type, prefix) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/extract.js')(array, type, prefix);
		}
		
		PHP.file_exists = function(filename) {
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
		
		PHP.file_get_contents = function(url, flags, context, offset, maxlen) {
			FileSystem.readFile(url, undefined, function (err, data) {
				if (err) throw err;
				
				return data;
			})
		}
	    
		PHP.fclose = function(handle) {
			try {
				var fc = FileSystem.closeSync(handle);
				
				return fc;
			} catch(e) {
				console.log(e);
				return false;
			}
		}

		PHP.flock = function(handle, operation, wouldblock) {
			return true;
		}
		
		PHP.fopen = function(filename, mode, use_include_path, context) {
			var file = (use_include_path != null)?use_include_path + filename:filename;
			
			try {
				var fd = FileSystem.openSync(file, mode, 0777);

				return fd;
			} catch(e) {
				console.log(e);
				return false;
			}
	    }
			
		PHP.fwrite = function(handle, string, length) {
			try {
				var bytes = FileSystem.writeSync(handle, string, null, undefined);
				
				return bytes;
			} catch(e) {
				console.log(e);
				return false;
			}
		}
	    
		PHP.function_exists = function(function_name) {
	    	return this[function_name];
	    }
	    
		PHP.get_class_methods = function (obj) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/get_class_methods.js')(obj);  
		}
		
		PHP.get_constants = function(key) {
	    	return PHP.$GLOBALS;
	    }
		
		PHP.get_object_vars = function(obj) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/get_object_vars.js')(obj);
		}
	    
		PHP.getenv = function(value) {
			return (PHP.$_ENV[value] || '');
		}
		
		PHP.get_magic_quotes_gpc = function() {
			return false;
		}
		
		PHP.get_class = function(object) {
			return (object.name || '');
		}
		
		PHP.header = function(string, replace, http_response_code, response) {
			console.log('STATUS:' + http_response_code);
			
	    	var header = string.split(':');
	    	console.log(header[0] + ':' + header[1]);
	    }

		PHP.implode = function(glue, pieces) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/implode.js')(glue, pieces);
		}
		
		PHP.in_array = function(needle, haystack, argStrict) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/in_array.js')(needle, haystack, argStrict); 
		}
	    
		PHP.is_array = function(mixed_var) {
			return (typeof(mixed_var) == 'object') || (mixed_var instanceof Array);
	    }

		PHP.is_dir = function(directory) {
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
	    
		PHP.is_numeric = function(mixed_var) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/is_numeric.js')(mixed_var);
	    }
		
		PHP.is_null = function(mixed_var) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/is_null.js')(mixed_var);
		}
		
		PHP.is_object = function(mixed_var) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/is_object.js')(mixed_var);
		}
		
		PHP.is_resource = function(handle) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/is_resource.js')(handle);
		}
	    
		PHP.is_string = function(mixed_var) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/is_string.js')(mixed_var);
	    }
	    
		PHP.is_writable = function(filename) {
	    	return true;
	    }
	    
		PHP.isset = function(mixed_var) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/isset.js')(mixed_var);
	    }
	    
		PHP.ini_get = function(varname) {
	        if (PHP.modules['configuration'].ini && PHP.modules['configuration'].ini[varname] && PHP.modules['configuration'].ini[varname].local_value !== undefined) {
	            if (PHP.modules['configuration'].ini[varname].local_value === null) {
	                return '';
	            }
	            
	            return PHP.modules['configuration'].ini[varname].local_value;
	        }
	        
	        return '';
	    }
	    
		PHP.ini_set = function (varname, newvalue) {
	        var oldval = '',
	            that = this;
	        
	        PHP.modules['configuration'].ini[varname] = PHP.modules['configuration'].ini[varname] || {};
	        oldval = PHP.modules['configuration'].ini[varname].local_value || undefined;
	     
	        var _set = function (oldval) {
	            if (typeof oldval == undefined) {
	                that.modules['configuration'].ini[varname].local_value = [];
	            }
	            
	            that.modules['configuration'].ini[varname].local_value.push(newvalue);
	        };
	     
	        PHP.modules['configuration'].ini[varname].local_value = newvalue;
	        
	        return oldval;
	    }
		
		PHP.key = function(array) {
			return false;
		}
	    
		PHP.md5 = function(str) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/md5.js')(str);
	    }
		
		PHP.method_exists = function(obj, method) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/method_exists.js')(obj, method);
		}
		
		PHP.microtime = function(get_as_float) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/microtime.js')(get_as_float);
		}
		
		PHP.mysql_connect = function(hostname, username, password, new_link, client_flags) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/mysql_connect.js')(hostname, username, password, new_link, client_flags);
		}
		
		PHP.mysql_next_result = function(link_identifier) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/mysql_next_result.js')(link_identifier);
		}
		
		PHP.mysql_select_db = function(database_name, link_identifier) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/mysql_select_db.js')(database_name, link_identifier);
		}
		
		PHP.mysql_query = function(query, link_identifier) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/mysql_query.js')(query, link_identifier);
		}
		
		PHP.mysql_close = function(link_identifier) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/mysql_close.js')(link_identifier);
		}
		
		PHP.mysql_error = function(link_identifier) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/mysql_error.js')(link_identifier);
		}
		
		PHP.mysql_errno = function(link_identifier) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/mysql_errno.js')(link_identifier);
		}
		
		PHP.mysql_num_rows = function(result) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/mysql_num_rows.js')(result);
		}
		
		PHP.number_format = function(number, decimals, dec_point, thousands_sep) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/number_format.js')(number, decimals, dec_point, thousands_sep);
		}
		
		PHP.ob_end_clean = function() {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/ob_end_clean.js');
		}
		
		PHP.ob_end_flush = function() {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/ob_end_flush.js');
		}
		
		PHP.ob_get_contents = function() {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/ob_get_contents.js');
		}
		
		PHP.ob_start = function (output_callback, chunk_size, erase) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/ob_start.js')(output_callback, chunk_size, erase);
		}
		
		PHP.ob_get_level = function() {
			return (PHP.ini_get('output_buffering') == '')? 0: PHP.ini_get('output_buffering');
		}
		
		PHP.pathinfo = function(path, options) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/pathinfo.js')(path, options);
		}

		PHP.php_sapi_name = function() {
	    	
	    }
		
		PHP.phpinfo = function() {
			var file = __dirname + '/templates/phpinfo.ejs';
			var str = FileSystem.readFileSync(file, 'utf8');
			
			var html = Ejs.render(str, {
				modules: PHP.modules,
				server: PHP.$_SERVER,
				env: PHP.$_ENV,
				cookies: PHP.$_COOKIES,
				globals: PHP.$GLOBALS
			});
			
			return html;
		}
		
		PHP.preg_replace = function(pattern, replacement, subject, limit, count) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/preg_replace.js')(pattern, replacement, subject, limit, count);
		}
		
		PHP.print_r = function(array, return_val) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/print_r.js')(array, return_val);
		}
	    
		PHP.phpversion = function($extension) {
			return PHP.PHP_VERSION_ID;
		}
		
		PHP.preg_match = function(pattern, subject, matches, flags, offset) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/preg_match.js')(pattern, subject, matches, flags, offset);
		}
		
		PHP.preg_quote = function(str, delimiter) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/preg_quote.js')(str, delimiter);
		}
		
		PHP.rand = function(min, max) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/rand.js')(min, max);
	    }
	    
		PHP.rtrim = function(str, charlist) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/rtrim.js')(str, charlist);
	    }
		
		PHP.set_error_handler = function(error_handler, error_types) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/set_error_handler.js')(error_handler, error_types);
		}
		
		PHP.str_replace = function(search, replace, subject, count) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/str_replace.js')(search, replace, subject, count);
		}
		
		PHP.strncmp = function(str1, str2, lgth) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/strncmp.js')(str1, str2, lgth);
		}
		
		PHP.strtolower = function(str) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/strtolower.js')(str);
		}
		
		PHP.strtoupper = function(str) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/strtoupper.js')(str);
		}
	    
		PHP.strpos = function(haystack, needle, offset) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/strpos.js')(haystack, needle, offset);
		}
		
		PHP.substr = function(str, start, len) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/substr.js')(str, start, len);
	    }
		
		PHP.stripslashes = function(str) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/stripslashes.js')(str);
	    }
		
		PHP.strip_tags = function(input, allowed) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/strip_tags.js')(input, allowed);
	    }
		
		PHP.serialize = function(mixed_var) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/serialize.js')(mixed_var);
	    }
	    
		PHP.trim = function(str, charlist) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/trim.js')(str, charlist);
	    }
		
		PHP.ucfirst = function(str) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/ucfirst.js')(str);
		}
	    
		PHP.unlink = function($filename, $context) {
			
	    }
		
		PHP.unset = function(mixed_var) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/unset.js')(mixed_var);
		}
		
		PHP.var_dump = function($expression) {
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
	    
		PHP.version_compare = function(v1, v2, operator) {
			return require(PHP.PHP_INI_SCAN_DIR + '/functions/version_compare.js')(v1, v2, operator);
	    }

	    return PHP;
	}

	module.exports = PHP;
})();