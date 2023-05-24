const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    try {
      res.render('index', { 
        title: 'EatMyRocks',
        icons: ['icon1.png', 'icon2.png', 'icon3.png'],
        references: ['About Us', 'Contact', 'FAQ'],
        products: [
          { 
            title: 'Product 1',
            description: 'This is the description of product 1.',
            image: 'images/stone2.jpg',
            price: 150
          },
          {
            title: 'Product 2',
            description: 'This is the description of product 2.',
            image: 'images/rock1.jpg',
            price: 150
          }
        ],
        recipes: [
          {
            title: 'Recipe 1',
            description: 'This is the description of recipe 1.',
            image: 'images/recipe1.jpg'
          },
          {
            title: 'Recipe 2',
            description: 'This is the description of recipe 2.',
            image: 'images/recipe2.jpg'
          }
        ]
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
module.exports = router;