const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');
const products = require('./product-model.js');

// set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// set up routes
app.use('/', indexRouter);

// start server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

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
