import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, CreditCard, Loader2, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import LocationPicker from '@/components/LocationPicker';
import { useEmailService } from '@/hooks/useEmailService';

// Types
type DeliveryArea = {
  name: string;
  price: number;
  deliveryTime: string;
};

const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state - removed localStorage to follow artifact restrictions
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    latitude: 0,
    longitude: 0,
    deliveryArea: '',
    addressInputType: 'manual' as 'manual' | 'picker',
    placeName: '',
    paymentMethods: 'mpesa' as 'mpesa' | 'card' | 'paypal',
  });
  
  const [paymentDetails, setPaymentDetails] = useState({
    mpesaNumber: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    paypalEmail: ''
  });
  
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryAreas: DeliveryArea[] = [
    { name: 'Mnarani', price: 150, deliveryTime: '20-30 minutes' },
    { name: 'Bofa', price: 200, deliveryTime: '25-35 minutes' },
    { name: 'Tezo', price: 250, deliveryTime: '30-45 minutes' },
    { name: 'Mtondia', price: 300, deliveryTime: '35-50 minutes' },
  ];

  // Sync MPESA number with phone number
  useEffect(() => {
    setPaymentDetails(prev => ({ ...prev, mpesaNumber: formData.phone }));
  }, [formData.phone]);

  const paymentMethods = [
    { id: 'mpesa', label: 'MPESA', icon: '/icons/mpesa.png', description: 'Pay via MPESA mobile money' },
    { id: 'card', label: 'Card', icon: '/icons/card.png', description: 'Pay with credit/debit card' },
    { id: 'paypal', label: 'PayPal', icon: 'https://www.flaticon.com/free-icons/paypal', description: 'Pay with PayPal' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (placeName: string, address: string, lat?: number, lng?: number) => {
    setFormData(prev => ({
      ...prev,
      placeName,
      address,
      latitude: lat,
      longitude: lng
    }));
  };

  const validateForm = () => {
    const phoneRegex = /^07\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Invalid phone number",
        description: "Use format: 07XXXXXXXX",
        variant: "destructive"
      });
      return false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Invalid email address",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    const requiredFields = ['name', 'phone', 'address', 'deliveryArea'];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    if (emptyFields.length > 0) {
      toast({
        title: "Missing information",
        description: `Please fill in: ${emptyFields.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }

    if (!selectedPayment) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method",
        variant: "destructive"
      });
      return false;
    }

    // Validate payment method specific fields
    if (selectedPayment === 'mpesa' && !paymentDetails.mpesaNumber) {
      toast({
        title: "MPESA number required",
        description: "Please enter your MPESA number",
        variant: "destructive"
      });
      return false;
    }

    if (selectedPayment === 'card') {
      if (!paymentDetails.cardNumber || !paymentDetails.cardExpiry || !paymentDetails.cardCVC) {
        toast({
          title: "Card details required",
          description: "Please fill in all card details",
          variant: "destructive"
        });
        return false;
      }
    }

    if (selectedPayment === 'paypal' && !paymentDetails.paypalEmail) {
      toast({
        title: "PayPal email required",
        description: "Please enter your PayPal email",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const { sendOrderEmail } = useEmailService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const selectedArea = deliveryAreas.find(area => area.name === formData.deliveryArea);
      const deliveryFee = selectedArea?.price || 0;
      const tax = total * 0.05;
      const finalTotal = total + deliveryFee + tax;
      
      const orderId = `ORDER-${Date.now().toString().slice(-6)}`;
      const orderData = {
        orderId,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          options: item.options,
          total: item.price * item.quantity
        })),
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          deliveryArea: formData.deliveryArea
        },
        payment: {
          method: selectedPayment,
          details: selectedPayment === 'mpesa' ? { number: paymentDetails.mpesaNumber } :
                   selectedPayment === 'card' ? { last4: paymentDetails.cardNumber.slice(-4) } :
                   selectedPayment === 'paypal' ? { email: paymentDetails.paypalEmail } : {}
        },
        pricing: {
          subtotal: total,
          deliveryFee,
          tax,
          total: finalTotal
        },
        deliveryInfo: {
          area: formData.deliveryArea,
          estimatedTime: selectedArea?.deliveryTime,
          address: formData.address,
          coordinates: formData.latitude && formData.longitude ? {
            lat: formData.latitude,
            lng: formData.longitude
          } : null
        },
        orderDate: new Date().toISOString(),
        status: 'pending'
      };

      // 2. Save order locally
      const pastOrders = localStorage.getItem('pastOrders');
      localStorage.setItem('pastOrders', JSON.stringify([
        ...(pastOrders ? JSON.parse(pastOrders) : []),
        orderData
      ]));

      // 3. Queue emails (non-blocking)
      const emailPromises = [
        fetch('/api/send-order-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            emailType: 'business',
            orderData
          }),
        })
      ];

      if (formData.email) {
        emailPromises.push(
          fetch('/api/send-order-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              emailType: 'customer',
              orderData
            }),
          })
        );
      }

      // Clear cart and navigate
      clearCart();
      navigate('/confirmation', {
        state: {
          ...orderData,
          emailJobs: await Promise.all(emailPromises.map(p => p.then(r => r.json()))),
        },
        replace: true
      });

    } catch (error) {
      toast({
        title: "Order processing error",
        description: "Your order was saved but email delivery failed",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/');
    }
  }, [items.length, navigate]);

  const selectedArea = deliveryAreas.find(area => area.name === formData.deliveryArea);
  const deliveryFee = selectedArea?.price || 0;
  const tax = total * 0.05;
  const finalTotal = total + deliveryFee + tax;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate('/')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Complete Your Order
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Delivery Information */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag size={20} />
                <span>Delivery Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="07XXXXXXXX"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
                <p className="text-sm text-muted-foreground">For order confirmation</p>
              </div>
              
              <div className="space-y-2">
                <Label>Address Input Method</Label>
                <div className="flex gap-2 mb-2">
                  <Button
                    variant={formData.addressInputType === 'picker' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, addressInputType: 'picker' }))}
                  >
                    <MapPin className="mr-2 h-4 w-4" /> Use Location
                  </Button>
                  <Button
                    variant={formData.addressInputType === 'manual' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, addressInputType: 'manual' }))}
                  >
                    Enter Manually
                  </Button>
                </div>
                
                {formData.addressInputType === 'picker' ? (
                  <>
                    <LocationPicker
                      onLocationSelect={handleLocationSelect}
                      initialAddress={formData.address}
                    />
                    {formData.address && (
                      <div className="mt-2 p-2 border rounded bg-gray-50">
                        {formData.placeName && <p><strong>Place:</strong> {formData.placeName}</p>}
                        <p><strong>Address:</strong> {formData.address}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Full delivery address"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Please enter your full delivery address or a nearby known area.
                    </p>
                  </>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deliveryArea">Delivery Area *</Label>
                <select
                  id="deliveryArea"
                  name="deliveryArea"
                  value={formData.deliveryArea}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select your area...</option>
                  {deliveryAreas.map(area => (
                    <option key={area.name} value={area.name}>
                      {area.name} - KES {area.price.toLocaleString('en-KE')} ({area.deliveryTime})
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardTitle className="flex items-center gap-2">
                <CreditCard size={20} />
                <span>Payment Method</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <RadioGroup 
                value={selectedPayment || ''}
                onValueChange={setSelectedPayment}
                className="grid grid-cols-1 gap-4"
              >
                {paymentMethods.map(method => (
                  <div key={method.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex items-center gap-2 cursor-pointer">
                      <img src={method.icon} alt={method.label} className="w-6 h-6" />
                      <div>
                        <p className="font-medium">{method.label}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              {selectedPayment === 'mpesa' && (
                <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor="mpesaNumber">MPESA Number *</Label>
                    <Input
                      id="mpesaNumber"
                      value={paymentDetails.mpesaNumber}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, mpesaNumber: e.target.value }))}
                      placeholder="07XXXXXXXX"
                      required
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Input MPESA number used to pay for order. For confirmation purposes.</p>
                  </div>
                </div>
              )}
              
              {selectedPayment === 'card' && (
                <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry">Expiry Date *</Label>
                      <Input
                        id="cardExpiry"
                        value={paymentDetails.cardExpiry}
                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardExpiry: e.target.value }))}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCVC">CVC *</Label>
                      <Input
                        id="cardCVC"
                        value={paymentDetails.cardCVC}
                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardCVC: e.target.value }))}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedPayment === 'paypal' && (
                <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor="paypalEmail">PayPal Email *</Label>
                    <Input
                      id="paypalEmail"
                      type="email"
                      value={paymentDetails.paypalEmail}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, paypalEmail: e.target.value }))}
                      placeholder="your@paypal.com"
                      required
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>You'll be redirected to PayPal to complete payment</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Order Summary */}
        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={`${item.id}-${item.options || 'default'}`} className="flex justify-between items-start pb-2 border-b border-gray-100">
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-100 rounded-md w-12 h-12 flex items-center justify-center text-sm font-medium">
                          {item.quantity}x
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.options && (
                            <p className="text-sm text-gray-600">{item.options}</p>
                          )}
                        </div>
                      </div>
                      <p className="font-medium">
                        KES {(item.price * item.quantity).toLocaleString('en-KE')}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>KES {total.toLocaleString('en-KE')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>
                      {formData.deliveryArea 
                        ? `KES ${deliveryFee.toLocaleString('en-KE')}` 
                        : 'Select area'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span>KES {tax.toLocaleString('en-KE')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">
                      {formData.deliveryArea 
                        ? `KES ${finalTotal.toLocaleString('en-KE')}` 
                        : '--'}
                    </span>
                  </div>
                </div>
                
                {formData.deliveryArea && selectedArea && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                    <Clock className="h-4 w-4" />
                    <span>Estimated delivery: {selectedArea.deliveryTime}</span>
                  </div>
                )}
                
                <Button
                  onClick={handleSubmit}
                  className="w-full mt-4"
                  size="lg"
                  disabled={isSubmitting || items.length === 0 || !formData.deliveryArea}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="mr-2 h-4 w-4" />
                  )}
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;