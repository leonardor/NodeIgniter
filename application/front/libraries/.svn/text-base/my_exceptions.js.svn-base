(function() {
	var MY_Exceptions = {};

	MY_Exceptions = Object.create(CI_Exceptions);
	
	MY_Exceptions.parent = CI_Exceptions;
	MY_Exceptions.name = 'MY_Exceptions';
	
	MY_Exceptions.show_error = function($heading, $message, $template, $status_code) {
		$template = $template || 'error_general';
		$status_code = $status_code || 500;
		
		CI_Common.set_status_header($status_code, $message);

		$message = '<p>' + PHP.implode('</p><p>', ( ! PHP.is_array($message)) ? $message : $message) + '</p>';

		var file = PHP.constant('APPPATH') + 'errors/' + $template + '.html';

		var html = MY_View.load(file, { message: $message, heading: $heading }, true);

		return html;
	}
	
	module.exports = MY_Exceptions;
})();