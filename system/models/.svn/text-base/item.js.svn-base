(function() {
	var Item = {};
	
	Item = Object.create(CI_Model).__construct();
	
	Item.name = 'Item';
	
	Item.__construct = function() {	
		console.log('Model: Item.__construct()');
		return this;
	}

	Item.select_items = function() {
		var self = this;
		
		this.custom_library.doSomething();
		
		console.log('Model: Item.select_items()');
	
		CI.db.on('ready', function() {
			console.log('intercepting db.ready event...');
			
			var $sql = "CALL udsp_item_SelectItems()";
			
			console.log('executing sql "' + $sql + '"');
			
			CI.db.query($sql).on('data', function(results) {
				console.log('intercepting db.data event...');
				console.log('emitting model.ready event...');
				
				self.emit('ready', results);
				return;
			}).once('error', function(error) {
				console.log('intercepting db.error event...');
				console.log('cannot load data of model "' + self.name + '". error: ' + error);
				
				console.log('emitting model.error event...');
				self.emit('error', error);
				return;
			});
		}).on('error', function(error) {
			console.log('intercepting db.error event...');
			console.log('cannot load data of model "' + self.name + '". error: ' + error);
			
			console.log('emitting model.error event...');
			self.emit('error', error);
			return;
		});

		return this;
	}

	module.exports = Item;
})();