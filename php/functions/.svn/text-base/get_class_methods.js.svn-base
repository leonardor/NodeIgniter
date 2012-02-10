var get_class_methods = function (obj) {
    // Returns an array of method names for class or class instance.  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/get_class_methods
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: function Myclass () {this.privMethod = function (){}}
    // *     example 1: Myclass.classMethod = function () {}
    // *     example 1: Myclass.prototype.myfunc1 = function () {return(true);};
    // *     example 1: Myclass.prototype.myfunc2 = function () {return(true);}
    // *     example 1: get_class_methods('MyClass')
    // *     returns 1: {}
    var retArr = {},
        method = '';

    for (method in obj) { // Get class methods of object's constructor
        if (typeof obj[method] === 'function') {
            retArr[method] = obj[method];
        }
    }
   
    return retArr;
}

module.exports = get_class_methods;