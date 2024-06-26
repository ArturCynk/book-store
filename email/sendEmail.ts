import sgMail from '@sendgrid/mail';
import getActivationEmailTemplate from '../templates/activationEmail';
import getPasswordResetEmailTemplate from '../templates/resetPasswordEmail'
import getOrderConfirmationEmailTemplate from '../templates/orderConfirmationEmail'
import getNewReviewNotificationTemplate from '../templates/newReviewNotification'
// Ustawienie klucza API SendGrid
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
  const msg = {
      to: email,
      from: 'generalzn1@gmail.com',
      subject: 'Order Confirmation',
      html: getOrderConfirmationEmailTemplate(orderDetails),
  };
  try {
      await sgMail.send(msg);
  } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      throw new Error('Failed to send order confirmation email');
  }
};

