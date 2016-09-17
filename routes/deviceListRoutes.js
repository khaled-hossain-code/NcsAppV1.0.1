var express = require('express');
var Device = require('../controllers/deviceController');
var router = express.Router();

var www = require('../bin/www');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  Device.getAllDevicesDetails(function (err, output){          
      
      //console.log(output);
      res.render('devices', { data: output });
  });

});




// Mamshad 2016-07-17
router.post('/', function(req, res){
  
  var docID = req.body.docID;
  var submitStatus = req.body.submitStatus;

  if(submitStatus == 1){
  	var postData = {

	  IP: req.body.IP,
	  Floor: req.body.Floor,
	  RoomType: req.body.RoomType,
	  RoomNumber: req.body.RoomNumber,
	  BedNumber: req.body.BedNumber,
	  Status: 0,
	  SocketID: '',

	};
  }else{
  	var postData = {

	  //IP: req.body.IP,
	  Floor: req.body.Floor,
	  RoomType: req.body.RoomType,
	  RoomNumber: req.body.RoomNumber,
	  BedNumber: req.body.BedNumber,
	  //Status: req.body.Status,
	  //SocketID: '',

	};
  }  
  
  if(submitStatus == 1){		
  	var addResponse = Device.addDevices(req, res, postData);    
  }else{
  	var editResponse = Device.editDevicesDetails(req, res, postData, docID);    
  }
  res.redirect('/devices');

});



// Mamshad 2016-07-17
router.get('/del/:id', function(req, res){
	
	//console.log('go');
	var getData = {
	  ID: req.params.id
	};
	//console.log(getData);
	var deactivateResponse = Device.deactivateDevice(req, res, getData);

	res.redirect('/devices');

});


// Mamshad 2016-07-17
router.get('/status/:ip/:devstatus', function(req, res){	

	www.sendStatusToDevice(req.params.ip, req.params.devstatus);
	res.redirect('/devices');

});



module.exports = router;
