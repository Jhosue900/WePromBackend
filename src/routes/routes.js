// src/routes/routes.js
const { Router } = require("express");
const multer = require("multer");

// Importar controladores
const {
    getCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/controllers");

// Importar controladores de autenticación
const {
    login,
    logout,
    verifyToken,
    authenticateToken
} = require("../controllers/authController");

const router = Router();

// ==========================================
// CONFIGURACIÓN DE MULTER
// ==========================================
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Límite de 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'));
        }
    }
});

// ==========================================
// RUTAS DE AUTENTICACIÓN (PÚBLICAS)
// ==========================================
router.post('/auth/login', login);
router.post('/auth/logout', authenticateToken, logout);
router.get('/auth/verify', authenticateToken, verifyToken);

// ==========================================
// RUTAS DE CAMPAÑAS (PROTEGIDAS)
// ==========================================
router.get('/campaigns', getCampaigns);
router.post('/campaigns', authenticateToken, upload.single('image'), createCampaign);
router.put('/campaigns/:id', authenticateToken, upload.single('image'), updateCampaign);
router.delete('/campaigns/:id', authenticateToken, deleteCampaign);

// ==========================================
// RUTAS DE PRODUCTOS (PROTEGIDAS)
// ==========================================
router.get('/products', getProducts);
router.post('/products', authenticateToken, upload.single('image'), createProduct);
router.put('/products/:id', authenticateToken, upload.single('image'), updateProduct);
router.delete('/products/:id', authenticateToken, deleteProduct);

module.exports = router;