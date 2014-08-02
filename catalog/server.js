var express, http, path, reload, cars, app, 
	mongoose, clientDir, server, db, ProductSchema, Product, server;


	
// import modules.
	express  = require('express');
	http     = require('http');
	path     = require('path');
	mongoose = require('mongoose');

	app = express();



// database connection.
mongoose.connect('mongodb://localhost:27017/catalog');
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
console.log( 'Application is up and running!' );

  	// create mongoDB schema.
  	ProductSchema = mongoose.Schema({
    	name      : String,
    	category  : String,
    	price     : Number,
    	desc      : String,
    	created_date : { type: Date, default: Date.now },
    	created_by	 : String
	});
	Product = mongoose.model('Product', ProductSchema);
});



// keep a reference to the client directory path.
clientDir = path.join( __dirname, 'client' );

// express configuration.
app.configure( function() {
	app.set( 'port', process.env.PORT || 8500 );
	app.use( express.logger('dev') );
	app.use( express.bodyParser() );
	app.use( app.router );
	app.use( express.static(clientDir) );
});

app.configure('development', function() {
	app.use(express.errorHandler());
});


/* Routing Start */

// Home page.
app.get('/', function( req, res ) {
	res.sendfile( path.join( clientDir, 'index.html' ) );
});

// Read all products.
app.get('/api/products', function(req, res) {
	Product.find(function( err, products ) {
		if (err) return;
		res.json(products);
	});
});

// Read one product.
app.get('/api/products/:id', function( req, res ) {

	var id, response;
	
	id = req.params.id;
	response = { success: false };
	
	Product.findOne({ _id: id }, function( err, product ) {
		if (err) return;
		
		response.success = true;
		response.data    = product;
		
		res.json( response );	
	});
	
});

// Delete product.
app.del('/api/products/:id', function( req, res ) {
	var id = req.params.id;
	Product.remove({ _id: id }, function( err, numOfRemoved ) {
		if ( err ) return;
		res.json({"success": true})
	})
	
});

// Create product.
app.post('/api/products', function( req, res ) {
	var p, json;

	json = {
		name        	: req.body.name,
		category    	: req.body.category,
		price       	: req.body.price,
		desc        	: req.body.desc,
		created_date	: { type: Date, default: Date.now },
		created_by  	: 'Admin'
	}
	
	p = new Product( json );

	p.save(function( err, product ) {
		var response;
		response = {};
		response.success = false;
		
		if ( !err ) {
			response.data    = product;
			response.success = true;
		}
		res.json( response );
	});
});

// Update product.
app.put('/api/products', function( req, res ) {

	var p, json, id;

	id   = req.body._id;
	json = {
		name     : req.body.name,
		category : req.body.category,
		price    : req.body.price,
		desc     : req.body.desc
	}

	Product.update({ _id: id }, json, function( err, numberAffected, raw ) {
		if (err) return;
	  	res.json({ "success": true });
	});
});
/* Routing End */


// initialize node server.
server = http.createServer( app );
server.listen(app.get('port'), function() {
	console.log("Web server listening on port " + app.get('port'));
});