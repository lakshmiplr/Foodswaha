var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var geocoder = require('geocoder');
var fs = require('fs');

var vd = require('../videodata.json');
var hd = require('../HotelData.json');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var hotelsSchema = new Schema({
    area: String,
    hotels : [{
        'Hotel name' : String,
        itemscount : String
    }]

});

var samplehotels = mongoose.model('hotelscollection',hotelsSchema,'hotelcollection');

router.get('/samplehotels', function(req, res, next) {
    samplehotels.find({'hotels.Hotel name':'Andhra curries1'},function(err,hotels){
      res.json(hotels);
  });
});

router.get('/hotels', function(req, res, next) {
    var hotels = require("../model/hotels");
    hotels.find({area:'Marathahalli'}).lean().exec(function(err,hotels){
        //var hotelsobj = JSON.stringify(hotels);
        res.json(hotels);
    });
});

function getHotels(area1,cb){
    var hotels = require("../model/hotels");
    hotels.find().where('area',area1).lean().exec(function(err,hotels){
       cb(hotels);
    });

};

router.post('/hotels', function(req, res, next) {
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    console.log(latitude);
    console.log(longitude);
    res.writeHead(200,{"context-type": "text/json"});
    fs.createReadStream("./HotelsMongo.json").pipe(res);

});

router.post('/location', function(req, res, next) {

    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    console.log("req "+req.body.toString());
    console.log(latitude);
    console.log(longitude);

    geocoder.reverseGeocode(latitude, longitude, function (err, data) {
        var fulladdress = data.results[0].formatted_address;
        console.log(fulladdress);
        var obj = '{"address":"'+fulladdress+'"}';



        //res.end(JSON.stringify(data, null, 4));
        var address = "", city = "", state = "", zip = "", area ="", country = "", formattedAddress = "";

        for (var i = 0; i < data.results[0].address_components.length; i++) {
            var addr = data.results[0].address_components[i];
            // check if this entry in address_components has a type of country
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
        var loc = '{"Area":"'+area+'"}';
        getHotels(area, function (hotels) {
            console.log("hotels "+hotels[0]);
            var convertedJSON = JSON.parse(JSON.stringify(hotels[0]));
            convertedJSON.address = fulladdress;
            res.json(convertedJSON);
        });

        // res.json(JSON.parse(loc));

    });
});

module.exports = router;


/*res.render('index', {
 title: 'Express' ,
 videodata: vd
 });*/