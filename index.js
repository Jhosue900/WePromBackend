const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const router = require("./src/routes/routes")

const app = express();

app.set("port", process.env.PORT || 4000);

// Configuración CORS para desarrollo y producción
const corsOptions = {
  origin: function (origin, callback) {
    // En desarrollo, permitir todos los orígenes
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // En producción, lista de orígenes permitidos
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://tu-frontend.vercel.app', // Cambia por tu frontend real
      'https://we-prom.vercel.app' // Si tu frontend está en Vercel
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  optionsSuccessStatus: 200
};

// Aplicar CORS antes de cualquier middleware
app.use(cors(corsOptions));

// Para preflight requests
app.options('*', cors(corsOptions));

// Headers adicionales
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Manejar preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(router)

// Ruta de prueba
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

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Si es error de CORS
  if (err.message === 'Origen no permitido por CORS') {
    return res.status(403).json({
      success: false,
      message: 'Origen no permitido'
    });
  }
  
  // Si es error de Multer
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'El archivo es demasiado grande (máximo 5MB)'
    });
  }
  
  if (err.message === 'Solo se permiten archivos de imagen') {
    return res.status(400).json({
      success: false,
      message: 'Solo se permiten archivos de imagen'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(app.get("port"))
console.log("Server running on port ", app.get("port"))