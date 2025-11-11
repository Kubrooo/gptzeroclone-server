import mongoose from "mongoose";

const detectionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
        maxlength: 10000
    }, 
    aiProbability: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    metrics: {
        entropy: Number,
        burstiness: Number,
        perplexity: Number,
        repetition: Number
    },
    wordCount: {
        type: Number,
        required: true
    },
    characters: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Detection', detectionSchema);