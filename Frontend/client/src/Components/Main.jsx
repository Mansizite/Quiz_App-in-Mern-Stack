import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Main.css';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userName, setUserName] = useState('');
  const [allScores, setAllScores] = useState([]);
  const [isLoadingScores, setIsLoadingScores] = useState(false);  
  const [timer, setTimer] = useState(30); // Initialize timer to 30 seconds
  const [isTimerActive, setIsTimerActive] = useState(true); // Timer active state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    
    if (name) {
      setUserName(name);
    }

    if (token) {
      axios
        .get('http://localhost:4000/api/question/getAllquestions', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setQuestions(response.data); // Set the questions fetched from the backend
        })
        .catch((error) => {
          console.error('Error fetching questions:', error);
        });
    } else {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    if (isTimerActive && timer > 0) {
      const timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(timerInterval);
    }

    if (timer === 0) {
      getNextQuestion(); // Automatically move to next question when time runs out
    }
  }, [timer, isTimerActive]);

  const handleAnswerChange = (e) => {
    const selectedAnswer = e.target.value;
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentIndex]: selectedAnswer,
    }));
  };

  const getNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimer(30); // Reset the timer for the next question
    }
  };

  const getPrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setTimer(30); // Reset the timer for the previous question
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found!');
        return;
      }
  
      const response = await axios.post(
        'http://localhost:4000/api/question/check-answer',
        { answers: userAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data && response.data.score !== undefined) {
        setIsSubmitted(true);
  
        setIsLoadingScores(true);
        const scoresResponse = await axios.get('http://localhost:4000/api/question/scores', {
          headers: { Authorization: `Bearer ${token}` } 
        });
        
        setAllScores(scoresResponse.data);
        setIsLoadingScores(false);
  
        navigate("/scores");
      } else {
        console.error('No score returned from the backend');
      }
  
    } catch (error) {
      console.error('Error submitting answers:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
    }
  };

  return (
    <>
    <div className="quiz-container">
      <h1>Quiz Application</h1>
      {userName && <h3>Welcome, {userName}!</h3>}

      {isSubmitted ? (
        <div className="result">
          <h2>Quiz Submitted!</h2>
          <h3>Leaderboard:</h3>
          {isLoadingScores ? (
            <p>Loading leaderboard...</p>
          ) : (
            <div className="leaderboard">
              <ul>
                {allScores.map((user, index) => (
                  <li key={index}>
                    <strong>{user.name}</strong>: {user.score}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div>
          {questions.length > 0 && (
            <div key={currentIndex} className="question-container">
              <p><strong>Q{currentIndex + 1}:</strong> {questions[currentIndex].question}</p>
              <div className="options">
                {questions[currentIndex].options.map((option, index) => (
                  <label key={index}>
                    <input
                      type="radio"
                      name={`question-${currentIndex}`}
                      value={option}
                      checked={userAnswers[currentIndex] === option}
                      onChange={handleAnswerChange}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="timer-container">
            <p>Time Left: {timer}s</p> {/* Display the timer */}
          </div>

          <div className="button-container">
            <button onClick={getPrevQuestion} disabled={currentIndex === 0}>
              Prev
            </button>
            <button onClick={getNextQuestion} disabled={currentIndex === questions.length - 1}>
              Next
            </button>
          </div>

          {currentIndex === questions.length - 1 && (
            <div className="submit-container">
              <button onClick={handleSubmit}>Submit</button>
            </div>
          )}
        </div>
      )}
    </div>
   
    </>
  );
};

export default Main;
