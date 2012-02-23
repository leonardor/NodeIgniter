(function() {
	var Item = {};
	
	Item = Object.create(CI_Model);
	
	Item.name = 'Item';
	
	Item.__construct = function() {	
		CI_Model.__construct();
	}

	Item.select_items = function() {
		var self = this;
		
		CI.db.on('select', function(database) {
			CI.db.on('set_charset', function(charset) {
				var $sql = "CALL udsp_item_SelectItems()";
				
				CI.db.query($sql).on('data', function(results) {
					console.log('intercepting db.data event...');

					console.log('emitting model.data event...');
					self.emit('data', results);
				}).on('error', function(error) {
					console.log('intercepting db.error event...');
					console.log('cannot load data of model "' + self.name + '". error: ' + error);
					
					console.log('emitting model.error event...');
					self.emit('error', error);
				});
			});
		});

		return self;
	}

	module.exports = Item;
})();