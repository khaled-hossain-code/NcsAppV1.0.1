var express = require('express');
var Calls = require('../controllers/callsController');
var router = express.Router();

var _ = require('underscore');

/* GET home page. */
router.get('/', function(req, res, next) {

	Calls.getAllPendingCalls(function (err, output){				

    	

	    //console.log(output); 				    
	

	  res.render('calls', { data: output });
  	});

  //res.render('calls', { title: 'Express' });
});

module.exports = router;
