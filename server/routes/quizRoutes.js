const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Quiz = require('../models/Quiz');


router.get('/', authMiddleware, async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err)
 {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'Organizer') {
      return res.status(403).json({ msg: 'Access forbidden: Organizers only' });
  }

  try {
    const { title, questions } = req.body;

    const newQuiz = new Quiz({
      title,
      questions,
      createdBy: req.user.id
    });

    const quiz = await newQuiz.save();
    res.status(201).json(quiz);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;