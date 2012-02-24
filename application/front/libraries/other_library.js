(function() {
	console.log('Library: Other_library');
	
	function Other_library() {
		this.__construct = function() {
			console.log('other_library.__construct()');
		}
		
		this.doSomething = function() {
			console.log('other_library.doSomething()');
		}

		return this;
	}
	
	module.exports = Other_library;
})();