const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Routine = require('../models/Routine');

// @route   GET /api/routines
// @desc    Get all routines
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const routines = await Routine.find({ user: req.user.id }).populate('habits');
        res.json(routines);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/routines
// @desc    Create a new routine
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { name, habits } = req.body;

        const newRoutine = new Routine({
            user: req.user.id,
            name,
            habits
        });

        const routine = await newRoutine.save();
        res.json(routine);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/routines/:id
// @desc    Update a routine
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, habits } = req.body;

        let routine = await Routine.findById(req.params.id);

        if (!routine) return res.status(404).json({ message: 'Routine not found' });

        if (routine.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        routine = await Routine.findByIdAndUpdate(
            req.params.id,
            { $set: { name, habits } },
            { new: true }
        ).populate('habits');

        res.json(routine);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/routines/:id
// @desc    Delete a routine
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let routine = await Routine.findById(req.params.id);

        if (!routine) return res.status(404).json({ message: 'Routine not found' });

        if (routine.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Routine.findByIdAndDelete(req.params.id);

        res.json({ message: 'Routine removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
