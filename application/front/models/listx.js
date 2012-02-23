(function() {
	function Listx() {
		Listx.super_.call(this).__construct();
		
		this.__construct = function() {
			
		}
		
		this.doSomething = function() {
			response.write('am incarcat listx');
		}

		return this;
	}

	Util.inherits(Listx, CI_Model);
	
	module.exports = Listx;
})();