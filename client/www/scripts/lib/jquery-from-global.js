// exports the already global jQuery in a way that require() likes
// this is used by browserify in the strong-arc build process to replace
// references to require('jquery') with require('./path/to/this/file')
module.exports = (window || global).jQuery;
