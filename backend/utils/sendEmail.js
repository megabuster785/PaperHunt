const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, message }) => {
  // Create transporter with Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,       // your gmail address
      pass: process.env.EMAIL_APP_PASS,   // app password or your gmail password (if less secure apps enabled)
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent to:', email);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
