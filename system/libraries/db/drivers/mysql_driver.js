(function() {
	var CI_DB_mysql_driver = {};

	CI_DB_mysql_driver = Object.create(CI_DB_driver);
	
	CI_DB_mysql_driver.name = 'CI_DB_mysql_driver';
	
	CI_DB_mysql_driver.$dbdriver = 'mysql';
	
	var self = CI_DB_mysql_driver;
	
	var Driver = require(CI_DB_mysql_driver.$dbdriver);

	CI_DB_mysql_driver.db_connect = function(){
		client = Driver.createClient({
			host: self.$hostname,
			user: self.$username,
			password: self.$password,
			debug: self.$db_debug
		});
		
		console.log('execut db_connect');
		
		client._connect();

		return client;
	}
	
	CI_DB_mysql_driver.db_select = function() {
		self.client.useDatabase(this.$database, function(error, results, fields) {
			if(error) {
				self.$error = error;
				
			    console.log('Connection Error:');
			    console.log(error);
			    
			    console.log('emit eventul db.error');
			    self.emit('db_error', error);
			    
			    return error;
			}
			
			console.log('emit eventul db.select');
			self.emit('select', self.$database);
			return self;
		});
		
		return self;
	}
	
	CI_DB_mysql_driver.db_set_charset = function ($charset, $collation) {
		self.client.query("SET NAMES '" + this.escape_str($charset) + "' COLLATE '" + this.escape_str($collation) + "'", function(error, results, fields) {
			if(error) {
				self.$error = error;
				
			    console.log('Connection Error:');
			    console.log(error);
			    
			    console.log('emit eventul db.error');
			    self.emit('error', error);
			    
			    return error;
			}
			
			 console.log('emit eventul db.set_charset');
			self.emit('set_charset', self.escape_str($charset));
			return self;
		});
		
		return self;
	}
	
	CI_DB_mysql_driver._execute = function ($sql) {
		self.client.query($sql, function(error, results, fields) {
			if(error) {
				self.$error = error;
				
			    console.log('Connection Error:');
			    console.log(error);
			    
			    console.log('emit eventul db.error');
			    self.emit('db_error', error);
			    
			    return false;
			}
			
			  console.log('emit eventul db.data');
			self.emit('data', results);
			
			return results;
		});
	}
	
	CI_DB_mysql_driver._error_number = function () {
		return this.$error.number || 0;
	}
	
	CI_DB_mysql_driver._error_message = function () {
		return this.$error.message || '';
	}
	
	CI_DB_mysql_driver.escape_str = function ($str, $like) {	
		$like = $like || false;
		
		if (PHP.is_array($str)) {
			for(var $key in $str) {
				$str[$key] = this.escape_str($str[$key], $like);
	   		}
   		
	   		return $str;
	   	}

		$str = PHP.addslashes($str);
		
		// escape LIKE condition wildcards
		if ($like === true) {
			$str = PHP.str_replace(['%', '_'], ['\\%', '\\_'], $str);
		}
		
		return $str;
	}
	
	CI_DB_mysql_driver._close = function($conn_id) {
		return $conn_id.end(function() {
			console.log('emit eventul db_close');
			self.emit('db_close', true);
			
			return true;
		});
	}

	module.exports = CI_DB_mysql_driver;
})();