const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use SMTP config for custom provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendStatusUpdateEmail = async (to, status, orderId) => {
  const info = await transporter.sendMail({
    from: `"Shop Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Your Order ${orderId} is now ${status}`,
    html: `<p>Hello,</p><p>Your order <strong>${orderId}</strong> status has been updated to <strong>${status}</strong>.</p>`
  });

  console.log('Email sent:', info.messageId);
};

module.exports = sendStatusUpdateEmail;
