(function() {
	function Custom_library() {
		this.__construct = function() {
			console.log('custom_library loaded');
		}
		
		this.doSomething = function() {
			console.log('custom_library.doSomething()');
		}

		return this;
	}
	
	module.exports = Custom_library;
})();