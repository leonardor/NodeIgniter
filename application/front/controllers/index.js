(function() {
	var IndexController = new function IndexController(request, response, next){
		
		IndexController.__construct = function (request, response, next) {	
			Controller.__construct();
		}
		
		IndexController.index = function() {
			var file = PHP.constant('APPPATH') + 'views/templates/main.html';
			
			var str = FileSystem.readFileSync(file, 'utf8');
			
			var html = Ejs.render(str, {
				request: request
			});
			
			response.write(html);
			
			response.end();
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
		
		return IndexController;
	}
	
	IndexController.prototype.constructor = IndexController.__construct(request, response, function next() {});

	module.exports = new IndexController;
})();