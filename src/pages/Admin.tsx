import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ChartBar, DollarSign, Users, TrendingUp, TrendingDown, Package, FileText, Inbox, Search, Plus, AlertTriangle, Settings, Eye, Edit, Archive } from 'lucide-react';

// Sample data - in a real app, this would come from a database
const orderData = [
  { id: 1, customer: 'John Doe', items: 3, total: 59.99, date: '2025-05-01', status: 'Delivered' },
  { id: 2, customer: 'Jane Smith', items: 2, total: 42.50, date: '2025-05-01', status: 'Processing' },
  { id: 3, customer: 'Alex Johnson', items: 5, total: 125.75, date: '2025-04-30', status: 'Delivered' },
  { id: 4, customer: 'Sarah Williams', items: 1, total: 19.99, date: '2025-04-30', status: 'Processing' },
  { id: 5, customer: 'Michael Brown', items: 4, total: 87.20, date: '2025-04-29', status: 'Delivered' },
];

const chartData = [
  { name: 'Apr 25', visitors: 120, orders: 4, revenue: 172 },
  { name: 'Apr 26', visitors: 145, orders: 6, revenue: 235 },
  { name: 'Apr 27', visitors: 132, orders: 5, revenue: 188 },
  { name: 'Apr 28', visitors: 178, orders: 8, revenue: 304 },
  { name: 'Apr 29', visitors: 189, orders: 9, revenue: 342 },
  { name: 'Apr 30', visitors: 210, orders: 11, revenue: 401 },
  { name: 'May 1', visitors: 252, orders: 14, revenue: 492 },
];

// Sample inventory data
const inventoryData = [
  { id: 1, name: 'Premium Scotch', category: 'Spirits', stock: 24, price: 58.99, reorder: 10 },
  { id: 2, name: 'Craft IPA', category: 'Beer', stock: 48, price: 12.99, reorder: 20 },
  { id: 3, name: 'Red Wine', category: 'Wine', stock: 15, price: 24.50, reorder: 8 },
  { id: 4, name: 'Vodka', category: 'Spirits', stock: 6, price: 18.75, reorder: 10 },
  { id: 5, name: 'Non-Alcoholic Beer', category: 'Non-Alcoholic', stock: 30, price: 8.99, reorder: 15 },
];

// Sample user data
const userData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', orders: 12, totalSpent: 458.50, lastOrder: '2025-05-01' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 8, totalSpent: 325.75, lastOrder: '2025-04-28' },
  { id: 3, name: 'Alex Johnson', email: 'alex@example.com', orders: 5, totalSpent: 187.90, lastOrder: '2025-04-30' },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', orders: 3, totalSpent: 95.47, lastOrder: '2025-04-25' },
  { id: 5, name: 'Michael Brown', email: 'michael@example.com', orders: 15, totalSpent: 612.80, lastOrder: '2025-05-01' },
];

// Sample sales by category data
const salesByCategoryData = [
  { name: 'Beer', value: 35 },
  { name: 'Wine', value: 25 },
  { name: 'Spirits', value: 30 },
  { name: 'Non-Alcoholic', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New order #1245 received', read: false, time: '10 minutes ago' },
    { id: 2, message: 'Inventory alert: Premium Scotch low on stock', read: false, time: '30 minutes ago' },
    { id: 3, message: 'Customer feedback received', read: true, time: '2 hours ago' },
    { id: 4, message: 'Payment processed for order #1242', read: true, time: '3 hours ago' },
  ]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [viewOrderDialog, setViewOrderDialog] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [viewProductDialog, setViewProductDialog] = useState(false);
  const [editProductDialog, setEditProductDialog] = useState(false);
  const [orderProductDialog, setOrderProductDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [viewCustomerDialog, setViewCustomerDialog] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  
  // In a real application, this would use a proper authentication system
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  // Navigate to settings page
  const navigateToSettings = () => {
    navigate('/settings');
  };

  // View order details
  const handleViewOrder = (order) => {
    setCurrentOrder(order);
    setViewOrderDialog(true);
  };

  // View product details
  const handleViewProduct = (product) => {
    setCurrentProduct(product);
    setViewProductDialog(true);
  };

  // Edit product
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setEditProductDialog(true);
  };

  // Order product
  const handleOrderProduct = (product) => {
    setCurrentProduct(product);
    setOrderProductDialog(true);
  };

  // View customer details
  const handleViewCustomer = (customer) => {
    setCurrentCustomer(customer);
    setViewCustomerDialog(true);
  };

  // Place sample order for inventory
  const handlePlaceOrder = () => {
    setOrderProductDialog(false);
    toast({
      title: "Order Placed",
      description: `Ordered ${currentProduct?.name} successfully.`,
    });
  };

  // Save edited product
  const handleSaveProduct = () => {
    setEditProductDialog(false);
    toast({
      title: "Product Updated",
      description: `${currentProduct?.name} has been updated successfully.`,
    });
  };

  // Calculate low stock items
  React.useEffect(() => {
    const alerts = inventoryData
      .filter(item => item.stock <= item.reorder)
      .map(item => ({
        id: item.id,
        name: item.name,
        stock: item.stock,
        reorder: item.reorder
      }));
    
    setLowStockAlerts(alerts);
  }, []);
  
  if (!authenticated) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Admin Dashboard</CardTitle>
            <CardDescription className="text-center">Enter your password to access the admin area</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Sign In</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  // Total calculations for summary
  const totalOrders = orderData.length;
  const totalRevenue = orderData.reduce((sum, order) => sum + order.total, 0);
  const totalVisitors = chartData[chartData.length - 1].visitors;
  const totalInventoryValue = inventoryData.reduce((sum, item) => sum + (item.stock * item.price), 0);
  const totalCustomers = userData.length;
  
  // Calculate percent change
  const revenueYesterday = chartData[chartData.length - 2].revenue;
  const revenueToday = chartData[chartData.length - 1].revenue;
  const revenueChange = ((revenueToday - revenueYesterday) / revenueYesterday * 100).toFixed(1);
  
  const visitorsYesterday = chartData[chartData.length - 2].visitors;
  const visitorsToday = chartData[chartData.length - 1].visitors;
  const visitorsChange = ((visitorsToday - visitorsYesterday) / visitorsYesterday * 100).toFixed(1);

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Inbox className="h-5 w-5 mr-2" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-3 border-b flex justify-between items-center">
                <h3 className="font-medium">Notifications</h3>
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>Mark all read</Button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-3 border-b text-sm ${!notification.read ? 'bg-muted' : ''} hover:bg-muted/50 cursor-pointer`}
                      onClick={() => {
                        setNotifications(notifications.map(n => 
                          n.id === notification.id ? { ...n, read: true } : n
                        ));
                      }}
                    >
                      <div className="flex items-start gap-2">
                        {!notification.read && (
                          <div className="h-2 w-2 mt-1 rounded-full bg-blue-500" />
                        )}
                        <div>
                          <p className="font-medium">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" onClick={navigateToSettings}>
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </Button>
        </div>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="shadow-sm hover:shadow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {Number(revenueChange) >= 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">{revenueChange}%</span> from yesterday
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  <span className="text-red-500">{revenueChange}%</span> from yesterday
                </>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ChartBar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 7 days
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisitors}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {Number(visitorsChange) >= 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">{visitorsChange}%</span> from yesterday
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  <span className="text-red-500">{visitorsChange}%</span> from yesterday
                </>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalInventoryValue.toFixed(2)}
            </div>
            {lowStockAlerts.length > 0 ? (
              <p className="text-xs text-amber-600 flex items-center mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {lowStockAlerts.length} items low on stock
              </p>
            ) : (
              <p className="text-xs text-green-600 flex items-center mt-1">
                All items adequately stocked
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Alerts section for critical issues */}
      {lowStockAlerts.some(item => item.stock <= item.reorder / 2) && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have {lowStockAlerts.filter(item => item.stock <= item.reorder / 2).length} items with critically low stock that require immediate attention!
          </AlertDescription>
        </Alert>
      )}
      
      {/* Charts and tables */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full md:w-auto mb-2 flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Visitors</CardTitle>
                <CardDescription>View visitor and revenue trends over the past week</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="visitors" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Distribution of sales across product categories</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesByCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {salesByCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Orders by Day</CardTitle>
              <CardDescription>Number of orders placed each day</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>Items that need reordering soon</CardDescription>
              </div>
              {lowStockAlerts.length > 0 && (
                <Button size="sm">Order inventory</Button>
              )}
            </CardHeader>
            <CardContent>
              {lowStockAlerts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Reorder Point</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockAlerts.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>{item.reorder}</TableCell>
                        <TableCell>
                          <Badge variant={item.stock <= item.reorder / 2 ? "destructive" : "secondary"}>
                            {item.stock <= item.reorder / 2 ? 'Critical' : 'Low'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => handleOrderProduct(inventoryData.find(p => p.id === item.id))}>
                            Order now
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No low stock alerts at this time.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders placed on your store</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>List of recent orders</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderData.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'Delivered' ? "default" : "secondary"}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => handleViewOrder(order)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>Monitor and manage product inventory</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search products..." className="pl-9 w-full" />
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>Complete inventory list</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryData.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">#{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              product.stock > product.reorder ? "default" : 
                              product.stock <= product.reorder / 2 ? "destructive" : "secondary"
                            }
                          >
                            {product.stock > product.reorder ? 'In Stock' : 
                             product.stock <= product.reorder / 2 ? 'Critical' : 'Low Stock'}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewProduct(product)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleOrderProduct(product)}>
                            <Archive className="h-4 w-4 mr-2" />
                            Order
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>View and manage customer information</CardDescription>
              </div>
              <div className="relative w-full sm:w-[250px]">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search customers..." className="pl-9 w-full" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>Complete customer list</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Last Order</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userData.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">#{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.orders}</TableCell>
                        <TableCell>{user.lastOrder}</TableCell>
                        <TableCell>${user.totalSpent.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => handleViewCustomer(user)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Order Dialog */}
      <Dialog open={viewOrderDialog} onOpenChange={setViewOrderDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order #{currentOrder?.id}</DialogTitle>
            <DialogDescription>
              Order details and items
            </DialogDescription>
          </DialogHeader>
          {currentOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{currentOrder.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{currentOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={currentOrder.status === 'Delivered' ? "default" : "secondary"}>
                    {currentOrder.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-medium">${currentOrder.total.toFixed(2)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="bg-muted p-3 rounded-md">
                  <p>Sample Items (would come from database in real app)</p>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Premium Scotch x1</li>
                    <li>Craft IPA x2</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOrderDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={viewProductDialog} onOpenChange={setViewProductDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentProduct?.name}</DialogTitle>
            <DialogDescription>
              Product details and information
            </DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="font-medium">#{currentProduct.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{currentProduct.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">${currentProduct.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Stock</p>
                  <p className="font-medium">{currentProduct.stock}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reorder Point</p>
                  <p className="font-medium">{currentProduct.reorder}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge 
                    variant={
                      currentProduct.stock > currentProduct.reorder ? "default" : 
                      currentProduct.stock <= currentProduct.reorder / 2 ? "destructive" : "secondary"
                    }
                  >
                    {currentProduct.stock > currentProduct.reorder ? 'In Stock' : 
                     currentProduct.stock <= currentProduct.reorder / 2 ? 'Critical' : 'Low Stock'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewProductDialog(false)}>Close</Button>
            <Button onClick={() => {
              setViewProductDialog(false);
              handleEditProduct(currentProduct);
            }}>Edit Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={editProductDialog} onOpenChange={setEditProductDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit {currentProduct?.name}</DialogTitle>
            <DialogDescription>
              Make changes to product information
            </DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="name">Product Name</label>
                <Input id="name" value={currentProduct.name} onChange={() => {}} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="category">Category</label>
                <Select defaultValue={currentProduct.category}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Spirits">Spirits</SelectItem>
                    <SelectItem value="Beer">Beer</SelectItem>
                    <SelectItem value="Wine">Wine</SelectItem>
                    <SelectItem value="Non-Alcoholic">Non-Alcoholic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="price">Price ($)</label>
                  <Input id="price" type="number" value={currentProduct.price} onChange={() => {}} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="stock">Stock Quantity</label>
                  <Input id="stock" type="number" value={currentProduct.stock} onChange={() => {}} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="reorder">Reorder Point</label>
                <Input id="reorder" type="number" value={currentProduct.reorder} onChange={() => {}} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProductDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Product Dialog */}
      <Dialog open={orderProductDialog} onOpenChange={setOrderProductDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Order {currentProduct?.name}</DialogTitle>
            <DialogDescription>
              Place an order to restock this product
            </DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Stock</p>
                  <p className="font-medium">{currentProduct.stock}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reorder Point</p>
                  <p className="font-medium">{currentProduct.reorder}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="orderQuantity">Order Quantity</label>
                <Input id="orderQuantity" type="number" defaultValue={currentProduct.reorder * 2} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="supplier">Supplier</label>
                <Select defaultValue="supplier1">
                  <SelectTrigger id="supplier">
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplier1">Main Distributor Ltd.</SelectItem>
                    <SelectItem value="supplier2">Wholesale Beverages Co.</SelectItem>
                    <SelectItem value="supplier3">Direct from Manufacturer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="notes">Notes</label>
                <Input id="notes" placeholder="Additional order instructions..." />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderProductDialog(false)}>Cancel</Button>
            <Button onClick={handlePlaceOrder}>Place Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Customer Dialog */}
      <Dialog open={viewCustomerDialog} onOpenChange={setViewCustomerDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Customer Profile: {currentCustomer?.name}</DialogTitle>
            <DialogDescription>
              Customer details and purchase history
            </DialogDescription>
          </DialogHeader>
          {currentCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer ID</p>
                  <p className="font-medium">#{currentCustomer.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{currentCustomer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="font-medium">{currentCustomer.orders}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Order</p>
                  <p className="font-medium">{currentCustomer.lastOrder}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="font-medium">${currentCustomer.totalSpent.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Recent Orders</h3>
                <div className="bg-muted p-3 rounded-md">
                  <p>Last 3 orders (would come from database in real app)</p>
                  <ul className="mt-2 space-y-2">
                    <li className="flex justify-between">
                      <span>#1245 - 2025-05-01</span>
                      <span>$59.99</span>
                    </li>
                    <li className="flex justify-between">
                      <span>#1232 - 2025-04-25</span>
                      <span>$87.50</span>
                    </li>
                    <li className="flex justify-between">
                      <span>#1224 - 2025-04-18</span>
                      <span>$32.99</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewCustomerDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
