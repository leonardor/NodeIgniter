var exit = function(status, code) {
	status = status || 'n/a';
	code = parseInt(code) || 0;

    console.log('exit with status "%s" (error code: %d)', status, code);
    process.exit(code);
    return;
}

module.exports = exit;