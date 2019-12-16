# MailingApplication
This is a simple Express app, to send email. It is integrated with 3rd party api [MailGun](https://documentation.mailgun.com/en/latest/api_reference.html) and [Sendgrid](https://sendgrid.com/docs/API_Reference/index.html).
In case of any 3rd party service down service will fail over to other service provider.

## Prerequisites
For development and testing, you will only need [Node.js](https://nodejs.org/en/) and a node global package, npm, installed in your environnement.
    
## Common setup
Clone the repo and install the dependencies.

```bash
git clone https://github.com/manish87sharma/Mailing-Application.git
cd Mailing-Application.
```

```bash
npm install
```
## Steps to start
**Note**: Default.json file must be updated in config folder before start,or .env file must be added to root directory with keys
mailgun_domain,mailgun_api_key,sendgrid_api_key

To start the express server, run the following

```bash
npm run start
```
To execute test case, run the following
```bash
npm run test
```
Open http://localhost:3000/sendMail and take a look around.

## Endpoint Details
* Port - 3000
* EndPoint - sendmail
* Method - Post
* Input parameter sample
```javascript
   {
    "toMail": "test@example.com",
    "ccList": "test1@example.com,test2@example.com",
    "bccList: "test3@example.com"
    }
```
* toMail-  Mandatory, multiple email Id comma separated
* ccList-  Optional,  multiple email Id comma separated
* bccList- Optional,  multiple email Id comma separated
* Email Id should have valid email format 
* Max 10 email Id are allowed in field




