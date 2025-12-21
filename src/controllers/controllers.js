require('dotenv').config();
const supabase = require("../db/supabaseClient");


// Client services

const makeReservation = async (req, res) => {
    try {
        const { name, email, phone, date, time, numberOfPersons, specialNeeds } = req.body;

        const { data, error } = await supabase   
            .from('reservations')
            .insert({
                name,
                email,
                phone,
                date,
                time,
                numberOfPersons,      
                specialNeeds          
            })
            .select();

        if (error) throw error;
        
        res.status(201).json({ 
            success: true, 
            data 
        });

    } catch (error) {
        console.error("Error in the petition:", error);
        return res.status(400).json({ error: error.message });
    }
}

const sendMessage = async(req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        const { data, error } = await supabase
            .from("messages")
            .insert({
                name,
                email,
                subject,
                message
            })
            .select();

        if (error) throw error;
        
        res.status(201).json({ 
            success: true, 
            data 
        });
        
    } catch (error) {
        console.error("Error in the petition:", error);
        return res.status(400).json({ error: error.message });
    }
}

const makeOrder = async(req, res) => {
    try {
        const { name, phone, specialNotes, products, total, shippingType, status } = req.body;

        const { data, error } = await supabase
            .from("orders")
            .insert({
                name,
                phone,
                specialNotes,     // Ajusta según tu tabla
                products,
                total,
                shippingType,     // Ajusta según tu tabla
                status
            })
            .select();

        if (error) throw error;
        
        res.status(201).json({ 
            success: true, 
            data 
        });
        
    } catch (error) {
        console.error("Error in the petition:", error);
        return res.status(400).json({ error: error.message });
    }
}



//Dashboard services

const showOrders = async(req, res) => {
    try {
        
        const { data, error } = await supabase
        .from('orders')
        .select('*');

        if(error) throw error;

        res.send(data)
        
    } catch (error) {
        console.error("Error in the petition:", error);
        return res.status(400).json({ error: error.message });
    }
}


const showReservations = async(req, res) => {
    try {
        
        const { data, error } = await supabase
        .from('reservations')
        .select('*');

        if(error) throw error;

        res.send(data)
        
    } catch (error) {
        console.error("Error in the petition:", error);
        return res.status(400).json({ error: error.message });
    }
}


const showMessages = async(req, res) => {
    try {
        
        const { data, error } = await supabase
        .from('messages')
        .select('*');

        if(error) throw error;

        res.send(data)
        
    } catch (error) {
        console.error("Error in the petition:", error);
        return res.status(400).json({ error: error.message });
    }
}
module.exports = {
    makeReservation,
    sendMessage,
    makeOrder,
    showOrders,
    showMessages,
    showReservations
}