var ob_end_flush = function() {
    PHP.echo(CI_Buffer.get_instance().toString('utf-8'));
    
    return true;
}

module.exports = ob_end_flush;