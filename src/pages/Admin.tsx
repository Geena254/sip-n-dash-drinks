
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChartBar, DollarSign, Users, TrendingUp, TrendingDown } from 'lucide-react';

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

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
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
  
  // Calculate percent change
  const revenueYesterday = chartData[chartData.length - 2].revenue;
  const revenueToday = chartData[chartData.length - 1].revenue;
  const revenueChange = ((revenueToday - revenueYesterday) / revenueYesterday * 100).toFixed(1);
  
  const visitorsYesterday = chartData[chartData.length - 2].visitors;
  const visitorsToday = chartData[chartData.length - 1].visitors;
  const visitorsChange = ((visitorsToday - visitorsYesterday) / visitorsYesterday * 100).toFixed(1);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
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
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalRevenue / totalOrders).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 7 days
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and tables */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
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
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders placed on your store</CardDescription>
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
      </Tabs>
    </div>
  );
};

export default Admin;
