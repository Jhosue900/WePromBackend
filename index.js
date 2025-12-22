const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const router = require("./src/routes/routes");

const app = express();

app.set("port", process.env.PORT || 4000);

// ⭐ SIMPLIFIED CORS CONFIGURATION ⭐
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://we-prom.vercel.app',
      'https://your-frontend-domain.vercel.app' // Update with your actual domain
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // For development, allow all origins
      // In production, use: callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware FIRST
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Other middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(router);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API WeProm funcionando',
    endpoints: {
      campaigns: '/campaigns',
      products: '/products'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start server
app.listen(app.get("port"), () => {
  console.log("Server running on port", app.get("port"));
});