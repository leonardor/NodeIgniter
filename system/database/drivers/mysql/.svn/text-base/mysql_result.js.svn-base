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
	
	// --------------------------------------------------------------------
	
	/**
	 * MySQL Result Class
	 *
	 * This class extends the parent result class: CI_DB_result
	 *
	 * @category	Database
	 * @author		ExpressionEngine Dev Team
	 * @link		http://codeigniter.com/user_guide/database/
	 */
	var CI_DB_mysql_result = {};
		
	CI_DB_mysql_result = Object.create(CI_DB_result);
	
	CI_DB_mysql_result.num_rows = function () {
			return PHP.mysql_num_rows(this.$result_id);
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Number of fields in the result set
		 *
		 * @access	public
		 * @return	integer
		 */
	CI_DB_mysql_result.num_fields = function() {
			return PHP.mysql_num_fields(this.$result_id);
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Fetch Field Names
		 *
		 * Generates an array of column names
		 *
		 * @access	public
		 * @return	array
		 */
	CI_DB_mysql_result.list_fields = function () {
			var $field_names = [];
			
			while ($field = PHP.mysql_fetch_field(this.$result_id)) {
				$field_names.push($field.name);
			}
			
			return $field_names;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Field data
		 *
		 * Generates an array of objects containing field meta-data
		 *
		 * @access	public
		 * @return	array
		 */
	CI_DB_mysql_result.field_data = function () {
			var $retval = [];
			
			while ($field = PHP.mysql_fetch_field(this.$result_id)) {	
				$F				= new Object();
				$F.name 		= $field.name;
				$F.type 		= $field.type;
				$F.default		= $field.def;
				$F.max_length	= $field.max_length;
				$F.primary_key = $field.primary_key;
				
				$retval.push($F);
			}
			
			return $retval;
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Free the result
		 *
		 * @return	null
		 */		
	CI_DB_mysql_result.free_result = function () {
			if (PHP.is_resource(this.$result_id)) {
				PHP.mysql_free_result(this.$result_id);
				this.$result_id = false;
			}
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Data Seek
		 *
		 * Moves the internal pointer to the desired offset.  We call
		 * this internally before fetching results to make sure the
		 * result set starts at zero
		 *
		 * @access	private
		 * @return	array
		 */
	CI_DB_mysql_result._data_seek = function ($n) {
			$n = $n || 0;
			
			return PHP.mysql_data_seek(this.$result_id, $n);
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Result - associative array
		 *
		 * Returns the result set as an array
		 *
		 * @access	private
		 * @return	array
		 */
	CI_DB_mysql_result._fetch_assoc = function () {
			return PHP.mysql_fetch_assoc(this.$result_id);
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Result - object
		 *
		 * Returns the result set as an object
		 *
		 * @access	private
		 * @return	object
		 */
	CI_DB_mysql_result._fetch_object = function () {
			return PHP.mysql_fetch_object(this.$result_id);
		}

	
	module.exports = CI_DB_mysql_result;
})();

/* End of file mysql_result.php */
/* Location: ./system/database/drivers/mysql/mysql_result.php */