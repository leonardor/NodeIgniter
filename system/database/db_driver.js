(function() {
	var CI_DB_driver = {};
	
	CI_DB_driver = Object.create(Events.EventEmitter.prototype);
	
	CI_DB_driver.name = 'CI_DB_driver';
	
	CI_DB_driver.$username = '';
	CI_DB_driver.$password = '';
	CI_DB_driver.$hostname = '';
	CI_DB_driver.$database = '';
	CI_DB_driver.$dbdriver = 'mysql';
	CI_DB_driver.$dbprefix = '';
	CI_DB_driver.$char_set = 'utf8';
	CI_DB_driver.$dbcollat = 'utf8_general_ci';
	CI_DB_driver.$autoinit = true; // Whether to automatically initialize the DB
	CI_DB_driver.$swap_pre = '';
	CI_DB_driver.$port = '';
	CI_DB_driver.$pconnect = false;
	CI_DB_driver.$conn_id = false;
	CI_DB_driver.$result_id = false;
	CI_DB_driver.$db_debug = false;
	CI_DB_driver.$benchmark = 0;
	CI_DB_driver.$query_count = 0;
	CI_DB_driver.$bind_marker = '?';
	CI_DB_driver.$save_queries = true;
	CI_DB_driver.$queries = [];
	CI_DB_driver.$query_times = [];
	CI_DB_driver.$data_cache = [];
	CI_DB_driver.$trans_enabled = true;
	CI_DB_driver.$trans_strict = true;
	CI_DB_driver.$_trans_depth = 0;
	CI_DB_driver.$_trans_status = true; // Used with transactions to determine if a rollback should occur
	CI_DB_driver.$cache_on = false;
	CI_DB_driver.$cachedir = '';
	CI_DB_driver.$conn_id = false;
	CI_DB_driver.$cache_autodel = false;
	CI_DB_driver.$CACHE = null; // The cache class object
	CI_DB_driver.$error = {};
	CI_DB_driver.client = false;

	CI_DB_driver.__construct = function($params) {
			if (PHP.is_array($params)) {
				for(var $key in $params) {
					this['$' + $key] = $params[$key];
				}
			}
			
			return this;
	
			CI_Common.log_message('debug', 'Database Driver Class Initialized');
		}

	CI_DB_driver.initialize = function(){
		var self = this;
		
		if (PHP.is_resource(this.client) || PHP.is_object(this.client)) {
			return true;
		}
		
		console.log('========================');
		// ----------------------------------------------------------------

		this.db_connect().on('connect', function(client) {
			console.log('intercepting db.connect event...');
			console.log('connected to server "' + client.host + ':' + client.port + '".');
			
			self.client = client;
			
			// Select the DB... assuming a database name is specified in the config file
			if (self.$database != '') {
				self.db_select().on('select', function(database) {
					console.log('intercepting db.select event...');
					console.log('connected to database "' + database + '".');
					
					
					// We've selected the DB. Now we set the character set
					self.db_set_charset(self.$char_set, self.$dbcollat).on('set_charset', function(charset) {
						console.log('intercepting db.set_charset event...');
						console.log('change charset to "' + charset + '" successfully.');
						
						console.log('emittind db.ready event...');
						self.emit('ready', self);
						return;
					}).on('error', function() {
						CI_Common.log_message('error', 'Unable to set database charset: ' + self.$database);
						
						console.log('intercepting db.error event...');
						console.log('cannot change charset to "' + charset + '". error: ' + error);
						
						if (this.$db_debug) {
							this.display_error('db_unable_set_charset', self.$database);
						}
					});
				}).on('error', function() {
					CI_Common.log_message('error', 'Unable to select database: ' + self.$database);
					
					console.log('intercepting db.error event...');
					console.log('cannot connect to database "' + self.$database + '". error: ' + error);
					
					if (self.$db_debug) {
						self.display_error('db_unable_to_select', self.$database);
					}
				});
			}
		});
		
		console.log('!!!!!!!!!!!!!!!!!!!');
		
		return this;
	}
	
	CI_DB_driver.close = function () {
		if (PHP.is_resource(this.client) || PHP.is_object(this.client)) {
			this._close(this.client);
		}
		this.client = false;
	}
	
	CI_DB_driver.query = function ($sql, $binds, $return_object) {
		$binds = $binds || false;
		$return_object = $return_object || true;
		
		if ($sql == '') {
			if (this.$db_debug) {
				CI_Common.log_message('error', 'Invalid query: ' + $sql);
				return this.display_error('db_invalid_query');
			}
			return false;
		}

		// Verify table prefix and replace if necessary
		if ( (this.$dbprefix != '' && this.$swap_pre != '') && (this.$dbprefix != this.$swap_pre) ) {			
			$sql = $sql.replace(new RegExp("(\W)" + this.$swap_pre + "(\S+?)"), "$1" + this.$dbprefix + "$2");
		}
		
		// Compile binds if needed
		if ($binds !== false) {
			$sql = this.compile_binds($sql, $binds);
		}

		// Run the Query
		if (false === (this.$result_id = this.simple_query($sql))) {
			if (this.$db_debug) {
				// grab the error number and message now, as we might run some
				// additional queries before displaying the error
				var $error_no = this._error_number();
				var $error_msg = this._error_message();
				
				// Log and display errors
				CI_Common.log_message('error', 'Query error: ' + $error_msg);
				return this.display_error(
										[
											'Error Number: ' + $error_no,
											$error_msg,
											$sql
										]
									);
			}
		
			return false;
		}
		
		return this;
	}
	
	CI_DB_driver.simple_query = function ($sql) {
		if ( ! this.client) {
			this.initialize();
		}
		
		return this._execute($sql);
	}
	
	CI_DB_driver.compile_binds = function ($sql, $binds) {
		if (PHP.strpos($sql, this.$bind_marker) === false) {
			return $sql;
		}
		
		if ( ! PHP.is_array($binds)) {
			$binds = [$binds];
		}
		
		// Get the sql segments around the bind markers
		var $segments = PHP.explode(this.$bind_marker, $sql);

		// The count of bind should be 1 less then the count of segments
		// If there are more bind arguments trim it down
		if (PHP.count($binds) >= PHP.count($segments)) {
			$binds = PHP.array_slice($binds, 0, PHP.count($segments)-1);
		}

		// Construct the binded query
		var $result = $segments[0];
		var $i = 0;
		
		for(var $bind in $binds) {
			$result += this.escape($binds[$bind]);
			$result += $segments[++$i];
		}

		return $result;
	}
	
	CI_DB_driver.escape = function ($str) {
		if (PHP.is_string($str)) {
			$str = "'" + this.escape_str($str) + "'";
		} else if (PHP.is_bool($str)) {
			$str = ($str === false) ? 0 : 1;
		} else if (PHP.is_null($str)) {
			$str = 'NULL';
		}

		return $str;
	}
	
	CI_DB_driver.escape_like_str = function ($str) {    
    	return this.escape_str($str, true);
	}
	
	CI_DB_driver.display_error = function ($error, $swap, $native) {
		$error = $error || '';
		$swap = $swap || '';
		$native = $native || false;
		
		var $LANG = CI_Common.load_class('Language');
		$LANG.load('db');
		
		var $heading = $LANG.line('db_error_heading');

		if ($native == true) {
			var $message = $error;
		} else {
			var $message = ( ! PHP.is_array($error)) ? [PHP.str_replace('%s', $swap, $LANG.line($error))] : $error;
		}
		
		var $error = CI_Common.load_class('Exceptions');
		
		response.write($error.show_error($heading, $message, 'error_db'));
	}
	
	module.exports = CI_DB_driver;
})();