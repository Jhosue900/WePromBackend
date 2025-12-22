// src/controllers/controllers.js
require('dotenv').config();
const supabase = require("../db/supabaseClient");



// ==========================================
// NUEVOS CONTROLADORES - CAMPAÑAS
// ==========================================

const getCampaigns = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('campaigns')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error("Error obteniendo campañas:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

const createCampaign = async (req, res) => {
    try {
        const { title, description } = req.body;
        const file = req.file;

        let imageUrl = null;

        // Si hay archivo, subirlo a Supabase Storage
        if (file) {
            const fileName = `campaign-${Date.now()}-${file.originalname}`;
            const filePath = `campaigns/${fileName}`;

            // Subir imagen a Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('weprom-images')
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Obtener URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('weprom-images')
                .getPublicUrl(filePath);

            imageUrl = publicUrl;
        }

        // Insertar campaña en la base de datos
        const { data, error } = await supabase
            .from('campaigns')
            .insert([{ title, description, img: imageUrl }])
            .select();

        if (error) throw error;

        res.status(201).json({ success: true, data: data[0] });
    } catch (error) {
        console.error("Error creando campaña:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

const updateCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, desc } = req.body;
        const file = req.file;

        let updateData = { title, desc };

        // Si hay nueva imagen, subirla
        if (file) {
            const fileName = `campaign-${Date.now()}-${file.originalname}`;
            const filePath = `campaigns/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('weprom-images')
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('weprom-images')
                .getPublicUrl(filePath);

            updateData.img = publicUrl;
        }

        const { data, error } = await supabase
            .from('campaigns')
            .update(updateData)
            .eq('id', id)
            .select();

        if (error) throw error;

        res.json({ success: true, data: data[0] });
    } catch (error) {
        console.error("Error actualizando campaña:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

const deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('campaigns')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ success: true, message: 'Campaña eliminada' });
    } catch (error) {
        console.error("Error eliminando campaña:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// ==========================================
// NUEVOS CONTROLADORES - PRODUCTOS
// ==========================================

const getProducts = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error("Error obteniendo productos:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, price, stock } = req.body;
        const file = req.file;

        let imageUrl = null;

        if (file) {
            const fileName = `product-${Date.now()}-${file.originalname}`;
            const filePath = `products/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('weprom-images')
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('weprom-images')
                .getPublicUrl(filePath);

            imageUrl = publicUrl;
        }

        const { data, error } = await supabase
            .from('products')
            .insert([{
                name,
                price,
                stock: parseInt(stock),
                img: imageUrl
            }])
            .select();

        if (error) throw error;

        res.status(201).json({ success: true, data: data[0] });
    } catch (error) {
        console.error("Error creando producto:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, stock } = req.body;
        const file = req.file;

        let updateData = { name, price, stock: parseInt(stock) };

        if (file) {
            const fileName = `product-${Date.now()}-${file.originalname}`;
            const filePath = `products/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('weprom-images')
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('weprom-images')
                .getPublicUrl(filePath);

            updateData.img = publicUrl;
        }

        const { data, error } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', id)
            .select();

        if (error) throw error;

        res.json({ success: true, data: data[0] });
    } catch (error) {
        console.error("Error actualizando producto:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ success: true, message: 'Producto eliminado' });
    } catch (error) {
        console.error("Error eliminando producto:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// ==========================================
// EXPORTAR TODOS LOS CONTROLADORES
// ==========================================

module.exports = {

    
    // Nuevos controladores de campañas
    getCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    
    // Nuevos controladores de productos
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
};