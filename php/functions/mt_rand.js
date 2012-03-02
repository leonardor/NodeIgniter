var mt_rand = function(min, max) {
    // Returns a random number from Mersenne Twister  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/mt_rand
    // +   original by: Onno Marsman
    // *     example 1: mt_rand(1, 1);
    // *     returns 1: 1
    var argc = arguments.length;
    if (argc === 0) {
        min = 0;
        max = 2147483647;
    } else if (argc === 1) {
        throw new Error('Warning: mt_rand() expects exactly 2 parameters, 1 given');
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = mt_rand;