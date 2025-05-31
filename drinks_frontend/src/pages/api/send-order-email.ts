import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { emailType, orderData } = req.body;

  try {
    // Validate required fields
    if (!emailType || !orderData?.orderId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const isBusinessEmail = emailType === 'business';
    const toEmail = isBusinessEmail 
      ? process.env.BUSINESS_EMAIL 
      : orderData.customerEmail;

    if (!toEmail) {
      return res.status(400).json({ error: 'No recipient email' });
    }

    await transporter.sendMail({
      from: `Barrush Delivery <${process.env.GMAIL_EMAIL}>`,
      to: toEmail,
      subject: isBusinessEmail
        ? `📦 New Order #${orderData.orderId}`
        : `✅ Order Confirmation #${orderData.orderId}`,
      html: buildEmailTemplate(orderData, isBusinessEmail),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}

const buildEmailTemplate = (order: any, isBusinessEmail: boolean) => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px; }
      .order-item { margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #eee; }
      .total { font-weight: bold; font-size: 1.1em; margin-top: 15px; }
      .footer { margin-top: 20px; font-size: 0.9em; color: #777; }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>${isBusinessEmail ? 'NEW ORDER RECEIVED' : 'ORDER CONFIRMATION'}</h1>
      <p>Order #${order.orderId} • ${new Date().toLocaleDateString()}</p>
    </div>

    ${isBusinessEmail ? `
      <h2>Customer Details</h2>
      <p><strong>Name:</strong> ${order.customerName}</p>
      <p><strong>Phone:</strong> ${order.customerPhone}</p>
      ${order.customerEmail ? `<p><strong>Email:</strong> ${order.customerEmail}</p>` : ''}
      <p><strong>Delivery:</strong> ${order.deliveryAddress}, ${order.deliveryArea}</p>
    ` : `
      <p>Hi ${order.customerName}, thank you for your order!</p>
      <p>We're preparing your items and will notify you when they're on the way.</p>
    `}

    <h2>Order Summary</h2>
    ${order.items.map((item: any) => `
      <div class="order-item">
        <strong>${item.quantity}x ${item.name}</strong>
        ${item.options ? `<br><small>${item.options}</small>` : ''}
        <div>KES ${(item.price * item.quantity).toLocaleString('en-KE')}</div>
      </div>
    `).join('')}

    <div class="total">
      <p>Subtotal: KES ${order.subtotal.toLocaleString('en-KE')}</p>
      <p>Delivery: KES ${order.deliveryFee.toLocaleString('en-KE')}</p>
      <p>Tax: KES ${order.tax.toLocaleString('en-KE')}</p>
      <p>TOTAL: KES ${order.total.toLocaleString('en-KE')}</p>
    </div>

    <div class="footer">
      <p>${isBusinessEmail ? 'Order received at ' + new Date().toLocaleTimeString() : 
        'Estimated delivery: ' + (order.deliveryTime || '30-45 minutes')}</p>
      <p>Payment Method: ${order.paymentMethod || 'Not specified'}</p>
      ${!isBusinessEmail ? `
        <p>Need help? Reply to this email or call 07XXXXXXXX</p>
      ` : ''}
    </div>
  </body>
  </html>
`;