var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

router.put('/create', function(req, res, next){
	var ord = req.body;
	console.log("request order "+req.body);
	var order = require("../model/orders");
	var neword = new order(ord);
	neword.save(function (err, data) {
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

router.post('/get', function(req, res, next) {
	 var email = req.body.email;
	 console.log("email "+email);
	 console.log("request json "+req.body)
	 var orders = require("../model/orders");
	 var convertedJSON = {};
	 orders.find().where('email',email).lean().exec(function(err, orders) {
		 console.log("results "+orders[0]);
		if (typeof orders !== 'undefined' && orders.length > 0) {
			try {
				convertedJSON = JSON.parse(JSON.stringify(orders));
			} catch (err) {
				console.log(err);
			}
		}
		res.json(convertedJSON);
	});
 
});

module.exports = router;