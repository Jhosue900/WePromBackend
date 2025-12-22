const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const router = require("./src/routes/routes");

const app = express();

app.set("port", process.env.PORT || 4000);

// ⭐ CONFIGURACIÓN CORS ULTRA SIMPLE - PERMITE TODO ⭐
app.use(cors({
  origin: '*', // Permite todos los orígenes (para desarrollo)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
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
  console.log(`📍 URL: http://localhost:${PORT}`);
});