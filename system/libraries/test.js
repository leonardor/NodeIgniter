
	var Test = function() {
		var counter = 0;
		
		this.bubu = function(request, response) {
			console.log('___counter___' + counter);
			counter++;
			return request.url;
		}
		
		return this;
	};

	module.exports = Test;
