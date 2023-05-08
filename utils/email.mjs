import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  //option ist eine funktion
  // 1.)  Create a transporter
  const transporter = nodemailer.createTransport({
    //service: 'Gmail', // kommt von nodemailer, gibt auch yxahoo, hotmail
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Activate in Gmail-Account "less secure app" option

    // in echtt, aufpassen, sonst 100te mail zu gmail, dann wäre spamer, und nicht für so eine webapp geeignet
    //https://mailtrap.io/home
  });

  // 2.) Define the mail options
  const mailOptions = {
    from: 'Max Muster <maxmuster@muster.io>',
    to: options.email, // funktion "options" von sendEmail = options => {}
    subject: options.subject,
    text: options.message,
    //html:
  };

  // 3.) Actually send the email
  await transporter.sendMail(mailOptions); //return ein promise
};

export default sendEmail;
//module.exports = sendEmail

//-----------------------------------------------------------------------
// const nodemailer = require('nodemailer')
// const pug = require('pug')
// const htmlToText = require('html-to-text') //Instead, import { htmToText } from 'html-to-text' then rather than using html.fromString()  use htmlToText() directly.,,,,, or: In your terminal window, do the following npm uninstall html-to-text npm i html-to-text@5
//
// //new Email(user, url).sendWelcome();// wenn sign up
//
// module.exports = class Email {
//   constructor(user, url) {
//     this.to = user.email;
//     this.firstName = user.name.split(' ')[0];
//     this.url = url;
//     this.from = ` <${process.env.EMAIL_FROM}>` //'Max Muster <maxmuster@muster.io>'
//   }
//
//   newTransport() { // wenn dev, email mit mailTrap, wenn prod, email mit sendgrit
//     if (process.env.NODE_ENV === 'production') {
//       // sendGrid
//       // return nodemailer.createTransport({
//       //     service: 'SendGrid',
//       //     auth: {
//       //         user: process.env.SENDGRID_USERNAME,
//       //         pass: process.env.SENDGRID_PASSWORD,
//       //     }
//       // });
//       return nodemailer.createTransport({
//         service: 'SendinBlue',
//         auth: {
//           user: process.env.SENDINBLUE_USERNAME,
//           pass: process.env.SENDINBLUE_PASSWORD,
//         }
//       });
//     }
//
//     // mailTrap DEV
//     return nodemailer.createTransport({
//       //service: 'Gmail', // kommt von nodemailer, gibt auch yxahoo, hotmail
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       }
//       // Activate in Gmail-Account "less secure app" option
//
//       // in echtt, aufpassen, sonst 100te mail zu gmail, dann wäre spamer, und nicht für so eine webapp geeignet
//       //https://mailtrap.io/home
//     })
//   }
//
//   async send(template, subject) {
//     // Send the actual email
//
//     // 1.) Render HTML based on a pug template
//     //res.render('')
//     const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
//       firstName: this.firstName,
//       url: this.url,
//       subject: subject, // title in baseEmail
//     })
//
//
//     // 2.) Define the email options
//     const mailOptions = {
//       from: this.from, //'Max Muster <maxmuster@muster.io>',
//       to: this.to, //options.email, // funktion "options" von sendEmail = options => {}
//       subject: subject, //options.subject,     // title in baseEmail
//       html: html,
//       text: htmlToText.fromString(html) //options.message,
//     }
//
//     // 3.) Create a transport and send email
//     //this.newTransport()
//     await this.newTransport().sendMail(mailOptions); //return ein promise
//   }
//
//   async sendWelcome() {
//     await this.send('welcome', 'Welcome to the MubeaTrack Family!') // welcome = template
//   }
//
//   async sendPasswordReset() {
//     await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)') // welcome = template
//   }
// }
