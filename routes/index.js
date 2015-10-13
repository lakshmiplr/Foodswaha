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

function getHotels(area,cb){
    var hotels = require("../model/hotels");
    hotels.find().where('area',area).lean().exec(function(err,hotels){
       cb(hotels);
    });

};

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
            if(hotels.length > 0){
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

module.exports = router;
