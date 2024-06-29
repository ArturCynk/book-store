import sgMail from '@sendgrid/mail';
import getActivationEmailTemplate from '../templates/activationEmail';
import getPasswordResetEmailTemplate from '../templates/resetPasswordEmail'
import getOrderConfirmationEmailTemplate from '../templates/orderConfirmationEmail'
import getNewReviewNotificationTemplate from '../templates/newReviewNotification'
import { generateInvoice } from '../utils/generateInvoice';
import path from 'path';
import fs from 'fs';

sgMail.setApiKey('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');

// Funkcja do wysyłania emaila
export const sendActivationEmail = async (email: string, activationLink: string): Promise<void> => {
    const msg = {
      to: email,
      from: 'generalzn1@gmail.com', 
      subject: 'Aktywacja konta',
      html: getActivationEmailTemplate(activationLink),
    };
    try {
      await sgMail.send(msg);
    } catch (error) {
      throw new Error('Failed to send activation email');
    }
  };


export const sendPasswordResetEmail = async (email: string, resetLink: string) => {
    const msg = {
        to: email,
        from: 'generalzn1@gmail.com', 
        subject: 'Zmiana Hasła',
        html: getPasswordResetEmailTemplate(resetLink),
      };
      try {
        await sgMail.send(msg);
      } catch (error) {
        throw new Error('Failed to send activation email');
      }
};

export const sendNewReviewNotification = async (email: string, bookTitle: string, reviewText: string) => {
  const msg = {
      to: email,
      from: 'generalzn1@gmail.com',
      subject: 'New Review Added',
      html: getNewReviewNotificationTemplate(bookTitle, reviewText),
  };
  try {
      await sgMail.send(msg);
  } catch (error) {
      console.error('Failed to send new review notification:', error);
      throw new Error('Failed to send new review notification');
  }
};

export const sendOrderConfirmationEmail = async (email: string, orderDetails: any) => {
  const invoicePath = path.resolve(__dirname, `../invoices/invoice_${orderDetails.orderId}.pdf`);

  await generateInvoice(orderDetails, invoicePath);

  // Ensure file is written before reading it
  const waitForFile = (filePath: string, timeout = 5000) => {
      return new Promise<void>((resolve, reject) => {
          const startTime = Date.now();
          const checkFile = () => {
              if (fs.existsSync(filePath)) {
                  resolve();
              } else if (Date.now() - startTime >= timeout) {
                  reject(new Error('File did not appear within timeout period'));
              } else {
                  setTimeout(checkFile, 100);
              }
          };
          checkFile();
      });
  };

  try {
      await waitForFile(invoicePath);

      const msg = {
          to: email,
          from: 'generalzn1@gmail.com',
          subject: 'Potwierdzenie zamówienia',
          html: getOrderConfirmationEmailTemplate(orderDetails),
          attachments: [
              {
                  content: fs.readFileSync(invoicePath).toString('base64'),
                  filename: `invoice_${orderDetails.orderId}.pdf`,
                  type: 'application/pdf',
                  disposition: 'attachment',
              },
          ],
      };

      await sgMail.send(msg);
  } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      throw new Error('Failed to send order confirmation email');
  } finally {
      if (fs.existsSync(invoicePath)) {
          fs.unlinkSync(invoicePath); 
      }
  }
};