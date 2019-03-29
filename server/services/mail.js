const nodemailer = require('nodemailer');

class MailService {
    constructor(config) {
        this.config = config;

        let smtpConfig = {
            host: this.config.smtp.host,
            port: this.config.smtp.port,
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: this.config.smtp.username,
                pass: this.config.smtp.password
            }
        };
        this.transporter = nodemailer.createTransport(smtpConfig);
    }

    sendMail(mailOptions) {
        // setup email data with unicode symbols
        // let mailOptions = {
        //     from: '"Fred Foo 👻" <no-reply@xkoji.com.ng>', // sender address
        //     to: 'samuelimolo4real@gmail.com', // list of receivers
        //     subject: 'Hello ✔', // Subject line
        //     text: 'Hello world?', // plain text body
        //     html: '<b>Hello world?</b>' // html body
        // };

        // send mail with defined transport object
        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });
    }

    sendCollageMail(userData, entryId) {
        const galleryImageLink = `${this.config.site_url}gallery/${entryId}`;
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"ACDF folks" <no-reply@xkoji.com.ng>', // sender address
            to: userData.email || 'samuelimolo4real@gmail.com', // list of receivers
            subject: `Here's your awesome ACDF collage! Just for you.`, // Subject line
            text: `Howdy ${userData.name}. Thanks for creating a collage. Here's a link: ${galleryImageLink}`, // plain text body
            html: `
                <b>Howdy ${userData.name},</b>
                <p>Thanks for creating a collage. Here's a link to the collage: <a href="${galleryImageLink}">${galleryImageLink}</a></p>
            ` // html body
        };
        return this.sendMail(mailOptions);
    }
}

module.exports = MailService;
