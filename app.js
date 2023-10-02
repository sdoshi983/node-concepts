const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');     // telling express which templating engine to use "whenever we try to use it"
app.set('views', 'views');      // telling the express where are all the views file located. Default value is projectSource/views

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));      // to parse the data in the incoming request
app.use(express.static(path.join(__dirname, 'public')));    // make the public folder available statically anywhere in the code, for read-only. Other folders are not accessible
/*
__dirname gives the location of the root project folder.
join method concats the arguments in a single string.
*/

// Below we are registering a middleware for all the incoming request. Note that it is called at the top (before all the middlewares) so we will be having the user data before any incoming requests gets hit/fulfilled
app.use((req, res, next) => {
    User.findById("64fd6666c6000de5dbed76fb")
        .then(user => {
            // we are storing user object in the request object. As, by default req object doesn't have any such key as user. Hence it is like we are creating a new key and assign the user obejct to that key. 
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
})
app.use('/admin', adminRoutes);     // filtering the admin routes. If a request has /admin in the beginnning, then only it will further go to the admin routes
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404Page);

mongoose.connect('mongodb+srv://sd:sdoshi983@cluster0.0nb30.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        console.log('connected');
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'SD', email: 'shrey@gmail.com', cart: {
                        items: []
                    }
                });
                user.save();
            }
        })

        app.listen(3000);
    })
    .catch(err => console.log(err))