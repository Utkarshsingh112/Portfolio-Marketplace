// server/routes/api.js

const express = require('express');
const crypto = require('crypto'); // Built-in Node.js module for generating random strings
const Download = require('../models/download'); // Import our Download model

// Initialize the Stripe client with your secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// --- API Endpoint to Create a Payment Session --- 💳
router.post('/create-checkout-session', async (req, res) => {
    try {
        // 1. Generate a secure, unique token for the download link
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

        // 2. Save the token and expiration date to the database
        const newDownload = new Download({ token, expiresAt });
        await newDownload.save();

        // 3. Create a Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Personal Resume Download',
                    },
                    unit_amount: 500, // Price in cents ($5.00)
                },
                quantity: 1,
            }],
            // On success, redirect to the frontend's success page with the token
            success_url: `${process.env.CLIENT_URL}/success?token=${token}`,
            // On cancellation, redirect to the frontend's cancel page
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
        });

        // 4. Send the session URL back to the frontend
        res.json({ url: session.url });

    } catch (error) {
        console.error('Error creating Stripe session:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

module.exports = router;