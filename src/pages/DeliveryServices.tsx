
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Clock, MapPin, Package, Shield, Phone, Star, CheckCircle, Users, Zap, Award } from 'lucide-react';

const DeliveryServices = () => {
  const services = [
    {
      id: 1,
      title: "Premium Drinks Delivery",
      description: "Fast delivery of wines, spirits, beers, and cocktail ingredients from our extensive collection.",
      icon: <Package className="h-8 w-8" />,
      features: ["Temperature controlled", "Premium selection", "Same-day delivery", "Age verification"],
      price: "From KES 200",
      popular: true
    },
    {
      id: 2,
      title: "Food & Grocery Delivery", 
      description: "Fresh groceries, meals, and daily essentials delivered to your doorstep within hours.",
      icon: <Truck className="h-8 w-8" />,
      features: ["Fresh produce", "Pharmacy items", "Household goods", "Bulk orders"],
      price: "From KES 150"
    },
    {
      id: 3,
      title: "Document & Package Delivery",
      description: "Secure and fast delivery of important documents, packages, and business materials.",
      icon: <Shield className="h-8 w-8" />,
      features: ["Secure handling", "Real-time tracking", "Proof of delivery", "Insurance available"],
      price: "From KES 100"
    },
    {
      id: 4,
      title: "Emergency Delivery",
      description: "Urgent delivery service available 24/7 for time-sensitive items and emergency situations.",
      icon: <Clock className="h-8 w-8" />,
      features: ["24/7 availability", "Express delivery", "Priority handling", "1-hour delivery"],
      price: "From KES 500"
    }
  ];

  const coverage = [
    "Kilifi Town", "Bofa", "Mnarani", "Tezo", "Malindi", "Mtondia", "Watamu", "Gede", 
    "Kakuyuni", "Mida Creek", "Mambrui", "Mtwapa", "Vipingo", "Shanzu", "Nyali", 
    "Kisauni", "Mombasa Island", "Likoni", "Diani", "Bamburi", "Kongowea"
  ];

  const stats = [
    { icon: <Users className="h-6 w-6" />, value: "50,000+", label: "Happy Customers" },
    { icon: <Truck className="h-6 w-6" />, value: "15-45", label: "Minutes Average Delivery" },
    { icon: <Star className="h-6 w-6" />, value: "4.9/5", label: "Customer Rating" },
    { icon: <Award className="h-6 w-6" />, value: "99.5%", label: "On-Time Delivery" }
  ];

  const whyChooseUs = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Average delivery time of 30-45 minutes with real-time tracking and updates."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Insured", 
      description: "All deliveries are insured and handled with utmost care and security."
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Customer Focused",
      description: "Dedicated 24/7 customer support and 100% satisfaction guarantee."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white mb-6 text-sm px-4 py-2">
              🚀 Fastest Delivery in Coast Region
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              More Than Just Drinks
              <span className="block text-secondary">We Deliver Everything</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 text-white/90 max-w-3xl mx-auto">
              From premium beverages to groceries, documents to packages - we're your trusted delivery partner 
              across the beautiful Coastal region of Kenya.
            </p>
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="bg-white/10 p-2 rounded-lg">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="default" className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3">
                <Phone className="mr-2 h-5 w-5" />
                Call Now: 0700 000 000
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 text-lg px-8 py-3">
                Get Instant Quote
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Delivery Services</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Professional delivery solutions tailored to meet your specific needs, whether personal or business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <Card key={service.id} className={`h-full transition-all hover:-translate-y-2 hover:shadow-xl relative ${service.popular ? 'border-primary shadow-lg' : ''}`}>
              {service.popular && (
                <Badge className="absolute -top-2 left-6 bg-primary text-white">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 text-primary p-4 rounded-xl">
                    {service.icon}
                  </div>
                  <Badge variant="outline" className="text-lg px-3 py-1">{service.price}</Badge>
                </div>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <p className="text-muted-foreground">{service.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-8">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full py-6 text-lg" variant={service.popular ? "default" : "outline"}>
                  Request Service
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose BarRush Delivery?</h2>
            <p className="text-muted-foreground text-lg">Experience the difference with our premium delivery service</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 text-primary p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Coverage Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Delivery Coverage Area</h2>
          <p className="text-muted-foreground text-lg">We deliver across the Coast region and surrounding areas</p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center mb-8">
              <div className="bg-primary/10 p-3 rounded-lg mr-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Areas We Serve</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {coverage.map((area, index) => (
                <Badge key={index} variant="outline" className="justify-center py-3 px-4 hover:bg-primary hover:text-white transition-colors cursor-pointer">
                  {area}
                </Badge>
              ))}
            </div>
            <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
              <p className="text-center text-muted-foreground">
                <strong>Don't see your area?</strong> Contact us - we're always expanding our coverage! 
                Call us at <span className="text-primary font-semibold">0700 000 000</span> to check availability.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact CTA */}
      <div className="bg-gradient-to-br from-primary to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Fast Delivery?</h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-3xl mx-auto">
                Join thousands of satisfied customers who trust BarRush for all their delivery needs. 
                Get started today with our reliable, fast, and secure delivery service.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="lg" className="text-lg px-8 py-4">
                  <Phone className="mr-2 h-5 w-5" />
                  Call: 0700 000 000
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  WhatsApp Us
                </Button>
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                  Get Free Quote
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Available 24/7 • Free consultation • Instant quotes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeliveryServices;
