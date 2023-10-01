// Student Name:- Khanjan Dave
// Student Id: - 301307330

const SERVER_NAME = 'product-api';
const PORT = 5000;
const HOST = '127.0.0.1';

const restify = require('restify');

// Create the restify server
const server = restify.createServer({ name: SERVER_NAME });

// Initialize request counters
let getRequestCount = 0;
let postRequestCount = 0;

// In-memory data store for products (you may need to use a database in production)
const products = [];

server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url);
  console.log('**** Resources: ****');
  console.log('********************');
  console.log(' /products');
  console.log(' /products/:id');
});

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Log request and response information
server.on('after', (req, res, route, error) => {
  getRequestCount++;
  console.log(`Processed Request Count --> Get: ${getRequestCount}, Post: ${postRequestCount}`);
});

// Get all products in the system
server.get('/products', function (req, res, next) {
  // Return all of the products in the system
  res.send(products);
});

// Get a single product by its product id
server.get('/products/:id', function (req, res, next) {
  // Find a single product by its id within the in-memory data store
  const productId = parseInt(req.params.id, 10);
  const product = products.find(p => p.productId === productId);

  if (product) {
    // Send the product if it exists
    res.send(product);
  } else {
    // Send a 404 header if the product doesn't exist
    res.send(404);
  }
});

// Create a new product
server.post('/products', function (req, res, next) {
  // Validation of mandatory fields in the JSON payload
  if (!req.body.productId || !req.body.name || !req.body.price || !req.body.quantity) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.errors.BadRequestError('Invalid JSON payload'));
  }

  const newProduct = {
    productId: req.body.productId,
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity,
  };

  // Add the new product to the in-memory data store
  products.push(newProduct);

  // Send a 201 Created response with the newly created product
  postRequestCount++;
  res.send(201, newProduct);
});

// Delete all product records
server.del('/products', function (req, res, next) {
  // Clear the in-memory data store (remove all products)
  products.length = 0;

  // Send a 204 No Content response
  res.send(204);
});

// Delete a product by its product id
server.del('/products/:id', function (req, res, next) {
  // Find the index of the product to delete
  const productId = parseInt(req.params.id, 10);
  const index = products.findIndex(p => p.productId === productId);

  if (index !== -1) {
    // Remove the product from the in-memory data store
    products.splice(index, 1);

    // Send a 204 No Content response
    res.send(204);
  } else {
    // Send a 404 header if the product doesn't exist
    res.send(404);
  }
});
