const validator = require('validator');
const { PropertyRequiredError, ValidationError } = require('./customError');

function getList(value, separator = ',') {
    return (typeof value === "string" && value.split(separator)) || [];
}

function getUniqueList(value, separator = ',') {
    let arr = getList(value, separator);
    return [... new Set(arr)];
}
function deepCopy(object) {
    return JSON.parse(JSON.stringify(object)); // fast method when don't know attributes and faster than jquery deep copy.
}
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function createSendGridEmailObject(data) {
    return data.map((id) => {
        return { "email": id };
    });
}

function getSendGridFormattedData(data) {

    //adding to 
    let sg_input = {
        personalizations: [{ to: "" }],
        from: { email: "" },
        subject: "",
        content: [{ type: "text/plain", value: "" }]
    };
    if (data.to.length) {
        sg_input.personalizations[0].to = createSendGridEmailObject(data.to);
    }
    //adding cc 
    if (data.cc && data.cc.length) {
        sg_input.personalizations[0].cc = createSendGridEmailObject(data.cc);
    }
    if (data.bcc && data.bcc.length) {
        sg_input.personalizations[0].bcc = createSendGridEmailObject(data.bcc);
    }
    sg_input.from.email = data.from;
    sg_input.subject = data.subject;
    sg_input.content[0].value = data.text;
    return sg_input;
}


function validateEmailListLength(value, param, max = 10) {
    let arrEmail = getList(value);
    if (arrEmail.length > max) {
        return new ValidationError(`${param}, Max number of email allowed is ${max}`);
    }
}

function validateEmpty(value, param) {
    if (!value || validator.isEmpty(value)) {
        return new PropertyRequiredError(`${param}, Must not be empty`);
    }
}
function validateEmailID(value, param) {

    if (typeof value === "object") {
        return new ValidationError(`${param}, Invalid input type`);
    } else {
        let arrEmail = getList(value);
        for (const email of arrEmail) {
            if (!validator.isEmail(email)) {
                return new ValidationError(`${param}, Must be a valid email type`);
            }
        }
    }
}

function validateInputs(req, res, next) {
    const { toMail = "", fromMail, subject, textMail, bccList, ccList } = req.body;
    var err = validateEmpty(toMail, "toMail") ||
        validateEmailID(toMail, "toMail") ||
        validateEmailID(bccList, "bccList") ||
        validateEmailID(ccList, "ccList") ||
        validateEmailListLength(toMail, "toMail") ||
        validateEmailListLength(bccList, "bccList") ||
        validateEmailListLength(ccList, "ccList");
    if (err) {
        next(err);
    } else {
        next();
    }
}
function parseInputData(req, res, next) {
    let data = {
        "to": getUniqueList(req.body.toMail),
        "cc": getUniqueList(req.body.ccList),
        "bcc": getUniqueList(req.body.bccList),
        "from": "test@example.com",
        "subject": "Test verification email",
        "text": "Test mail",
    };
    req.parseData = data;
    next();
}


module.exports = {
    getList, deepCopy,
    validateEmpty, validateEmailID,
    validateEmailListLength, getUniqueList,
    validateInputs, parseInputData, getSendGridFormattedData,
    IsJsonString
};