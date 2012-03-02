(function() {
	var Plugin = {};
	
	Plugin = Object.create(Events.EventEmitter.prototype);
	
	Plugin.parent = Events.EventEmitter.prototype;
	Plugin.name = 'Plugin';
	
	Plugin.__construct = function() {
		console.log('Plugin.__construct()');
		return this;
	}
	
	Plugin.__load = function(random) {
		console.log('emitting ' + this.name + '.__load event... (' + random + ')');
		this.emit('__load', this);
		
		return this;
	}

	module.exports = Plugin;
})();
// END Model Class

/* End of file Model.php */
/* Location: ./system/libraries/Model.php */