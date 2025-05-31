import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, CreditCard, Loader2, Mail, MapPin, LocateFixed, Clock } from 'lucide-react';
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
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state with localStorage persistence
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('checkoutFormData');
    return savedData ? JSON.parse(savedData) : {
      name: '',
      phone: '',
      email: '',
      address: '',
      latitude: 0,
      longitude: 0,
      deliveryArea: '',
      addressInputType: 'manual' as 'manual' | 'picker'
    };
  });
  const [paymentDetails, setPaymentDetails] = useState({
    mpesaNumber: formData.phone || '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryAreas: DeliveryArea[] = [
    { name: 'Mnarani', price: 150, deliveryTime: '20-30 minutes' },
    { name: 'Bofa', price: 200, deliveryTime: '25-35 minutes' },
    { name: 'Tezo', price: 250, deliveryTime: '30-45 minutes' },
    { name: 'Mtondia', price: 300, deliveryTime: '35-50 minutes' },
  ];

  // Save form data to localStorage
  useEffect(() => {
    localStorage.setItem('checkoutFormData', JSON.stringify(formData));
  }, [formData]);

  const paymentMethods = [
    { id: 'mpesa', label: 'MPESA', icon: '/icons/mpesa.png', description: 'Pay via MPESA mobile money' },
    { id: 'card', label: 'Card', icon: '/icons/card.png', description: 'Pay with credit/debit card' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
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

    return true;
  };

  const { sendOrderEmail } = useEmailService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Client-side order processing
    const selectedArea = deliveryAreas.find(area => area.name === formData.deliveryArea);
    const deliveryFee = selectedArea?.price || 0;
    const tax = cartTotal * 0.05;
    const total = cartTotal + deliveryFee + tax;

    // Generate order ID locally
    const orderId = `ORDER-${Date.now().toString().slice(-6)}`;
    const orderDate = new Date().toLocaleString('en-KE');

    // Prepare order confirmation data
    const orderData = {
      orderId,
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      deliveryAddress: formData.address,
      deliveryArea: formData.deliveryArea,
      items: items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        options: item.options || null, // Handle undefined options
      })),
      subtotal: cartTotal,
      deliveryFee: deliveryFee,
      tax: tax,
      total: total,
      paymentMethod: selectedPayment || 'Cash on Delivery',
      deliveryTime: selectedArea?.deliveryTime || '30-45 minutes'
    };

    try {
      // Send business notification
      await sendOrderEmail('business', orderData);

      // Send customer confirmation if email exists
      if (formData.email) {
        await sendOrderEmail('customer', orderData);
      }
      // Store order in localStorage (for demo purposes)
      const pastOrders = JSON.parse(localStorage.getItem('pastOrders') || '[]');
      localStorage.setItem('pastOrders', JSON.stringify([...pastOrders, orderData]));

      // Clear cart and form data
      clearCart();
      localStorage.removeItem('checkoutFormData');

      // Navigate to confirmation
      navigate('/confirmation', {
        state: orderData
      });

    } catch (error) {
      toast({
        title: "Order placed but email failed",
        description: "Check your email for confirmation. If you don't receive it, please contact us.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedArea = deliveryAreas.find(area => area.name === formData.deliveryArea);
  const deliveryFee = selectedArea?.price || 0;
  const tax = cartTotal * 0.05;
  const total = cartTotal + deliveryFee + tax;

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
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
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
                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    initialAddress={formData.address}
                  />
                ) : (
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full delivery address"
                    required
                  />
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
                    <p>You'll receive a payment request on this number</p>
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
                {items.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {items.map(item => (
                        <div key={`${item.id}-${item.options}`} className="flex justify-between items-start pb-2 border-b border-gray-100">
                          <div className="flex items-start gap-3">
                            <div className="bg-gray-100 rounded-md w-12 h-12 flex items-center justify-center text-sm font-medium">
                              {item.quantity}x
                            </div>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              {item.options && (
                                <p className="text-sm text-muted-foreground">{item.options}</p>
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
                        <span>KES {cartTotal.toLocaleString('en-KE')}</span>
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
                            ? `KES ${total.toLocaleString('en-KE')}` 
                            : '--'}
                        </span>
                      </div>
                    </div>
                    
                    {formData.deliveryArea && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                        <Clock className="h-4 w-4" />
                        <span>Estimated delivery: {selectedArea?.deliveryTime}</span>
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
                  </>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    Your cart is empty
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
