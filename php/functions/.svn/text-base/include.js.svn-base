var include = function (filename) {
	var content = FileSystem.readFileSync(filename, 'utf-8');

	CI_Buffer.get_instance().write(content, 'utf-8');

	return true;
}

module.exports = include;