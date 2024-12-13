import { createTransport } from 'nodemailer';
import 'dotenv/config';

// Configure the transporter using your email provider details
export const emailHelper = createTransport({
  service: 'gmail', // You can use other services like Yahoo, Outlook, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password 
  },
});

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body content (plain text)
 * @param {string} html - HTML content for the email body (optional)
 * @returns {Promise} - Resolves when email is sent, rejects on error
 */
export const sendEmail = async (to, subject, text, html = '') => {
  // Ensure the required fields are provided
  if (!to || !subject || !text) {
    throw new Error('To, subject, and text are required to send an email');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email address
    to: to, // Recipient's email address
    subject: subject, // Subject of the email
    text: text, // Plain text body content
    html: html, // HTML body content (optional)
  };

  try {
    const info = await emailHelper.sendMail(mailOptions); // Use emailHelper here
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email sending failed');
  }
};

