(function() {
	var DataController = {};
	
	DataController = Object.create(MY_Controller).__construct();
	
	DataController.name = 'DataController';
	
	DataController.__construct = function () {
		console.log('DataController.__construct()');
		return this;
	}
	
	DataController.get_items = function () {
		var items = CI.models.item.select_items();
		
		items.on('ready', function(results) {
			console.log('intercepting model.ready event...');
			
			CI.view.set('response', JSON.stringify(results));
			CI.view.set('page', 'pages/json.html');
			CI.view.load('templates/json.html');
		});
	}
	
	module.exports = DataController;
})();