const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const MONGODB_URI = 'mongodb+srv://sd:sdoshi983@cluster0.0nb30.mongodb.net/shop';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})
const csrfProtection = csrf();

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
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
}))
app.use(csrfProtection);    // this middleware is registered to add csrf token protection against CSRF attack
app.use(flash());

// Below we are registering a middleware for all the incoming request. Note that it is called at the top (before all the middlewares) so we will be having the user data before any incoming requests gets hit/fulfilled
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            // we are storing user object in the request object. As, by default req object doesn't have any such key as user. Hence it is like we are creating a new key and assign the user obejct to that key. 
            req.user = user;
            next();
        })
        .catch(err => {
            throw new Error(err);
        });
})

app.use((req, res, next) => {       // this middleware is registered to set locals, which is passed to all the views that are rendered so we don't have to pass it manually in all the routes
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes);     // filtering the admin routes. If a request has /admin in the beginnning, then only it will further go to the admin routes
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500Page );

app.use(errorController.get404Page);

mongoose.connect(MONGODB_URI)
    .then(result => {
        console.log('connected');
        app.listen(3000);
    })
    .catch(err => console.log(err))