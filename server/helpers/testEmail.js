import nodemailer from 'nodemailer';
import { createTransport, createTestAccount } from 'nodemailer';

import 'dotenv/config';

// Configure the transporter using the Ethereal test account
export const emailHelper = async () => {
  const testAccount = await createTestAccount();
    console.log(testAccount)
  // Return a transporter configured with the test account details
  return createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure, // True for 465, false for other ports
    auth: {
      user: testAccount.user, // Test account user
      pass: testAccount.pass, // Test account pass
    },
  });
};

/**
 * Send an email using the Ethereal transporter
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body content (plain text)
 * @param {string} html - HTML content for the email body (optional)
 * @returns {Promise} - Resolves when email is sent, rejects on error
 */
export const sendTestEmail = async (to, subject, text, html = '') => {
  // Ensure the required fields are provided
  if (!to || !subject || !text) {
    throw new Error('To, subject, and text are required to send an email');
  }

  try {
    // Get the Ethereal email transport
    const transporter = await emailHelper();

    const mailOptions = {
      from: process.env.EMAIL_USER || 'sender@example.com', // Use any email as sender
      to: to, // Recipient's email address
      subject: subject, // Subject of the email
      text: text, // Plain text body content
      html: html, // HTML body content (optional)
    };

    const info = await transporter.sendMail(mailOptions); // Send the email using the Ethereal transporter
    console.log('Email sent:', info.response);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info)); // URL to preview the email in Ethereal inbox
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email sending failed');
  }
};
