var mongoose = require('mongoose');

var addressSchema = new mongoose.Schema(
    {
        email: String,
        mobile: String,
        addresses: [
            {
                flatnumber: String,
                streetdetails: String,
                area: String,
                city: String,
                pincode: String,
                landmark: String,
            }
        ]
    }
);

var address = mongoose.model('address',addressSchema, "address");
module.exports = address;
