(function() {
	var IndexController = {};
	
	IndexController = Object.create(MY_Controller);
	
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
		
		var items = CI.item.select_items();
		
		items.on('data', function(results) {
			console.log('intercepting model.data event...');
			console.log('getting results: ' + JSON.stringify(results));
			
			CI.other_library.doSomething();

			//CI.load.plugin('item');
			var url = CI.plugins.get_url({ title: 'this _is_ a title # . ' });
			
			console.log(url);
			
			var file = PHP.constant('APPPATH') + 'views/templates/main.html';
			
			var str = FileSystem.readFileSync(file, 'utf8');
			
			var html = Ejs.render(str, {
				$this: self,
				items: results,
				request: request
			});
		
			console.log('emitting controller.data event...');
			self.emit('data', html);
			
			return self;
		}).on('error', function(error) {
			console.log('intercepting model.error event...');
			console.log('cannot get model "' + this.name + '" data. error: ' + error)
			self.emit('data', html);
		});
		
		return self;
	}

	IndexController.custom_route = function() {
		var file = PHP.constant('APPPATH') + 'views/templates/main.html';
		
		var str = FileSystem.readFileSync(file, 'utf8');
		
		var html = Ejs.render(str, {
			request: request
		});
		
		response.write(html);
		response.end();
	}
		
	IndexController.some_method = function(param1, param2) {
		var params = [];
		
		if(param1) {
			params.push(param1);
		}
		if(param2) {
			params.push(param2);
		}
		
		var file = PHP.constant('APPPATH') + 'views/templates/main.html';
		
		var str = FileSystem.readFileSync(file, 'utf8');
		
		var html = Ejs.render(str, {
			request: request,
			params: params
		});
		
		response.write(html);
		response.end();
	}

	module.exports = IndexController;
})();