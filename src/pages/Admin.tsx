
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartBar, DollarSign, Users, TrendingUp, TrendingDown, Package, FileText, Inbox } from 'lucide-react';

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
  
  // In a real application, this would use a proper authentication system
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
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
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your password to access the admin dashboard</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit">Sign In</Button>
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="relative">
          <Button variant="outline" className="relative">
            <Inbox className="h-5 w-5" />
            <span className="ml-2">Notifications</span>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </Button>
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 hidden group-hover:block">
            <div className="p-3 border-b flex justify-between items-center">
              <h3 className="font-medium">Notifications</h3>
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>Mark all read</Button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {notifications.map(notification => (
                <div key={notification.id} className={`p-3 border-b text-sm ${!notification.read ? 'bg-muted' : ''}`}>
                  <p className="font-medium">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
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
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 7 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
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
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalInventoryValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {lowStockAlerts.length} items low on stock
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and tables */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full md:w-auto">
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
                    <Tooltip />
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
            <CardHeader>
              <CardTitle>Low Stock Alerts</CardTitle>
              <CardDescription>Items that need reordering soon</CardDescription>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockAlerts.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>{item.reorder}</TableCell>
                        <TableCell>
                          <span className={`inline-block px-2 py-1 text-xs rounded ${
                            item.stock <= item.reorder / 2 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.stock <= item.reorder / 2 ? 'Critical' : 'Low'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-4">No low stock alerts at this time.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders placed on your store</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
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
                        <span className={`inline-block px-2 py-1 text-xs rounded ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>Monitor and manage product inventory</CardDescription>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Search products..." className="w-[250px]" />
                <Button>Add Product</Button>
              </div>
            </CardHeader>
            <CardContent>
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
                        <span className={`inline-block px-2 py-1 text-xs rounded ${
                          product.stock > product.reorder ? 'bg-green-100 text-green-800' : 
                          product.stock <= product.reorder / 2 ? 'bg-red-100 text-red-800' : 
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {product.stock > product.reorder ? 'In Stock' : 
                           product.stock <= product.reorder / 2 ? 'Critical' : 'Low Stock'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>View and manage customer information</CardDescription>
              </div>
              <Input placeholder="Search customers..." className="w-[250px]" />
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Complete customer list</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead className="text-right">Total Spent</TableHead>
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
                      <TableCell className="text-right">${user.totalSpent.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
