const ServiceFactory = require('./serviceFactory');
const config = require('config');
const { InternalError } = require('../../utils/customError');

class MailService {
    constructor() {
        this.mailgun_domain = process.env.mailgun_domain || config.get("smtp.mailgun.domain");
        this.mailgun_key = process.env.mailgun_api_key || config.get("smtp.mailgun.api_key");
        this.mailgun_url = `https://api.mailgun.net/v3/${this.mailgun_domain}/messages`;
        this.sendgrid_key = process.env.sendgrid_api_key || config.get("smtp.sendgrid.api_key");
        this.sendgrid_url = "https://api.sendgrid.com/v3/mail/send";
    }
    async execute(data) {
        try {
            // let data = this.parseInput(inputData);
            let flagMailSuccess = false;
            let MailGunInstance = new ServiceFactory("MailGun", { url: this.mailgun_url, key: this.mailgun_key });
            let SendGridInstance = new ServiceFactory("SendGrid", { url: this.sendgrid_url, key: this.sendgrid_key });

            flagMailSuccess = await MailGunInstance.SendMail(data);
            if (!flagMailSuccess) {
                flagMailSuccess = await SendGridInstance.SendMail(data);
            }
            if (flagMailSuccess instanceof Error) {
                console.error("Mail Servers can not full fill the request");
                return flagMailSuccess;
            } else {
                return flagMailSuccess;
            }
        } catch (error) {
            console.error("Internal Error", error);
            return new InternalError("Some internal error, We are working on it");
        }
    }
}
module.exports = MailService;