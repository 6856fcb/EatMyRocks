Here's a brief explanation of each directory and file:

    config/: Contains configuration files for the database and API keys for payment gateways.
        db.js: Contains code for connecting to the MySQL server.
        keys.js: Contains API keys for PayPal and Stripe.
    controllers/: Contains code for handling HTTP requests and responses.
        cart.js: Contains code for adding and removing items from the shopping cart.
        checkout.js: Contains code for handling the checkout process.
        product.js: Contains code for displaying and searching products.
        user.js: Contains code for user authentication and registration.
    models/: Contains code for interacting with the database.
        cart.js: Contains code for adding and removing items from the shopping cart in the database.
        order.js: Contains code for storing orders in the database.
        product.js: Contains code for querying products from the database.
        user.js: Contains code for user authentication and registration in the database.
    public/: Contains static assets like CSS, images, and JavaScript.
    routes/: Contains code for defining API routes and connecting them to the controllers.
        cart.js: Defines routes for adding and removing items from the shopping cart.
        checkout.js: Defines routes for handling the checkout process.
        index.js: Defines the home page route.
        product.js: Defines routes for displaying and searching products.
        user.js: Defines routes for user authentication and registration.
    views/: Contains Pug templates for rendering HTML.
        cart/: Contains templates for the shopping cart.
        checkout/: Contains templates for the checkout process.
        layouts/: Contains the main layout template that other templates extend.
        partials/: Contains reusable templates for things like the header and footer.
        product/: Contains templates for displaying and searching products.
        user/: Contains templates for user authentication and registration.
        index.pug: The home page template.
    app.js: The main Node.js application file.
    package.json: Contains dependencies and other project information.
    README.md: The project's README file.