import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { buildCustomerEmailTemplate } from '../../utils/buildEmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { emailType, orderData } = req.body;

  try {
    const toEmail = emailType === 'business'
      ? process.env.BUSINESS_EMAIL
      : orderData.customerEmail;

    if (!toEmail) {
      return res.status(400).json({ error: 'Missing recipient email' });
    }

    const response = await resend.emails.send({
      from: 'Barrush Delivery <noreply@barrushdelivery.co.ke>', // or your verified sender domain
      to: toEmail,
      subject: emailType === 'business'
        ? `📦 New Order #${orderData.orderId}`
        : `✅ Order Confirmation #${orderData.orderId}`,
      html: emailType === 'business'
        ? buildEmailTemplate(orderData, emailType == 'business')
        : buildCustomerEmailTemplate(orderData),
    });

    return res.status(200).json({ success: true, response });
  } catch (error: any) {
    console.error('Resend email error:', error);
    return res.status(500).json({ error: error.message || 'Unknown error' });
  }
}

const buildEmailTemplate = (order: any, isBusiness: boolean) => `
  <div style="font-family: sans-serif; max-width: 600px;">
    <h2>${isBusiness ? 'NEW ORDER RECEIVED' : 'ORDER CONFIRMATION'}</h2>
    <p><strong>Order ID:</strong> ${order.orderId}</p>
    <p><strong>Name:</strong> ${order.customerName}</p>
    <p><strong>Phone:</strong> ${order.customerPhone}</p>
    ${order.customerEmail ? `<p><strong>Email:</strong> ${order.customerEmail}</p>` : ''}
    <p><strong>Delivery:</strong> ${order.deliveryAddress}, ${order.deliveryArea}</p>

    <h3>Items</h3>
    ${order.items.map((item: any) => `
      <div>
        ${item.quantity}x ${item.name} - KES ${(item.price * item.quantity).toLocaleString('en-KE')}
        ${item.options ? `<br><small>Options: ${item.options}</small>` : ''}
      </div>
    `).join('')}

    <p><strong>Total:</strong> KES ${order.total.toLocaleString('en-KE')}</p>
    <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
    <p><strong>Estimated Delivery:</strong> ${order.deliveryTime}</p>
  </div>
`;