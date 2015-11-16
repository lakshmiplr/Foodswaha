var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var geocoder = require('geocoder');
var fs = require('fs');
var path = require('path');

router.get('/hotels', function(req, res, next) {
    var hotels = require("../model/hotels");
    hotels.find({area:'Marathahalli'}).lean().exec(function(err,hotels){
        res.json(hotels);
    });
});

router.get('/hotel/:hotelid', function(req, res, next) {
    var hotelid = req.params.hotelid;
    console.log("Hotel id "+hotelid);
    var menus = require("../model/menu");
    var convertedJSON = {};
    menus.find().where('hotelid',hotelid).lean().exec(function(err,menus){
    	if( typeof menus !=='undefined' && menus.length > 0){
        	try{
                convertedJSON = JSON.parse(JSON.stringify(menus[0]));
        	}catch(err) {
        		console.log(err);
        	}  
    	}
    	res.json(convertedJSON);
    });
}); 

router.post('/location', function(req, res, next) {

    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    
    console.log(latitude);
    console.log(longitude);

    geocoder.reverseGeocode(latitude, longitude, function (err, data) {
        var fulladdress = data.results[0].formatted_address;
        console.log(fulladdress);
        var obj = '{"address":"'+fulladdress+'"}';

        var address = "", city = "", state = "", zip = "", area ="", country = "", formattedAddress = "";

        for (var i = 0; i < data.results[0].address_components.length; i++) {
            var addr = data.results[0].address_components[i];
            if (addr.types[0] == 'country')
                country = addr.long_name;
            else if (addr.types[0] == 'street_address') // address 1
                address = address + addr.long_name;
            else if (addr.types[0] == 'establishment')
                address = address + addr.long_name;
            else if (addr.types[0] == 'route')  // address 2
                address = address + addr.long_name;
            else if(addr.types[0] == 'sublocality_level_1')
                area = addr.long_name;
            else if (addr.types[0] == 'postal_code')       // Zip
                zip = addr.short_name;
            else if (addr.types[0] == ['administrative_area_level_1'])       // State
                state = addr.long_name;
            else if (addr.types[0] == ['locality'])       // City
                city = addr.long_name;
        }
        console.log("City: "+city + " Country: "+country + " state: "+state+" Area: "+area+" address: "+address);
        getHotels(area, function (hotels) {
            console.log("hotels "+hotels[0]);
            var convertedJSON = {};
            if(typeof hotels !== 'undefined' && hotels.length > 0){
            	try{
                    convertedJSON = JSON.parse(JSON.stringify(hotels[0]));
            	}catch(err) {
            		console.log(err);
            	}
            }
            else{
            	convertedJSON.area = area;
            }
            	
            convertedJSON.address = fulladdress;
            res.json(convertedJSON);
        });

    });
});

router.post('/address', function(req, res, next) {
	 var email = req.body.email;
	 console.log("email "+email);
	 var address = require("../model/address");
	 var convertedJSON = {};
	 address.find().where('email',email).lean().exec(function(err, address) {
		 console.log("results "+address[0]);
		if (typeof address !== 'undefined' && address.length > 0) {
			try {
				 console.log("results "+address[0]);
				convertedJSON = JSON.parse(JSON.stringify(address[0]));
			} catch (err) {
				console.log(err);
			}
		}
		res.json(convertedJSON);
	});
   
});

function getHotels(area,cb){
    var hotels = require("../model/hotels");
    hotels.find().where('area',area).lean().exec(function(err,hotels){
       cb(hotels);
    });

};

module.exports = router;
