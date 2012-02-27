(function() {
	var IndexController = {};
	
	IndexController = Object.create(MY_Controller);
	
	IndexController.name = 'IndexController';
	
	IndexController.__construct = function () {
		MY_Controller.__construct();
		console.log('IndexController.__construct()');
		
		return this;
	}

	IndexController.index = function() {
		var self = this;
		
		console.log('extending MY_Controller.index()...');
		MY_Controller.index();
		
		console.log('IndexController.index()');
		
		CI.load.on('autoload', function(obj) {
			console.log('## intercepting loader.autoload event... ###');
		});
		
		CI.load.model('item');
		var items = CI.models.item.select_items();
		
		items.on('ready', function(results) {
			console.log('intercepting model.ready event...');
			console.log('getting results: ' + JSON.stringify(results));
			
			CI.load.plugin('item');
			var url = CI.plugins.get_url({ title: 'this _is_ a title # . ' });
			
			console.log(url);
			
			var file = PHP.constant('APPPATH') + 'views/templates/main.html';
			
			var html = Ejs.renderFile(file, {
				$this: self,
				items: results,
				request: request
			}, function(error, html) {
				if(error) {
					console.log('emitting controller.error event...');
					self.emit('error', error.toString());
					return;
				}
				
				console.log('emitting controller.ready event...');
				self.emit('ready', html);
				return;
			});
		}).once('error', function(error) {
			console.log('intercepting model.error event...');
			console.log('cannot get model "' + this.name + '" data. error: ' + error)
			self.emit('ready', html);
			return;
		});

		return self;
	}

	IndexController.custom_route = function() {
		var self = this;
		
		var file = PHP.constant('APPPATH') + 'views/templates/main.html';
		
		var html = Ejs.renderFile(file, {
			request: request
		}, function(error, html) {
			if(error) {
				console.log('emitting controller.error event...');
				self.emit('error', error.toString());
				return;
			}
			
			console.log('emitting controller.ready event...');
			self.emit('ready', html);
			return;
		});
	}
		
	IndexController.some_method = function(param1, param2) {
		var self = this;
		
		var params = [];
		
		if(param1) {
			params.push(param1);
		}
		if(param2) {
			params.push(param2);
		}
		
		var file = PHP.constant('APPPATH') + 'views/templates/main.html';
		
		var html = Ejs.renderFile(file, {
			request: request,
			params: params
		}, function(error, html) {
			if(error) {
				console.log('emitting controller.error event...');
				self.emit('error', error.toString());
				return;
			}
			
			console.log('emitting controller.ready event...');
			self.emit('ready', html);
			return;
		});
		
		return this;
	}

	module.exports = IndexController;
})();