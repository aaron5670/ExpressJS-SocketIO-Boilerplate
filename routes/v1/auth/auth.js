const express = require("express");
const authRouter = express.Router();

/* GET home page. */
authRouter.get("/", async function (req, res, next) {
    res.json({
        'success': true,
        'message': 'Express.JS & Socket.IO test API route'
    });
});

module.exports = authRouter;
