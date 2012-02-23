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
	 * Database Cache Class
	 *
	 * @category	Database
	 * @author		ExpressionEngine Dev Team
	 * @link		http://codeigniter.com/user_guide/database/
	 */
	var CI_DB_Cache = {
		$db: null,	// allows passing of db object so that multiple database connections and returned db objects can be supported
	
		/**
		 * Constructor
		 *
		 * Grabs the CI super object instance so we can access it.
		 *
		 */	
		__construct: function($db) {
			// Assign the main CI object to $this->CI
			// and load the file helper since we use it a lot
			this.$db = CI.db;
			var file_helper = CI.load.helper('file');	
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Set Cache Directory Path
		 *
		 * @access	public
		 * @param	string	the path to the cache directory
		 * @return	bool
		 */		
		check_path:	function ($path) {
			$path = $path || '';
				
			if ($path == '') {
				if (this.$db.cachedir == '') {
					return this.$db.cache_off();
				}
			
				$path = this.$db.cachedir;
			}
		
			// Add a trailing slash to the path if needed
			$path = PHP.preg_replace("/(.+?)\/*$/", "\\1/",  $path);
	
			if ( ! PHP.is_dir($path) || ! CI_Common.is_really_writable($path))
			{
				// If the path is wrong we'll turn off caching
				return this.$db.cache_off();
			}
			
			this.$db.cachedir = $path;
			return true;
		},
		
		// --------------------------------------------------------------------
	
		/**
		 * Retrieve a cached query
		 *
		 * The URI being requested will become the name of the cache sub-folder.
		 * An MD5 hash of the SQL statement will become the cache file name
		 *
		 * @access	public
		 * @return	string
		 */
		read: function ($sql) {
			if ( ! this.check_path()) {
				return this.$db.cache_off();
			}
	
			var $segment_one = ($CI.uri.segment(1) == false) ? 'default' : $CI.uri.segment(1);
			
			var $segment_two = ($CI.uri.segment(2) == false) ? 'index' : $CI.uri.segment(2);
		
			var $filepath = this.$db.cachedir + $segment_one + '+' + $segment_two + '/' + PHP.md5($sql);		
			
			if (false === (var $cachedata = PHP.read_file($filepath))) {	
				return FALSE;
			}
			
			return PHP.unserialize($cachedata);			
		},	
	
		// --------------------------------------------------------------------
	
		/**
		 * Write a query to a cache file
		 *
		 * @access	public
		 * @return	bool
		 */
		write: function ($sql, $object) {
			if ( ! this.check_path()) {
				return this.$db.cache_off();
			}
	
			var $segment_one = ($CI.uri.segment(1) == false) ? 'default' : $CI.uri.segment(1);
			
			var $segment_two = ($CI.uri.segment(2) == false) ? 'index' : $CI.uri.segment(2);
		
			var $dir_path = this.$db.cachedir + $segment_one + '+' + $segment_two + '/';
			
			var $filename = PHP.md5($sql);
		
			if ( ! PHP.is_dir($dir_path)) {
				if ( ! PHP.mkdir($dir_path, PHP.constant('DIR_WRITE_MODE'))) {
					return false;
				}
				
				PHP.chmod($dir_path, PHP.constant('DIR_WRITE_MODE'));			
			}
			
			if (file_helper.write_file($dir_path + $filename, PHP.serialize($object)) === false) {
				return false;
			}
			
			PHP.chmod($dir_path + $filename, PHP.constant('DIR_WRITE_MODE'));
			return true;
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Delete cache files within a particular directory
		 *
		 * @access	public
		 * @return	bool
		 */
		delete: function ($segment_one, $segment_two) {	
			$segment_one = $segment_one || '';
			$segment_two = $segment_two || '';
				
			if ($segment_one == '') {
				$segment_one  = ($CI.uri.segment(1) == false) ? 'default' : $CI.uri.segment(1);
			}
			
			if ($segment_two == '') {
				$segment_two = ($CI.uri.segment(2) == false) ? 'index' : $CI.uri.segment(2);
			}
			
			var $dir_path = this.$db.cachedir + $segment_one + '+' + $segment_two + '/';
			
			file_helper.delete_files($dir_path, true);
		},
	
		// --------------------------------------------------------------------
	
		/**
		 * Delete all existing cache files
		 *
		 * @access	public
		 * @return	bool
		 */
		delete_all: function () {
			file_helper.delete_files(this.$db.cachedir, true);
		}
	}

	module.exports = CI_DB_cache;
})();

/* End of file DB_cache.php */
/* Location: ./system/database/DB_cache.php */