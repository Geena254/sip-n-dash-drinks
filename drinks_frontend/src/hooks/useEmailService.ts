export const useEmailService = () => {
  const sendOrderEmail = async (emailType: 'business' | 'customer', orderData: any) => {
    try {
      const response = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailType, orderData }),
      });

      if (!response.ok) throw new Error(await response.text());
      return true;
    } catch (err) {
      console.error('Email send failed:', err);
      return false;
    }
  };

  return { sendOrderEmail };
};