import { useCallback } from 'react';

export const useEmailService = () => {
  const sendOrderEmail = useCallback(async (emailType: 'business' | 'customer', orderData: any) => {
    try {
      const response = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailType, orderData }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return true;
    } catch (error) {
      console.error('Email error:', error);
      return false;
    }
  }, []);

  return { sendOrderEmail };
};