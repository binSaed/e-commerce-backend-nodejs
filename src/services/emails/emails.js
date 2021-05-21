const ejs = require("ejs");
const path = require("path");

const emailSender = require("./email_sender");

exports.sendConfirmEmail = async ({ to, name, confirmEmailToken, code }) => {
  const hostname = ""; //req.hostname
  const subject = "Confirm your email";
  const confirmEmailLink = `${hostname}/api/auth/verifyEmail?token=${confirmEmailToken}&code=${code}`;
  const renderedFile = await ejs.renderFile(
    path.join(__dirname, "../../../", "emails/confirm_email.ejs"),
    { name, confirmEmailLink, code }
  );
  await emailSender({ to, subject, html: renderedFile });
};
exports.sendResetPassword = async ({ to, resetPasswordToken, code }) => {
  const hostname = ""; //req.hostname
  const subject = "Reset password";
  const resetPasswordLink = `${hostname}/api/auth/verifyResetPassword?token=${resetPasswordToken}&code=${code}`;
  const renderedFile = await ejs.renderFile(
    path.join(__dirname, "../../../", "emails/reset_password.ejs"),
    { resetPasswordLink, code }
  );
  await emailSender({ to, subject, html: renderedFile });
};
