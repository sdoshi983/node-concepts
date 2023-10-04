const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
    })
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false,
    })
};

exports.postLogin = (req, res, next) => {
    User.findById('64fd6666c6000de5dbed76fb')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err => {       // this method is not compulsorly needed. It is used to make sure session cookie is stored and wrote to the mongodb before any other new requests are fired
                console.log(err);
                res.redirect('/');
            });
        }).catch(err => console.log(err));

};

exports.postSignup = (req, res, next) => {

};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};

