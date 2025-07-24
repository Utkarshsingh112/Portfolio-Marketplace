// server/models/resume.js

const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // Store price in cents to avoid floating point issues
    priceInCents: {
        type: Number,
        required: true,
    },
    // The name of the file in the /assets folder
    fileName: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Resume', resumeSchema);