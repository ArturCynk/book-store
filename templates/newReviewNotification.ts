const getNewReviewNotificationTemplate = (bookTitle: string, reviewText: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            color: #ffffff;
            text-align: center;
            padding: 10px 0;
        }
        .content {
            padding: 20px;
            text-align: left;
        }
        .content h2 {
            color: #333333;
        }
        .content p {
            color: #666666;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #999999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Review Added</h1>
        </div>
        <div class="content">
            <h2>${bookTitle}</h2>
            <p>A new review has been added:</p>
            <blockquote>${reviewText}</blockquote>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Bookstore. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export default getNewReviewNotificationTemplate;
