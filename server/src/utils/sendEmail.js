const nodemailer = require("nodemailer");

exports.sendEmail = (emailAddress, emailData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.TRANSPORTER_EMAIL,
      pass: process.env.TRANSPORTER_PASSWORD,
    },
  });

  transporter.verify((error, success) => {
    if (error) console.log(error);
    else console.log("Server ready to send emails");
  });

  const mailOptions = {
    from: `"✈ Flights" <${process.env.TRANSPORTER_EMAIL}>`,
    to: emailAddress,
    subject: emailData.subject,
    html: emailData.message,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error("Error sending email:", err);
    else console.log("Email sent:", info.response);
  });
};
