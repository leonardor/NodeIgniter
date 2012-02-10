var preg_match = function(pattern, subject, matches, flags, offset) {
	var offset = offset || 0;
	var flags = flags || this.flag('PREG_OFFSET_CAPTURE');
	
	var regex = new RegExp(pattern);

	var subject = (offset > 0)?subject.substr(offset, subject.length):subject;

	if(matches) {
		matches = subject.match(pattern);

		return matches;
	} else {
		return subject.match(pattern);
	}
}

module.exports = preg_match;