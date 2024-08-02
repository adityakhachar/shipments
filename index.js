const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();
const emailRoute = require('.//routes/email.js')
const app = express();
const scheduler = require('./scheduler.js'); // Add this line

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Automated Email Scheduling API!');
});
// Use routes
app.use('/email', emailRoute);
// app.use('/api/categories', categoryRoutes); // Make sure this line is correct
// app.use('/api/vehicles', vehicleRoutes);
// app.use('/api/cityprices', cityPriceRoutes);
// app.use('/api/admin',adminRoutes)


// Start server
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
    scheduler.scheduleEmails();
  });
