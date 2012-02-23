var array_map = function(callback, array) {
    // Applies the callback to the elements in given arrays.  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/array_map
    // +   original by: Andrea Giammarchi (http://webreflection.blogspot.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // %        note 1: Takes a function as an argument, not a function's name
    // %        note 2: If the callback is a string, it can only work if the function name is in the global context
    // *     example 1: array_map( function (a){return (a * a * a)}, [1, 2, 3, 4, 5] );
    // *     returns 1: [ 1, 8, 27, 64, 125 ]
    var j = array.length,
        i = 0,
        m = 0;
    var tmp = [],
        tmp_ar = [];
 
   for(i =0; i < j; i++) {
        var tmp = array[i];
 
        if (callback) {
            if (typeof callback === 'string') {
                callback = PHP[callback];
            }
            tmp_ar[i] = callback(tmp);
        } else {
            tmp_ar[i] = tmp;
        }
    }
 
    return tmp_ar;
}

module.exports = array_map;