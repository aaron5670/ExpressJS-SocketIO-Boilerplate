/**
 * Web server port
 */
const SERVER_PORT = 3005;

/**
 * Session settings
 */
const SESSION_SECRET = 'Z>lFs46=B)$u(742x5(iEH6k&m';

/**
 * MongoDB configuration settings
 *
 * Note:
 *  - If you use cloud service like mongodb.com/cloud, you need to change to CONNECTION_TYPE to 'mongodb+srv'!
 *  - DB_QUERY_PARAMS is optional, but if you use cloud service like mongodb.com/cloud,
 *    then the following query params is recommend: '?retryWrites=true&w=majority'
 */
const CONNECTION_TYPE = "mongodb";
const DB_USERNAME = "";
const DB_PASSWORD = "";
const DB_HOST = "localhost";
const DB_PORT = "27017";
const DB_NAME = "express-boilerplate";
const DB_QUERY_PARAMS = "";

/**
 * SSL / HTTPS settings
 * ------------------------
 * if HTTPS is true, the PRIVATE_KEY_PATH, CERTIFICATE_PATH and CA_PATH MUST be correctly located.
 *
 * PRIVATE_KEY_PATH is the path where the privkey.pem file is located
 * CERTIFICATE_PATH is the path where the cert.pem file is located
 * CA_PATH is the path where the chain.pem file is located
 */
const HTTPS_ENABLED = false;
const PRIVATE_KEY_PATH = '/opt/psa/var/modules/letsencrypt/etc/live/YOUR-DOMAIN-NAME.com/privkey.pem';
const CERTIFICATE_PATH = '/opt/psa/var/modules/letsencrypt/etc/live/YOUR-DOMAIN-NAME.com/cert.pem';
const CA_PATH = '/opt/psa/var/modules/letsencrypt/etc/live/YOUR-DOMAIN-NAME.com/chain.pem';

/**
 * Swagger UI settings
 * ------------------------
 * Swagger UI is a collection of HTML, Javascript, and CSS assets
 * that dynamically generate beautiful documentation from a Swagger-compliant API.
 *
 * You can visit the Swagger API documentation on /api-docs
 * Example: http://localhost:3005/api-docs/
 */
const SWAGGER_SETTINGS = {
    enableSwaggerUI: true,
    swaggerDefinition: {
        info: {
            title: 'Express.js & Socket.io server',
            description: 'Express.js endpoint API documentation.',
            version: '1.0.0',
        },
        basePath: '/',
        produces: [
            "application/json"
        ],
        schemes: ['http', 'https'],
    },
    basedir: __dirname, //app absolute path
    files: ['./routes/**/*.js'] //Path to the API handle folder
};

module.exports = {
    SERVER_PORT,
    SESSION_SECRET,
    CONNECTION_TYPE,
    DB_USERNAME,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_QUERY_PARAMS,
    HTTPS_ENABLED,
    PRIVATE_KEY_PATH,
    CERTIFICATE_PATH,
    CA_PATH,
    SWAGGER_SETTINGS
};
