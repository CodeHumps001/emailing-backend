import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create a reusable email transporter using SMTP
export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST, // MAIL server
  port: process.env.MAIL_PORT, // 587 for TLS (recommended)
  secure: false, // "false" when using port 587
  auth: {
    user: process.env.MAIL_USER, // Email address (Brevo)
    pass: process.env.MAIL_PASS, // MAIL key
  },
});

// Verify MAIL connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("MAIL connection error:", error);
  } else {
    console.log("MAIL is ready to send emails");
  }
});
