const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');

// @route   GET /api/habits
// @desc    Get all habits for user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const habits = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(habits);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/habits
// @desc    Create a new habit
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { name, category, targetType, targetValue } = req.body;

        const newHabit = new Habit({
            user: req.user.id,
            name,
            category,
            targetType,
            targetValue
        });

        const habit = await newHabit.save();
        res.json(habit);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/habits/:id
// @desc    Update a habit
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, category, targetType, targetValue, isActive } = req.body;

        let habit = await Habit.findById(req.params.id);

        if (!habit) return res.status(404).json({ message: 'Habit not found' });

        // Make sure user owns habit
        if (habit.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        habit = await Habit.findByIdAndUpdate(
            req.params.id,
            { $set: { name, category, targetType, targetValue, isActive } },
            { new: true }
        );

        res.json(habit);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/habits/:id
// @desc    Delete a habit
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let habit = await Habit.findById(req.params.id);

        if (!habit) return res.status(404).json({ message: 'Habit not found' });

        // Make sure user owns habit
        if (habit.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Habit.findByIdAndDelete(req.params.id);

        // Also delete logs for this habit
        await HabitLog.deleteMany({ habit: req.params.id });

        res.json({ message: 'Habit removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/habits/log
// @desc    Log habit progress for a day
// @access  Private
router.post('/log', auth, async (req, res) => {
    try {
        const { habitId, date, completed, progress, note } = req.body;

        let log = await HabitLog.findOne({ habit: habitId, date });

        if (log) {
            // Update existing log
            log.completed = completed !== undefined ? completed : log.completed;
            log.progress = progress !== undefined ? progress : log.progress;
            log.note = note !== undefined ? note : log.note;
            await log.save();
        } else {
            // Create new log
            log = new HabitLog({
                user: req.user.id,
                habit: habitId,
                date,
                completed,
                progress,
                note
            });
            await log.save();
        }

        res.json(log);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/habits/logs/:date
// @desc    Get all habit logs for a specific date
// @access  Private
router.get('/logs/:date', auth, async (req, res) => {
    try {
        const logs = await HabitLog.find({ user: req.user.id, date: req.params.date });
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
