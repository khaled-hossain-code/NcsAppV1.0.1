var express = require('express');
var Calls = require('../controllers/callsController');
var router = express.Router();

var _ = require('underscore');

/* GET home page. */
router.get('/', function(req, res, next) {

	Calls.getAllCallHistory(function (err, output){

	    //console.log(output);

	  res.render('callshistory', { data: output });
  	});

});

module.exports = router;
