// src/controllers/authController.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Clave secreta para JWT - ¡IMPORTANTE! Debe estar en tu .env
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambiar_en_produccion';

// Lista negra de tokens (para logout)
// En producción deberías usar Redis o una base de datos
let tokenBlacklist = new Set();

// Usuario de prueba (en producción deberías consultar tu base de datos)
const ADMIN_USER = {
  id: 1,
  email: 'admin@weprom.com',
  // Password: "admin123" (hasheado con bcrypt)
  password: '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa'
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que vengan los datos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Verificar que el usuario existe
    if (email !== ADMIN_USER.email) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    // Verificar contraseña
    //const isValidPassword = await bcrypt.compare(password, ADMIN_USER.password);
    
    if (passsword !== ADMIN_USER.password) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña incorrecta'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: ADMIN_USER.id, 
        email: ADMIN_USER.email 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: ADMIN_USER.id,
        email: ADMIN_USER.email
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      // Agregar el token a la lista negra
      tokenBlacklist.add(token);
      
      // Opcional: limpiar tokens expirados después de cierto tiempo
      // En producción esto debería ser manejado por Redis con TTL
    }

    res.json({
      success: true,
      message: 'Logout exitoso'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Verificar token
const verifyToken = async (req, res) => {
  try {
    res.json({
      success: true,
      valid: true,
      user: req.user
    });
  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

// Middleware para proteger rutas
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado'
    });
  }

  // Verificar si el token está en la lista negra
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    
    req.user = user;
    next();
  });
};

module.exports = {
  login,
  logout,
  verifyToken,
  authenticateToken
};