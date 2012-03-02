var ob_get_level = function() {
	 return (PHP.ini && PHP.ini_get('output_buffering') && (typeof PHP.ini_get('output_buffering').local_value !== 'string' || PHP.ini_get('output_buffering').local_value.toLowerCase() !== 'off')) ? 1 : 0;
}

module.exports = ob_get_level;