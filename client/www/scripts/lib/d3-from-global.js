// exports the already global d3 in a way that require() likes
// this is used by browserify in the strong-arc build process to replace
// references to require('d3') with require('./path/to/this/file')
module.exports = (window || global).d3;
