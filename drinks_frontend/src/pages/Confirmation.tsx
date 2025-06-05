import React, { useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const Confirmation: React.FC = () => {
  const { state } = useLocation();
  const [emailConfirmed, setEmailConfirmed] = React.useState(false);

  useEffect(() => {
    // Check if emails were sent successfully
    const checkEmailStatus = async () => {
      if (!state?.emailSent) {
        const res = await fetch('/api/check-email-status?orderId=' + state.orderId);
        if (!res.ok) {
          console.error('Failed to check email status');
          return;
        }
        setEmailConfirmed(true);
      }
    };
    checkEmailStatus();
  }, []);

  // If accessed directly without state, redirect to home
  if (!state?.orderId) {
    return <Navigate to="/" replace />;
  }
  
  function handleResendEmail(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    setEmailConfirmed(true);
  }
  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-green-100 rounded-full">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p>Thank you, {state.customerName}! Your order #{state.orderId} is confirmed.</p>
          
          <div className="bg-muted p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Order Number:</p>
                <p className="font-medium">{state.orderId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Estimated Time:</p>
                <p className="font-medium">{state.deliveryTime}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              We've sent a confirmation text with your order details.
            </p>

            {
              !emailConfirmed && (
                <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                  <p>Emails may take a few minutes to arrive.</p>
                  <button 
                    onClick={handleResendEmail}
                    className="mt-2 text-sm text-yellow-700 underline"
                  >
                    Didn't receive email? Resend
                  </button>
                </div>
              )
            }
            
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
