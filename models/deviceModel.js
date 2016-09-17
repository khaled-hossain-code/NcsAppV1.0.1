/**
 * Created by khaled on 5/28/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var RoomTypes = 'Single VIP DoubleShare MaleWard FemaleWard ICU CCU MICU Dialysis '.split(' ');

var deviceSchema= new Schema({
  IP:{
    type: String,
    unique: true,
    required: true,
    index: true,
    match: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  },
  Floor:{
    type:String,
    required:false
  },
  RoomType:{
    type:String,
    required:false,
    enum:RoomTypes
  },
  RoomNumber:{
    type:String,
    required:false
  },
  BedNumber:{
    type:String,
    required:false
  },
  Status:{
    type:Number
  },
  SocketID:{
    type:String
  },
  createdOn:{
    type:String
  },
  updatedOn:{
    type:String
    }
},
{
  timestamps: true
});

//Export model
module.exports = mongoose.model('device',deviceSchema);