const nodemailer = require("nodemailer")

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "5ab19a12807d56",
    pass: "7e7c2f57e50924"
  }
});

