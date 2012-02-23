(function() {
	function MY_Loader() {
		MY_Loader.super_.call(this).__construct();
		
		var $_ci_ob_level;
		var $_ci_view_path		= '';
		var $_ci_is_php5		= false;
		var $_ci_is_instance 	= false; // Whether we should use $this or $CI =& get_instance()
		var $_ci_cached_vars	= [];
		var $_ci_classes		= [];
		var $_ci_loaded_files	= [];
		var $_ci_models			= [];
		var $_ci_helpers		= [];
		var $_ci_plugins		= [];
		var $_ci_varmap			= {'unit_test': 'unit', 'user_agent': 'agent'};
		
		this.__construct = function () {
			console.log('MY_Loader.__construct()');
		}
		
		this.model = function($model, $name, $db_conn) {	
			$name = $name || '';
			$db_conn = $db_conn || true;
			
			if (PHP.is_array($model)) {
				for($babe in $model) {
					this.model($babe);	
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
			
			if (PHP.in_array($name, $_ci_models, true)) {
				return;
			}
			
			if (CI[$name]) {
				CI_Common.show_error('The model name you are loading is the name of a resource that is already being used: ' + $name);
			}
		
			$model = PHP.strtolower($model);
			
			if (!global.CI_Model) {
				CI_Model = CI_Model = require(PHP.constant('BASEPATH') + 'libraries/model' + PHP.constant('EXT'));
			}
			
			if(PHP.file_exists(PHP.constant('APPPATH') + 'models/' + $path + $model + PHP.constant('EXT'))){
				var $c = require(PHP.constant('APPPATH') + 'models/' + $path + $model + PHP.constant('EXT'));
			} else if (PHP.file_exists(PHP.constant('BASEPATH') + 'models/' + $path + $model + PHP.constant('EXT'))){
				var $c = require(PHP.constant('BASEPATH') + 'models/' + $path + $model + PHP.constant('EXT'));
			} else {
				CI_Common.show_error('Unable to locate the model you have specified: ' + $model, 500);
				return;
			}
			
			if ($db_conn !== false && !global.CI_DB) {
				if ($db_conn === true) {
					$db_conn = '';
				}

				this.database($db_conn, false, true);
			}

			CI[$name] = $c;
			CI[$name]._assign_libraries();
			
			$_ci_models.push($name);
		}
		
		this.database = function($params, $return, $active_record){
			$params = $params || '';
			$return = $return || false;
			$active_record = $active_record || false;
			
			// Do we even need to load the database class?
			if (global.CI_DB && $return == false && $active_record == false && CI.db && PHP.is_object(CI.db)) {
				return false;
			}
			//require_once(BASEPATH.'libraries/MY_DB'.EXT);

			DB = require(PHP.constant('APPPATH') + 'libraries/my_db' + PHP.constant('EXT'));
			
			if ($return === true) {
				return DB($params, $active_record);
			}
			
			// Initialize the db variable.  Needed to prevent   
			// reference errors with some configurations
			CI.db = '';
			
			// Load the DB class
			var $db = new DB();
			$db.__construct($params, $active_record);

			CI.db = $db;
			
			CI.db.on('db_connect', function() {
				console.log('am interceptat evenimentul db_connect');
				
				// Assign the DB object to any existing models
				this._ci_assign_to_models();
			});
		}
		
		return this;
	}

	Util.inherits(MY_Loader, CI_Loader);
	
	module.exports = MY_Loader;
})();