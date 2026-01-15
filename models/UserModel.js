const mongoose = require('mongoose');

// When running tests we don't want to require a real MongoDB connection.
// Provide a lightweight in-memory model that implements the minimal API
// used by the controllers (findOne, find, findById, save via instance).

    const UserModel = new mongoose.Schema(
        {
            name: {
                type: String,
                required: true,
                trim: true,
            },
            password:{
                type: String,
                required: true,
                trim: true,
            },
            email: {
                type: String,
                required: true,
                unique: true,
                lowercase: true,
            },
            preferences: {
                type: [String],
                default: []
            }
        },
        {
            timestamps: true,
            collection: 'user'
        }
    );

    module.exports = mongoose.model("user", UserModel);