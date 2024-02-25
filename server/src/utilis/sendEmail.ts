import nodemailer from "nodemailer";
import { Mail } from "../interfaces/mail";

export const sendEmail = async (message: string, email: string) => {
  const transport: nodemailer.Transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions: Mail = {
    from: "Car Market <admin@car-market.com",
    to: email,
    subject: "Reset password - Car Market",
    html: message,
  };

  await transport.sendMail(mailOptions);
};
