(function() {
	var Item = {};
	
	Item = Object.create(CI_Plugin);
	
	Item.__construct = function() {
		console.log('Plugin: Item.__construct()');
		Plugin.__construct();
		return this;
	}
	
	Item.get_url = function($params) {
		$params = $params || [];
		
		$params['title'] = $params['title'] || 'unknown';
		
		CI.custom_library.doSomething();
		
		return CI.helpers.url_title($params['title']);
	}
	
	module.exports = Item;
})();