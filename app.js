const fetch = require('node-fetch');
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const products = require('./product.js');
const recipes = require('./recipes.js');

const newstones = [];
for (const productID in products) {
  const stone = products[productID];
  newstones.push(stone);
}
/**
 * Login
 */
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cors = require('cors')
app.use(cors()) //Login Ende

app.use(express.json())

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

let currenShoppingCart = []
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
  let totalPrice = 0.00
  if(currenShoppingCart){
    currenShoppingCart.forEach(price => { totalPrice+=price })
  }else{
    totalPrice = 0.01
  }

  get_access_token()
      .then(access_token => {
          let order_data_json = {
              'intent': req.body.intent.toUpperCase(),
              'purchase_units': [{
                  'amount': {
                      'currency_code': 'EUR',
                      'value': ((totalPrice > 0 ) ? totalPrice.toString() : '0.01')
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

/**
 * Login
 */
const customers = []

app.post('/register', async (req, res) => {
    const alreadyExists = customers.find(user => user.username === req.body.username)
    if(alreadyExists != null){
        return res.status(400).send('User already exists')
    }
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const newCustomer = { username: req.body.username, password: hashedPassword, shoppingcart: []}
      customers.push(newCustomer)
      res.status(201).send('Registration was successful')
    } catch {
      res.status(500).send()
    }
})

app.post('/login', async (req, res) => {
    //Authenticate User
    const userToAuth = customers.find(user => user.username === req.body.username)
    if(userToAuth == null){
        res.status(201).send('Benutzername oder Passwort falsch')
    }else{
    
      if(await bcrypt.compare(req.body.password, userToAuth.password)) {
          const username = req.body.username
          const user = {name : username}
    
          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
          //customers.filter(c => c.username === userToAuth.username)[0].shoppingcart[0].forEach(item => currenShoppingCart.push(item.price))
          res.cookie('jwt', accessToken)
          res.send('Logged in successfully')
      } else {
          res.status(201).send('Benutzername oder Passwort falsch')
      }  
    
    }
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401).send("Please log in")

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}
//Login Ende
//Cart

app.get("/shoppingcart", authenticateToken, (req, res) => {
  let shoppingcartIds = customers.filter(user => user.username === req.user.name)[0].shoppingcart

  //console.log(shoppingcartIds) //[ '2345678', '4567890', '5678901' ]
  let shoppingcart = []
  console.log(shoppingcartIds.length)
  shoppingcartIds.forEach(stone => {
    let product = products[parseInt(stone)]
    shoppingcart.push(product)
  })

  if(shoppingcart.length == 0){
    return res.status(201).send("Wow, so empty!")
  }
  res.json(shoppingcart)
});

app.put("/addProductToShoppingcart", authenticateToken, function(req, res) {
  let itemToAdd = req.body.item

  if(!customers.filter(c => c.username === req.user.name)[0].shoppingcart.includes(itemToAdd)){
    customers.filter(c => c.username === req.user.name)[0].shoppingcart.push(itemToAdd)
    currenShoppingCart.push(products[`${itemToAdd}`].price)
    res.status(200).send("Product added to shoppingcart")
  }else{
    //Wenn mehr Stück eingekauft werden von einem Produkt
  }
});

app.delete("/removeProductFromShoppingcart", authenticateToken, function(req, res) {
    let itemToRemove = req.body.item;
    
    if(customers.filter(c => c.username === req.user.name)[0].shoppingcart.includes(itemToRemove)){
      let itemIndex = customers.filter(c => c.username === req.user.name)[0].shoppingcart.indexOf(itemToRemove)
      customers.filter(c => c.username === req.user.name)[0].shoppingcart.splice(itemIndex,1)
      //
      res.status(200).send("Product removed from shoppingcart")
    }else{
      res.sendStatus(400).send("This product does not exist")
    }
});


app.get("/totalPrice/:jwt", (req, res) => {

  let totalPrice = 0.00

  /*let username = customers.filter(c => c.username === req.user.name)[0].username
  let password = customers.filter(c => c.username === req.user.name)[0].password

  const user = {name : username}*/
  const token = req.params.jwt

  fetch('http://localhost:3000/shoppingcart', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
  })
  .then(response => {
      if (response.status === 201) {
        console.log(res.statusMessage);
      }else {
        return response.json();
      }
  })
  .then(data => {
      data.forEach(item => totalPrice += item.price)
      res.json(totalPrice)
  })
  .catch(error => {
      console.error('Error:', error);
  });

});

//Cart Ende

//Product Endpoints


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})