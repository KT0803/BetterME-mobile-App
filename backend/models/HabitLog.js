const mongoose = require('mongoose');

const habitLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    habit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit',
        required: true
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    progress: {
        type: Number,
        default: 0
    },
    note: {
        type: String,
        trim: true
    }
});

// Compound index to ensure one log per habit per day
habitLogSchema.index({ habit: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HabitLog', habitLogSchema);
