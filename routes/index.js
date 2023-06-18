const express = require('express');
const router = express.Router();
const product = require('./product.js');

// BSP verwendung vom Router
router.get('/', (req, res) => {
    try {
      res.render('index', { 
        title: 'EatMyRocks',
        icons: ['icon1.png', 'icon2.png', 'icon3.png'],
        references: ['About Us', 'Contact', 'FAQ'],
        products: [
          { 
            title: product.products[0].name,
            description: product.products[0].description,
            image: 'product1.jpg',
            price: product.products[0].price
          },
          {
            title: product.products[1].name,
            description: product.products[1].description,
            image: 'product2.jpg',
            price: product.products[1].price
          }
        ],
        recipes: [
          {
            title: 'Recipe for ', //+ product.products[0].name,
            description: product.products[0].recipe,
            image: 'recipe1.jpg'
          },
          {
            title: 'Recipe for ',// + product.products[1].name,
            description: product.products[1].recipe,
            image: 'recipe2.jpg'
          }
        ]
      });
      //console.log(product.products[1].name);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
module.exports = router;