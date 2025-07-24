// server/routes/api.js

const express = require('express');
const crypto = require('crypto');
const path = require('path');
const Download = require('../models/download');
const Resume = require('../models/resume'); // Import the new model

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// --- API Endpoint to Get All Resumes ---
router.get('/resumes', async (req, res) => {
    try {
        const resumes = await Resume.find({});
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// --- API Endpoint to Create a Payment Session (Marketplace Version) ---
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { resumeId } = req.body;

        const resume = await Resume.findById(resumeId);
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found.' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const newDownload = new Download({ token, expiresAt, resumeFile: resume.fileName });
        await newDownload.save();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: resume.title },
                    unit_amount: resume.priceInCents,
                },
                quantity: 1,
            }],
            success_url: `${process.env.CLIENT_URL}/success?token=${token}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
        });

        res.json({ url: session.url });

    } catch (error) {
        console.error('Error creating Stripe session:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// --- API Endpoint to Verify Token and Download File (Marketplace Version) ---
router.get('/download/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const download = await Download.findOne({ token });

        if (!download || new Date() > download.expiresAt) {
            return res.status(404).send('This download link is invalid or has expired.');
        }

        const filePath = path.join(__dirname, '..', 'assets', download.resumeFile);

        res.download(filePath, download.resumeFile, (err) => {
            if (err) {
                console.error('File download error:', err);
                res.status(500).send('Could not download the file.');
            }
        });

    } catch (error) {
        console.error('Download route error:', error);
        res.status(500).send('An internal server error occurred.');
    }
});

module.exports = router;