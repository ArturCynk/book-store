const getPasswordResetEmailTemplate = (resetLink: string): string => {
    const template = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          /* Reset CSS */
          body,
          html {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
          }
  
          /* Container styles */
          .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
  
          /* Header styles */
          .header {
              text-align: center;
              padding: 10px 0;
          }
  
          .header h1 {
              color: #007bff;
              margin: 0;
          }
  
          /* Content styles */
          .content {
              margin-top: 20px;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
  
          .content p {
              font-size: 16px;
              line-height: 1.6;
              color: #333333;
              margin-bottom: 15px;
          }
  
          .button-container {
              text-align: center;
              margin-top: 30px;
          }
  
          .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #007bff;
              color: white !important;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
              transition: background-color 0.3s ease;
          }
  
          .button:hover {
              background-color: #0056b3;
          }
  
          /* Footer styles */
          .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #888888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset</h1>
          </div>
          <div class="content">
            <p>Dear User,</p>
            <p>We received a request to reset your password. To proceed with resetting your password, please click the button below:</p>
            <div class="button-container">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            <p>If you did not request a password reset, you can ignore this message.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Service. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  
    return template;
  };
  
  export default getPasswordResetEmailTemplate;
  