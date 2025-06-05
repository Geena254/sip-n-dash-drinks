export const buildCustomerEmailTemplate = (order: any) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Order Confirmation</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #f9f9f9;
          color: #333;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        h1 {
          color: #1a73e8;
          font-size: 24px;
        }
        .summary {
          border-top: 1px solid #eee;
          padding-top: 10px;
          margin-top: 20px;
        }
        .item {
          margin-bottom: 10px;
          font-size: 14px;
        }
        .item span {
          display: block;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #777;
        }
        .highlight {
          font-weight: bold;
          color: #1a73e8;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Hi ${order.customerName},</h1>
        <p>Thank you for your order! 🎉</p>
        <p>Your order <strong>#${order.orderId}</strong> is being prepared.</p>

        <div class="summary">
          <h2>Order Summary</h2>
          ${order.items.map((item: any) => `
            <div class="item">
              <span>${item.quantity}x ${item.name}</span>
              ${item.options ? `<small>Options: ${item.options}</small>` : ''}
              <div>KES ${(item.price * item.quantity).toLocaleString('en-KE')}</div>
            </div>
          `).join('')}

          <p><strong>Subtotal:</strong> KES ${order.subtotal.toLocaleString('en-KE')}</p>
          <p><strong>Delivery Fee:</strong> KES ${order.deliveryFee.toLocaleString('en-KE')}</p>
          <p><strong>Tax:</strong> KES ${order.tax.toLocaleString('en-KE')}</p>
          <p class="highlight"><strong>Total:</strong> KES ${order.total.toLocaleString('en-KE')}</p>

          <p><strong>Delivery Time:</strong> ${order.deliveryTime}</p>
          <p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>
          <p><strong>Payment:</strong> ${order.paymentMethod}</p>
        </div>

        <div class="footer">
          You'll receive updates once your order is dispatched.<br>
          Questions? Just reply to this email or call us at <strong>07XXXXXXXX</strong>.<br><br>
          Cheers, <br>
          <strong>Barrush Delivery Team</strong>
        </div>
      </div>
    </body>
  </html>
`;
