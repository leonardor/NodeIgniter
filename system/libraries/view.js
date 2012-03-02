(function(){
	/**
	*	View Library - simplifies management and loading of views in CodeIgniter applications
	*
	*	@author			Ted Wood (ted[at]codeoflife.ca)
	*	@last_modified	July 28th, 2007
	*
	*/
	
	var View = {};
	
	View = Object.create(Events.EventEmitter.prototype);
	
	View.parent = Events.EventEmitter.prototype;
	View.name = 'View';
	
	View.$vars		= {};
	View.$parts		= {};
	// configuration
	View.$config	= {'parse': false, 'cache_timeout': 0};
		
	View.__construct = function($config) {
		$config = $config || {};
		
		console.log('View.__construct()');
		
		if (PHP.is_array($config)) {
			this.$config = PHP.array_merge(this.$config, $config);
		}
		
		this.set_parse_mode(this.$config['parse']);
		
		if (this.$config['cache_timeout'] > 0) {
			this.cache();
		}
		
		CI_Common.log_message('debug', "View Class Initialized");
		
		return this;
	}
		
	View.__load = function(random) {
		console.log('emitting ' + this.name + '.__load event... (' + random + ')');
		this.emit('__load', this);
		
		return this;
	}
	/**
	 * Toggles parsing mode on (default) or off
	 *
	 * Usage:
	 *   $this->view->set_parse_mode();
	 *
	 * @access	public
	 * @param	bool	whether to parse or not, defaults to TRUE
	 * @return	none
	 */
	View.set_parse_mode = function($state) {
		$state = $state || true;
		
		this.$config['parse'] = $state;
		if (this.$config['parse']) {
			CI_Parser = CI_Common.load_class('parser');
		}
	}
		
	/**
	 * Assigns data to the view
	 *	with option to avoid overwriting existing value (useful for assigning default values)
	 *
	 * Usage:
	 *   $this->view->set($array_of_data);			// assign array of data
	 *   $this->view->set('name', 'value');			// assign atomic value
	 *   $this->view->set('name', 'value', TRUE);	// only assigns value of it doesn't exist
	 *
	 * @access	public
	 * @param	mixed	a placeholder name or array of data
	 * @param	mixed	NULL or value to assign
	 * @param	bool	controls whether existing values are replaced (default) or not
	 * @return	none
	 */
	View.set = function ($data, $value, $no_replace) {		// no_replace: don't replace existing value
		$value = $value || null;
		$no_replace = $no_replace || false;
		
		if (PHP.is_array($data)) {
			for(var $key in $data) {
				this.set($key, $data[$key], $no_replace);
			}
		} else if (!$no_replace || ! this.$vars[$data]) {
			this.$vars[$data] = $value;
		}
	}
	
	/**
	 * Appends string values onto existing string values, if present
	 *  othewise simply assigns to view like set() function
	 *
	 * Usage:
	 *   $this->view->append($array_of_data);
	 *   $this->view->append($name, $value);
	 *
	 * @access	public
	 * @param	mixed	name of placeholder or array of data
	 * @param	mixed	NULL or value of data to assign
	 * @return	none
	 */
	View.append = function ($data, $value) {
		$value = $value || null;
		
		if (PHP.is_array($data)) {
			for(var $key in $data) {
				this.append($key, $data[$key]);
			}
		} else if (PHP.is_string($value)) {
			if (this.$vars[$data]) {
				this.$vars[$data] += $value;
			} else {
				this.$vars[$data] = $value;
			}
		}
	}
	
	/**
	 * Retrieves value of previously-set data, or NULL if it doens't exist
	 *
	 * Usage:
	 *   $this->view->get($name_of_variable);
	 *
	 * @access	public
	 * @param	string	name of existing variable
	 * @return	mixed
	 */
	View.get = function ($name) {
		return (this.$vars[$name]) ? this.$vars[$name] : null;
	}
		
	/*** css & js ***/
	
	/**
	 * Simplifies dynamic loading of CSS files using <link> tag.
	 * Assigns rendered html into specified placeholder variable (defaults to "view_css")
	 *
	 * Usage:
	 *   $this->view->linkCSS('/css/some_styles.css');
	 *
	 * In the view:
	 *    <?php echo $view_css; ?> // must be within the <head> section
	 *
	 * @access	public
	 * @param	string	uri of CSS file
	 * @param	string	name of placeholder variable, defaults to $view_css
	 * @return	none
	 */
	View.linkCSS = function ($href, $var) {
		$var = $var || 'view_css'
			
		if (!this.$vars[$var]) {
			this.$vars[$var] = "<!-- @{" + $var + "} -->\n";
		}
		if (PHP.is_array($href)) {
			for(var $key in $href) {
				this.$vars[$var] += '<link type="text/css" rel="stylesheet" href="' + $hre[$key] + '" />' + "\n";
			}
		} else {
			this.$vars[$var] += '<link type="text/css" rel="stylesheet" href="' + $href + '" />' + "\n";
		}
	}
	
	/**
	 * Simplifies dynamic loading of CSS files using @import directive.
	 * Assigns rendered html into specified placeholder variable (defaults to "view_css")
	 *
	 * Usage:
	 *   $this->view->importCSS('/css/some_styles.css');
	 *
	 * In the view:
	 *    <?php echo $view_css; ?> // can be anywhere in view or a partial
	 *
	 * @access	public
	 * @param	string	uri of CSS file
	 * @param	string	name of placeholder variable, defaults to $view_css
	 * @return	none
	 */
	View.importCSS = function ($url, $var) {
		$var = $var || 'view_css';
			
		if (!this.$vars[$var]) {
			this.$vars[$var] = "<!-- @{" + $var + "} -->\n";
		}
		if (PHP.is_array($url)) {
			for(var $key in $url) {
				this.$vars[$var] += '<style type="text/css">@import url("' + $url[$key] + '");</style>' + "\n";
			}
		} else {
			this.$vars[$var] += '<style type="text/css">@import url("' + $url + '");</style>' + "\n";
		}
	}
	
	/**
	 * Simplifies dynamic loading of JavaScript files.
	 * Assigns rendered html into specified placeholder variable (defaults to "view_js")
	 *
	 * Usage:
	 *   $this->view->linkJS('/js/some_functions.js');
	 *
	 * In the view:
	 *    <?php echo $view_js; ?> // will contain rendered <script> tags
	 *
	 * @access	public
	 * @param	string	uri of JavaScript file
	 * @param	string	name of placeholder variable, defaults to $view_js
	 * @return	none
	 */
	View.linkJS = function ($src, $var) {
		$var = $var || 'view_js';
		
		if (!this.$vars[$var]) {
			this.$vars[$var] = "<!-- @{" + $var + "} -->\n";
		}
		if (PHP.is_array($src)) {
			for(var $key in $src) {
				this.$vars[$var] += '<script type="text/javascript" src="' + $src[$key] + '"></script>' + "\n";
			}
		} else {
			this.$vars[$var] += '<script type="text/javascript" src="' + $src + '"></script>' + "\n";
		}
	}
		
	/*** meta tags ***/
	
	/**
	 * Simplifies dynamic adding of <meta> tags
	 * Assigns rendered html into specified placeholder variable (defaults to "meta_tags")
	 *
	 * Usage:
	 *   $this->view->meta('description', "Here is a description of this page.");
	 *
	 * In the view:
	 *    <?php echo $meta_tags; ?> // must be within the <head> section
	 *
	 * @access	public
	 * @param	string	name of meta tag
	 * @param	string	value of meta tag
	 * @return	none
	 */
	View.meta = function ($name, $content) {
		if (!this.$vars['meta_tags']) {
			this.$vars['meta_tags'] = "<!-- @meta_tags -->\n\t";
		}
		this.$vars['meta_tags'] += '<meta name="' + $name + '" content="' + PHP.htmlentities($content) + '" />' + "\n\t";
	}
	
	/*** includes & templates ***/
	
	/**
	 * Loads a partial or prepares one for loading into the view.
	 *
	 * Usage:
	 *   $this->view->part('placeholder', 'path/to/partial', TRUE or FALSE);
	 *
	 * @access	public
	 * @param	string	name of a placeholder variable from the parent view (can be another partial)
	 * @param	string	subpath of file containing partial within /views/ folder.
	 * @param	bool	controls whether the partial is loaded immediate or when full view is loaded (default)
	 * @return	mixed
	 */
	View.part = function ($name, $view, $render_now) {
		$render_now = $render_now || false;
		
		if ($render_now) {
			this.$vars[$name] = (this.$config['parse'] ? CI_Parser.parse($view, this.$vars, true) : CI.load.view($view, this.$vars, true));
		} else {
			this.$parts[$name] = $view;
		}
	}
		
	/**
	 * Renders and displays or returns a few file. Replacement for CI's $this->load->view() method
	 *
	 * Usage:
	 *   $this->view->load('template', $data_array, TRUE or FALSE);
	 *
	 * @access	public
	 * @param	string	a name of a template file
	 * @param	string	an atomic or array of variables
	 * @param	bool	whether or not to return the view rather than display it
	 * @return	mixed
	 */
	View.load = function ($tpl, $data, $return) {
		$data = $data || {};
		$return = $return || false;
		
		this.set($data);
		
		for(var $name in this.$parts) {
			this.$vars[$name] = (this.$config['parse'] ? CI_Parser.parse(this.$parts[$name], this.$vars, true) : CI.load.view(this.$parts[$name], this.$vars, true));
		}

		return (this.$config['parse'] ? CI_Parser.parse($tpl, this.$vars, $return) : CI.load.view($tpl, this.$vars, $return));
	}
	
	/*** view/part caching ***/
	
	/**
	 * Instruct CI not the cache the view on the server
	 * Send headers to instruct browser not to cache the view
	 *
	 * Usage:
	 *   $this->view->no_cache();
	 *
	 * @access	public
	 * @return	none
	 */
	View.no_cache = function () {
		// tell CI not to cache the view
		CI_Output.cache(0);
		// tell the browser not to cache the view
		CI_Output.set_header('Last-Modified: ' + PHP.gmdate("D, d M Y H:i:s") + ' GMT');
		CI_Output.set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
		CI_Output.set_header('Pragma: no-cache');
		CI_Output.set_header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
	}
		
	View.cache = function ($mins) {
		$mins = $mins || null;
		
		if ($mins === null) {
			$mins = this.$config['cache_timeout'];
		}
		
		CI_Output.cache($mins);
	}
	
	module.exports = View;
})();