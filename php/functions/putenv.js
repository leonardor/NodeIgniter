var putenv = function(setting) {
	var settings = setting.split('=');
	
	if(settings.length > 0) {
		PHP.$_ENV[settings[0]] = settings[1];
		process.env[settings[0]] = settings[1];
		
		return true;
	} else {
		return false;
	}
}

module.exports = putenv;