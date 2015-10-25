var mongoose = require('mongoose');

var menuSchema = new mongoose.Schema(
		{
			hotelid: Number,
			categories:[
			             String
			             ],
			Starters: [
			             {
			            	 itemname: String,
			            	 cost: Number,
			            	 itemdesc: String
			             }
			           ],
			           veg: [
						             {
						            	 itemname: String,
						            	 cost: Number,
						            	 itemdesc: String
						             }
						           ],
						           NonVeg: [
									             {
									            	 itemname: String,
									            	 cost: Number,
									            	 itemdesc: String
									             }
									           ]
		}
)

var menus = mongoose.model('menus',menuSchema);
module.exports = menus;
