const mongoose = require('mongoose');

const NewsModel = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        authors: {
            type: [String],
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        url: {
            type: String,
            required: true,
        },
        urlToImage: {
            type: String,
        },
        publishedAt: {
            type: Date,
            required: true,
        },
        source: {
            type: String,
        },
        content: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('news', NewsModel);