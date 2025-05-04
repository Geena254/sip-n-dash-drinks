import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, Archive, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [generalSettings, setGeneralSettings] = useState({
    storeName: "Liquor Store",
    storeEmail: "admin@example.com",
    storePhone: "+1 234 567 8900",
    storeCurrency: "USD",
    storeLanguage: "English"
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderNotifications: true,
    inventoryAlerts: true,
    marketingEmails: false
  });
  
  const [paymentSettings, setPaymentSettings] = useState({
    acceptCreditCards: true,
    acceptPaypal: true,
    acceptCrypto: false
  });
  
  const handleSaveGeneral = (e) => {
    e.preventDefault();
    toast({
      title: "Settings Saved",
      description: "Your general settings have been updated successfully."
    });
  };
  
  const handleSaveNotifications = (e) => {
    e.preventDefault();
    toast({
      title: "Notification Preferences Updated",
      description: "Your notification settings have been saved."
    });
  };
  
  const handleSavePayment = (e) => {
    e.preventDefault();
    toast({
      title: "Payment Methods Updated",
      description: "Your payment settings have been saved."
    });
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-muted-foreground mb-6">Configure your store settings and preferences</p>
      
      <Tabs defaultValue="general" className="w-full">
        <div className="border-b mb-6">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Configure your store's basic information
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveGeneral}>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input 
                      id="storeName" 
                      value={generalSettings.storeName}
                      onChange={(e) => setGeneralSettings({...generalSettings, storeName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeEmail">Store Email</Label>
                    <Input 
                      id="storeEmail" 
                      type="email"
                      value={generalSettings.storeEmail}
                      onChange={(e) => setGeneralSettings({...generalSettings, storeEmail: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storePhone">Store Phone</Label>
                    <Input 
                      id="storePhone"
                      value={generalSettings.storePhone}
                      onChange={(e) => setGeneralSettings({...generalSettings, storePhone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeCurrency">Currency</Label>
                    <Select 
                      value={generalSettings.storeCurrency}
                      onValueChange={(value) => setGeneralSettings({...generalSettings, storeCurrency: value})}
                    >
                      <SelectTrigger id="storeCurrency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeLanguage">Language</Label>
                    <Select 
                      value={generalSettings.storeLanguage}
                      onValueChange={(value) => setGeneralSettings({...generalSettings, storeLanguage: value})}
                    >
                      <SelectTrigger id="storeLanguage">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveNotifications}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive important store updates via email</p>
                    </div>
                    <Switch 
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="orderNotifications">Order Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications for new and updated orders</p>
                    </div>
                    <Switch 
                      id="orderNotifications"
                      checked={notificationSettings.orderNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, orderNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="inventoryAlerts">Inventory Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts when products are low on stock</p>
                    </div>
                    <Switch 
                      id="inventoryAlerts"
                      checked={notificationSettings.inventoryAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, inventoryAlerts: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketingEmails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive marketing tips and promotional ideas</p>
                    </div>
                    <Switch 
                      id="marketingEmails"
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, marketingEmails: checked})}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Save Preferences</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Configure available payment options for customers
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSavePayment}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="acceptCreditCards">Credit Cards</Label>
                      <p className="text-sm text-muted-foreground">Accept Visa, MasterCard, Amex and other cards</p>
                    </div>
                    <Switch 
                      id="acceptCreditCards"
                      checked={paymentSettings.acceptCreditCards}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, acceptCreditCards: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="acceptPaypal">PayPal</Label>
                      <p className="text-sm text-muted-foreground">Accept payments via PayPal</p>
                    </div>
                    <Switch 
                      id="acceptPaypal"
                      checked={paymentSettings.acceptPaypal}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, acceptPaypal: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="acceptCrypto">Cryptocurrency</Label>
                      <p className="text-sm text-muted-foreground">Accept Bitcoin and other cryptocurrencies</p>
                    </div>
                    <Switch 
                      id="acceptCrypto"
                      checked={paymentSettings.acceptCrypto}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, acceptCrypto: checked})}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Save Payment Methods</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Settings
              </CardTitle>
              <CardDescription>
                Configure inventory management preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold (%)</Label>
                  <Input id="lowStockThreshold" type="number" defaultValue={20} />
                  <p className="text-xs text-muted-foreground mt-1">Percentage of reorder point to mark as low stock</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="criticalStockThreshold">Critical Stock Threshold (%)</Label>
                  <Input id="criticalStockThreshold" type="number" defaultValue={50} />
                  <p className="text-xs text-muted-foreground mt-1">Percentage of reorder point to mark as critical</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="autoReorder">Automatic Reordering</Label>
                <Select defaultValue="manual">
                  <SelectTrigger id="autoReorder">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual only</SelectItem>
                    <SelectItem value="alert">Alert but don't order</SelectItem>
                    <SelectItem value="auto">Fully automatic</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">How to handle low stock situations</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Inventory Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure system preferences and operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Data Retention (days)</Label>
                  <Input id="dataRetention" type="number" defaultValue={90} />
                  <p className="text-xs text-muted-foreground mt-1">How long to keep detailed analytics data</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Automatic Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger id="backupFrequency">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border p-4 rounded-md bg-muted/50">
                  <h3 className="font-medium mb-2">Database Management</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Button variant="outline" size="sm" className="mr-2">
                        <Archive className="h-4 w-4 mr-2" />
                        Backup Now
                      </Button>
                      <Button variant="outline" size="sm">
                        Restore from Backup
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save System Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
