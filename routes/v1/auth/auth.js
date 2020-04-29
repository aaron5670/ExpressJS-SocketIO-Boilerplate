const express = require("express");
const authRouter = express.Router();
require('querystring');
const mongoose = require('mongoose');
require('./../../../database/model/users');
const db = mongoose.connection;
const Users = mongoose.model('Users');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const authenticationMiddleware = require('./../../../middleware/authenticationMiddleware');
const bcrypt = require('bcryptjs');

authRouter.use(passport.initialize());
authRouter.use(passport.session());
authRouter.use(flash());

//Passport middleware for Authentication
passport.use(new LocalStrategy(
    function (username, password, done) {
        Users.findOne({username: username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: 'username-incorrect'});
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false, {message: 'password-incorrect'});
            }
            return done(null, user);
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

authRouter.post('/login',
    passport.authenticate('local', {
        successFlash: 'Successful login, welcome!',
        failureFlash: true,
        successRedirect: 'success-url',
        failureRedirect: 'login-failed',
    })
);

authRouter.post('/register', async (req, res) => {
    let usernameCheck = req.query.usernameCheck;
    let {name, username, password} = req.body;

    /**
     * Username availability check
     * ToDo: Create a middleware for this section
     */
    if (usernameCheck) {
        if (username === '') return res.json({
            error: true,
            message: 'Username can\'t be empty!'
        });

        return Users.findOne({username: username}, function (err, user) {
                if (err) return res.json({
                    error: true
                });

                return res.json({
                    usernameAlreadyInUsage: (!!user),
                });
            }
        );
    }

    if (!name || !username || !password) return res.json({
        success: false,
        message: 'All fields are required!'
    });

    await Users.findOne({username: username}, async function (err, user) {
        if (err) return res.json({success: false, error: true});
        if (user) return res.json({success: false, message: 'Username already exist!'});

        const salt = bcrypt.genSaltSync(10);
        const newUser = new Users({
            name: name,
            username: username,
            password: bcrypt.hashSync(password, salt)
        });

        await newUser.save(function (err) {
            if (err) return console.error(err);
        });

        return res.json({
            success: true,
            message: 'User is successfully registered!'
        });
    });
});

authRouter.get('/success-url', authenticationMiddleware(), (req, res) => {
    return res.json({
        success: true,
        username: req.session.passport.user.username,
        message: req.flash('success')[0]
    });
});

authRouter.get('/login-failed', (req, res) => {
    res.json({
        success: false,
        message: req.flash('error')[0]
    });
});

authRouter.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

module.exports = authRouter;
