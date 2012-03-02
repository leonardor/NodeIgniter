(function() {
	var IndexController = {};
	
	IndexController = Object.create(MY_Controller).__construct();
	
	IndexController.name = 'IndexController';
	
	IndexController.__construct = function () {
		console.log('IndexController.__construct()');
		return this;
	}

	IndexController.index = function() {
		console.log('extending MY_Controller.index()...');
		MY_Controller.index();
		
		console.log('IndexController.index()');

		CI.view.set('page', 'pages/index.html');
		CI.view.load('templates/main.html');
	}

	IndexController.custom_route = function() {
		CI.view.set('request', request);
		CI.view.set('page', 'pages/custom_route.html');
		CI.view.load('templates/main.html');
	}
		
	IndexController.some_method = function(param1, param2) {
		var params = [];
		
		if(param1) {
			params.push(param1);
		}
		if(param2) {
			params.push(param2);
		}
		
		CI.view.set('request', request);
		CI.view.set('params', params);
		CI.view.set('page', 'pages/some_method.html');
		CI.view.load('templates/main.html');
	}
	
	IndexController.dynamic = function() {
		var params = {x: 1, y: 2};
		
		CI.view.set('request', request);
		CI.view.set('params', params);
		CI.view.set('page', 'pages/dynamic.html');
		CI.view.load('templates/main.html');
	}

	module.exports = IndexController;
})();