(function() {
/**
 * CodeIgniter
 *
 * An open source application development framework for PHP 4.3.2 or newer
 *
 * @package		CodeIgniter
 * @author		ExpressionEngine Dev Team
 * @copyright	Copyright (c) 2008 - 2010, EllisLab, Inc.
 * @license		http://codeigniter.com/user_guide/license.html
 * @link		http://codeigniter.com
 * @since		Version 1.0
 * @filesource
 */

// ------------------------------------------------------------------------

/**
 * CodeIgniter Application Controller Class
 *
 * This class object is the super class that every library in
 * CodeIgniter will be assigned to.
 *
 * @package		CodeIgniter
 * @subpackage	Libraries
 * @category	Libraries
 * @author		ExpressionEngine Dev Team
 * @link		http://codeigniter.com/user_guide/general/controllers.html
 */
	var Controller = new function Controller() {
		var $_ci_scaffolding	= false;
		var $_ci_scaff_table	= false;
		
		this.$load = null;
		
		/**
		 * Constructor
		 *
		 * Calls the initialize() function
		 */
		Controller.__construct = function() {
			this.prototype.__construct();
			this._ci_initialize();
			CI_Common.log_message('debug', "Controller Class Initialized");
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
			// Assign all the class objects that were instantiated by the
			// front controller to local class variables so that CI can be
			// run as one big super object.
			/*$classes = {
						'config': 'Config',
						'input': 'Input',
						'benchmark': 'Benchmark',
						'uri': 'URI',
						'output': 'Output',
						'lang': 'Language',
						'router': 'Router'
					};
			
			for($var in $classes) {
				this[$var] = CI_Common.load_class($classes[$var]);
			}*/
	
			// In PHP 5 the Loader class is run as a discreet
			// class.  In PHP 4 it extends the Controller

			if (Math.floor(PHP.phpversion()) >= 5) {
				this.$load = CI_Common.load_class('Loader');
				this.$load.__construct();
				this.$load._ci_autoloader();
			} else {
				this._ci_autoloader();
				
				// sync up the objects since PHP4 was working from a copy
				$attributes = PHP.array_keys(PHP.get_object_vars(this));
				
				for($attribute in $attributes) {
					if (PHP.is_object(this[$attribute])) {
						this.$load[$attribute] = this[$attribute];
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
			if($_ci_scaffolding == false || $_ci_scaff_table === false) {
				CI_Common.show_404('Scaffolding unavailable');
			}
			
			$method = ( ! PHP.in_array(this.uri.segment[3], ['add', 'insert', 'edit', 'update', 'view', 'delete', 'do_delete'], true)) ? 'view' : this.uri.segment[3];
			
			var Scaffolding = require(PHP.constant('BASEPATH') + 'scaffolding/Scaffolding' + PHP.constant('EXT'));
			$scaff = Scaffolding($_ci_scaff_table);
			$scaff[$method]();
		}

		return Controller;
	}

	Controller.prototype = CI;
	//Controller.prototype.constructor = Controller.__construct();
	
	module.exports = Controller;
})();
// END _Controller class

/* End of file Controller.php */
/* Location: ./system/libraries/Controller.php */