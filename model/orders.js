var mongoose = require('mongoose');

var ordersSchema = new mongoose.Schema(
    {
    	email:String,
    		hotelid:String,
    		hotelname:String,
    		area:String,
    		date:String,
    		time:String,
    		hotelimageurl:String,
    		deliverytype:String,
    		address:String,
    		total:Number,
    		status: String,
    		mobile:String,
    		cart :[{
    				itemname:String,
    				itemprice: Number,
    				itemcount:Number
    			}
    			
    			]
    			
    }
);

var orders = mongoose.model('orders',ordersSchema, "orders");
module.exports = orders;
