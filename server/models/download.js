// server/models/download.js

const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    // Add this line to link the token to the file
    resumeFile: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Download', downloadSchema);