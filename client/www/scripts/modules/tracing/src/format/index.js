'use strict'


var format = d3.format('.3s')

module.exports = {

  msFormat: function msFormat(val){
    return format(val/1000000) + 's'
  }
}
