const express = require('express');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHanlder');
const cors = require('cors');
const PORT = process.env.PORT;

// Initialize App
const app = express();

// Logging Middleware
app.use(morgan('dev'));

// Body Parser Setup
app.use(express.json());

// Enable Cors
app.use(cors());

// Error Handler Middleware
app.use(errorHandler);

// Serve "Public" folder as a static directory
app.use(express.static(__dirname + '/public'));

// PORT Setup and Server Setup on PORT
app.listen(PORT, async () => {
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
