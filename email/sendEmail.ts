import sgMail from '@sendgrid/mail';
import getActivationEmailTemplate from '../templates/activationEmail'

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