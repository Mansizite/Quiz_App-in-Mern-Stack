const express = require('express');
const router = express.Router();
const { auth } = require('../auth/auth');  // Assuming auth middleware is in place
const { getAllQuestions, checkAnswer, register, getAllScores, postQuestion } = require('../controller/questionController');

// Routes
router.post('/postquestion', postQuestion);
router.get('/getAllquestions', auth, getAllQuestions); // Protected route
router.post('/check-answer', auth, checkAnswer); // Protected route
router.post('/register', register);  // Registration route
router.get('/scores', getAllScores);  // Scores route

module.exports = router;
