const Question = require('../model/question');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

// Post a new question
exports.postQuestion = async (req, res) => {
    const { question, answer, options } = req.body;
    try {
        const newQuestion = new Question({ question, answer, options });
        await newQuestion.save();
        res.status(201).json({ message: "Question added successfully", newQuestion });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error adding question', error: error.message });
    }
};

// Get all questions
exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find(); 
        res.status(200).json(questions);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error fetching questions', error: error.message });
    }
};

// Check answers and calculate score
exports.checkAnswer = async (req, res) => {
    const userAnswers = req.body.answers; // User's answers from the frontend
    let score = 0;

    try {
        // Fetch all questions to check answers
        const questions = await Question.find();

        // Check each question answer
        questions.forEach((question, index) => {
            if (userAnswers[index] === question.answer) {
                score++;
            }
        });

        console.log('Calculated score:', score); // Debug log

        const userId = req.user._id; // Assuming req.user contains the logged-in user's data
        await User.findByIdAndUpdate(userId, { score });

        // Return the score and total number of questions
        res.json({ score, total: questions.length });

    } catch (error) {
        res.status(500).json({ message: 'Error checking answers', error });
    }
};

// Get all users' scores
exports.getAllScores = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        const scores = users.map(user => ({
            name: user.name,
            score: user.score,
        }));
        res.status(200).json(scores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user scores' });
    }
};

// Register a new user or return existing user with questions
exports.register = async (req, res) => {
    const { name } = req.body;
    console.log("Attempting to register user:", name);  // Debug log
    
    try {
        // Check if the user already exists in the database
        const existingUser = await User.findOne({ name });
        
        if (existingUser) {
            console.log("User already exists");
            // If user exists, generate a token and return user info along with questions
            const token = jwt.sign({ id: existingUser._id, name: existingUser.name }, process.env.SECRET_KEY);
            
            // Fetch all questions after user is found (either new or existing)
            const questions = await Question.find();
            return res.status(200).json({
                token,
                name: existingUser.name,
                score: existingUser.score,
                questions  // Send questions to the existing user
            });
        }

        // If user doesn't exist, create a new user
        const newUser = new User({ name, score: 0 });
        await newUser.save();
        console.log("New user created:", newUser);

        // Generate JWT token for the new user
        const token = jwt.sign({ id: newUser._id, name: newUser.name }, process.env.SECRET_KEY);

        // Fetch all questions after user registration
        const questions = await Question.find();

        return res.status(201).json({
            token,
            name: newUser.name,
            score: newUser.score,
            questions  // Send questions to the new user
        });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: 'Server error' });
    }
};
