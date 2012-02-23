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
	 * Database Result Class
	 *
	 * This is the platform-independent result class.
	 * This class will not be called directly. Rather, the adapter
	 * class for the specific database will extend and instantiate it.
	 *
	 * @category	Database
	 * @author		ExpressionEngine Dev Team
	 * @link		http://codeigniter.com/user_guide/database/
	 */
	var CI_DB_result = {
		$conn_id: null,
		$result_id: null,
		$result_array: [],
		$result_object: [],
		$current_row: 0,
		$num_rows: 0,
		$row_data: null,
	
	
		/**
		 * Query result.  Acts as a wrapper function for the following functions.
		 *
		 * @access	public
		 * @param	string	can be "object" or "array"
		 * @return	mixed	either a result object or array	
		 */	
		result: function ($type) {	
			$type = $type || 'object';
			
			return ($type == 'object') ? this.result_object() : this.result_array();
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Query result.  "object" version.
		 *
		 * @access	public
		 * @return	object
		 */	
		result_object: function () {
			if (PHP.count(this.$result_object) > 0) {
				return this.$result_object;
			}
			
			// In the event that query caching is on the result_id variable 
			// will return FALSE since there isn't a valid SQL resource so 
			// we'll simply return an empty array.
			if (this.$result_id === false || this.num_rows() == 0) {
				return [];
			}
	
			this._data_seek(0);
			
			var $row;
			
			while($row = this._fetch_object()) {
				this.$result_object.push($row);
			}
			
			return this.$result_object;
		},
		
		// --------------------------------------------------------------------
	
		/**
		 * Query result.  "array" version.
		 *
		 * @access	public
		 * @return	array
		 */	
		result_array: function () {
			if (PHP.count(this.$result_array) > 0) {
				return this.$result_array;
			}
	
			// In the event that query caching is on the result_id variable 
			// will return FALSE since there isn't a valid SQL resource so 
			// we'll simply return an empty array.
			if (this.$result_id === false || this.num_rows() == 0) {
				return [];
			}
	
			this._data_seek(0);
			
			var $row;
			
			while ($row = this._fetch_assoc()) {
				this.$result_array.push($row);
			}
			
			return this.$result_array;
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Query result.  Acts as a wrapper function for the following functions.
		 *
		 * @access	public
		 * @param	string
		 * @param	string	can be "object" or "array"
		 * @return	mixed	either a result object or array	
		 */	
		row: function ($n, $type) {
			$n = $n || 0;
			$type = $type || 'object';
				
			if ( ! PHP.is_numeric($n)) {
				// We cache the row data for subsequent uses
				if ( ! PHP.is_array(this.$row_data)) {
					this.$row_data = this.row_array(0);
				}
			
				// array_key_exists() instead of isset() to allow for MySQL NULL values
				if (PHP.array_key_exists($n, this.$row_data)) {
					return this.$row_data[$n];
				}
				// reset the $n variable if the result was not achieved			
				$n = 0;
			}
			
			return ($type == 'object') ? this.row_object($n) : this.row_array($n);
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Assigns an item into a particular column slot
		 *
		 * @access	public
		 * @return	object
		 */	
		set_row: function ($key, $value) {
			$value = $value || null;
			
			// We cache the row data for subsequent uses
			if ( ! PH.is_array(this.$row_data)) {
				this.$row_data = this.row_array(0);
			}
		
			if (PHP.is_array($key)) {
				for(var $k in $key) {
					this.$row_data[$k] = $key[$k];
				}
				
				return;
			}
		
			if ($key != '' && ! PHP.is_null($value)) {
				this.$row_data[$key] = $value;
			}
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Returns a single result row - object version
		 *
		 * @access	public
		 * @return	object
		 */	
		row_object: function ($n) {
			$n = $n || 0;
			
			var $result = this.result_object();
			
			if (PHP.count($result) == 0) {
				return $result;
			}
	
			if ($n != this.$current_row && $result[$n]){
				this.$current_row = $n;
			}
	
			return $result[this.$current_row];
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Returns a single result row - array version
		 *
		 * @access	public
		 * @return	array
		 */	
		row_array: function ($n) {
			$n = $n || 0;
			
			var $result = this.result_array();
	
			if (PHP.count($result) == 0) {
				return $result;
			}
				
			if ($n != this.$current_row && $result[$n]) {
				this.$current_row = $n;
			}
			
			return $result[this.$current_row];
		},
	
			
		// --------------------------------------------------------------------
	
		/**
		 * Returns the "first" row
		 *
		 * @access	public
		 * @return	object
		 */	
		first_row: function ($type) {
			$type = $type || 'object';
				
			var $result = this.result($type);
	
			if (PHP.count($result) == 0) {
				return $result;
			}
			
			return $result[0];
		},
		
		// --------------------------------------------------------------------
	
		/**
		 * Returns the "last" row
		 *
		 * @access	public
		 * @return	object
		 */	
		last_row: function ($type) {
			$type = $type || 'object';
			
			var $result = this.result($type);
	
			if (PHP.count($result) == 0) {
				return $result;
			}
			
			return $result[PHP.count($result)-1];
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Returns the "next" row
		 *
		 * @access	public
		 * @return	object
		 */	
		next_row: function ($type) {
			$type = $type || 'object';
			
			var $result = this.result($type);
	
			if (PHP.count($result) == 0) {
				return $result;
			}
	
			if ($result[this.$current_row + 1]) {
				++this.$current_row;
			}
					
			return $result[this.$current_row];
		},
		
		// --------------------------------------------------------------------
	
		/**
		 * Returns the "previous" row
		 *
		 * @access	public
		 * @return	object
		 */	
		previous_row: function ($type) {
			$type = $type || 'object';
			
			var $result = this.result($type);
	
			if (PHP.count($result) == 0) {
				return $result;
			}
	
			if ($result[this.$current_row - 1]) {
				--this.$current_row;
			}
			
			return $result[this.$current_row];
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * The following functions are normally overloaded by the identically named
		 * methods in the platform-specific driver -- except when query caching
		 * is used.  When caching is enabled we do not load the other driver.
		 * These functions are primarily here to prevent undefined function errors
		 * when a cached result object is in use.  They are not otherwise fully
		 * operational due to the unavailability of the database resource IDs with
		 * cached results.
		 */
		num_rows: function () { return this.$num_rows; },
		num_fields: function () { return 0; },
		list_fields: function () { return []; },
		field_data: function () { return []; },
		free_result: function () { return true; },
		_data_seek: function () { return true; },
		_fetch_assoc: function () { return []; },	
		_fetch_object: function () { return []; }
	}
	
	module.exports = CI_DB_result;
})();
// END DB_result class

/* End of file DB_result.php */
/* Location: ./system/database/DB_result.php */