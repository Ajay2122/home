const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "akku29168@gmail.com",
      pass: "eoxyqjdlvlbctdwd",
    },
  });

  const adoptions = {
    from: "akku29168@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(adoptions);
};

module.exports = sendEmail;
