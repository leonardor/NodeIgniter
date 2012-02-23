(function() {
	var MY_Controller = {};
	
	MY_Controller = Object.create(Controller);
	
	MY_Controller.name = 'MY_Controller';
	
	MY_Controller.__construct = function () {
		Controller.__construct();
		console.log('MY_Controller.__construct()');
	}
		
	MY_Controller.index = function() {
		console.log('MY_Controller.index()');
	}

	module.exports = MY_Controller;
})();