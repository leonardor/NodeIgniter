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
	 * Session Class
	 *
	 * @package		CodeIgniter
	 * @subpackage	Libraries
	 * @category	Sessions
	 * @author		ExpressionEngine Dev Team
	 * @link		http://codeigniter.com/user_guide/libraries/sessions.html
	 */
	var CI_Session = {};
	
	CI_Session = Object.create(Events.EventEmitter.prototype);
	
	CI_Session.parent = Events.EventEmitter.prototype;
	CI_Session.name = 'CI_Session';
	
	CI_Session.$sess_encrypt_cookie		= false;
	CI_Session.$sess_use_database		= false;
	CI_Session.$sess_table_name			= '';
	CI_Session.$sess_expiration			= 7200;
	CI_Session.$sess_match_ip			= false;
	CI_Session.$sess_match_useragent	= true;
	CI_Session.$sess_cookie_name		= 'ci_session';
	CI_Session.$cookie_prefix			= '';
	CI_Session.$cookie_path				= '';
	CI_Session.$cookie_domain			= '';
	CI_Session.$sess_time_to_update		= 300;
	CI_Session.$encryption_key			= '';
	CI_Session.$flashdata_key 			= 'flash';
	CI_Session.$time_reference			= 'time';
	CI_Session.$gc_probability			= 5;
	CI_Session.$userdata				= {};
	CI_Session.$now = 0;
	
	/**
	 * Session Constructor
	 *
	 * The constructor runs the session routines automatically
	 * whenever the class is instantiated.
	 */
	CI_Session.__construct = function($params) {
		$params = $params || [];
		
		CI_Common.log_message('debug', "Session Class Initialized");

		// Set all the session preferences, which can either be set
		// manually via the $params array above or via the config file
		var $array = ['sess_encrypt_cookie', 'sess_use_database', 'sess_table_name', 'sess_expiration', 'sess_match_ip', 'sess_match_useragent', 'sess_cookie_name', 'cookie_path', 'cookie_domain', 'sess_time_to_update', 'time_reference', 'cookie_prefix', 'encryption_key'];
		
		for(var $key in $array) {
			this['$' + $array[$key]] = ($params[$array[$key]]) ? $params[$array[$key]] : CI_Common.config_item($array[$key]);
		}

		// Load the string helper so we can use the strip_slashes() function
		CI.load.helper('string');

		// Do we need encryption? If so, load the encryption class
		if (this.$sess_encrypt_cookie == true) {
			CI.load.library('encrypt');
		}

		// Are we using a database?  If so, load it
		if (this.$sess_use_database === true && this.$sess_table_name != '') {
			CI.load.database();
		}

		// Set the "now" time.  Can either be GMT or server time, based on the
		// config prefs.  We use this to set the "last activity" time
		this.$now = this._get_time();

		// Set the session length. If the session expiration is
		// set to zero we'll set the expiration two years from now.
		if (this.$sess_expiration == 0) {
			this.$sess_expiration = (60*60*24*365*2);
		}

		// Set the cookie name
		this.$sess_cookie_name = this.$cookie_prefix + this.$sess_cookie_name;

		// Run the Session routine. If a session doesn't exist we'll
		// create a new one.  If it does, we'll update it.
		if ( ! this.sess_read()) {
			this.sess_create();
		} else {
			this.sess_update();
		}

		// Delete 'old' flashdata (from last request)
	   	this._flashdata_sweep();

		// Mark all new flashdata as old (data will be deleted before next request)
	   	this._flashdata_mark();

		// Delete expired sessions if necessary
		this._sess_gc();

		CI_Common.log_message('debug', "Session routines successfully run");
		
		return this;
	}
	
	CI_Session.__load = function(random) {
		console.log('emitting ' + this.name + '.__load event... (' + random + ')');
		this.emit('__load', this);
		
		return this;
	}

	// --------------------------------------------------------------------

	/**
	 * Fetch the current session data if it exists
	 *
	 * @access	public
	 * @return	bool
	 */
	CI_Session.sess_read = function () {
		// Fetch the cookie
		var $session = CI_Input.cookie(this.$sess_cookie_name);

		// No cookie?  Goodbye cruel world!...
		if ($session === false) {
			CI_Common.log_message('debug', 'A session cookie was not found.');
			return false;
		}

		// Decrypt the cookie data
		if (this.$sess_encrypt_cookie == true) {
			$session = CI.encrypt.decode($session);
		} else {
			// encryption was not used, so we need to check the md5 hash
			var $hash	 = PHP.substr($session, PHP.strlen($session)-32); // get last 32 chars
			$session = PHP.substr($session, 0, PHP.strlen($session)-32);

			// Does the md5 hash match?  This is to prevent manipulation of session data in userspace
			if ($hash !==  PHP.md5($session + this.$encryption_key)) {
				CI_Common.log_message('error', 'The session cookie data did not match what was expected. This could be a possible hacking attempt.');
				this.sess_destroy();
				return false;
			}
		}

		// Unserialize the session array
		$session = this._unserialize($session);

		// Is the session data we unserialized an array with the correct format?
		if ( ! PHP.is_array($session) || ! $session['session_id'] || ! $session['ip_address'] || ! $session['user_agent'] || ! $session['last_activity']) {
			this.sess_destroy();
			return false;
		}

		// Is the session current?
		if (($session['last_activity'] + this.$sess_expiration) < this.$now) {
			this.sess_destroy();
			return false;
		}

		// Does the IP Match?
		if (this.$sess_match_ip == true && $session['ip_address'] != CI_Input.ip_address()) {
			this.sess_destroy();
			return false;
		}

		// Does the User Agent Match?
		if (this.$sess_match_useragent == true && PHP.trim($session['user_agent']) != PHP.trim(PHP.substr(CI_Input.user_agent(), 0, 50))) {
			this.sess_destroy();
			return false;
		}

		// Is there a corresponding session in the DB?
		if (this.$sess_use_database === true) {
			CI.db.where('session_id', $session['session_id']);

			if (this.$sess_match_ip == true) {
				CI.db.where('ip_address', $session['ip_address']);
			}

			if ($this.$sess_match_useragent == true) {
				CI.db.where('user_agent', $session['user_agent']);
			}

			var $query = CI.db.get(this.$sess_table_name);

			// No result?  Kill it!
			if ($query.num_rows() == 0) {
				this.sess_destroy();
				return false;
			}

			// Is there custom data?  If so, add it to the main session array
			$row = $query.row();
			
			if ($row.user_data && $row.user_data != '') {
				var $custom_data = this._unserialize($row.user_data);

				if (PHP.is_array($custom_data)) {
					for(var $key in $custom_data) {
						$session[$key] = $custom_data[$key];
					}
				}
			}
		}

		// Session is valid!
		this.$userdata = $session;
		PHP.unset($session);

		return true;
	}

	// --------------------------------------------------------------------

	/**
	 * Write the session data
	 *
	 * @access	public
	 * @return	void
	 */
	CI_Session.sess_write = function () {
		// Are we saving custom data to the DB?  If not, all we do is update the cookie
		if (this.$sess_use_database === false) {
			this._set_cookie();
			return;
		}

		// set the custom userdata, the session data we will set in a second
		var $custom_userdata = this.userdata;
		var $cookie_userdata = {};

		// Before continuing, we need to determine if there is any custom data to deal with.
		// Let's determine this by removing the default indexes to see if there's anything left in the array
		// and set the session data while we're at it
		var $array = ['session_id','ip_address','user_agent','last_activity'];
		
		for(var $key in $array) {
			PHP.unset($custom_userdata[$key]);
			$cookie_userdata[$array[$key]] = this.$userdata[$array[$key]];
		}

		// Did we find any custom data?  If not, we turn the empty array into a string
		// since there's no reason to serialize and store an empty array in the DB
		if (PHP.count($custom_userdata) === 0) {
			$custom_userdata = '';
		} else {
			// Serialize the custom data array so we can store it
			$custom_userdata = this._serialize($custom_userdata);
		}

		// Run the update query
		CI.db.where('session_id', this.$userdata['session_id']);
		CI.db.update(this.$sess_table_name, {'last_activity': this.$userdata['last_activity'], 'user_data': $custom_userdata });

		// Write the cookie.  Notice that we manually pass the cookie data array to the
		// _set_cookie() function. Normally that function will store $this->userdata, but
		// in this case that array contains custom data, which we do not want in the cookie.
		this._set_cookie($cookie_userdata);
	}

	// --------------------------------------------------------------------

	/**
	 * Create a new session
	 *
	 * @access	public
	 * @return	void
	 */
	CI_Session.sess_create = function () {
		var $sessid = '';
		
		while (PHP.strlen($sessid) < 32) {
			$sessid += PHP.mt_rand(0, PHP.mt_getrandmax());
		}

		// To make the session ID even more secure we'll combine it with the user's IP
		$sessid += CI_Input.ip_address();

		this.$userdata = {
			'session_id': PHP.md5(PHP.uniqid($sessid, true)),
			'ip_address': CI_Input.ip_address(),
			'user_agent': PHP.substr(CI_Input.user_agent(), 0, 50),
			'last_activity': this.$now
		};


		// Save the data to the DB if needed
		if (this.$sess_use_database === true) {
			CI.db.query(CI.db.insert_string(this.$sess_table_name, this.userdata));
		}

		// Write the cookie
		this._set_cookie();
	}

	// --------------------------------------------------------------------

	/**
	 * Update an existing session
	 *
	 * @access	public
	 * @return	void
	 */
	CI_Session.sess_update = function () {
		// We only update the session every five minutes by default
		if ((this.$userdata['last_activity'] + this.$sess_time_to_update) >= this.$now) {
			return;
		}

		// Save the old session id so we know which record to
		// update in the database if we need it
		var $old_sessid = this.$userdata['session_id'];
		var $new_sessid = '';
		
		while (PHP.strlen($new_sessid) < 32) {
			$new_sessid += PHP.mt_rand(0, PHP.mt_getrandmax());
		}

		// To make the session ID even more secure we'll combine it with the user's IP
		$new_sessid += CI_Input.ip_address();

		// Turn it into a hash
		$new_sessid = PHP.md5(PHP.uniqid($new_sessid, true));

		// Update the session data in the session data array
		this.$userdata['session_id'] = $new_sessid;
		this.$userdata['last_activity'] = this.$now;

		// _set_cookie() will handle this for us if we aren't using database sessions
		// by pushing all userdata to the cookie.
		var $cookie_data = null;

		// Update the session ID and last_activity field in the DB if needed
		if (this.$sess_use_database === true) {
			// set cookie explicitly to only have our session data
			$cookie_data = {};
			
			var $array = array('session_id','ip_address','user_agent','last_activity');
			
			for(var $key in $array) {
				$cookie_data[$array[$key]] = this.$userdata[$array[$key]];
			}

			CI.db.query(CI.db.update_string(this.$sess_table_name, {'last_activity': this.$now, 'session_id': $new_sessid}, {'session_id': $old_sessid}));
		}

		// Write the cookie
		this._set_cookie($cookie_data);
	}

	// --------------------------------------------------------------------

	/**
	 * Destroy the current session
	 *
	 * @access	public
	 * @return	void
	 */
	CI_Session.sess_destroy = function () {
		// Kill the session DB row
		if (this.$sess_use_database === true && this.$userdata['session_id']) {
			CI.db.where('session_id', this.$userdata['session_id']);
			CI.db.delete(this.$sess_table_name);
		}

		// Kill the cookie
		PHP.setcookie(
			this.$sess_cookie_name,
			PHP.addslashes(PHP.serialize([])),
			(this.$now - 31500000),
			this.$cookie_path,
			this.$cookie_domain,
			0
		);
	}

	// --------------------------------------------------------------------

	/**
	 * Fetch a specific item from the session array
	 *
	 * @access	public
	 * @param	string
	 * @return	string
	 */
	CI_Session.userdata = function ($item) {
		return ( ! this.$userdata[$item]) ? false : this.$userdata[$item];
	}

	// --------------------------------------------------------------------

	/**
	 * Fetch all session data
	 *
	 * @access	public
	 * @return	mixed
	 */
	CI_Session.all_userdata = function () {
		return ( ! this.$userdata) ? false : this.$userdata;
	}

	// --------------------------------------------------------------------

	/**
	 * Add or change data in the "userdata" array
	 *
	 * @access	public
	 * @param	mixed
	 * @param	string
	 * @return	void
	 */
	CI_Session.set_userdata = function ($newdata, $newval) {
		$newdata = $newdata || {};
		$newval = $newval || '';
		
		if (PHP.is_string($newdata)) {
			$newdata = {$newdata: $newval};
		}

		if (PHP.count($newdata) > 0) {
			for(var $key in $newdata) {
				this.userdata[$key] = $newdata[$key];
			}
		}

		this.sess_write();
	}

	// --------------------------------------------------------------------

	/**
	 * Delete a session variable from the "userdata" array
	 *
	 * @access	array
	 * @return	void
	 */
	CI_Session.unset_userdata = function ($newdata) {
		$newdata = $newdata || {};
		
		if (PHP.is_string($newdata)) {
			$newdata = {$newdata: ''};
		}

		if (PHP.count($newdata) > 0) {
			for(var $key in $newdata) {
				PHP.unset(this.$userdata[$key]);
			}
		}

		this.sess_write();
	}

	// ------------------------------------------------------------------------

	/**
	 * Add or change flashdata, only available
	 * until the next request
	 *
	 * @access	public
	 * @param	mixed
	 * @param	string
	 * @return	void
	 */
	CI_Session.set_flashdata = function ($newdata, $newval)
	{
		$newdata = $newdata || {};
		$newval = $newval || '';
		
		if (PHP.is_string($newdata)) {
			$newdata = {$newdata: $newval};
		}

		if (PHP.count($newdata) > 0) {
			for(var $key in $newdata) {
				var $flashdata_key = this.$flashdata_key + ':new:' + $key;
				this.set_userdata($flashdata_key, $newdata[$key]);
			}
		}
	}

	// ------------------------------------------------------------------------

	/**
	 * Keeps existing flashdata available to next request.
	 *
	 * @access	public
	 * @param	string
	 * @return	void
	 */
	CI_Session.keep_flashdata = function ($key) {
		// 'old' flashdata gets removed.  Here we mark all
		// flashdata as 'new' to preserve it from _flashdata_sweep()
		// Note the function will return FALSE if the $key
		// provided cannot be found
		var $old_flashdata_key = this.$flashdata_key + ':old:' + $key;
		var $value = this.userdata($old_flashdata_key);

		var $new_flashdata_key = this.$flashdata_key + ':new:' + $key;
		this.set_userdata($new_flashdata_key, $value);
	}

	// ------------------------------------------------------------------------

	/**
	 * Fetch a specific flashdata item from the session array
	 *
	 * @access	public
	 * @param	string
	 * @return	string
	 */
	CI_Session.flashdata = function ($key) {
		var $flashdata_key = this.$flashdata_key + ':old:' + $key;
		return this.userdata($flashdata_key);
	}

	// ------------------------------------------------------------------------

	/**
	 * Identifies flashdata as 'old' for removal
	 * when _flashdata_sweep() runs.
	 *
	 * @access	private
	 * @return	void
	 */
	CI_Session._flashdata_mark = function () {
		var $userdata = this.all_userdata();
		for(var $key in $userdata) {
			var $parts = PHP.explode(':new:', $key);
			if (PHP.is_array($parts) && PHP.count($parts) === 2) {
				var $new_name = this.$flashdata_key + ':old:' + $parts[1];
				this.set_userdata($new_name, $userdata[$key]);
				this.unset_userdata($userdata[$key]);
			}
		}
	}

	// ------------------------------------------------------------------------

	/**
	 * Removes all flashdata marked as 'old'
	 *
	 * @access	private
	 * @return	void
	 */

	CI_Session._flashdata_sweep = function () {
		var $userdata = this.all_userdata();
		for(var $key in $userdata) {
			if (PHP.strpos($key, ':old:')) {
				this.unset_userdata($key);
			}
		}

	}

	// --------------------------------------------------------------------

	/**
	 * Get the "now" time
	 *
	 * @access	private
	 * @return	string
	 */
	CI_Session._get_time = function () {
		if (PHP.strtolower(this.$time_reference) == 'gmt') {
			var $now = PHP.time();
			var $time = PHP.mktime(PHP.gmdate("H", $now), PHP.gmdate("i", $now), PHP.gmdate("s", $now), gmdate("m", $now), PHP.gmdate("d", $now), PHP.gmdate("Y", $now));
		} else {
			var $time = PHP.time();
		}

		return $time;
	}

	// --------------------------------------------------------------------

	/**
	 * Write the session cookie
	 *
	 * @access	public
	 * @return	void
	 */
	CI_Session._set_cookie = function ($cookie_data) {
		$cookie_data = $cookie_data || null;
		
		if (PHP.is_null($cookie_data)) {
			$cookie_data = this.$userdata;
		}

		// Serialize the userdata for the cookie
		$cookie_data = this._serialize($cookie_data);

		if (this.$sess_encrypt_cookie == true) {
			$cookie_data = CI.encrypt.encode($cookie_data);
		} else {
			// if encryption is not used, we provide an md5 hash to prevent userside tampering
			$cookie_data = $cookie_data + PHP.md5($cookie_data + this.$encryption_key);
		}

		// Set the cookie
		PHP.setcookie(
			this.$sess_cookie_name,
			$cookie_data,
			this.$sess_expiration + PHP.time(),
			this.$cookie_path,
			this.$cookie_domain,
			0
		);
	}

	// --------------------------------------------------------------------

	/**
	 * Serialize an array
	 *
	 * This function first converts any slashes found in the array to a temporary
	 * marker, so when it gets unserialized the slashes will be preserved
	 *
	 * @access	private
	 * @param	array
	 * @return	string
	 */
	CI_Session._serialize = function ($data) {
		if (PHP.is_array($data)) {
			for(var $key in $data) {
				$data[$key] = PHP.str_replace('\\', '{{slash}}', $data[$key]);
			}
		} else {
			$data = PHP.str_replace('\\', '{{slash}}', $data);
		}

		return PHP.serialize($data);
	}

	// --------------------------------------------------------------------

	/**
	 * Unserialize
	 *
	 * This function unserializes a data string, then converts any
	 * temporary slash markers back to actual slashes
	 *
	 * @access	private
	 * @param	array
	 * @return	string
	 */
	CI_Session._unserialize = function ($data) {
		$data = PHP.unserialize(PHP.strip_slashes($data));

		if (PHP.is_array($data)) {
			for(var $key in $data) {
				$data[$key] = PHP.str_replace('{{slash}}', '\\', $data[$key]);
			}

			return $data;
		}

		return PHP.str_replace('{{slash}}', '\\', $data);
	}

	// --------------------------------------------------------------------

	/**
	 * Garbage collection
	 *
	 * This deletes expired session rows from database
	 * if the probability percentage is met
	 *
	 * @access	public
	 * @return	void
	 */
	CI_Session._sess_gc = function () {
		if (this.$sess_use_database != true) {
			return;
		}

		PHP.srand(PHP.time());
		
		if ((PHP.rand() % 100) < this.$gc_probability) {
			var $expire = this.$now - this.$sess_expiration;

			CI.db.where("last_activity < {$expire}");
			CI.db.delete(this.$sess_table_name);

			CI_Common.log_message('debug', 'Session garbage collection performed.');
		}
	}
	
	module.exports = CI_Session;
})();
// END Session Class

/* End of file Session.php */
/* Location: ./system/libraries/Session.php */