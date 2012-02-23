(function() {
	var Item = {};
	
	Item = Object.create(CI_Model);
	
	Item.__construct = function() {	
	}
		
	Item.doSomething = function() {
		CI.load.library('other_library');

		CI.other_library.doSomething();
			
		response.write('am incarcat item');
	}
		
	Item.select_items = function() {
		var self = this;
		
		if(CI.db.client) {
			var $sql = "CALL udsp_item_SelectItems()";
			
			CI.db.query($sql).on('data', function(results) {
				console.log('am interceptat eventul de db.data');

				console.log('emit eventul de model.data');
				self.emit('data', results);
				
				return self;
			}).on('db_error', function(error) {
				console.log('a aparut o eroare la query');
				
				self.emit('model_error', error);
	
				return self;
			});
		}
		
		return self;
	}

	module.exports = Item;
})();