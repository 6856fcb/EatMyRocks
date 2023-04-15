const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');

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

