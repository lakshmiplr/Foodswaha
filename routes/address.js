var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

router.post('/', function(req, res, next) {
	 var email = req.body.email;
	 console.log("email "+email);
	 console.log("request json "+req.body)
	 var address = require("../model/address");
	 var convertedJSON = {};
	 address.find().where('email',email).lean().exec(function(err, address) {
		 console.log("results "+address[0]);
		if (typeof address !== 'undefined' && address.length > 0) {
			try {
				convertedJSON = JSON.parse(JSON.stringify(address[0]));
			} catch (err) {
				console.log(err);
			}
		}
		res.json(convertedJSON);
	});
  
});

router.put('/create', function(req, res, next){
	var addr = req.body;
	console.log("request address "+req.body)
	var address = require("../model/address");
	var newadd = new address(addr);
	newadd.save(function (err, data) {
		if (err) {
			console.log(err);
			res.send("not saved");
		}
		else {
			console.log('Saved : ', data );
			res.send("saved");
		} 
		});
});

router.post('/update', function(req, res, next){
	var addr = req.body;
	var reqemail = req.body.email;
	var query = {'email':reqemail};
	console.log("request address "+reqemail)
	var address = require("../model/address");
	var newadd = new address(addr);

	address.findOneAndUpdate(query, newadd, {upsert:true}, function(err, doc){
	    if (err) return res.send(500, { error: err });
	    return res.send("succesfully saved");
	});
});

module.exports = router;