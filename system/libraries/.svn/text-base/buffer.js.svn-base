(function() {
	var CI_Buffer = {};
	
	CI_Buffer = Object.create(Events.EventEmitter.prototype);
	
	CI_Buffer.name = 'CI_Buffer';
	
	CI_Buffer.instance = null;
	
	CI_Buffer.__construct = function() {
		return this;
	}
	
	CI_Buffer.set_instance = function(value) {
		this.instance = value;
		
		return this.instance;
	}
	
	CI_Buffer.get_instance = function() {
		if(this.instance == null) {
			this.instance = new Buffer(2000, 'utf-8');
		}
		
		return this.instance;
	}
	
	module.exports = CI_Buffer;
})();