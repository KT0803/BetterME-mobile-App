const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    habits: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Routine', routineSchema);
