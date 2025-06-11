import React, { useState, useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const Confirmation: React.FC = () => {
  const { state } = useLocation();
  const [emailStatus, setEmailStatus] = useState<{
    business: 'pending' | 'sent' | 'failed';
    customer?: 'pending' | 'sent' | 'failed';
  }>({ 
    business: 'pending',
    customer: state?.customerEmail ? 'pending' : undefined
  });

  useEffect(() => {
    if (!state?.emailJobs) return;

    // Check email status periodically
    const interval = setInterval(async () => {
      try {
        const results = await Promise.all(
          state.emailJobs.map((job: any) => 
            fetch(`/api/check-email-status?jobId=${job.jobId}`)
              .then(res => res.json())
          )
        );

        setEmailStatus({
          business: results[0].delivered ? 'sent' : 'failed',
          customer: results[1]?.delivered ? 'sent' : results[1] ? 'failed' : undefined
        });

        if (results.every(r => r.delivered)) {
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Status check failed:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [state]);
  
  // If accessed directly without state, redirect to home
  if (!state?.orderId) return <Navigate to="/" replace />;
  
   return (
    <div className="max-w-md mx-auto p-4">
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-green-100 rounded-full">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p>Thank you, {state?.customerName}! Your order #{state?.orderId} is confirmed.</p>
          
          <div className="bg-muted p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Order Number:</p>
                <p className="font-medium">{state?.orderId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Estimated Time:</p>
                <p className="font-medium">{state.deliveryTime}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              We've sent a confirmation email with your order details.
            </p>

            {(emailStatus.business === 'failed' || emailStatus.customer === 'failed') && (
              <div className="bg-yellow-100 p-4 rounded mb-4 text-yellow-700 text-sm">
                We couldn’t confirm your email was delivered. Here’s a copy of your order:
                <ul className="mt-2 list-disc list-inside">
                  {state?.items?.map((item: any) => (
                    <li key={item.name}>
                      {item.quantity}x {item.name} – KES {(item.price * item.quantity).toLocaleString('en-KE')}
                    </li>
                  ))}
                </ul>
                <p className="mt-2">Total: <strong>KES {state?.total?.toLocaleString('en-KE')}</strong></p>
              </div>
            )}
            
            <Link to="/">
              <Button className="w-full gap-2">
                <ArrowLeft size={16} />
                Return to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default Confirmation;