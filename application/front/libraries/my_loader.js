(function() {
	var MY_Loader = {};
	
	MY_Loader = Object.create(CI_Loader);
	
	MY_Loader.name = 'MY_Loader';
	
	MY_Loader.__construct = function () {
		CI_Loader.__construct();
		console.log('MY_Loader.__construct()');
		return this;
	}
	
	MY_Loader.model = function($model, $name, $db_conn) {
		$name = $name || '';
		$db_conn = $db_conn || true;

		if (PHP.is_array($model)) {
			for(var $babe in $model) {
				this.model($model[$babe]);	
			}
			
			return;
		}

		if ($model == '') {
			return;
		}
	
		// Is the model in a sub-folder? If so, parse out the filename and path.
		if (PHP.strpos($model, '/') == false) {
			var $path = '';
		} else {
			var $x = PHP.explode('/', $model);
			$model = PHP.end($x);			
			PHP.unset($x[PHP.count($x)-1]);
			var $path = PHP.implode('/', $x) + '/';
		}
	
		if ($name == '') {
			$name = $model;
		}
		
		if (PHP.in_array($name, this.$_ci_models, true)) {
			CI.models[$name] = this._models[$name];
			CI.models[$name].__construct();
			CI.models[$name]._assign_libraries();
	
			return;
		}
		
		$model = PHP.strtolower($model);
		
		if (!global.CI_Model) {
			CI_Model = CI_Common.load_class('Model');
			CI_Model.__construct();
		}

		if(PHP.file_exists(PHP.constant('APPPATH') + 'models/' + $path + $model + PHP.constant('EXT'))){
			var $m = require(PHP.constant('APPPATH') + 'models/' + $path + $model + PHP.constant('EXT'));
		} else if (PHP.file_exists(PHP.constant('BASEPATH') + 'models/' + $path + $model + PHP.constant('EXT'))){
			var $m = require(PHP.constant('BASEPATH') + 'models/' + $path + $model + PHP.constant('EXT'));
		} else {
			CI_Common.show_error('Unable to locate the model you have specified: ' + $model, 500);
			PHP.exit('Unable to locate the model you have specified: ' + $model, 500);
		}
		
		if ($db_conn !== false && !global.CI_DB) {
			if ($db_conn === true) {
				$db_conn = '';
			}

			this.database($db_conn, false, true);
		}

		this._models[$name] = $m;
		
		CI.models[$name] = $m;
		CI.models[$name].__construct();
		CI.models[$name]._assign_libraries();

		this.$_ci_models.push($name);
	}
		
	MY_Loader.database = function($params, $return, $active_record){
		$params = $params || '';
		$return = $return || false;
		$active_record = $active_record || false;
		
		// Do we even need to load the database class?
		if (global.CI_DB && $return == false && $active_record == false && CI.db && PHP.is_object(CI.db)) {
			return false;
		}
		//require_once(BASEPATH.'libraries/MY_DB'.EXT);

		CI_DB = require(PHP.constant('APPPATH') + 'libraries/my_db' + PHP.constant('EXT'));
		
		if ($return === true) {
			var $db = CI_DB.__construct($params, $active_record);
			
			return $db;
		}
		
		// Initialize the db variable.  Needed to prevent   
		// reference errors with some configurations
		CI.db = '';
		
		// Load the DB class
		var $db = CI_DB.__construct($params, $active_record);
		
		CI.db = $db;
		
		// Assign the DB object to any existing models
		this._ci_assign_to_models();
	}

	module.exports = MY_Loader;
})();