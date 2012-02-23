var Http = require('http');

Path = require('path'),
FileSystem = require('fs'),
Util = require('util'),
Sys = require('sys'),
Ejs = require('ejs'),
Events = require('events');

	Ejs.open = '<?';
	Ejs.close = '?>';

/*
|---------------------------------------------------------------
| SYSTEM FOLDER NAME
|---------------------------------------------------------------
*/


var app = Http.createServer(function (request, response) {
	var filename = (Path.basename(request.url) != '')?Path.basename(request.url):'index';
	var path = Path.resolve(__dirname) + '/' + filename;

	Path.exists(path, function(exists){
		if(exists) {
			var stats = FileSystem.statSync(path);

			if(stats.isFile()) {
				FileSystem.readFile(path, function(err, data){
				    response.writeHead(200, {"Content-Disposition": "inline; filename=\"" + Path.basename(request.url) + "\"", "Content-Type": "application/octet-stream"});
				    response.write(data, "binary");
				    response.end();
				});
			}
		} else {
			global.request = request;
			global.response = response;
			
			var PHP = require('../php');
			PHP.__construct(request, response);
			global.PHP = PHP;
			
			var $system_folder = '../system';

			/*
			|---------------------------------------------------------------
			| APPLICATION FOLDER NAME
			|---------------------------------------------------------------
			*/

			var $application_folder = '../application/front';

			/*
			|---------------------------------------------------------------
			| SET THE SERVER PATH
			|---------------------------------------------------------------
			*/

			if ($system_folder.indexOf('/') == -1) {
				$system_folder = Path.relative($system_folder) + '/' + $system_folder;
			} else {
				$system_folder = $system_folder.replace('/\\/', '/'); 
			}

			/*
			|---------------------------------------------------------------
			| DEFINE APPLICATION CONSTANTS
			|---------------------------------------------------------------
			|
			| EXT		- The file extension.  Typically ".php"
			| FCPATH	- The full server path to THIS file
			| SELF		- The name of THIS file (typically "index.php")
			| BASEPATH	- The full server path to the "system" folder
			| APPPATH	- The full server path to the "application" folder
			|
			*/

			PHP.define('EXT', Path.extname(__filename));
			PHP.define('FCPATH', Path.resolve(__filename));
			PHP.define('SELF', Path.basename(__filename));
			PHP.define('BASEPATH', Path.resolve(__dirname) + '/' + $system_folder + '/');

			var stats = FileSystem.statSync(Path.resolve(__dirname) + '/' + $application_folder);

			if (stats.isDirectory()) {
				PHP.define('APPPATH', Path.resolve(__dirname) + '/' + $application_folder + '/');
			} else {
				if($application_folder == '') {
					$application_folder = 'application';
				}

				PHP.define('APPPATH', PHP.constant.BASEPATH + $application_folder + '/');
			}

			/*
			|---------------------------------------------------------------
			| SERVER
			|---------------------------------------------------------------
			*/
			
			response.setHeader("Content-Type", "text/html");
		
			PHP.$_SERVER['DOCUMENT_ROOT'] = __dirname;
			PHP.$_SERVER['SERVER_ADDR'] = app.address().address;
			PHP.$_SERVER['LOCAL_ADDR'] = app.address().address;
			PHP.$_SERVER['SERVER_PORT'] = app.address().port;
			
			console.log('PROCESS MEMORY: ' + JSON.stringify(process.memoryUsage()));
			
			var CI = require($system_folder + '/codeigniter/codeigniter')(request, response);
			CI.__construct(request, response);
		}
	})
});

app.listen('3001', '127.0.0.1', function() {
	console.log('Application server started on port ' + app.address().port);
});