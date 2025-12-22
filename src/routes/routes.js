// src/routes/routes.js
const { Router } = require("express");
const multer = require("multer");

// Importar todos los controladores
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
        // Solo permitir imágenes
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'));
        }
    }
});



// ==========================================
// NUEVAS RUTAS - CAMPAÑAS
// ==========================================
router.get('/campaigns', getCampaigns);
router.post('/campaigns', upload.single('image'), createCampaign);
router.put('/campaigns/:id', upload.single('image'), updateCampaign);
router.delete('/campaigns/:id', deleteCampaign);

// ==========================================
// NUEVAS RUTAS - PRODUCTOS
// ==========================================
router.get('/products', getProducts);
router.post('/products', upload.single('image'), createProduct);
router.put('/products/:id', upload.single('image'), updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;