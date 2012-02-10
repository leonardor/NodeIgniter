var array_keys = function(array1) {
	var retArr = {},
	    argl = arguments.length,
	    k1 = '',
	    i = 1,
	    k = '',
	    arr = {};
	
	arr1keys: for (k1 in array1) {
	    for (i = 1; i < argl; i++) {
	        arr = arguments[i];
	        for (k in arr) {
	            if (arr[k] === array1[k1]) {
	                // If it reaches here, it was found in at least one array, so try next value
	                continue arr1keys;
	            }
	        }
	        retArr[k1] = array1[k1];
	    }
	}
	
	return retArr;
}

module.exports = array_keys;