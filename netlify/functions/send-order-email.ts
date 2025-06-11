import { Resend } from 'resend';
import { NextApiRequest, NextApiResponse } from 'next';
import { EmailQueue } from '../../src/lib/emailQueue';
import { Handler } from '@netlify/functions';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  options?: string;
}

interface OrderData {
  orderId: string | number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryArea: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  deliveryTime?: string;
  paymentMethod?: string;
}

interface SendOrderEmailRequestBody {
  emailType: 'business' | 'customer';
  orderData: OrderData;
}

const handler: Handler = async (
  event: { httpMethod: string; body?: string },
  context: any
): Promise<{
  statusCode: number;
  body: string;
}> => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const { emailType, orderData }: SendOrderEmailRequestBody = JSON.parse(event.body || '{}');

  if (!emailType || !orderData?.orderId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields' }),
    };
  }

  const isBusinessEmail: boolean = emailType === 'business';
  const recipient: string | undefined = isBusinessEmail 
    ? process.env.BUSINESS_EMAIL
    : orderData.customerEmail;

  if (!recipient) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No recipient email' }),
    };
  }

  try {
    const emailResponse = await resend.emails.send({
      from: 'Barrush KE <info@barrush.co.ke>',
      to: [recipient],
      subject: isBusinessEmail
        ? `New Order #${orderData.orderId}`
        : `Order Confirmation #${orderData.orderId}`,
      html: buildEmailTemplate(orderData, isBusinessEmail),
    });

    return {
      statusCode: 202,
      body: JSON.stringify({ success: true, data: emailResponse }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to send email' }),
    };
  }
};

export { handler };

function buildEmailTemplate(order: any, isBusinessEmail: boolean) {
  return `
    <!DOCTYPE html>
    <html>
    <!-- Your email template here -->
    </html>
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
`};
