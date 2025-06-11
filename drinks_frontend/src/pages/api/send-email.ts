import { Resend } from 'resend';
import { NextApiRequest, NextApiResponse } from 'next';
import { EmailQueue } from '../../lib/emailQueue';

const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize email queue
const emailQueue = new EmailQueue({
  maxRetries: 3,
  retryDelay: (attempt) => Math.pow(2, attempt) * 1000, // Exponential backoff
  processCallback: async (job) => {
    try {
      const response = await resend.emails.send({
        from: 'Barrush KE <info@barrush.co.ke>',
        to: [job.recipient],
        subject: job.subject,
        html: job.htmlContent,
      });
      return { success: true, data: response };
    } catch (error) {
      throw error;
    }
  }
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { emailType, orderData } = req.body;

  // Validate input
  if (!emailType || !orderData?.orderId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const isBusinessEmail = emailType === 'business';
    const recipient = isBusinessEmail 
      ? process.env.BUSINESS_EMAIL!
      : orderData.customerEmail;

    if (!recipient) {
      return res.status(400).json({ error: 'No recipient email' });
    }

    // Add to queue
    const jobId = await emailQueue.addJob({
      recipient,
      subject: isBusinessEmail
        ? `New Order #${orderData.orderId}`
        : `Order Confirmation #${orderData.orderId}`,
      htmlContent: buildEmailTemplate(orderData, isBusinessEmail),
      metadata: { orderId: orderData.orderId }
    });

    return res.status(202).json({ 
      success: true,
      jobId,
      message: 'Email queued for delivery'
    });

  } catch (error) {
    console.error('Email queueing error:', error);
    return res.status(500).json({ 
      error: 'Failed to queue email',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}

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
