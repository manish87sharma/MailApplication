const  MailGun=require('../../services/mailGun');
const  SendGrid=require('../../services/sendGrid');
class ServiceFactory {
    constructor(type, props) {
      if(type === "MailGun")
        return new MailGun(props);
      if(type === "SendGrid")
        return new SendGrid(props);
    }
  }; 

  module.exports=ServiceFactory;