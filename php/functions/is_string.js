var is_string = function(mixed_var) {
    // Returns true if variable is a Unicode or binary string  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/is_string
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: is_string('23');
    // *     returns 1: true
    // *     example 2: is_string(23.5);
    // *     returns 2: false
    return (typeof(mixed_var) == 'string');
}

module.exports = is_string;