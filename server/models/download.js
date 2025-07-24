// server/models/download.js

const mongoose = require('mongoose');

// This is the blueprint for the data we will store for each download.
const downloadSchema = new mongoose.Schema({
    // The unique string the user will use to download the file.
    token: {
        type: String,
        required: true, // A token is always required.
        unique: true      // Each token must be unique.
    },
    // The timestamp for when this token will expire.
    expiresAt: {
        type: Date,
        required: true // An expiration date is always required.
    }
});

// This exports the schema as a "Model".
// We can now use this Model in other files to interact with the 'downloads' collection in MongoDB.
module.exports = mongoose.model('Download', downloadSchema);