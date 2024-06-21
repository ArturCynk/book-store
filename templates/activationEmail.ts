const getActivationEmailTemplate = (activationLink: string): string => {
    const template = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Activate Your Account</title>
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
              color: #4CAF50;
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
              color: white;
              text-decoration: none;
          }
  
          .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #4CAF50;
              color: white !important;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
              transition: background-color 0.3s ease;
          }
  
          .button:hover {
              background-color: #45a049;
          }
            a{
                text-decoration: none;
                color: white;
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
            <h1>Welcome to Our Service!</h1>
          </div>
          <div class="content">
            <p>Dear User,</p>
            <p>Thank you for registering with our service. To complete your registration and activate your account, please click the button below:</p>
            <div class="button-container">
              <a href="${activationLink}" class="button" style="color: white;">Activate Account</a>
            </div>
            <p>If you did not register for our service, please ignore this message.</p>
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
  
  export default getActivationEmailTemplate;
  