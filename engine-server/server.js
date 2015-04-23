var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  name: {type: String, required: true},
  price: {type: Number, required: true},
  description: {blurb: {type: String, required: true}, full: {type: String, required: true}},
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category', index: true}],
  images: {type: Array, default: ['http://lorempixel.com/400/400']}, 
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  quantity: Number // quantity available--needs to increment when order placed
});

var Product = mongoose.model('Product', ProductSchema);

var lineItemsSchema = new Schema({
  productId: String,
  productName: String,
  price: Number,
  quantity: Number,
  image: {type: String, default:'http://lorempixel.com/400/400'}
});
var states = 'created processing processing_guest cancelled cancelled_guest completed completed_guest'.split(' ');

var OrderSchema = new Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  lineItems: {type:[lineItemsSchema], required:true },
  status: {type: String, default:'created', enum: states},
  date: Date,
  shipping: {},
  billing: {} // includes chargeId
});

var Order = mongoose.model('Order', OrderSchema);

// let's set up mongoose
mongoose.connect('mongodb://localhost/stackstore-dev');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));


var server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));

// allow cross-domain
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

var obj = {};
Order.find(function(err, orders) {
	orders.forEach(function(order) {
			// each item id is a key in the hash
				// each item id is a key in that key's value, e.g.
				// {id1: {id2: val, id3: val...}, id2: {id1: val, id3: val...}}
				// increment values for the object
				// go through the rest of the goddamn objects in the line item.
		order.lineItems.forEach(function(item1, outerIndex) {
			if (!obj[item1.productId]) obj[item1.productId] = {};
			order.lineItems.forEach(function (item2, innerIndex) {
				if (item1.productId !== item2.productId) {
					if (!obj[item1.productId][item2.productId]) {
						obj[item1.productId][item2.productId] = 1
					}
					else {
						obj[item1.productId][item2.productId]++;
					}
				}
			});
		});
	});
	// console.log(obj);
});

server.post('/:id', function(req, res) {
	Product.findById(req.params.id, function(err, product){
		// console.log(obj);
		// console.log(product._id);
		// console.log(obj[product._id]);
		var highestValues = [{num: 0}, {num: 0}, {num: 0}];
		// go to that item's section of the hash (obj[product._id])
		// go through each entry in that section (by key)
		// and see if its value (number of co-occurrences) is higher than
		// any of the values currently in the "highestValues" array.
		for (var key in obj[product._id]) {
			for (var i = 0; i < 3; i++) {
				if (obj[product._id][key] > highestValues[i]['num']) {
					highestValues[i] = {productId: key, num: obj[product._id][key]}
					break;
				}
			}
		}
		var ids = [highestValues[0].productId, highestValues[1].productId, highestValues[2].productId];
		// console.log(ids);
		// console.log(highestValues);
		res.send(ids);
	});
});

server.listen(3000);