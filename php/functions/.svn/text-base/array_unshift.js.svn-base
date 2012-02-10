var array_unshift = function (array) {
    // Pushes elements onto the beginning of the array  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/array_unshift
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Martijn Wieringa
    // +   improved by: jmweb
    // %        note 1: Currently does not handle objects
    // *     example 1: array_unshift(['van', 'Zonneveld'], 'Kevin');
    // *     returns 1: 3
    var i = arguments.length;
 
    while (--i !== 0) {
        arguments[0].unshift(arguments[i]);
    }
 
    return arguments[0].length;
}

module.exports = array_unshift;