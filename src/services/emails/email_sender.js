const nodemailer = require("nodemailer");

module.exports = ({ to, subject, html }) => {
  return new Promise(async (resolutionFunc, rejectionFunc) => {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `Tkamul SA <${process.env.EMAIL}>`,
      to,
      sender: "Tkamul SA",
      subject,
      html,
    };

    transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        rejectionFunc(err);
      }
      resolutionFunc(info);
    });
  });
};
