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
	 * Active Record Class
	 *
	 * This is the platform-independent base Active Record implementation class.
	 *
	 * @package		CodeIgniter
	 * @subpackage	Drivers
	 * @category	Database
	 * @author		ExpressionEngine Dev Team
	 * @link		http://codeigniter.com/user_guide/database/
	 */

	var CI_DB_active_record = {};
	
	CI_DB_active_record = Object.create(CI_DB_driver);

	CI_DB_active_record.$ar_select				= [];
	CI_DB_active_record.$ar_distinct			= false;
	CI_DB_active_record.$ar_from				= [];
	CI_DB_active_record.$ar_join				= [];
	CI_DB_active_record.$ar_where				= [];
	CI_DB_active_record.$ar_like				= [];
	CI_DB_active_record.$ar_groupby				= [];
	CI_DB_active_record.$ar_having				= [];
	CI_DB_active_record.$ar_limit				= false;
	CI_DB_active_record.$ar_offset				= false;
	CI_DB_active_record.$ar_order				= false;
	CI_DB_active_record.$ar_orderby				= [];
	CI_DB_active_record.$ar_set					= [];	
	CI_DB_active_record.$ar_wherein				= [];
	CI_DB_active_record.$ar_aliased_tables		= [];
	CI_DB_active_record.$ar_store_array			= [];
		
		// Active Record Caching variables
	CI_DB_active_record.$ar_caching 			= false;
	CI_DB_active_record.$ar_cache_exists		= [];
	CI_DB_active_record.$ar_cache_select		= [];
	CI_DB_active_record.$ar_cache_from			= [];
	CI_DB_active_record.$ar_cache_join			= [];
	CI_DB_active_record.$ar_cache_where			= [];
	CI_DB_active_record.$ar_cache_like			= [];
	CI_DB_active_record.$ar_cache_groupby		= [];
	CI_DB_active_record.$ar_cache_having		= [];
	CI_DB_active_record.$ar_cache_orderby		= [];
	CI_DB_active_record.$ar_cache_set			= [];	
	
		// --------------------------------------------------------------------
	
		/**
		 * Select
		 *
		 * Generates the SELECT portion of the query
		 *
		 * @access	public
		 * @param	string
		 * @return	object
		 */
		CI_DB_active_record.select = function ($select, $escape) {
			$select = $select || '*';
			$escape = $escape || null;
			
			// Set the global value if this was sepecified	
			if (PHP.is_bool($escape)) {
				$_protect_identifiers = $escape;
			}
			
			if (PHP.is_string($select)) {
				$select = PHP.explode(',', $select);
			}
	
			for(var $val in $select) {
				$val = PHP.trim($val);
	
				if ($val != '') {
					$ar_select.push($val);
	
					if ($ar_caching === true) {
						$ar_cache_select.push($val);
						$ar_cache_exists.push('select');
					}
				}
			}
			
			return this;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Select Max
		 *
		 * Generates a SELECT MAX(field) portion of a query
		 *
		 * @access	public
		 * @param	string	the field
		 * @param	string	an alias
		 * @return	object
		 */
		CI_DB_active_record.select_max = function ($select, $alias) {
			$select = $select || '';
			$alias = $alias || '';
				
			return this._max_min_avg_sum($select, $alias, 'MAX');
		}
			
		// --------------------------------------------------------------------
	
		/**
		 * Select Min
		 *
		 * Generates a SELECT MIN(field) portion of a query
		 *
		 * @access	public
		 * @param	string	the field
		 * @param	string	an alias
		 * @return	object
		 */
		CI_DB_active_record.select_min = function ($select, $alias) {
			$select = $select || '';
			$alias = $alias || '';
			
			return this._max_min_avg_sum($select, $alias, 'MIN');
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Select Average
		 *
		 * Generates a SELECT AVG(field) portion of a query
		 *
		 * @access	public
		 * @param	string	the field
		 * @param	string	an alias
		 * @return	object
		 */
		CI_DB_active_record.select_avg = function ($select, $alias) {
			$select = $select || '';
			$alias = $alias || '';
			
			return this._max_min_avg_sum($select, $alias, 'AVG');
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Select Sum
		 *
		 * Generates a SELECT SUM(field) portion of a query
		 *
		 * @access	public
		 * @param	string	the field
		 * @param	string	an alias
		 * @return	object
		 */
		CI_DB_active_record.select_sum = function ($select, $alias) {
			$select = $select || '';
			$alias = $alias || '';
			
			return this._max_min_avg_sum($select, $alias, 'SUM');
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Processing Function for the four functions above:
		 *
		 *	select_max()
		 *	select_min()
		 *	select_avg()
		 *  select_sum()
		 *	
		 * @access	public
		 * @param	string	the field
		 * @param	string	an alias
		 * @return	object
		 */
		CI_DB_active_record._max_min_avg_sum = function ($select, $alias, $type) {
			$select = $select || '';
			$alias = $alias || '';
			$type = $type || 'MAX';
				
			if ( ! PHP.is_string($select) || $select == '') {
				this.display_error('db_invalid_query');
			}
		
			$type = PHP.strtoupper($type);
		
			if ( ! PHP.in_array($type, ['MAX', 'MIN', 'AVG', 'SUM'])) {
				CI_Common.show_error('Invalid function type: ' + $type);
				return;
			}
		
			if ($alias == '') {
				$alias = this._create_alias_from_table(PHP.trim($select));
			}
		
			var $sql = $type + '(' + this._protect_identifiers(PHP.trim($select)) + ') AS ' + $alias;
	
			$ar_select.push($sql);
			
			if ($ar_caching === true) {
				$ar_cache_select.push($sql);
				$ar_cache_exists.push('select');
			}
			
			return this;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Determines the alias name based on the table
		 *
		 * @access	private
		 * @param	string
		 * @return	string
		 */
		CI_DB_active_record._create_alias_from_table = function ($item) {
			if (PHP.strpos($item, '.') !== false) {
				return PHP.end(PHP.explode('.', $item));
			}
			
			return $item;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * DISTINCT
		 *
		 * Sets a flag which tells the query string compiler to add DISTINCT
		 *
		 * @access	public
		 * @param	bool
		 * @return	object
		 */
		CI_DB_active_record.distinct = function ($val) {
			$val = $val || true;
			
			$ar_distinct = (PHP.is_bool($val)) ? $val : true;
			return this;
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * From
		 *
		 * Generates the FROM portion of the query
		 *
		 * @access	public
		 * @param	mixed	can be a string or array
		 * @return	object
		 */
		CI_DB_active_record.from = function ($from) {
			for(var $val in $from) {
				if (PHP.strpos($val, ',') !== false) {
					for(var $v in explode(',', $val)) {
						$v = PHP.trim($v);
						this._track_aliases($v);
	
						$ar_from.push(this._protect_identifiers($v, true, null, false));
						
						if ($ar_caching === true) {
							$ar_cache_from.push(this._protect_identifiers($v, true, null, false));
							$ar_cache_exists.push('from');
						}				
					}
				} else {
					$val = PHP.trim($val);
	
					// Extract any aliases that might exist.  We use this information
					// in the _protect_identifiers to know whether to add a table prefix 
					this._track_aliases($val);
		
					$ar_from.push(this._protect_identifiers($val, true, null, false));
					
					if ($ar_caching === true) {
						$ar_cache_from.push(this._protect_identifiers($val, true, null, false));
						$ar_cache_exists.push('from');
					}
				}
			}
	
			return this;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Join
		 *
		 * Generates the JOIN portion of the query
		 *
		 * @access	public
		 * @param	string
		 * @param	string	the join condition
		 * @param	string	the type of join
		 * @return	object
		 */
		CI_DB_active_record.join = function ($table, $cond, $type) {
			$type = $type || '';
			
			if ($type != '') {
				$type = PHP.strtoupper(PHP.trim($type));
	
				if ( ! PHP.in_array($type, ['LEFT', 'RIGHT', 'OUTER', 'INNER', 'LEFT OUTER', 'RIGHT OUTER'])) {
					$type = '';
				} else {
					$type += ' ';
				}
			}
	
			// Extract any aliases that might exist.  We use this information
			// in the _protect_identifiers to know whether to add a table prefix 
			this._track_aliases($table);
	
			// Strip apart the condition and protect the identifiers
			if (PHP.preg_match('/([\w\.]+)([\W\s]+)(.+)/', $cond, $match)) {
				$match[1] = this._protect_identifiers($match[1]);
				$match[3] = this._protect_identifiers($match[3]);
			
				$cond = $match[1] + $match[2] + $match[3];		
			}
			
			// Assemble the JOIN statement
			var $join = $type + 'JOIN ' + this._protect_identifiers($table, true, null, false) + ' ON ' + $cond;
	
			$ar_join.push($join);
			
			if ($ar_caching === true) {
				$ar_cache_join.push($join);
				$ar_cache_exists.push('join');
			}
	
			return this;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Where
		 *
		 * Generates the WHERE portion of the query. Separates
		 * multiple calls with AND
		 *
		 * @access	public
		 * @param	mixed
		 * @param	mixed
		 * @return	object
		 */
		CI_DB_active_record.where = function ($key, $value, $escape) {
			$value = $value || null;
			$escape = $escape || true;
			
			return this._where($key, $value, 'AND ', $escape);
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * OR Where
		 *
		 * Generates the WHERE portion of the query. Separates
		 * multiple calls with OR
		 *
		 * @access	public
		 * @param	mixed
		 * @param	mixed
		 * @return	object
		 */
		CI_DB_active_record.or_where = function ($key, $value, $escape) {
			$value = $value || null;
			$escape = $escape || true;
			
			return this._where($key, $value, 'OR ', $escape);
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * orwhere() is an alias of or_where()
		 * this function is here for backwards compatibility, as
		 * orwhere() has been deprecated
		 */
		CI_DB_active_record.orwhere = function ($key, $value, $escape) {
			$value = $value || null;
			$escape = $escape || true;
			
			return this.or_where($key, $value, $escape);
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Where
		 *
		 * Called by where() or orwhere()
		 *
		 * @access	private
		 * @param	mixed
		 * @param	mixed
		 * @param	string
		 * @return	object
		 */
		CI_DB_active_record._where = function ($key, $value, $type, $escape) {
			$value = $value || null;
			$type = $type || 'AND ';
			$escape = $escape || null;
			
			if ( ! PHP.is_array($key)) {
				$key = {$key: $value};
			}
			
			// If the escape value was not set will will base it on the global setting
			if ( ! PHP.is_bool($escape)) {
				$escape = $_protect_identifiers;
			}
	
			for(var $k in $key) {
				var $prefix = (PHP.count($ar_where) == 0 && PHP.count($ar_cache_where) == 0) ? '' : $type;
	
				if (PHP.is_null($key[$k]) && ! this._has_operator($k)) {
					// value appears not to have been set, assign the test to IS NULL
					$k += ' IS NULL';
				}
				
				if ( ! PHP.is_null($key[$k])) {
					if ($escape === true) {
						$k = this._protect_identifiers($k, false, $escape);
						
						$key[$k] = ' ' + this.escape($key[$k]);
					}
	
					if ( ! this._has_operator($k)) {
						$k += ' =';
					}
				} else {
					$k = this._protect_identifiers($k, false, $escape);			
				}
	
				$ar_where.push($prefix + $k + $key[$k]);
				
				if ($ar_caching === true) {
					$ar_cache_where.push($prefix + $k + $key[$k]);
					$ar_cache_exists.push('where');
				}
				
			}
			
			return this;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Where_in
		 *
		 * Generates a WHERE field IN ('item', 'item') SQL query joined with
		 * AND if appropriate
		 *
		 * @access	public
		 * @param	string	The field to search
		 * @param	array	The values searched on
		 * @return	object
		 */
		CI_DB_active_record.where_in = function ($key, $values) {
			$key = $key || null;
			$values = $values || null;
			
			return this._where_in($key, $values);
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Where_in_or
		 *
		 * Generates a WHERE field IN ('item', 'item') SQL query joined with
		 * OR if appropriate
		 *
		 * @access	public
		 * @param	string	The field to search
		 * @param	array	The values searched on
		 * @return	object
		 */
		CI_DB_active_record.or_where_in = function ($key, $values) {
			$key = $key || null;
			$values = $values || null;
			
			return this._where_in($key, $values, false, 'OR ');
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Where_not_in
		 *
		 * Generates a WHERE field NOT IN ('item', 'item') SQL query joined
		 * with AND if appropriate
		 *
		 * @access	public
		 * @param	string	The field to search
		 * @param	array	The values searched on
		 * @return	object
		 */
		CI_DB_active_record.where_not_in = function ($key, $values) {
			$key = $key || null;
			$values = $values || null;
			
			return this._where_in($key, $values, true);
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Where_not_in_or
		 *
		 * Generates a WHERE field NOT IN ('item', 'item') SQL query joined
		 * with OR if appropriate
		 *
		 * @access	public
		 * @param	string	The field to search
		 * @param	array	The values searched on
		 * @return	object
		 */
		CI_DB_active_record.or_where_not_in = function ($key, $values) {
			$key = $key || null;
			$values = $values || null;
			
			return this._where_in($key, $values, true, 'OR ');
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Where_in
		 *
		 * Called by where_in, where_in_or, where_not_in, where_not_in_or
		 *
		 * @access	public
		 * @param	string	The field to search
		 * @param	array	The values searched on
		 * @param	boolean	If the statement would be IN or NOT IN
		 * @param	string	
		 * @return	object
		 */
		CI_DB_active_record._where_in = function ($key, $values, $not, $type) {
			$key = $key || null;
			$values = $values || null;
			$not = $not || false;
			$type = $type || 'AND ';
				
			if ($key === null || $values === null) {
				return;
			}
			
			if ( ! PHP.is_array($values)) {
				$values = [$values];
			}
			
			$not = ($not) ? ' NOT' : '';
	
			for(var $value in $values) {
				$ar_wherein.push(this.escape($value));
			}
	
			var $prefix = (PHP.count($ar_where) == 0) ? '' : $type;
	 
			var $where_in = $prefix + this._protect_identifiers($key) + $not + " IN (" + PHP.implode(", ", $ar_wherein) + ") ";
	
			$ar_where.push($where_in);
			if ($ar_caching === true) {
				$ar_cache_where.push($where_in);
				$ar_cache_exists.push('where');
			}
	
			// reset the array for multiple calls
			$ar_wherein = [];
			return this;
		}
			
		// --------------------------------------------------------------------
	
		/**
		 * Like
		 *
		 * Generates a %LIKE% portion of the query. Separates
		 * multiple calls with AND
		 *
		 * @access	public
		 * @param	mixed
		 * @param	mixed
		 * @return	object
		 */
		CI_DB_active_record.like = function ($field, $match, $side) {
			$match = $match || '';
			$side = $side || 'both';
				
			return this._like($field, $match, 'AND ', $side);
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Not Like
		 *
		 * Generates a NOT LIKE portion of the query. Separates
		 * multiple calls with AND
		 *
		 * @access	public
		 * @param	mixed
		 * @param	mixed
		 * @return	object
		 */
		CI_DB_active_record.not_like = function ($field, $match, $side) {
			$match = $match || '';
			$side = $side || 'both';
				
			return this._like($field, $match, 'AND ', $side, 'NOT');
		}
			
		// --------------------------------------------------------------------
	
		/**
		 * OR Like
		 *
		 * Generates a %LIKE% portion of the query. Separates
		 * multiple calls with OR
		 *
		 * @access	public
		 * @param	mixed
		 * @param	mixed
		 * @return	object
		 */
		CI_DB_active_record.or_like = function ($field, $match, $side) {
			$match = $match || '';
			$side = $side || 'both';
			
			return this._like($field, $match, 'OR ', $side);
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * OR Not Like
		 *
		 * Generates a NOT LIKE portion of the query. Separates
		 * multiple calls with OR
		 *
		 * @access	public
		 * @param	mixed
		 * @param	mixed
		 * @return	object
		 */
		CI_DB_active_record.or_not_like = function ($field, $match, $side) {
			$match = $match || '';
			$side = $side || 'both';
			
			return this._like($field, $match, 'OR ', $side, 'NOT');
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * orlike() is an alias of or_like()
		 * this function is here for backwards compatibility, as
		 * orlike() has been deprecated
		 */
		CI_DB_active_record.orlike = function ($field, $match, $side) {
			$match = $match || '';
			$side = $side || 'both';
			
			return this.or_like($field, $match, $side);
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Like
		 *
		 * Called by like() or orlike()
		 *
		 * @access	private
		 * @param	mixed
		 * @param	mixed
		 * @param	string
		 * @return	object
		 */
		CI_DB_active_record._like = function ($field, $match, $type, $side, $not) {
			$match = $match || '';
			$type = $type || 'AND ';
			$side = $side || 'both';
			$not = $not || '';
				
			if ( ! PHP.is_array($field)) {
				$field = {$field: $match};
			}
	 	
			for(var $k in $field) {
				$k = this._protect_identifiers($k);
	
				var $prefix = (PHP.count($ar_like) == 0) ? '' : $type;
	
				$field[$k] = this.escape_like_str($field[$k]);
	
				if ($side == 'before') {
					var $like_statement = $prefix + " $k $not LIKE '%" + $field[$k] + "'";
				} else if ($side == 'after') {
					var $like_statement = $prefix + " $k $not LIKE '" + $field[$k] + "%'";
				} else {
					var $like_statement = $prefix + " $k $not LIKE '%" + $field[$k] + "%'";
				}
				
				// some platforms require an escape sequence definition for LIKE wildcards
				if ($_like_escape_str != '') {
					$like_statement = PHP.sprintf($like_statement, $_like_escape_str, $_like_escape_char);
				}

				$ar_like.push($like_statement);
				if ($ar_caching === true)
				{
					$ar_cache_like.push($like_statement);
					$ar_cache_exists.push('like');
				}
				
			}
			return this;
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * GROUP BY
		 *
		 * @access	public
		 * @param	string
		 * @return	object
		 */
		CI_DB_active_record.group_by = function ($by) {
			if (PHP.is_string($by)) {
				$by = PHP.explode(',', $by);
			}
		
			for(var $val in $by) {
				$val = PHP.trim($val);
			
				if ($val != '') {
					$ar_groupby.push(this._protect_identifiers($val));
					
					if ($ar_caching === true)
					{
						$ar_cache_groupby.push(this._protect_identifiers($val));
						$ar_cache_exists.push('groupby');
					}
				}
			}
			return this;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * groupby() is an alias of group_by()
		 * this function is here for backwards compatibility, as
		 * groupby() has been deprecated
		 */
		CI_DB_active_record.groupby = function ($by) {
			return this.group_by($by);
		}	
	
		// --------------------------------------------------------------------
	
		/**
		 * Sets the HAVING value
		 *
		 * Separates multiple calls with AND
		 *
		 * @access	public
		 * @param	string
		 * @param	string
		 * @return	object
		 */
		CI_DB_active_record.having = function ($key, $value, $escape) {
			$value = $value || '';
			$escape = $escape || true;
			
			return this._having($key, $value, 'AND ', $escape);
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * orhaving() is an alias of or_having()
		 * this function is here for backwards compatibility, as
		 * orhaving() has been deprecated
		 */
	
		CI_DB_active_record.orhaving = function ($key, $value, $escape) {
			$value = $value || '';
			$escape = $escape || true;
			
			return this.or_having($key, $value, $escape);
		}	
		// --------------------------------------------------------------------
	
		/**
		 * Sets the OR HAVING value
		 *
		 * Separates multiple calls with OR
		 *
		 * @access	public
		 * @param	string
		 * @param	string
		 * @return	object
		 */
		CI_DB_active_record.or_having = function ($key, $value, $escape) {
			$value = $value || '';
			$escape = $escape || true;
			
			return this._having($key, $value, 'OR ', $escape);
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Sets the HAVING values
		 *
		 * Called by having() or or_having()
		 *
		 * @access	private
		 * @param	string
		 * @param	string
		 * @return	object
		 */
		CI_DB_active_record._having = function ($key, $value, $type, $escape) {
			$value = $value || '';
			$type = $type || 'AND ';
			$escape = $escape || true;
			
			if ( ! PHP.is_array($key)) {
				$key = {$key: $value};
			}
		
			for(var $k in $key) {
				var $prefix = (PHP.count($ar_having) == 0) ? '' : $type;
	
				if ($escape === true) {
					$k = this._protect_identifiers($k);
				}
	
				if ( ! this._has_operator($k)) {
					$k += ' = ';
				}
	
				if ($key[$k] != '') {
					$key[$k] = ' ' + this.escape_str($key[$k]);
				}
				
				$ar_having.push($prefix + $k + $key[$k]);
				if ($ar_caching === true)
				{
					$ar_cache_having.push($prefix + $k + $key[$k]);
					$ar_cache_exists.push('having');
				}
			}
			
			return this;
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Sets the ORDER BY value
		 *
		 * @access	public
		 * @param	string
		 * @param	string	direction: asc or desc
		 * @return	object
		 */
		CI_DB_active_record.order_by = function ($orderby, $direction) {
			$direction = $direction || '';
			
			if (PHP.strtolower($direction) == 'random') {
				$orderby = ''; // Random results want or don't need a field name
				$direction = $_random_keyword;
			} else if (PHP.trim($direction) != '') {
				$direction = (PHP.in_array(PHP.strtoupper(PHP.trim($direction)), ['ASC', 'DESC'], true)) ? ' '.$direction : ' ASC';
			}
		
			if (PHP.strpos($orderby, ',') !== false) {
				var $temp = [];
				for(var $part in PHP.explode(',', $orderby)) {
					$part = PHP.trim($part);
					if ( ! PHP.in_array($part, $ar_aliased_tables)) {
						$part = this._protect_identifiers(PHP.trim($part));
					}
					
					$temp.push($part);
				}
				
				$orderby = implode(', ', $temp);			
			} else if ($direction != $_random_keyword) {
				$orderby = this._protect_identifiers($orderby);
			}
		
			$orderby_statement = $orderby + $direction;
			
			$ar_orderby.push($orderby_statement);
			if ($ar_caching === true) {
				$ar_cache_orderby.push($orderby_statement);
				$ar_cache_exists.push('orderby');
			}
	
			return this;
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * orderby() is an alias of order_by()
		 * this function is here for backwards compatibility, as
		 * orderby() has been deprecated
		 */
		CI_DB_active_record.orderby = function ($orderby, $direction) {
			$direction = $direction || '';
			
			return this.order_by($orderby, $direction);
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Sets the LIMIT value
		 *
		 * @access	public
		 * @param	integer	the limit value
		 * @param	integer	the offset value
		 * @return	object
		 */
		CI_DB_active_record.limit = function ($value, $offset) {
			$offset = $offset || '';
				
			$ar_limit = $value;
	
			if ($offset != ''){
				$ar_offset = $offset;
			}
			
			return this;
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Sets the OFFSET value
		 *
		 * @access	public
		 * @param	integer	the offset value
		 * @return	object
		 */
		CI_DB_active_record.offset = function ($offset) {
			$ar_offset = $offset;
			return this;
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * The "set" function.  Allows key/value pairs to be set for inserting or updating
		 *
		 * @access	public
		 * @param	mixed
		 * @param	string
		 * @param	boolean
		 * @return	object
		 */
		CI_DB_active_record.set = function ($key, $value, $escape) {
			$value = $value || '';
			$escape = $escape || true;
			
			$key = this._object_to_array($key);
		
			if ( ! PHP.is_array($key)) {
				$key = {$key: $value};
			}	
	
			for(var $k in $key) {
				if ($escape === false) {
					$ar_set[this._protect_identifiers($k)] = $key[$k];
				} else {
					$ar_set[this._protect_identifiers($k)] = this.escape($key[$k]);
				}
			}
			
			return this;
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Get
		 *
		 * Compiles the select statement based on the other functions called
		 * and runs the query
		 *
		 * @access	public
		 * @param	string	the table
		 * @param	string	the limit clause
		 * @param	string	the offset clause
		 * @return	object
		 */
		CI_DB_active_record.get = function ($table, $limit, $offset) {
			$table = $table || '';
			$limit = $limit || null;
			$offset = $offset || null;
			
			if ($table != '') {
				this._track_aliases($table);
				this.from($table);
			}
			
			if ( ! PHP.is_null($limit)) {
				this.limit($limit, $offset);
			}
				
			var $sql = this._compile_select();
	
			var $result = this.query($sql);
			this._reset_select();
			return $result;
		}
	
		/**
		 * "Count All Results" query
		 *
		 * Generates a platform-specific query string that counts all records 
		 * returned by an Active Record query.
		 *
		 * @access	public
		 * @param	string
		 * @return	string
		 */
		CI_DB_active_record.count_all_results = function ($table) {
			$table = $table || '';
				
			if ($table != '') {
				this._track_aliases($table);
				this.from($table);
			}
			
			var $sql = this._compile_select($_count_string + this._protect_identifiers('numrows'));
	
			var $query = this.query($sql);
			this._reset_select();
		
			if ($query.num_rows() == 0) {
				return '0';
			}
	
			var $row = $query.row();
			return $row.numrows;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Get_Where
		 *
		 * Allows the where clause, limit and offset to be added directly
		 *
		 * @access	public
		 * @param	string	the where clause
		 * @param	string	the limit clause
		 * @param	string	the offset clause
		 * @return	object
		 */
		CI_DB_active_record.get_where = function ($table, $where, $limit, $offset) {
			$table = $table || '';
			$where = $where || null;
			$limit = $limit || null;
			$offset = $offset || null;
			
			if ($table != '') {
				this.from($table);
			}
	
			if ( ! PHP.is_null($where)) {
				this.where($where);
			}
			
			if ( ! PHP.is_null($limit)) {
				this.limit($limit, $offset);
			}
				
			var $sql = this._compile_select();
	
			var $result = this.query($sql);
			this._reset_select();
			return $result;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * getwhere() is an alias of get_where()
		 * this function is here for backwards compatibility, as
		 * getwhere() has been deprecated
		 */
		CI_DB_active_record.getwhere = function ($table, $where, $limit, $offset) {
			$table = $table || '';
			$where = $where || null;
			$limit = $limit || null;
			$offset = $offset || null;
			
			return this.get_where($table, $where, $limit, $offset);
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Insert
		 *
		 * Compiles an insert string and runs the query
		 *
		 * @access	public
		 * @param	string	the table to retrieve the results from
		 * @param	array	an associative array of insert values
		 * @return	object
		 */
		CI_DB_active_record.insert = function ($table, $set) {
			$table = $table || '';
			$set = $set || null;
			
			if ( ! PHP.is_null($set)) {
				this.set($set);
			}
		
			if (PHP.count($ar_set) == 0) {
				if ($db_debug) {
					return this.display_error('db_must_use_set');
				}
				return false;
			}
	
			if ($table == '') {
				if ( ! $ar_from[0]) {
					if ($db_debug) {
						return this.display_error('db_must_set_table');
					}
					return false;
				}
				
				$table = $ar_from[0];
			}
	
			var $sql = this._insert(this._protect_identifiers($table, true, null, false), PHP.array_keys($ar_set), PHP.array_values($ar_set));
			
			this._reset_write();
			return this.query($sql);		
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Update
		 *
		 * Compiles an update string and runs the query
		 *
		 * @access	public
		 * @param	string	the table to retrieve the results from
		 * @param	array	an associative array of update values
		 * @param	mixed	the where clause
		 * @return	object
		 */
		CI_DB_active_record.update = function ($table, $set, $where, $limit) {
			$table = $table || '';
			$set = $set || null;
			$where = $where || null;
			$limit = $limit || null;
			
			// Combine any cached components with the current statements
			this._merge_cache();
	
			if ( ! PHP.is_null($set)) {
				this.set($set);
			}
		
			if (PHP.count($ar_set) == 0) {
				if ($db_debug) {
					return this.display_error('db_must_use_set');
				}
				return false;
			}
	
			if ($table == '') {
				if ( ! $ar_from[0]) {
					if ($db_debug) {
						return this.display_error('db_must_set_table');
					}
					return false;
				}
				
				$table = $ar_from[0];
			}
			
			if ($where != null) {
				this.where($where);
			}
	
			if ($limit != null) {
				this.limit($limit);
			}
			
			var $sql = this._update(this._protect_identifiers($table, true, null, false), $ar_set, $ar_where, $ar_orderby, $ar_limit);
			
			this._reset_write();
			return this.query($sql);
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Empty Table
		 *
		 * Compiles a delete string and runs "DELETE FROM table"
		 *
		 * @access	public
		 * @param	string	the table to empty
		 * @return	object
		 */
		CI_DB_active_record.empty_table = function ($table) {
			$table = $table || '';
			
			if ($table == '') {
				if ( ! $ar_from[0]) {
					if ($db_debug) {
						return this.display_error('db_must_set_table');
					}
					return false;
				}
	
				$table = $ar_from[0];
			} else {
				$table = this._protect_identifiers($table, true, null, false);
			}
	
			var $sql = this._delete($table);
	
			this._reset_write();
			
			return this.query($sql);
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Truncate
		 *
		 * Compiles a truncate string and runs the query
		 * If the database does not support the truncate() command
		 * This function maps to "DELETE FROM table"
		 *
		 * @access	public
		 * @param	string	the table to truncate
		 * @return	object
		 */
		CI_DB_active_record.truncate = function ($table) {
			$table = $table || '';
			
			if ($table == '') {
				if ( ! $ar_from[0]) {
					if ($db_debug) {
						return this.display_error('db_must_set_table');
					}
					return false;
				}
	
				$table = $ar_from[0];
			} else {
				$table = this._protect_identifiers($table, true, null, false);
			}
	
			var $sql = this._truncate($table);
	
			this._reset_write();
			
			return this.query($sql);
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Delete
		 *
		 * Compiles a delete string and runs the query
		 *
		 * @access	public
		 * @param	mixed	the table(s) to delete from. String or array
		 * @param	mixed	the where clause
		 * @param	mixed	the limit clause
		 * @param	boolean
		 * @return	object
		 */
		CI_DB_active_record.delete = function ($table, $where, $limit, $reset_data) {
			$table = $table || '';
			$where = $where || '';
			$limit = $limit || null;
			$reset_data = $reset_data || true;
			
			// Combine any cached components with the current statements
			this._merge_cache();
	
			if ($table == '') {
				if ( ! $ar_from[0]) {
					if ($db_debug) {
						return this.display_error('db_must_set_table');
					}
					return false;
				}
	
				$table = $ar_from[0];
			} else if (PHP.is_array($table)) {
				for(var $single_table in $table)
				{
					this.delete($single_table, $where, $limit, false);
				}
	
				this._reset_write();
				return;
			} else {
				$table = this._protect_identifiers($table, true, null, false);
			}
	
			if ($where != '') {
				this.where($where);
			}
	
			if ($limit != null) {
				this.limit($limit);
			}
	
			if (PHP.count($ar_where) == 0 && PHP.count($ar_wherein) == 0 && PHP.count($ar_like) == 0) {
				if (db_debug)
				{
					return this.display_error('db_del_must_use_where');
				}
	
				return false;
			}		
	
			var $sql = this._delete($table, $ar_where, $ar_like, $ar_limit);
	
			if ($reset_data){
				this._reset_write();
			}
			
			return this.query($sql);
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * DB Prefix
		 *
		 * Prepends a database prefix if one exists in configuration
		 *
		 * @access	public
		 * @param	string	the table
		 * @return	string
		 */
		CI_DB_active_record.dbprefix = function ($table) {
			$table = $table || '';
				
			if ($table == '') {
				this.display_error('db_table_name_required');
			}
	
			return $dbprefix + $table;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Track Aliases
		 *
		 * Used to track SQL statements written with aliased tables.
		 *
		 * @access	private
		 * @param	string	The table to inspect
		 * @return	string
		 */	
		CI_DB_active_record._track_aliases = function ($table) {
			if (PHP.is_array($table)) {
				for(var $t in $table) {
					this._track_aliases($t);
				}
				return;
			}
			
			// Does the string contain a comma?  If so, we need to separate
			// the string into discreet statements
			if (PHP.strpos($table, ',') !== false) {
				return this._track_aliases(PHP.explode(',', $table));
			}
		
			// if a table alias is used we can recognize it by a space
			if (PHP.strpos($table, " ") !== false) {
				// if the alias is written with the AS keyword, remove it
				$table = $table.replace('/ AS /i', ' ');
				
				// Grab the alias
				$table = PHP.trim(PHP.strrchr($table, " "));
				
				// Store the alias, if it doesn't already exist
				if ( ! PHP.in_array($table, $ar_aliased_tables))
				{
					$ar_aliased_tables.push($table);
				}
			}
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Compile the SELECT statement
		 *
		 * Generates a query string based on which functions were used.
		 * Should not be called directly.  The get() function calls it.
		 *
		 * @access	private
		 * @return	string
		 */
		CI_DB_active_record._compile_select = function ($select_override) {
			$select_override = $select_override || false;
			
			// Combine any cached components with the current statements
			this._merge_cache();
	
			// ----------------------------------------------------------------
			
			// Write the "select" portion of the query
	
			if ($select_override !== false) {
				var $sql = $select_override;
			} else {
				var $sql = ( ! $ar_distinct) ? 'SELECT ' : 'SELECT DISTINCT ';
			
				if (PHP.count($ar_select) == 0) {
					$sql += '*';		
				} else {				
					// Cycle through the "select" portion of the query and prep each column name.
					// The reason we protect identifiers here rather then in the select() function
					// is because until the user calls the from() function we don't know if there are aliases
					for(var $key in $ar_select) {
						$ar_select[$key] = this._protect_identifiers($ar_select[$key]);
					}
					
					$sql += PHP.implode(', ', $ar_select);
				}
			}
	
			// ----------------------------------------------------------------
			
			// Write the "FROM" portion of the query
	
			if (PHP.count($ar_from) > 0) {
				$sql += "\nFROM ";
	
				$sql += this._from_tables($ar_from);
			}
	
			// ----------------------------------------------------------------
			
			// Write the "JOIN" portion of the query
	
			if (PHP.count($ar_join) > 0) {
				$sql += "\n";
	
				$sql += PHP.implode("\n", $ar_join);
			}
	
			// ----------------------------------------------------------------
			
			// Write the "WHERE" portion of the query
	
			if (PHP.count($ar_where) > 0 || PHP.count($ar_like) > 0) {
				$sql += "\n";
	
				$sql += "WHERE ";
			}
	
			$sql += PHP.implode("\n", $ar_where);
	
			// ----------------------------------------------------------------
			
			// Write the "LIKE" portion of the query
		
			if (PHP.count($ar_like) > 0) {
				if (PHP.count($ar_where) > 0) {
					$sql += "\nAND ";
				}
	
				$sql += PHP.implode("\n", $ar_like);
			}
	
			// ----------------------------------------------------------------
			
			// Write the "GROUP BY" portion of the query
		
			if (PHP.count($ar_groupby) > 0) {
				$sql += "\nGROUP BY ";
				
				$sql += PHP.implode(', ', $ar_groupby);
			}
	
			// ----------------------------------------------------------------
			
			// Write the "HAVING" portion of the query
			
			if (PHP.count($ar_having) > 0) {
				$sql += "\nHAVING ";
				$sql += PHP.implode("\n", $ar_having);
			}
	
			// ----------------------------------------------------------------
			
			// Write the "ORDER BY" portion of the query
	
			if (PHP.count($ar_orderby) > 0)
			{
				$sql += "\nORDER BY ";
				$sql += PHP.implode(', ', $ar_orderby);
				
				if ($ar_order !== false) {
					$sql += ($ar_order == 'desc') ? ' DESC' : ' ASC';
				}		
			}
	
			// ----------------------------------------------------------------
			
			// Write the "LIMIT" portion of the query
			
			if (PHP.is_numeric($ar_limit)) {
				$sql += "\n";
				$sql = this._limit($sql, $ar_limit, $ar_offset);
			}
	
			return $sql;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Object to Array
		 *
		 * Takes an object as input and converts the class variables to array key/vals
		 *
		 * @access	public
		 * @param	object
		 * @return	array
		 */
		CI_DB_active_record._object_to_array = function ($object) {
			if ( ! PHP.is_object($object)) {
				return $object;
			}
			
			$array = [];
			var $object_vars = PHP.get_object_vars($object);
			
			for(var $key in $object_vars) {
				// There are some built in keys we need to ignore for this conversion
				if ( ! PHP.is_object($object_vars[$key]) && ! PHP.is_array($object_vars[$key]) && $key != '_parent_name' && $key != '_ci_scaffolding' && $key != '_ci_scaff_table') {
					$array[$key] = $object_vars[$key];
				}
			}
		
			return $array;
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Start Cache
		 *
		 * Starts AR caching
		 *
		 * @access	public
		 * @return	void
		 */		
		CI_DB_active_record.start_cache = function () {
			$ar_caching = true;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Stop Cache
		 *
		 * Stops AR caching
		 *
		 * @access	public
		 * @return	void
		 */		
		CI_DB_active_record.stop_cache = function () {
			$ar_caching = false;
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Flush Cache
		 *
		 * Empties the AR cache
		 *
		 * @access	public
		 * @return	void
		 */	
		CI_DB_active_record.flush_cache = function () {	
			this._reset_run(
							{
								'ar_cache_select': [], 
								'ar_cache_from': [], 
								'ar_cache_join': [],
								'ar_cache_where': [], 
								'ar_cache_like': [], 
								'ar_cache_groupby': [], 
								'ar_cache_having': [], 
								'ar_cache_orderby': [], 
								'ar_cache_set': [],
								'ar_cache_exists': []
							}
						);	
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Merge Cache
		 *
		 * When called, this function merges any cached AR arrays with 
		 * locally called ones.
		 *
		 * @access	private
		 * @return	void
		 */
		CI_DB_active_record._merge_cache = function () {
			if (PHP.count($ar_cache_exists) == 0) {
				return;
			}
	
			for(var $val in $ar_cache_exists) {
				$ar_variable	= 'ar_' + $val;
				$ar_cache_var	= 'ar_cache_' + $val;
	
				if (PHP.count(this[$ar_cache_var]) == 0) {
					continue;
				}
	
				this[$ar_variable] = PHP.array_unique(PHP.array_merge(this[$ar_cache_var], this[$ar_variable]));
			}
	
			// If we are "protecting identifiers" we need to examine the "from"
			// portion of the query to determine if there are any aliases
			if ($_protect_identifiers === true && PHP.count($ar_cache_from) > 0) {
				this._track_aliases($ar_from);
			}
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Resets the active record values.  Called by the get() function
		 *
		 * @access	private
		 * @param	array	An array of fields to reset
		 * @return	void
		 */
		CI_DB_active_record._reset_run = function ($ar_reset_items) {
			for(var $item in $ar_reset_items) {
				if ( ! in_array($item, $ar_store_array)) {
					this[$item] = $ar_reset_items[$item];
				}
			}
		}
	
		// --------------------------------------------------------------------
	
		/**
		 * Resets the active record values.  Called by the get() function
		 *
		 * @access	private
		 * @return	void
		 */
		CI_DB_active_record._reset_select = function () {
			var $ar_reset_items = {
									'ar_select': [], 
									'ar_from': [], 
									'ar_join': [], 
									'ar_where': [], 
									'ar_like': [], 
									'ar_groupby': [], 
									'ar_having': [], 
									'ar_orderby': [], 
									'ar_wherein': [], 
									'ar_aliased_tables': [],
									'ar_distinct': false, 
									'ar_limit': false, 
									'ar_offset': false, 
									'ar_order': false
			};
			
			this._reset_run($ar_reset_items);
		}
		
		// --------------------------------------------------------------------
	
		/**
		 * Resets the active record "write" values.
		 *
		 * Called by the insert() update() and delete() functions
		 *
		 * @access	private
		 * @return	void
		 */
		CI_DB_active_record._reset_write = function () {	
			var $ar_reset_items = {
									'ar_set': [], 
									'ar_from': [], 
									'ar_where': [], 
									'ar_like': [],
									'ar_orderby': [], 
									'ar_limit': false, 
									'ar_order': false
							};
	
			this._reset_run($ar_reset_items);
		}

	module.exports = CI_DB_active_record;
})();

/* End of file DB_active_rec.php */
/* Location: ./system/database/DB_active_rec.php */