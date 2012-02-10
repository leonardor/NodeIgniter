var ob_get_contents = function() {
    // Return the contents of the output buffer  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/ob_get_contents
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: ob_get_contents();
    // *     returns 1: 'some buffer contents'
    this.php_js = this.php_js || {};
    var phpjs = this.php_js,
        ini = phpjs.ini,
        obs = phpjs.obs;
    if (!obs || !obs.length) {
        return (ini && ini.output_buffering && (typeof ini.output_buffering.local_value !== 'string' || ini.output_buffering.local_value.toLowerCase() !== 'off')) ? '' : false; // If output was already buffered, it would be available in obs
    }
    return obs[obs.length - 1].buffer; // Retrieve most recently added buffer contents
}

module.exports = ob_get_contents;