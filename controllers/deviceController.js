/**
 * Created by khaled on 5/28/2016.
 */
var Device = require('../models/deviceModel');
var _ = require('underscore');
var date = require('../Utilities/date.js');

exports.create = function(req, res){
  req.body = _.pick(req.body, 'IP', 'Floor', 'RoomType', 'RoomNumber', 'BedNumber');
  var device = new Device(req.body);
  device.createdOn = date().formatted;

  device.save(function(err){
    if(err)
    {
      res.status(500).send(err);
    }else{
      res.status(201).send(device);
    }
  });
  //res.redirect(301,'/');
};

exports.getAllDevice = function(req, res){
  var query = _.pick(req.query, 'IP', 'Floor', 'RoomType', 'RoomNumber', 'BedNumber');
  
  Device.find(query,function(err,devices){
    if(err){
      res.status(500).send(err);
    }else if(_.isEmpty(devices)) {
      res.status(404).send("Not Found");
    }
    else{
      var devicesWithLink = [];

      devices.forEach(function(device,index,array){
         
        newDevice.links = {};
        newDevice.links.self = 'http://'+ req.headers.host + '/api/devices/' + newDevice._id;
        devicesWithLink.push(newDevice);
      });
      res.send(devicesWithLink);
    }
  });
};


exports.findDeviceByID = function(req, res, next){

  Device.findById(req.params.deviceID, function(err,device){
    if(err){
      res.status(500).send(err);
    }else if(_.isEmpty(device)){
      res.status(404).send("Not Found");
    }else{
      req.device = device;
      next();
    }
  });
};

exports.getDevice = function( req, res){
  var deviceWithLinks = req.device.toJSON();
  deviceWithLinks.links = {};
  deviceWithLinks.links.filterByFloor = 'http://'+ req.headers.host + '/api/devices/?Floor=' + deviceWithLinks.Floor;
  deviceWithLinks.links.filterByRoomType = 'http://'+ req.headers.host + '/api/devices/?RoomType=' + deviceWithLinks.RoomType;
  deviceWithLinks.links.filterByRoomNumber = 'http://'+ req.headers.host + '/api/devices/?RoomNumber=' + deviceWithLinks.RoomNumber;
  deviceWithLinks.links.filterByBedNumber = 'http://'+ req.headers.host + '/api/devices/?BedNumber=' + deviceWithLinks.BedNumber;
  res.json(deviceWithLinks);
};

exports.editDevice = function (req, res) {

  
  req.body = _.pick(req.body, 'IP', 'Floor', 'RoomType', 'RoomNumber', 'BedNumber');
  req.body.updatedOn = date().formatted;

  req.device = _.extend(req.device, req.body);
  console.log(req.device);

  req.device.save(function(err){
    if(err){
      res.status(500).send(err);
    }else{
      res.json(req.device);
    }
  });
};

exports.deleteDevice = function(req, res){

  req.device.remove(function(err){
    if(err){
      res.status(500).send(err);
    }else{
      res.status(204).send();
    }
  });
};


exports.getAllDevicesDetails = function(cb){  

  Device.find({}).sort({IP:1}).exec(function(err, devices) {      
      cb(err,devices);
    });
};


exports.editDevicesDetails = function(req, res, postData, docID){  

  var query = {
    "_id": docID
  };

  var options = {new: true};
  
  //console.log(query, postData, query);

  Device.findOneAndUpdate(query, postData, options, function(err, device){
        
    console.log(err, device);

    if(err == null){
      return true;
    }else{
      return false;
    }

  });

};

exports.addDevices = function(req, res, postData){  
  
  var dev = new Device(postData);
  dev.createdOn = date().formatted;

  dev.save(function(err, dev2){

    
    console.log(err, dev2);

    if(err == null){
      return true;
    }else{
      return false;
    }

  });


};


exports.deactivateDevice = function(req, res, getData){  

  var query = {
    "_id": getData.ID
  };
 

  //console.log(query);


  Device.findOneAndRemove(query, function(err, device){
        
    console.log(err, device);

    if(err == null){
      return true;
    }else{
      return false;
    }

  });


};


// khaled

exports.updateDeviceSocketId = function (payload, cb){    
    
    Device.findOneAndUpdate({IP: payload.IP}, {$set: {"SocketID" : payload.SocketID}}, function (err, updatedDevice) {
      if(err){
          //unable to update device info
        }else if(_.isEmpty(updatedDevice)){
          //means there is no device list found, so create one
          var deviceData =  {
                  IP: payload.IP,
                  Floor: '',        
                  RoomType: '',
                  RoomNumber: '',
                  BedNumber: '',
                  Status: 1,
                  SocketID: payload.SocketID         
              };
          var deviceObj = new Device(deviceData);

          deviceObj.save(function (err, result) {
              cb(err,result);
          });
          
        }else{

          Device.findOneAndUpdate({IP: payload.IP}, {$set: {"SocketID" : payload.SocketID}}, function (err, device) {
            if (err) {
              // tell front-end an error occured with payload.IP send(err);
              //console.log(err);
              return {};

            } else if (_.isEmpty(device)) {
              // tell front-end a IP is calling but not available in database send();
              return {};
            } else {
              //console.log(device);
              cb(err, device);
            }
          });

          //cb(err,updatedDevice);
        }
    });
};
