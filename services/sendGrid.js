const MailProvider = require('../adaptor/mailProvider');
var { getSendGridFormattedData,IsJsonString } = require('../utils/util');
const { CustomError, InternalError } = require("../utils/customError");

class SendGrid extends MailProvider {
    constructor(props) {
        super();
        this.setApiKey(props.key);
        this.setUrl(props.url);
    }
    setAuthorization() {
        let token = "Bearer " + this.apiKey;
        this.setDefaultHeader("Authorization", token);
        this.setDefaultHeader("Content-Type", 'application/json');
    }

    handleResponse(response) {
        let data, message;
        if (IsJsonString(response.body)) {
            data = JSON.parse(response.body);
            message = data && data.errors && data.errors[0].message;
        } else {
            message = response.body;
        }
        console.log("Sendgrid response", message, response.statusCode);
        if (response.statusCode == 200) {
            return "Mail sent successfully";
        }
        else if (response.statusCode == 400) {
            return new CustomError("Invalid input values provided", 400);
        } else {
            //err.statusCode > 400) 
            return new InternalError("Some internal error, We are working on it");
        }
    }

    SendMail(inputData) {
        this.setAuthorization();
        let data = getSendGridFormattedData(inputData);
        let result;
        try {
            result = this.request({ body: JSON.stringify(data) }).
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
module.exports = SendGrid;