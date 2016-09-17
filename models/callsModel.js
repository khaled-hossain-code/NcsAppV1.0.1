/**
 * Created by khaled on 5/29/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CallTypes = 'Normal Emergency BlueCode Toilet '.split(' ');


var CallSchema = mongoose.Schema({

  IP: {
    type: String,
    required: true,
    index: true,
    match: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  },
  CallType: {
    type: String,
    required: true,
    index: true,
    enum:CallTypes
  },
  CallDate: {
    type: String
  },
  StartTime:{
    type: String
  },
  StopTime:{
    type: String
  },
  DiffTime:{
    type: String
  }
  
},
{
  timestamps: true
});


module.exports = mongoose.model('Call', CallSchema);
