(function() {
	var CI_DB_mysql_driver = {};

	CI_DB_mysql_driver = Object.create(CI_DB_driver);
	
	CI_DB_mysql_driver.name = 'CI_DB_mysql_driver';
	
	CI_DB_mysql_driver.$dbdriver = 'mysql';

	var Driver = require(CI_DB_mysql_driver.$dbdriver);

	CI_DB_mysql_driver.db_connect = function(){
		var self = this;
		
		var client = Driver.createClient({
			host: self.$hostname,
			user: self.$username,
			password: self.$password,
			debug: false
		});

		client._connect(function() {
			console.log('emitting db.connect event...');
	    	self.emit('connect', client);
	    	return;
	    });
		
		return self;
	}
	
	CI_DB_mysql_driver.db_select = function() {
		var self = this;
		
		this.client.useDatabase(self.$database, function(error, results, fields) {
			if(error) {
				self.$error = error;
				
			    console.log('Connection Error:');
			    console.log(error);
			    
			    console.log('emitting db.error event...');
			    self.emit('error', error);
			    return;
			}
			
			console.log('emitting db.select event...');
			self.emit('select', self.$database);
			return;
		});
		
		return self;
	}
	
	CI_DB_mysql_driver.db_set_charset = function ($charset, $collation) {
		var self = this;
		
		this.client.query("SET NAMES '" + this.escape_str($charset) + "' COLLATE '" + this.escape_str($collation) + "'", function(error, results, fields) {
			if(error) {
				self.$error = error;
				
			    console.log('Connection Error:');
			    console.log(error);
			    
			    console.log('emitting db.error event...');
			    self.emit('error', error);
			    return;
			}
			
			 console.log('emitting db.set_charset event...');
			self.emit('set_charset', self.escape_str($charset));
			return;
		});
		
		return self;
	}
	
	CI_DB_mysql_driver._execute = function ($sql) {
		var self = this;
		
		this.client.query($sql, function(error, results, fields) {
			if(error) {
				self.$error = error;
				
			    console.log('Connection Error:');
			    console.log(error);
			    
			    console.log('emitting db.error event...');
			    self.emit('error', error);
			    return;
			}
			
			console.log('emitting db.data event...');
			self.emit('data', results);
			return;
		});
		
		return self;
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
	
	CI_DB_mysql_driver._close = function() {
		var self = this;
		
		this.client.end(function() {
			console.log('emitting db.close event...');
			self.emit('close', true);
		});
		
		return self;
	}

	module.exports = CI_DB_mysql_driver;
})();