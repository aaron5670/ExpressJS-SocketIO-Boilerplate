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


/**
 * @typedef ReqUsernameJSON
 * @property {string} username.required - user's username - eg: john
 * @property {string} password.required - user's password - eg: password123
 */
/**
 * @typedef ResponseSuccessLoginJSON
 * @property {string} name - user's name - eg: John Doe
 * @property {string} username - user's username - eg: john
 */
/**
 * @route POST /api/v1/auth/login
 * @group Auth - Authentication routes
 * @param {ReqUsernameJSON.model} body.body.required - User's authentication info
 * @returns {ResponseSuccessLoginJSON.model} 200 - An array of name of the user and username
 * @returns {string} 401 - Username and/or password is incorrect.
 * @produces application/json
 * @consumes application/json
 */
authRouter.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) return next(err);

        if (!user) {
            return res.status(401).json({ message: 'Username and/or password is incorrect.' });
        }
        req.logIn(user, function (err) {
            if (err) return next(err);

            return res.json({
                name: req.session.passport.user.name,
                username: req.session.passport.user.username,
            });
        });
    })(req, res, next);
});


/**
 * @typedef ReqRegisterJSON
 * @property {string} name.required - user's name - eg: Janet Doe
 * @property {string} username.required - user's username - eg: janet
 * @property {string} password.required - user's password - eg: securepassword92
 */
/**
 * @typedef ResponseSuccessRegisterJSON
 * @property {boolean} success
 * @property {string} message - success message string - eg: User is successfully registered!
 */
/**
 * @route POST /api/v1/auth/register
 * @group Auth
 * @param {ReqRegisterJSON.model} body.body.required - Information about the user.
 * @returns {ResponseSuccessRegisterJSON.model} 201 - User account successfully created.
 * @returns {Object} 303 - Username already exist!
 * @returns {Object} 409 - All fields are required!
 * @produces application/json
 * @consumes application/json
 */
authRouter.post('/register', async (req, res) => {
    let {name, username, password} = req.body;

    if (!name || !username || !password) return res.status(409).json({
        success: false,
        message: 'All fields are required!'
    });

    await Users.findOne({username: username}, async function (err, user) {
        if (err) return res.json({success: false, error: true});
        if (user) return res.status(303).json({success: false, message: 'Username already exist!'});

        const salt = bcrypt.genSaltSync(10);
        const newUser = new Users({
            name: name,
            username: username,
            password: bcrypt.hashSync(password, salt)
        });

        await newUser.save(function (err) {
            if (err) return console.error(err);
        });

        return res.status(201).json({
            success: true,
            message: 'User is successfully registered!'
        });
    });
});


/**
 * @typedef ResponseUsernameAvailabilityJSON
 * @property {boolean} usernameAvailable
 */
/**
 * @route GET /api/v1/auth/username-availability
 * @group Auth
 * @param {string} username.query.required - the username you want to check for availability - example: john
 * @returns {ResponseUsernameAvailabilityJSON.model} 200 - Availability of a username
 * @produces application/json
 */
authRouter.get('/username-availability', async (req, res) => {
    let username = req.query.username;
    if (!username || username === '') return res.json({
        error: true,
        message: 'Username can\'t be empty!'
    });

    return Users.findOne({username: username}, function (err, user) {
            if (err) return res.json({
                error: true
            });

            return res.json({
                usernameAvailable: (!user),
            });
        }
    );
});

/**
 * @typedef ResponseAuthenticatedRouteJSON
 * @property {string} username - user's username - eg: janet
 * @property {string} message - message - eg: This is a authenticated route!
 */
/**
 * Dashboard endpoint only allowed for authenticated users
 * @route GET /api/v1/auth/dashboard
 * @group Auth
 * @returns {ResponseAuthenticatedRouteJSON.model} 200
 * @produces application/json
 */
authRouter.get('/dashboard', authenticationMiddleware(), (req, res) => {
    return res.json({
        username: req.session.passport.user.username,
        message: 'This is a authenticated route!'
    });
});


/**
 * @typedef ResponseSuccessLogoutJSON
 * @property {boolean} success
 */
/**
 * @route GET /api/v1/auth/logout
 * @group Auth
 * @returns {ResponseSuccessLogoutJSON.model} 200 - Logout successfully
 * @produces application/json
 */
authRouter.get('/logout', function (req, res) {
    req.logout();
    res.json({
        success: true
    });
});

module.exports = authRouter;
