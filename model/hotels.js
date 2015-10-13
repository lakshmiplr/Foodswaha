var mongoose = require('mongoose');

var hotelSchema = new mongoose.Schema(
    {
        area: String,
        hotels: [
            {
                id: String,
                name: String,
                address: String,
                area: String,
                imageurl: String,
                deliverytime: Number,
                deliveryfees: Number,
                minorder: Number,
                ontime: Number,
                rating: Number,
                timings: String
            }
        ]
    }
)

var hotels = mongoose.model('hotels',hotelSchema);
module.exports = hotels;
