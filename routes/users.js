var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var expressValidator = require("express-validator");
router.use(expressValidator());

router.get('/register', function(req, res){
    res.render('register');
});
router.post('/register', function(req, res){
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    
    // validation: 
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is reqired').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if(errors){
        res.render('register', {
            errors: errors
        });
    } else {
        var newUser = new User({
            username,
            email,
            password
        });
        User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log("user form createUser f-n", user);
        });
        req.flash('success_msg', "You are registred and can login now");
        res.redirect('/users/login');
    }
})

router.get('/login', function(req, res){
    res.render('login')
});

app.post("/login", 
    passport.authenticate("local", {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }), 
    function(req, res) {
        res.redirect('/');
});

module.exports = router;