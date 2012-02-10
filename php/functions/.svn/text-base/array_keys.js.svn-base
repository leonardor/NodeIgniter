var array_keys = function(input, search_value, argStrict) {
    // Return just the keys from the input array, optionally only for the specified search_value  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/array_keys
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: jd
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   input by: P
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: array_keys( {firstname: 'Kevin', surname: 'van Zonneveld'} );
    // *     returns 1: {0: 'firstname', 1: 'surname'}
    var search = typeof search_value !== 'undefined',
        tmp_arr = [],
        strict = !!argStrict,
        include = true,
        key = '';
 
    if (input && typeof input === 'object' && input.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
        return input.keys(search_value, argStrict);
    }
 
    for (key in input) {
        if (input.hasOwnProperty(key)) {
            include = true;
            if (search) {
                if (strict && input[key] !== search_value) {
                    include = false;
                }
                else if (input[key] != search_value) {
                    include = false;
                }
            }
 
            if (include) {
                tmp_arr[tmp_arr.length] = key;
            }
        }
    }
 
    return tmp_arr;
}

module.exports = array_keys;