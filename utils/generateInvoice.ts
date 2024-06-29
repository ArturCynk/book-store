import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateInvoice = (orderDetails: any, filePath: string) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    doc.pipe(fs.createWriteStream(filePath));

    // Header
    doc
        .image(path.join(__dirname, '../assets/logo.png'), 50, 45, { width: 50 })
        .fillColor('#444444')
        .fontSize(20)
        .text('Bookstore Inc.', 110, 57)
        .fontSize(10)
        .text('Bookstore Inc.', 200, 50, { align: 'right' })
        .text('123 Main Street', 200, 65, { align: 'right' })
        .text('New York, NY, 10025', 200, 80, { align: 'right' })
        .moveDown();

    // Customer Information
    doc
        .fillColor('#444444')
        .fontSize(20)
        .text('Invoice', 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text('Invoice Number:', 50, customerInformationTop)
        .font('Helvetica-Bold')
        .text(orderDetails._id, 150, customerInformationTop) // Use _id for orderId
        .font('Helvetica')
        .text('Invoice Date:', 50, customerInformationTop + 15)
        .text(formatDate(new Date()), 150, customerInformationTop + 15)
        .text('Balance Due:', 50, customerInformationTop + 30)
        .text(
            formatCurrency(orderDetails.total), // Use totalPrice instead of total
            150,
            customerInformationTop + 30
        )
        .font('Helvetica-Bold')
        .text(orderDetails.customerName, 300, customerInformationTop)
        .font('Helvetica')
        .text(orderDetails.customerEmail, 300, customerInformationTop + 15)
        .moveDown();

    generateHr(doc, 252);

    // Invoice Table
    const invoiceTableTop = 330;
    doc.font('Helvetica-Bold');
    generateTableRow(
        doc,
        invoiceTableTop,
        'Item',
        'Description',
        'Unit Cost',
        'Quantity',
        'Line Total'
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font('Helvetica');

    orderDetails.items.forEach((item: any, index: number) => {
        const position = invoiceTableTop + (index + 1) * 30;
        generateTableRow(
            doc,
            position,
            item.title,
            item.author,
            formatCurrency(item.price),
            item.quantity,
            formatCurrency(item.price * item.quantity)
        );

        generateHr(doc, position + 20);
    });

    const subtotalPosition = invoiceTableTop + (orderDetails.items.length + 1) * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        '',
        '',
        'Subtotal',
        '',
        formatCurrency(orderDetails.total) // Use totalPrice instead of total
    );

    doc.end();
};

const generateTableRow = (
    doc: any,
    y: number,
    item: string,
    description: string,
    unitCost: string,
    quantity: string,
    lineTotal: string
) => {
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(description, 150, y)
        .text(unitCost, 280, y, { width: 90, align: 'right' })
        .text(quantity, 370, y, { width: 90, align: 'right' })
        .text(lineTotal, 0, y, { align: 'right' });
};

const generateHr = (doc: any, y: number) => {
    doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
};

const formatCurrency = (amount: number) => {
    return amount + ' PLN';
};

const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + '/' + month + '/' + day;
};
