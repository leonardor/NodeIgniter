(function() {
	function Other_library() {
		this.__construct = function() {
			console.log('other_library loaded');
		}
		
		this.doSomething = function() {
			console.log('other_library.doSomething()');
		}

		return this;
	}
	
	module.exports = Other_library;
})();