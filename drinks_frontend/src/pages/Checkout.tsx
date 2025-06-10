
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MapPin, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '@/components/LocationPicker';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
}

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [selectedPayment, setSelectedPayment] = useState<string>('mpesa');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: Smartphone,
      description: 'Pay with M-Pesa mobile money'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Pay with your card'
    },
    {
      id: 'cash',
      name: 'Cash on Delivery',
      icon: Banknote,
      description: 'Pay when your order arrives'
    }
  ];

  const deliveryFee = 200;
  const finalTotal = total + deliveryFee;

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    setCustomerInfo(prev => ({
      ...prev,
      location: { lat, lng, address },
      address
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        customer: customerInfo,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity
        })),
        payment: {
          method: selectedPayment,
          subtotal: total,
          deliveryFee,
          total: finalTotal
        },
        orderDate: new Date().toISOString()
      };

      console.log('Order submitted:', orderData);
      
      clearCart();
      navigate('/confirmation', { 
        state: { 
          orderData,
          orderId: `ORD-${Date.now()}`
        }
      });
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-4">Add some items to your cart before checkout.</p>
          <Button onClick={() => navigate('/categories')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+254 7xx xxx xxx"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin size={20} />
                  Delivery Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LocationPicker onLocationSelect={handleLocationSelect} />
                {customerInfo.location && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      Selected: {customerInfo.location.address}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPayment === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <div className="flex items-center gap-3">
                      <method.icon size={20} />
                      <div>
                        <h4 className="font-medium">{method.name}</h4>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        KES {item.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>KES {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>KES {deliveryFee.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>KES {finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting || !customerInfo.name || !customerInfo.phone}
                  >
                    {isSubmitting ? 'Processing...' : `Place Order - KES ${finalTotal.toLocaleString()}`}
                  </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Estimated delivery: 15-45 minutes</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
