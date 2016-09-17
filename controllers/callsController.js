/**
 * Created by khaled on 5/29/2016.
 */
var CallModel = require('../models/callsModel');
var _ = require('underscore');
var date = require('../Utilities/date.js');
var Device = require('../models/deviceModel');


exports.createcalls = function(req, res) {
  req.body = _.pick(req.body, 'IP', 'CallType', 'CallDate', 'StartTime', 'StopTime', 'DiffTime');

  Device.find({IP: req.body.IP}, function (err, device) {
    if (err) {
      res.status(500).send(err);
    } else if (_.isEmpty(device)) {
      res.status(404).end();
    } else {
      var call = new CallModel(req.body);
      call.createdOn = date().formatted;

      call.save(function (err) {
        if (err) {
          res.status(500).send(err); // 500 means server internal error
        } else {
          res.status(201).send(call); // status 201 means created
        }
      });
    }
  });
};

exports.getAllcalls = function (req, res){
  var query = _.pick(req.query, 'IP', 'CallType', 'CallDate', 'StartTime', 'StopTime', 'DiffTime');

  query = _.mapObject( query, function(val, key) {
      try{
        val = JSON.parse(val); //if the value is not JSON it returns error
      }catch(e){}

      return val;
  });

  CallModel.find(query, function(err, calls){
    if(err){
      res.status(500).send(err);
    }else if(_.isEmpty(calls)) {
      res.status(404).send("Not Found");
    }
    else {
      var callsWithLink = [];

      calls.forEach(function (call, index, array) {
        var newCall = call.toJSON();
        newCall.links = {};
        newCall.links.self = 'http://' + req.headers.host + '/api/calls/' + newCall._id;
        callsWithLink.push(newCall);
      });
      res.send(callsWithLink);
    }
  });
};

exports.findCallByID = function(req, res, next){

  CallModel.findById(req.params.callsID,function(err, call){
    if(err)
    {
      res.status(500).send(err);
    }else if(_.isEmpty(call)){
      res.status(404).send("Not Found");
    }else{
      req.call = call;
      next();
    }
  });
};


exports.getCall =  function(req, res){
  var callWithLinks = req.call.toJSON();
  callWithLinks.links = {};

  callWithLinks.links.finterByCallType = 'http://'+ req.headers.host + '/api/calls/?CallType=' + callWithLinks.CallType;
  callWithLinks.links.finterByIP = 'http://'+ req.headers.host + '/api/calls/?IP=' + callWithLinks.IP;

  callWithLinks.links.finterByCallDate = 'http://'+ req.headers.host + '/api/calls/?CallDate=' + callWithLinks.CallDate;
  callWithLinks.links.finterByCallDateLessThan = 'http://'+ req.headers.host + '/api/calls/?CallDate=' + '{%22$lt%22:%22' + callWithLinks.CallDate + '%22}'; //?CallDate={"$lt":"05.06.16"} %22 means "
  callWithLinks.links.finterByCallDateGreaterThan = 'http://'+ req.headers.host + '/api/calls/?CallDate=' + '{%22$gt%22:%22' + callWithLinks.CallDate + '%22}';
  callWithLinks.links.finterByCallDateBetween = 'http://'+ req.headers.host + '/api/calls/?CallDate=' + '{%22$gt%22:%22' + callWithLinks.CallDate + '%22,%22$lt%22:%22' + callWithLinks.CallDate + '%22}';

  callWithLinks.links.finterByStartTime = 'http://'+ req.headers.host + '/api/calls/?StartTime=' + callWithLinks.StartTime;
  callWithLinks.links.finterByStartTimeLessThan = 'http://'+ req.headers.host + '/api/calls/?StartTime=' + '{%22$lt%22:%22' + callWithLinks.StartTime + '%22}'; //?StartTime={"$lt":"08:06:16"} %22 means "
  callWithLinks.links.finterByStartTimeGreaterThan = 'http://'+ req.headers.host + '/api/calls/?StartTime=' + '{%22$gt%22:%22' + callWithLinks.StartTime + '%22}';
  callWithLinks.links.finterByStartTimeBetween = 'http://'+ req.headers.host + '/api/calls/?StartTime=' + '{%22$gt%22:%22' + callWithLinks.StartTime + '%22,%22$lt%22:%22' + callWithLinks.StartTime + '%22}';

  callWithLinks.links.finterByStopTime = 'http://'+ req.headers.host + '/api/calls/?StopTime=' + callWithLinks.StopTime;
  callWithLinks.links.finterByStopTimeLessThan = 'http://'+ req.headers.host + '/api/calls/?StopTime=' + '{%22$lt%22:%22' + callWithLinks.StopTime + '%22}'; //?CallDate={"$lt":"05.06.16"} %22 means "
  callWithLinks.links.finterByStopTimeGreaterThan = 'http://'+ req.headers.host + '/api/calls/?StopTime=' + '{%22$gt%22:%22' + callWithLinks.StopTime + '%22}';
  callWithLinks.links.finterByStopTimeBetween = 'http://'+ req.headers.host + '/api/calls/?StopTime=' + '{%22$gt%22:%22' + callWithLinks.StopTime + '%22,%22$lt%22:%22' + callWithLinks.StopTime + '%22}';

  callWithLinks.links.finterByDiffTime = 'http://'+ req.headers.host + '/api/calls/?DiffTime=' + callWithLinks.DiffTime;
  callWithLinks.links.finterByDiffTimeLessThan = 'http://'+ req.headers.host + '/api/calls/?DiffTime=' + '{%22$lt%22:%22' + callWithLinks.DiffTime + '%22}'; //?DiffTime={"$lt":"12:00"} %22 means "
  callWithLinks.links.finterByDiffTimeGreaterThan = 'http://'+ req.headers.host + '/api/calls/?DiffTime=' + '{%22$gt%22:%22' + callWithLinks.DiffTime + '%22}';
  callWithLinks.links.finterByDiffTimeBetween = 'http://'+ req.headers.host + '/api/calls/?DiffTime=' + '{%22$gt%22:%22' + callWithLinks.DiffTime + '%22,%22$lt%22:%22' + callWithLinks.DiffTime + '%22}'; //?DiffTime={"$gt":"07:00", "$lt":"12:00"}
  //TODO other types of filters
  res.json(callWithLinks);
};

exports.editCall = function(req, res){
  req.body = _.pick(req.body, 'IP', 'CallType', 'CallDate', 'StartTime', 'StopTime', 'DiffTime');
  req.body.updatedOn = date().formatted;

  req.call = _.extend(req.call, req.body);
  
  req.call.save(function(err){
    if(err){
      res.status(500).send(err);
    }else{
      res.json(req.call);
    }
  });
};

exports.deleteCall = function(req, res){

  req.call.remove(function(err){
    if(err){
      res.status(500).send(err);
    }else{
      res.status(204).send();
    }
  });
};

///Controllers for Beaglebone 

exports.createcallsBBB = function(payload, cb) {  

  var req = {};
  var deviceData = {};

  req.body =  {
    IP: payload.IP,
    CallType: payload.CallType,
    CallDate: date().formattedDate,
    StartTime: date().formattedTime,
    StopTime: '',
    DiffTime: '',
  };
  //updating the payload
  exports.payload = _.extend(payload, req.body);
  
  //Device.find({IP: payload.IP}, function (err, device) {
  Device.find({$and:[{IP: payload.IP},{"Floor":{$ne:""}},{"RoomNumber":{$ne:""}},{"BedNumber":{$ne:""}}]}, function (err, device) {
    if (err) {
      // tell front-end an error occured with payload.IP send(err);
      console.log(err);
      //cb(err,{});
    } else if (_.isEmpty(device)) {

      console.log('device not found in DB');
      // insert device details to database id not found in DB
      
      // mamshad
      // --start--
      // deviceData =  {
      //     IP: payload.IP,
      //     Floor: '',        
      //     RoomType: '',
      //     RoomNumber: '',
      //     BedNumber: '',
      //     Status: 1,
      //     SocketID: payload.SocketID,        
      //     createdOn: date().formatted,
      //     updatedOn:  date().formatted  
      // }; 

      // var deviceObj = new Device(deviceData);

      // deviceObj.save(function (err) {
      //   if (err) {
      //     console.log(err); // tell front-end an error occured while saving to database
      //     //cb(err,{});
      //   } else {
      //     //console.log('done');
      //     //return 1;
      //     cb(err,1);
      //   }
      // });
      // --end--


    } else {

      var call = new CallModel(req.body);

      call.save(function (err) {
        if (err) {
          // tell front-end an error occured while saving to database
          //cb(err,{});
          console.log(err);
        } else {
          //return 0;
          console.log('calls controller: 202. test');
        }
      });
      //cb(err,0);
    }
  });
};


exports.nursePresence = function(payload) {

  //CallModel.find({CallType:"Normal"}).sort({createdAt:-1}).exec(function(err, data) {
  CallModel.find({$and:[{IP:payload.IP},{CallType:"Normal"}]}).sort({createdAt:-1}).exec(function(err, data) {

    if (err) {
      // tell front-end an error occured
    } else if (_.isEmpty(data)) {
      // an ip is press the presence but it is not in calls table
    } else {
      data[0].StopTime = date().formattedTime;
      data[0].DiffTime = date().DiffTime(data[0].StartTime, data[0].StopTime);
      data[0].save();
    }
  });
};

//for Front-End
exports.fetchBBBinfo = function(payload,cb) {
  //console.log(payload);
  //Device.findOne({$and:[{IP: payload.IP},{"Status":1},{"Floor":{$ne:""}},{"RoomNumber":{$ne:""}},{"BedNumber":{$ne:""}}]}, function (err, device) {
  Device.findOne({$and:[{IP: payload.IP},{"Status":1},{"Floor":{$ne:""}},{"RoomNumber":{$ne:""}},{"BedNumber":{$ne:""}}]}, function (err, device) {
    if (err) {
      // tell front-end an error occured with payload.IP send(err);
      return {};

    } else if (_.isEmpty(device)) {
      // tell front-end a IP is calling but not available in database send();
      return {};
    } else {
      var newDevice = JSON.parse(JSON.stringify(device)); // cloning an object
      var newpayload = JSON.parse(JSON.stringify(payload));
      newpayload = _.extend(newpayload, newDevice);
      cb({},newpayload);
      }
  });
};

exports.cancelEmergency = function(payload) {

  //CallModel.find({CallType:"Emergency"}).sort({createdAt:-1}).exec(function(err, data) {
  CallModel.find({$and:[{IP:payload.IP},{CallType:"Emergency"}]}).sort({createdAt:-1}).exec(function(err, data) {
    if (err) {
      // tell front-end an error occured
    } else if (_.isEmpty(data)) {
      // an ip is press the presence but it is not in calls table
    } else {
      data[0].StopTime = date().formattedTime;
      data[0].DiffTime = date().DiffTime(data[0].StartTime, data[0].StopTime);
      data[0].save();
    }
  });
};

exports.cancelBlueCode = function(payload) {

  //CallModel.find({CallType:"BlueCode"}).sort({createdAt:-1}).exec(function(err, data) {
  CallModel.find({$and:[{IP:payload.IP},{CallType:"BlueCode"}]}).sort({createdAt:-1}).exec(function(err, data) {
    if (err) {
      // tell front-end an error occured
    } else if (_.isEmpty(data)) {
      // an ip is press the presence but it is not in calls table
    } else {
      data[0].StopTime = date().formattedTime;
      data[0].DiffTime = date().DiffTime(data[0].StartTime, data[0].StopTime);
      data[0].save();
    }
  });
};

//khaled
exports.cancelAnyCall = function(payload) {

  CallModel.find({IP:payload.IP, StopTime:""}).exec(function(err, data) {
    if (err) {
      // tell front-end an error occured
    } else if (_.isEmpty(data)) {
      // an ip is press the presence but it is not in calls table
    } else {
      for(var i =0; i< data.length; i++){
	//console.log(data[i]);
     	 data[i].StopTime = date().formattedTime;
     	 data[i].DiffTime = date().DiffTime(data[i].StartTime, data[i].StopTime);
     	 data[i].save();
	}
    }
  });
};


// Mamshad

exports.showDeviceDisconnectedAlert = function(SocketID,cb) {
  //console.log(payload);
  Device.findOne({SocketID: SocketID}, function (err, device) {
    if (err) {
      // tell front-end an error occured with payload.IP send(err);
      return {};

    } else if (_.isEmpty(device)) {
      // tell front-end a IP is calling but not available in database send();
      return {};
    } else {
      //console.log(device);
      cb(err, device);
    }
  });
};


// Mamshad

exports.updateDeviceSocketIdAtDatabase = function(payload,cb) {
  //console.log(payload);
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
};


//Mamshad
exports.getAllPendingCalls = function(cb){

  // var callDetails = {};

  // CallModel.find({"StopTime": ""}, function(err, calls) {      

  //     var keys = Object.keys( calls );
  //      for( var i = 0,length = keys.length; i < length; i++ ) {           

  //          var query = {
  //             "IP": calls[ keys[ i ] ].IP
  //           };

  //           var query2 = {
  //             "CallType": calls[ keys[ i ] ].CallType,
  //             "CallDate": calls[ keys[ i ] ].CallDate,
  //             "StartTime": calls[ keys[ i ] ].StartTime
  //           };

  //          Device.findOne(query, function(err, device){              

  //               callDetails.IP =  device.IP;
  //               callDetails.BedNumber =  device.BedNumber;
  //               callDetails.RoomNumber =  device.RoomNumber;
  //               callDetails.RoomType =  device.RoomType;
  //               callDetails.Floor =  device.Floor;
  //               callDetails.CallType = query2.CallType;
  //               callDetails.CallDate = query2.CallDate;
  //               callDetails.StartTime = query2.StartTime;
  //               //console.log(callDetails); 
  //               cb(err, callDetails);
  //           });           
  //      }
      
  //   });


  var myCallDetails = [];
  

  CallModel.find({"StopTime": ""}, function(err, calls) {
	
      var myIP = new Array();
      for (var i = calls.length - 1; i >= 0; i--) {
                 
        myIP.push(calls[i].IP);          
        
      };
      
      Device.find({'IP': {$in: myIP}}, function(err, device){
      

        for (var j = 0; j < calls.length;  j++) {
        
        var  devDetails = _.findWhere(device, {IP: calls[j].IP});

        myCallDetails[j] = {

          'IP': calls[j].IP,          
          'BedNumber': devDetails.BedNumber,
          'RoomNumber': devDetails.RoomNumber,
          'RoomType': devDetails.RoomType,
          'Floor': devDetails.Floor,
          'CallType': calls[j].CallType,
          'CallDate': calls[j].CallDate,
          'StartTime': calls[j].StartTime
        }         
        
      };

        console.log(myCallDetails);
        cb(err, myCallDetails);

      });      


    });


};


//Mamshad
exports.getAllCallHistory = function(cb){

  var myCallDetails = [];
  

  CallModel.find().sort({_id:-1}).limit(1000).exec( function(err, calls) {
      
      var myIP = new Array();
      for (var i = calls.length - 1; i >= 0; i--) {
                 
        myIP.push(calls[i].IP);          
        
      };
      
      Device.find({'IP': {$in: myIP}}, function(err, device){
      

        for (var j = 0; j < calls.length;  j++) {
        
        var  devDetails = _.findWhere(device, {IP: calls[j].IP});

        myCallDetails[j] = {

          'IP': calls[j].IP,          
          'BedNumber': devDetails.BedNumber,
          'RoomNumber': devDetails.RoomNumber,
          'RoomType': devDetails.RoomType,
          'Floor': devDetails.Floor,
          'CallType': calls[j].CallType,
          'CallDate': calls[j].CallDate,
          'StartTime': calls[j].StartTime,
          'StopTime': calls[j].StopTime,
        }
        
      };

        console.log(myCallDetails);
        cb(err, myCallDetails);

      });      


    });
};


//khaled

exports.getCallStatus = function(deviceIP, cb ){

    CallModel.find({"IP":deviceIP}).sort({updatedAt:-1}).exec(function (err, deviceList) {
        //cb(err, deviceList);
        console.log(deviceList[0]);
        var device = deviceList[0];
        var status = 10; //10 means status is unknown

        if (err) {
            //device status is unknown giving error from database
          console.log(err);
        } else if (_.isEmpty(deviceList)) {
            //device is not in call list means this device is brand new and
            //did not generated any calls yet
        } else {
            if(device.CallType === 'Normal' && device.StopTime !== "" ){
                status = 0; //nurse pressed presence button
            }else if(device.CallType === 'Normal' && device.StopTime === "" ){
                status =1; //only patient generated normal call
            }else if(device.CallType === 'Emergency' && device.StopTime !== "" ){
                status = 4; // nurse cancelled emergency
            }else if(device.CallType === 'Emergency' && device.StopTime === "" ){
                status =2; //nurse generated emergency call
            }else if(device.CallType === 'BlueCode' && device.StopTime !== "" ){
                status = 5; //nurse cancelled bluecode
            }else if(device.CallType === 'BlueCode' && device.StopTime === "" ){
                status =3; //nurse generated bluecode
            }
        }

        cb(err, status);
    });    
};
