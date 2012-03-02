(function() {
	var Controller = {};
	
	Controller = Object.create(Events.EventEmitter.prototype);
	
	Controller.parent = Events.EventEmitter.prototype;
	Controller.name = 'Controller';
	
	Controller.$_ci_scaffolding	= false;
	Controller.$_ci_scaff_table	= false;
		
	/**
	 * Constructor
	 *
	 * Calls the initialize() function
	 */
	Controller.__construct = function() {
		console.log('Controller.__construct()');
		this._ci_initialize();
		CI_Common.log_message('debug', "Controller Class Initialized");
		
		return this;
	}
	
	// --------------------------------------------------------------------

	/**
	 * Initialize
	 *
	 * Assigns all the bases classes loaded by the front controller to
	 * variables in this class.  Also calls the autoload routine.
	 *
	 * @access	private
	 * @return	void
	 */
	Controller._ci_initialize = function() {
		console.log('Controller._ci_initialize()');
		// Assign all the class objects that were instantiated by the
		// front controller to local class variables so that CI can be
		// run as one big super object.
		var $classes = {
					'config': 'Config',
					'input': 'Input',
					'benchmark': 'Benchmark',
					'uri': 'URI',
					'output': 'Output',
					'lang': 'Language',
					'router': 'Router'
				};
		
		for(var $var in $classes) {
			if(!CI[$var]) {
				CI[$var] = CI_Common.load_class($classes[$var]);
				CI[$var].__construct();
			}
			
		}
		
		// In PHP 5 the Loader class is run as a discreet
		// class.  In PHP 4 it extends the Controller

		if (Math.floor(PHP.phpversion()) >= 5) {
			CI.load = CI_Common.load_class('Loader');
			CI.load.__construct();
			CI.load._ci_autoloader();
			
			this.load = CI.load;
		} else {
			this._ci_autoloader();
			
			// sync up the objects since PHP4 was working from a copy
			var $attributes = PHP.array_keys(PHP.get_object_vars(this));
			
			for($attribute in $attributes) {
				if (PHP.is_object(this[$attributes[$attribute]])) {
					this.load[$attributes[$attribute]] = this[$attributes[$attribute]];
				}
			}
		}
	}
		
	// --------------------------------------------------------------------
	
	/**
	 * Run Scaffolding
	 *
	 * @access	private
	 * @return	void
	 */	
	Controller._ci_scaffolding = function() {
		if(this.$_ci_scaffolding == false || this.$_ci_scaff_table === false) {
			CI_Common.show_404('Scaffolding unavailable');
			PHP.exit('Scaffolding unavailable', 404);
		}
		
		var $method = ( ! PHP.in_array(CI_URI.segment[3], ['add', 'insert', 'edit', 'update', 'view', 'delete', 'do_delete'], true)) ? 'view' : CI_URI.segment[3];
		
		var Scaffolding = require(PHP.constant('BASEPATH') + 'scaffolding/Scaffolding' + PHP.constant('EXT'));
		var $scaff = Scaffolding(this.$_ci_scaff_table);
		$scaff[$method]();
	}

	module.exports = Controller;
})();
// END _Controller class

/* End of file Controller.php */
/* Location: ./system/libraries/Controller.php */