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
 * CodeIgniter Model Class
 *
 * @package		CodeIgniter
 * @subpackage	Libraries
 * @category	Libraries
 * @author		ExpressionEngine Dev Team
 * @link		http://codeigniter.com/user_guide/libraries/config.html
 */
	var Model = new function Model() {

		var $_parent_name = '';
	
		/**
		 * Constructor
		 *
		 * @access public
		 */
		Model.__construct = function() {
			// If the magic __get() or __set() methods are used in a Model references can't be used.
			this._assign_libraries((PHP.method_exists(this, '__get') || PHP.method_exists(this, '__set')) ? false : true );
			
			// We don't want to assign the model object to itself when using the
			// assign_libraries function below so we'll grab the name of the model parent
			$_parent_name = PHP.ucfirst(CI_Common.get_class(this));
			
			CI_Common.log_message('debug', "Model Class Initialized");
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
		this._assign_libraries = function($use_reference) {
			$CI = CI.get_instance();	
			
			for($key in PHP.array_keys(PHP.get_object_vars($CI))) {
				if ( ! PHP.isset(this[$key]) AND $key != $_parent_name) {			
					// In some cases using references can cause
					// problems so we'll conditionally use them
					if ($use_reference == true) {
						this[$key] = null; // Needed to prevent reference errors with some configurations
						this[$key] = $CI[$key];
					} else {
						$this[$key] = $CI[$key];
					}
				}
			}		
		}
		
		return Model;
	}
	
	//Model.prototype.constructor = Model.__construct();
	
	module.exports = Model;
})();
// END Model Class

/* End of file Model.php */
/* Location: ./system/libraries/Model.php */