const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');     // telling express which templating engine to use "whenever we try to use it"
app.set('views', 'views');      // telling the express where are all the views file located. Default value is projectSource/views

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

app.use(bodyParser.urlencoded({ extended: false }));      // to parse the data in the incoming request
app.use(express.static(path.join(__dirname, 'public')));    // make the public folder available statically anywhere in the code, for read-only. Other folders are not accessible
/*
__dirname gives the location of the root project folder.
join method concats the arguments in a single string.
*/

// Below we are registering a middleware for all the incoming request. Note that it is called at the top (before all the middlewares) so we will be having the user data before any incoming requests gets hit/fulfilled
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            // we are storing user object in the request object. As, by default req object doesn't have any such key as user. Hence it is like we are creating a new key and assign the user obejct to that key. 
            req.user = user;     // NOTE: the user object we are assigning is not the javascript object, it is the sequelize object. Hence it will also have all the sequlize methods like destroy and all
            next();
        })
        .catch(err => console.log(err));
})
app.use('/admin', adminRoutes);     // filtering the admin routes. If a request has /admin in the beginnning, then only it will further go to the admin routes
app.use(shopRoutes);

app.use(errorController.get404Page);

// defining sequlize associations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});

sequelize.sync().then(result => {
    return User.findByPk(1);
}).then(user => {
    if (!user) {
        return User.create({ name: 'Max', email: 'test@test.com' })
    }
    return user;
}).then(user => {
    return user.createCart();
}).then(cart => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});
