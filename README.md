# ExpressJS-SocketIO-Boilerplate
Simple Express.JS, SocketIO Boilerplate

### Endpoints
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
