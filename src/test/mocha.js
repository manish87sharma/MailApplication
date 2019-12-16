process.env.NODE_ENV = 'Development';
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
let should = chai.should();
var expect = chai.expect;
chai.use(chaiHttp);

describe('Api testing ', () => {

    it('Test empty body', (done) => {
        chai.request(server)
            .post('/sendMail')
            .send().end(function (err, res) {
                expect(res.body.message).to.eql("toMail, Must not be empty");
                expect(res.body.status).to.eql(422);
                done();
            });
    })
    it('Test empty toMail', (done) => {
        chai.request(server)
            .post('/sendMail')
            .send({ "toMail": "" }).end(function (err, res) {
                // 
                expect(res.body.message).to.eql("toMail, Must not be empty");
                expect(res.body.status).to.eql(422);
                done();
            });
    })
    it('Test valid toMail', (done) => {
        chai.request(server)
            .post('/sendMail')
            .send({ "toMail": "test" }).end(function (err, res) {
                // 
                expect(res.body.message).to.eql("toMail, Must be a valid email type");
                expect(res.body.status).to.eql(422);
                done();
            });
    })
    it('Test null toMail', (done) => {
        chai.request(server)
            .post('/sendMail')
            .send({ "toMail": null }).end(function (err, res) {

                expect(res.body.message).to.eql("toMail, Must not be empty");
                expect(res.body.status).to.eql(422);
                done();
            });
    })
    it('Test invalid email id ccList', (done) => {
        chai.request(server)
            .post('/sendMail')
            .send({ "toMail": "manish.sharma87@gmail.com", ccList: "null" }).end(function (err, res) {

                expect(res.body.message).to.eql("ccList, Must be a valid email type");
                expect(res.body.status).to.eql(422);
                done();
            });
    })
    it('Test invalid email id bccList', (done) => {
        chai.request(server)
            .post('/sendMail')
            .send({ "toMail": "manish.sharma87@gmail.com", bccList: "null" }).end(function (err, res) {

                expect(res.body.message).to.eql("bccList, Must be a valid email type");
                expect(res.body.status).to.eql(422);
                done();
            });
    })
    it('Test wrong type of input bccList', (done) => {
        var list = ["a@in.co", "b@in.co", "c@in.co", "d@in.co", "e@in.co",
            "f@in.co", "g@in.co", "h@in.co", "i@in.co", "j@in.co", "k@in.co",
            "l@in.co", "m@in.co", "n@in.co", "0@in.co"];
        chai.request(server)
            .post('/sendMail')
            .send({ "toMail": "manish.sharma87@gmail.com", bccList: list }).end(function (err, res) {
                expect(res.body.message).to.eql("bccList, Invalid input type");
                expect(res.body.status).to.eql(422);
                done();
            });
    })
    it('Test max email id bccList', (done) => {
        var list = "foo@bar.com,foo@bar.com,foo@bar.com,foo@bar.com,foo@bar.com,foo@bar.com,foo@bar.com,foo@bar.com,foo@bar.com,foo@bar.com,foo@bar.com";
        chai.request(server)
            .post('/sendMail')
            .send({ "toMail": "manish.sharma87@gmail.comm", bccList: list }).end(function (err, res) {
                expect(res.body.message).to.eql("bccList, Max number of email allowed is 10");
                expect(res.body.status).to.eql(422);
                done();
            });
    })
    it('Test Mail sent', (done) => {
        chai.request(server)
            .post('/sendMail')
            .send({ "toMail": "manish.sharma87@gmail.com", "bccList": "manish.sharma87@gmail.com" }).end(function (err, res) {
                expect(res.text).to.eql("Mail sent successfully");
                expect(res.status).to.eql(200);
                done();
            });
    });
});
