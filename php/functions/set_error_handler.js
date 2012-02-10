var set_error_handler = function(error_handler, error_types) {
	switch (error_types) {
		case PHP.E_ALL:
			break;
		case PHP.E_STRICT:
			break;
		default:
			
	}
}

module.exports = set_error_handler;