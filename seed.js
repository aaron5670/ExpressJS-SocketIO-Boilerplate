const mongoose = require('mongoose');
const srvConfig = require('./config');
const db = mongoose.connection;
const {CONNECTION_TYPE, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_PORT, DB_NAME, DB_QUERY_PARAMS} = srvConfig;
const dbAuthString = (DB_USERNAME && DB_PASSWORD) ? `${srvConfig.DB_USERNAME}:${srvConfig.DB_PASSWORD}@` : '';
require('./database/model/users');
const Users = mongoose.model('Users');

mongoose.connect(`${CONNECTION_TYPE}://${dbAuthString}${DB_HOST}:${DB_PORT}/${DB_NAME}${DB_QUERY_PARAMS}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    return seedUsers();
}).catch(err => {
    console.log(err);
}).then(() => {
    console.log('Database successfully seeded!')
    db.close();
});

async function seedUsers() {
    await Users.deleteMany();
    await Users.insertMany([
        {
            "name": "John Doe",
            "username": "john",
            "password": "$2a$10$KPtehsbArEr3XlIbNOOHOu7/N4s6ha31ZZ2jDngQ.jvFToDs5mNdO" //password123
        },
        {
            "name": "Jane Roe",
            "username": "jane",
            "password": "$2a$10$M8R.EalzDPC.ZNz4K.SqMO87KQp0Paq3Qv9xyTG6LHJobNyViWFHi" //securepassword1
        },
    ])
}
