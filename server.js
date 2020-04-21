'use strict';
const express = require('express');
const http = require('http');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const srvConfig = require('./config');

const mongoose = require('mongoose');
require('./database/model/users');
const db = mongoose.connection;
const Users = mongoose.model('Users');

const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

const authenticationMiddleware = require('./middleware/authenticationMiddleware');
const bcrypt = require('bcryptjs');

//Install middlewear
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    saveUninitialized: true,
    secret: srvConfig.SESSION_SECRET,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/**
 * Include all API Routes
 */
app.use('/api', require('./routes/api'));


//ToDo: Refactor this to own route
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


app.post('/login',
    passport.authenticate('local', {
        successFlash: 'Welcome!',
        failureFlash: true,
        successRedirect: '/dashboard',
        failureRedirect: '/login',
    })
);

app.get('/login', (req, res) => {
    res.json({
        success: false,
        logout: true,
        errorMsg: req.flash('error')
    });
});

app.post('/register', async (req, res) => {

    //If usernameCheck
    let usernameCheck = req.query.usernameCheck;
    if (usernameCheck) {
        let username = req.body.username;

        if (username !== '') {
            await Users.findOne({username: username}, function (err, user) {
                if (err) {
                    return res.json({
                        success: false,
                        error: true
                    });
                }
                if (!user) {
                    return res.json({
                        success: true,
                    });
                } else {
                    return res.json({
                        success: false,
                    });
                }
            })
        }
    }

    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;

    if (name && username && password) {

        await Users.findOne({username: username}, async function (err, user) {
            if (err) {
                return res.json({
                    success: false,
                    error: true
                });
            }
            if (!user) {
                const salt = bcrypt.genSaltSync(10);
                const user = new Users({
                    name: name,
                    username: username,
                    password: bcrypt.hashSync(password, salt)
                });

                user.save(function (err, fluffy) {
                    if (err) return console.error(err);
                });
                return res.json({
                    success: true,
                });
            } else {
                return res.json({
                    success: false,
                });
            }
        });
    }
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

app.get('/dashboard', authenticationMiddleware(), (req, res) => {
    return res.json({
        success: true,
        username: req.session.passport.user.username,
        successMsg: req.flash('success')
    });
});

let httpServer;
if (srvConfig.HTTPS_ENABLED) {
    const privateKey = fs.readFileSync(srvConfig.PRIVATE_KEY_PATH, 'utf8');
    const certificate = fs.readFileSync(srvConfig.CERTIFICATE_PATH, 'utf8');
    const ca = fs.readFileSync(srvConfig.CA_PATH, 'utf8');

    // Create a HTTPS server
    httpServer = https.createServer({key: privateKey, cert: certificate, ca: ca}, app);
} else {
    // Create a HTTP server
    httpServer = http.createServer({}, app);
}

httpServer.listen(srvConfig.SERVER_PORT, () => {
    mongoose.connect(`mongodb+srv://${srvConfig.DB_USERNAME}:${srvConfig.DB_PASSWORD}@${srvConfig.DB_HOST}/${srvConfig.DB_NAME}${srvConfig.DB_QUERY_PARAMS}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, () => {
        console.log(`Server started on port ${srvConfig.SERVER_PORT}`);
    });
});

/**
 * Socket.IO section
 */
const io = require('socket.io')(httpServer);
io.on('connection', function (socket) {
    console.log('New connection');

    socket.on('disconnect', () => console.log('Connection left'))
});
