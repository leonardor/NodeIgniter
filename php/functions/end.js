var end = function(array) {
	if(array.length == 0) {
		return false;
	}
	
	return array[array.length - 1];
}

module.exports = end;