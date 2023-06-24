import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1.)  Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    //https://mailtrap.io/home
  });

  // 2.) Define the mail options
  const mailOptions = {
    from: 'Max Muster <maxmuster@muster.io>',
    to: options.email, // function "options" by sendEmail = options => {}
    subject: options.subject,
    text: options.message,
  };

  // 3.) Actually send the email
  await transporter.sendMail(mailOptions); // return a promise
};

export default sendEmail;
