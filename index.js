const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const router = require("./src/routes/routes")

const app = express();

app.set("port", process.env.PORT || 4000);

// ⭐⭐ CONFIGURACIÓN CORS SIMPLIFICADA ⭐⭐
const corsOptions = {
  origin: [
    'http://localhost:5173',      // Tu frontend local
    'http://localhost:3000',      // Otro puerto común
    'https://we-prom.vercel.app', // Tu frontend en producción (cámbialo si es diferente)
    'https://tu-frontend.vercel.app' // Ejemplo - cambia por tu URL real
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Aplicar CORS antes de cualquier middleware
app.use(cors(corsOptions));

// ⭐⭐ COMENTA O ELIMINA ESTA LÍNEA PROBLEMÁTICA ⭐⭐
// app.options('*', cors(corsOptions)); // ❌ ELIMINA ESTO

// Headers adicionales (opcional, pero bueno para preflight)
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

// Resto de tu código se mantiene igual...
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

// Manejo de errores global...
// ... (tu código existente)

app.listen(app.get("port"))
console.log("Server running on port ", app.get("port"))