(function() {
	var Model = {};
	
	Model = Object.create(Events.EventEmitter.prototype);
	
	Model.name = 'Model';
	Model.$_parent_name = '';

	Model.__construct = function() {
		console.log('Model.__construct()');
		// If the magic __get() or __set() methods are used in a Model references can't be used.
		this._assign_libraries((PHP.method_exists(this, '__get') || PHP.method_exists(this, '__set')) ? false : true );
		
		// We don't want to assign the model object to itself when using the
		// assign_libraries function below so we'll grab the name of the model parent
		this.$_parent_name = PHP.ucfirst(PHP.get_class(this));
		
		CI_Common.log_message('debug', "Model Class Initialized");
		
		return this;
	}

	/**
	 * Assign Libraries
	 *
	 * Creates local references to all currently instantiated objects
	 * so that any syntax that can be legally used in a controller
	 * can be used within models.  
	 *
	 * @access private
	 */	
	Model._assign_libraries = function($use_reference) {
		console.log('Model._assign_libraries()');
		
		$use_reference = $use_reference || true;
		
		for($key in PHP.array_keys(PHP.get_object_vars(CI))) {
			if ( ! this[$key] && $key != this.$_parent_name) {			
				// In some cases using references can cause
				// problems so we'll conditionally use them
				if ($use_reference == true) {
					this[$key] = null; // Needed to prevent reference errors with some configurations
					this[$key] = CI[$key];
				} else {
					this[$key] = CI[$key];
				}
			}
		}		
	}

	module.exports = Model;
})();
// END Model Class

/* End of file Model.php */
/* Location: ./system/libraries/Model.php */