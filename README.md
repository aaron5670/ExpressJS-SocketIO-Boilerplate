# 📦 Express.js & Socket.io Boilerplate
Simple Express.js & Socket.io Boilerplate.


## ✨ Features

- [x] Express 4.16
- [x] Mongoose 5.7
- [x] Passport.js with Bcrypt.js
  - Login endpoint
  - Register endpoint
  - Username availability check endpoint
  - Authenticated endpoint
  - Logout endpoint
- [x] Socket.io integration for real-time, bidirectional and event-based communication.
- [x] Generates automatically API docs based on Express existing routes with Swagger UI.
- [ ] Social login / register integration.


## 📝 Getting Started

```
git clone https://github.com/aaron5670/ExpressJS-SocketIO-Boilerplate.git

cd expressjs-socketio-boilerplate

npm install

// Optional: if you want dummy data, then run this seed file
node seed.js

node server.js
```

## ⚡ Create Socket.io connection
Install on your client-side (web) application the module [socket.io-client](https://www.npmjs.com/package/socket.io-client).
```
npm install socket.io-client
```

Then create a connection with the following code:
```javascript
// with ES6 import
import io from 'socket.io-client';
 
const socket = io('http://localhost:3005');
```

For more info you can read the official Socket.io documentation:
- [Official docs](https://socket.io/docs/)
- [Server API](https://socket.io/docs/server-api/)
- [Client API](https://socket.io/docs/client-api/)

## 📓 How to document the Swagger UI endpoint API
```javascript
/**
 * @typedef ResponseJSON
 * @property {string} username - user's username - eg: janet
 * @property {string} message - message - eg: This is a authenticated route!
 */
/**
 * Dashboard endpoint only allowed for authenticated users
 * @route GET /api/v1/auth/dashboard
 * @group Auth
 * @returns {ResponseJSON.model} 200
 * @produces application/json
 */
router.get('/dashboard', authenticationMiddleware(), (req, res) => {
    return res.json({
        username: req.session.passport.user.username,
        message: 'This is a authenticated route!'
    });
});
```
If you are running this boilerplate on you localhost you can see the Swagger UI documentation on: http://localhost:3005/api-docs/.

**Note:** *Check if your port number is the same as your [configuration](https://github.com/aaron5670/ExpressJS-SocketIO-Boilerplate/blob/master/config.js)*.

### 📌 Swagger UI example
<img src="https://github.com/aaron5670/ExpressJS-SocketIO-Boilerplate/blob/master/swaggerExample.jpg?raw=true" alt="Swagger UI Docs" width="500"/>

## 🚀 Endpoints
The following endpoints are available

#### Login

```
url:    /api/v1/auth/login
method: POST
```

This request expects the following body:

```json
{
  "username": "jane", 
  "password": "securepassword1"
}
```

It will response the client the following object after a successful login:

```json
{
  "success": true,
  "username": "jane",
  "message": "Successful login, welcome!"
}
```

#### Register

```
url:    /api/v1/auth/register
method: POST
```

This request expects the following body:

```json
{
  "name": "John Doe",
  "username": "john",
  "password": "password123"
}
```

It will response the client the following object after a successful register:

```json
{
  "success": true,
  "message": "User is successfully registered!"
}
```

#### Username availability check

```
url:             /api/v1/auth/username-availability
method:          GET
query parameter: username
```

This request expects a request like:

```
https://localhost:3005/api/v1/auth/username-availability?username=john
```

It will response the client the following object after a successful request:

```json
{
  "usernameAlreadyInUsage": true
}
```

#### Logout

```
url:    /api/v1/auth/logout
method: GET
```

It will response the client the following object after a successful request:

```json
{
  "success": true
}
```
