import express, { json } from 'express';
import { static as expressStatic } from 'express';import cors from 'cors';
import { config } from 'dotenv';

// Load environment variables
config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/analytics', require('./routes/analytics'));

// Add routes for categories and orders
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(expressStatic('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));