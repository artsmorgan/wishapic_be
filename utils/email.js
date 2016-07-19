var nodemailer = require('nodemailer');
var config  = require('../config/config').main();
var env  = require('../config/config').env();
// create reusable transporter object using the default SMTP transport

var transporter = nodemailer.createTransport({
    service: config.email.service,
    auth: {
        user: config.email.user,
        pass: config.email.password
    }
});



exports.sendActivationLink = function(email, hash){
	// send mail with defined transport object
	
	var mailOptions = {
	    from: 'Pierre from wishapic✔ <amorgan115@gmail.com.com>', // sender address
	    to: email, // list of receivers
	    subject: 'Activation Link',
	    html: 'Please activate your account: <a href="'+env.current+'api/activate?activate='+hash+'">Activate it Now</a>'
	};
	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){	        
	        return console.log(error);
	    }
	    // console.log('Message sent: ' + info.response);
	    console.log('Message sent: ' + info.response);
	});
	
}