
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Clock, MapPin, Package, Shield, Phone, Star, CheckCircle } from 'lucide-react';

const DeliveryServices = () => {
  const services = [
    {
      id: 1,
      title: "Food & Grocery Delivery",
      description: "We deliver fresh groceries, meals, and essentials from your favorite stores to your doorstep.",
      icon: <Package className="h-8 w-8" />,
      features: ["Same-day delivery", "Temperature controlled", "Fresh produce", "Pharmacy items"],
      price: "From KES 200"
    },
    {
      id: 2,
      title: "Document & Package Delivery",
      description: "Secure and fast delivery of important documents, packages, and business materials.",
      icon: <Shield className="h-8 w-8" />,
      features: ["Secure handling", "Real-time tracking", "Proof of delivery", "Insurance available"],
      price: "From KES 150"
    },
    {
      id: 3,
      title: "E-commerce Delivery",
      description: "Reliable delivery service for online stores and marketplace sellers.",
      icon: <Truck className="h-8 w-8" />,
      features: ["Multiple pickup points", "Bulk delivery", "Returns handling", "API integration"],
      price: "Custom pricing"
    },
    {
      id: 4,
      title: "Emergency Delivery",
      description: "Urgent delivery service available 24/7 for time-sensitive items.",
      icon: <Clock className="h-8 w-8" />,
      features: ["24/7 availability", "Express delivery", "Priority handling", "1-hour delivery"],
      price: "From KES 500"
    }
  ];

  const coverage = [
    "Nairobi CBD", "Westlands", "Karen", "Kilimani", "Lavington", 
    "Kileleshwa", "Parklands", "Kasarani", "Embakasi", "Donholm",
    "South B", "South C", "Langata", "Runda", "Muthaiga"
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-lg p-8 md:p-12 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white mb-4">
            Reliable • Fast • Secure
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            More Than Just Drinks - We Deliver Everything
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90">
            From beverages to groceries, documents to packages - we're your trusted delivery partner across Nairobi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default" className="bg-white text-primary hover:bg-gray-100">
              <Phone className="mr-2 h-5 w-5" />
              Call Now: 0700 000 000
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              Get Quote
            </Button>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Delivery Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional delivery solutions tailored to meet your specific needs, whether personal or business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="h-full transition-all hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-lg">
                    {service.icon}
                  </div>
                  <Badge variant="outline">{service.price}</Badge>
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full">
                  Request Service
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Coverage Area */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Delivery Coverage Area</h2>
          <p className="text-muted-foreground">We deliver across Nairobi and surrounding areas</p>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <MapPin className="h-6 w-6 text-primary mr-2" />
              <h3 className="text-lg font-semibold">Areas We Serve</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {coverage.map((area, index) => (
                <Badge key={index} variant="outline" className="justify-center py-2">
                  {area}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Don't see your area? Contact us - we're always expanding our coverage!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Why Choose Us */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Why Choose Our Delivery Service?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="bg-green-100 text-green-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Fast & Reliable</h3>
              <p className="text-sm text-muted-foreground">
                Average delivery time of 30-45 minutes with real-time tracking
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Secure & Insured</h3>
              <p className="text-sm text-muted-foreground">
                All deliveries are insured and handled with utmost care
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="bg-yellow-100 text-yellow-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Customer Focused</h3>
              <p className="text-sm text-muted-foreground">
                Dedicated customer support and satisfaction guarantee
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact CTA */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Contact us today for a custom quote or to schedule your delivery. 
            Our team is ready to help with all your delivery needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Phone className="mr-2 h-5 w-5" />
              Call: 0700 000 000
            </Button>
            <Button size="lg" variant="outline">
              WhatsApp Us
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryServices;
