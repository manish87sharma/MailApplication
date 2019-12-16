
const express = require('express');
const { validateInputs, parseInputData } = require("./utils/util");
const config = require('config');
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const mailService = require('./src/mail-service/mailService');
const mailServiceInstance = new mailService();

process.on('unhandledRejection', (err) => {
    console.error("error", err);
    process.exit(1);
});

app.use(morgan(config.get("logger.format")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw({ type: 'application/json' }));

app.post('/sendMail', [validateInputs, parseInputData], async function (req, res) {

    let result = await mailServiceInstance.execute(req.parseData);
    if (result instanceof Error) {
        res.status(result.status || 500).json({ error: result.name, message: result.message, status: result.status });
    } else {
        res.writeHead(200, { 'content-type': 'text/plain' });
        res.write(result);
        res.end();
    }
});
app.use(function (req, res, next) {
    return res.status(404).send({ message: 'Route' + req.url + ' Not found.' });
});

app.use(function (err, req, res, next) {
    /* We log the error internally */
    //  console.error(err);
    res.status(err.status || 500).json({ error: err.name, message: err.message, status: err.status });
});
app.listen(3000, function () {
    console.log("Started on PORT 3000");
});



// const { check, validationResult } = require('express-validator');
// function validate(req, res, next) {
//     const { toMail, fromMail, subject, textMail, bccList, ccList } = req.body;
//     const commaToArray = (value = '') => value.split(',')
//     validator.check(toMail)
//         .exists({ checkFalsy: true, checkNull: true })
//         .withMessage("Must not be empty");

//     check(toMail).isEmail();
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(422).json({ errors: errors.array() });
//     }
//     next();
// }

module.exports = app;