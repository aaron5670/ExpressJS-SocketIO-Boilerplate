const mongoose = require('mongoose');
require('./database/model/users');
const db = mongoose.connection;
const Users = mongoose.model('Users');
const srvConfig = require('./config');

mongoose.connect(`mongodb+srv://${srvConfig.DB_USERNAME}:${srvConfig.DB_PASSWORD}@${srvConfig.DB_HOST}/${srvConfig.DB_NAME}${srvConfig.DB_QUERY_PARAMS}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    return seedUsers();
}).catch(err => {
    console.log(err);
}).then(() => {
    db.close();
});

async function seedUsers() {
    await Users.deleteMany();
    await Users.insertMany([
        {
            "name": "John Doe",
            "username": "john",
            "password": "password123"
        },
        {
            "name": "Jane Roe",
            "username": "jane",
            "password": "securePassword1"
        },
    ])
}
