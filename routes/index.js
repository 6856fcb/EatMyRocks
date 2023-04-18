const express = require('express');
const router = express.Router();


// BSP verwendung vom Router
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
            image: 'product1.jpg'
          },
          {
            title: 'Product 2',
            description: 'This is the description of product 2.',
            image: 'product2.jpg'
          }
        ],
        recipes: [
          {
            title: 'Recipe 1',
            description: 'This is the description of recipe 1.',
            image: 'recipe1.jpg'
          },
          {
            title: 'Recipe 2',
            description: 'This is the description of recipe 2.',
            image: 'recipe2.jpg'
          }
        ]
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
module.exports = router;