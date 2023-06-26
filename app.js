const fetch = require('node-fetch');
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const products = require('./product.js');
const recipes = require('./recipes.js');

// parse incoming requests
app.use(bodyParser.json());

// serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use(express.static(path.join(__dirname, 'public', 'html')));

// Add a GET /applications endpoint
app.get('/applications', (req, res) => {
  const applications = [];

  for (const productID in products) {
    const stone = products[productID];
    for (const application of stone.applications) {
      if (!applications.includes(application)) {
        applications.push(application);
      }
    }
  }

  applications.sort();
  res.send(applications);
});

app.get('/stones', function (req, res) {
  let stones = Object.values(products);
  let application = req.query.application;
  if (application) {
    let filteredStones = [];
    for (let i = 0; i < stones.length; i++) {
      if (stones[i].applications.includes(application)) {
        filteredStones.push(stones[i]);
      }
    }
    stones = filteredStones;
  }
  res.send(stones);
});

app.get('/recipes', function (req, res){
  const recipeJSON = Object.values(recipes);
  //console.log(recipeJSON);
  res.json(recipeJSON);
});

/*
app.get('/product', function (req, res) {
  const productJSON = Object.values(products);
  res.json(productJSON);
})

app.get('/pay', function (req, res){
  res.render('payment');
})

app.get('/pp', function (req, res){
  res.render('privacypolicy');
})

app.get('/tc', function (req, res){
  res.render('termsconditions');
})

app.get('/cu', function (req, res){
  res.render('contactus');
})

app.get('/payment', function(req, res) {
  const filePath = path.join(__dirname, 'public', 'html', 'payment.html');
  res.sendFile(filePath);
});


*/

//-------------------------------------


//const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
const port = process.env.PORT || 3000;
const environment = process.env.ENVIRONMENT || 'sandbox';
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const endpoint_url = environment === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

/**
 * Creates an order and returns it as a JSON response.
 * @function
 * @name createOrder
 * @memberof module:routes
 * @param {object} req - The HTTP request object.
 * @param {object} req.body - The request body containing the order information.
 * @param {string} req.body.intent - The intent of the order.
 * @param {object} res - The HTTP response object.
 * @returns {object} The created order as a JSON response.
 * @throws {Error} If there is an error creating the order.
 */
app.post('/create_order', (req, res) => {
    get_access_token()
        .then(access_token => {
            let order_data_json = {
                'intent': req.body.intent.toUpperCase(),
                'purchase_units': [{
                    'amount': {
                        'currency_code': 'EUR',
                        'value': '100.00'
                    }
                }]
            };
            const data = JSON.stringify(order_data_json)

            fetch(endpoint_url + '/v2/checkout/orders', { //https://developer.paypal.com/docs/api/orders/v2/#orders_create
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    },
                    body: data
                })
                .then(res => res.json())
                .then(json => {
                    res.send(json);
                }) //Send minimal data to client
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err)
        })
});

/**
 * Completes an order and returns it as a JSON response.
 * @function
 * @name completeOrder
 * @memberof module:routes
 * @param {object} req - The HTTP request object.
 * @param {object} req.body - The request body containing the order ID and intent.
 * @param {string} req.body.order_id - The ID of the order to complete.
 * @param {string} req.body.intent - The intent of the order.
 * @param {object} res - The HTTP response object.
 * @returns {object} The completed order as a JSON response.
 * @throws {Error} If there is an error completing the order.
 */
app.post('/complete_order', (req, res) => {
    get_access_token()
        .then(access_token => {
            fetch(endpoint_url + '/v2/checkout/orders/' + req.body.order_id + '/' + req.body.intent, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    }
                })
                .then(res => res.json())
                .then(json => {
                    console.log(json);
                    res.send(json);
                }) //Send minimal data to client
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err)
        })
});

// Helper / Utility functions

//Servers the index.html file
app.get('/payment', (req, res) => {
    res.sendFile(process.cwd() + '/payment.html');
});
//Servers the style.css file
app.get('/style.css', (req, res) => {
    res.sendFile(process.cwd() + '/style.css');
});
//Servers the script.js file
app.get('/paypal/paypalscript.js', (req, res) => {
    res.sendFile(process.cwd() + '/paypal/paypalscript.js');
});

//PayPal Developer YouTube Video:
//How to Retrieve an API Access Token (Node.js)
//https://www.youtube.com/watch?v=HOkkbGSxmp4
function get_access_token() {
    const auth = `${client_id}:${client_secret}`
    const data = 'grant_type=client_credentials'
    return fetch(endpoint_url + '/v1/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(auth).toString('base64')}`
            },
            body: data
        })
        .then(res => res.json())
        .then(json => {
            return json.access_token;
        })
}

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})