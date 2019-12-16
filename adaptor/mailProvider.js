
const http = require('request');
class MailProvider {

    constructor() {
        this.apiKey = '';
        //Default headers
        this.defaultHeaders = {

        };
        //Empty default request
        this.defaultRequest = {
            //json: true,
            url: '',
            method: 'POST',
            rejectUnauthorized: false,
            headers: {},
        };
    }
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }
    setUrl(url) {
        this.defaultRequest.url = url;
    }

    /** * Set default header */
    setDefaultHeader(key, value) {
        this.defaultHeaders[key] = value;
        return this;
    }

    /**     * Set default request     */
    setDefaultRequest(key, value) {
        this.defaultRequest[key] = value;
        return this;
    }

    createHeaders(data) {

        //Merge data with default headers
        const headers = { ...this.defaultHeaders, ...data };
        //Return
        return headers;
    }

    createRequest(data) {

        //Keep URL parameter consistent
        if (data.uri) {
            data.url = data.uri;
            delete data.uri;
        }

        //Merge data with empty request
        const request = { ...this.defaultRequest, ...data };

        //Add headers
        request.headers = this.createHeaders(request.headers);
        return request;
    }

    request(data) {
        const request = this.createRequest(data);
        return new Promise((resolve, reject) => {
            http(request, (error, response, body) => {

                //Request error
                if (error) {
                   return reject(error) ;
                }
    
                //Response error
                if (response.statusCode >= 400) {
                   return reject (response);
                }
                //Successful response
                return resolve(response);
            });
        });
        
    }
   
    SendMail(data, cb) {
        return this.request(data, cb);
    }
    Validate(data) {
        //todo
    }
    parse(data) {
        //todo
    }
    handleResponse() {
        //todo 
        //handle response
    }
    handleAttachmentObject() {
        //todo
        //handle any attachment
    }
    handleMimeObject() {
        //todo
        // handle any mime Object
    }
    SendMimeMail() {
        //todo
        // send Mime Object
    }
    getBounces() {
        //todo
        //get bounces
    }
    getMailingList() {
        //todo
        // get list of mailing address
    }
    getStats() {
        //todo
        //Get statics of smtp server
    }
}

//Export singleton instance
module.exports = MailProvider;
