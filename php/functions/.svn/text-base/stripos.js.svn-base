var stripos = function (haystack, needle, offset) {
    // Finds position of first occurrence of a string within another, case insensitive  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/stripos
    // +     original by: Martijn Wieringa
    // +      revised by: Onno Marsman
    // *         example 1: stripos('ABC', 'a');
    // *         returns 1: 0
    var haystack = (haystack + '').toLowerCase();
    var needle = (needle + '').toLowerCase();
    var index = 0;
 
    if ((index = haystack.indexOf(needle, offset)) !== -1) {
        return index;
    }
    
    return false;
}

module.exports = stripos;