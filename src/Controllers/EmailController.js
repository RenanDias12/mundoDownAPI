import nodemailer from "nodemailer";

class EmailController {
  constructor() {}

  async sendEmail(request, response) {
    try {
      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      let message = {
        from: process.env.EMAIL_USER,
        to: request.body.to,
        subject: request.body.subject,
        text: request.body.text,
      };

      transporter.sendMail(message, function (err) {
        if (err) throw err;
      });

      return response.status(200).json({
        Message: "Email sent to " + request.body.to,
      });
    } catch (error) {
      return response.status(500).json({
        Message: error.message,
      });
    }
  }
}

export { EmailController };
