const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Check this path
const Result = require('../models/Result'); // Check this path

// @route   POST /api/results
// @desc    Save a quiz result
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { quizId, score, totalQuestions } = req.body;
    const newResult = new Result({
      quiz: quizId,
      user: req.user.id,
      score,
      totalQuestions
    });
    await newResult.save();
    res.status(201).json({ msg: 'Result saved successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/results/:quizId
// @desc    Get leaderboard for a specific quiz
// @access  Private
router.get('/:quizId', authMiddleware, async (req, res) => {
  try {
    const leaderboard = await Result.find({ quiz: req.params.quizId })
      .sort({ score: -1 })
      .limit(10)
      .populate('user', 'name');

    res.json(leaderboard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;