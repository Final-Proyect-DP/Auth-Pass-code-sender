const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const sendResetEmail = require('../utils/email');

const router = express.Router();

module.exports = (redisClient) => {
    
    router.post('/check-email', async (req, res) => {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'Email not found' });
        }

        const resetCode = Math.floor(1000 + Math.random() * 9000).toString(); 
        const hashedCode = await bcrypt.hash(resetCode, 10); 
        redisClient.setex(email, 180, resetCode); 

        try {
            await sendResetEmail(email, resetCode);
            res.send({ email });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Error sending email' });
        }
    });

    return router;
};
