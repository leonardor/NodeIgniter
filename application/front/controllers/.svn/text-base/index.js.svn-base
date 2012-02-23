(function() {
	var IndexController = {};
	
	IndexController = Object.create(MY_Controller);
	
	IndexController.__construct = function () {
		MY_Controller.__construct();
		console.log('IndexController.__construct()');
	}

	IndexController.index = function() {
		var self = this;
		
		MY_Controller.index();
		
		CI.load.model('item');

		var items = CI.item.select_items();
		
		items.on('data', function(results) {
			console.log('am interceptat eventul de model.data');
			console.log(results);

			/*
			CI.load.model('listx');
			CI.listx.doSomething();
			CI.load.helper('url');
			CI.helpers.url_title('BUBU');
			CI.load.helper('text');
			CI.helpers.character_limiter('BUBULICA', 5);
			CI.load.library('custom_library');
			CI.custom_library.doSomething();
			*/
			
			var file = PHP.constant('APPPATH') + 'views/templates/main.html';
			
			var str = FileSystem.readFileSync(file, 'utf8');
			
			var html = Ejs.render(str, {
				$this: self,
				items: results,
				request: request
			});
		
			console.log('emit eventul de controller_data');
			
			self.emit('data', html);
			
			return self;
		});
		
		return self;
	}

	IndexController.custom_route = function() {
		var file = PHP.constant('APPPATH') + 'views/templates/main.html';
		
		CI.load.helper('string');

		CI.helpers.strip_slashes('d/sfsf/');
		
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