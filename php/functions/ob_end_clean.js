var ob_end_clean = function() {
	CI_Buffer.set_instance(null);
	
	PHP.ini_set('output_buffering',  'Off');
	
    return true;
}

module.exports = ob_end_clean;