const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const HabitLog = require('../models/HabitLog');

// @route   GET /api/stats/heatmap
// @desc    Get heatmap data (count of completed habits per day)
// @access  Private
router.get('/heatmap', auth, async (req, res) => {
    try {
        const logs = await HabitLog.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id), completed: true } },
            {
                $group: {
                    _id: '$date',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Transform to object { date: count }
        const heatmapData = {};
        logs.forEach(log => {
            heatmapData[log._id] = log.count;
        });

        res.json(heatmapData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
