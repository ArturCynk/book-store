export default function getOrderConfirmationEmailTemplate(orderDetails: any) {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; padding: 20px;">
            <h1>Order Confirmation</h1>
            <p>Thank you for your order. Below are your order details:</p>
            <h2>Order ID: ${orderDetails._id}</h2>
            <p><strong>Order Date:</strong> ${new Date(orderDetails.createdAt).toLocaleDateString()}</p>
            <h3>Order Summary:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Title</th>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Author</th>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Quantity</th>
                        <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderDetails.items.map((item: any) => `
                        <tr>
                            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${item.book.title}</td>
                            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${item.book.author}</td>
                            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${item.quantity}</td>
                            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${item.price}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <h3>Total Price: ${orderDetails.totalPrice}</h3>
            <p>If you have any questions, feel free to contact us.</p>
            <p>Thank you for shopping with us!</p>
        </div>
    `;
}
