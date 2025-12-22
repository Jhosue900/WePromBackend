const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const router = require("./src/routes/routes");

const app = express();

app.set("port", process.env.PORT || 4000);

// ⭐ CONFIGURACIÓN CORS COMPLETA ⭐
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4000',
  'https://we-prom.vercel.app',
  'https://we-prom-backend.vercel.app'
];

// Middleware CORS manual ANTES de todo
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Si el origin está en la lista permitida, o no hay origin (llamadas desde servidor)
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Middleware adicional de CORS usando el paquete
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (Postman, apps móviles, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('⚠️ Origen no permitido:', origin);
      // Para desarrollo, permitir de todas formas
      callback(null, true);
      // Para producción estricta, descomentar:
      // callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Middleware de logging
app.use(morgan("dev"));

// Parseo de JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use(router);

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API WeProm funcionando correctamente ✅',
    timestamp: new Date().toISOString(),
    endpoints: {
      campaigns: {
        getAll: 'GET /campaigns',
        create: 'POST /campaigns',
        update: 'PUT /campaigns/:id',
        delete: 'DELETE /campaigns/:id'
      },
      products: {
        getAll: 'GET /products',
        create: 'POST /products',
        update: 'PUT /products/:id',
        delete: 'DELETE /products/:id'
      }
    }
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Iniciar servidor
const PORT = app.get("port");
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Orígenes permitidos:`, allowedOrigins);
});