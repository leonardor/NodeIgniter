(function() {
	var MY_View = {};

	MY_View = Object.create(CI_View).__construct();
	
	MY_View.parent = CI_View;
	MY_View.name = 'MY_View';

	MY_View.__construct = function() {
		console.log('MY_View.__construct()');
		return this;
	}
	
	MY_View.load = function($tpl, $data, $return) {
		var self = this;
		
		$data = $data || {};
		$return = $return || false;

		this.set($data);

		Swig.init({
		    allowErrors: false,
		    autoescape: true,
		    encoding: 'utf8',
		    filters: {},
		    root: PHP.constant('APPPATH') + 'views/',
		    tags: {},
		    extensions: {},
		    tzOffset: 0
		});
		
		CI_Output.on('ready', function() {
			var tpl = Swig.compileFile($tpl);
			var html = tpl.render(CI.view.$vars);

			console.log('emitting my_view.load event...');
			self.emit('load', html);
		});
		
		return this;
	}

	module.exports = MY_View;
})();