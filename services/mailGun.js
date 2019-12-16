const MailProvider = require('../adaptor/mailProvider');
const { CustomError, InternalError } = require("../utils/customError");
const { IsJsonString } = require("../utils/util");
class MailGun extends MailProvider {
    constructor(props) {
        super();
        this.setApiKey(props.key);
        this.setUrl(props.url);
    }
    setAuthorization() {
        let token = "Basic " + Buffer.from(`api:${this.apiKey}`).toString('base64');
        this.setDefaultHeader("Authorization", token);
        this.setDefaultHeader("json", true);
        this.setDefaultHeader("Accept", "application/json");
    }

    handleResponse(response) {
        let data, message;
        if (IsJsonString(response.body)) {
            data = JSON.parse(response.body);
            message = data && data.message;
        } else {
            message = response.body;
        }
        console.log("Mailgun response", message, response.statusCode);
        if (response.statusCode == 200) {
            return "Mail sent successfully";
        }
        else if (response.statusCode == 400) {
            if (message.includes("Sandbox subdomains are for test purposes only")) {
                return new CustomError("Sandbox subdomains are for test purposes only", 400);
            } else {
                return new CustomError("Invalid input values provided", 400);
            }
        } else {
            //err.statusCode > 400) 
            return new InternalError("Some internal error, We are working on it");
        }

    }

    SendMail(inputData) {
        this.setAuthorization();
        let result;
        try {
            result = this.request({ form: inputData }).
                then((response) => {
                    return this.handleResponse(response);
                }).catch((err) => {
                    return this.handleResponse(err);
                });
        } catch (error) {
            console.error("Error", error);
            return new InternalError("Some internal error, We are working on it");
        }
        return result;
    }
}

module.exports = MailGun;