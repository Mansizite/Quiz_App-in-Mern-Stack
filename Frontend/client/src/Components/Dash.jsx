import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dash.css';  // Ensure you have appropriate styles for the elements

const Dash = () => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      // Check if the name is empty
      if (!name.trim()) {
        setErrorMessage('Please enter your name.');
        setIsLoading(false);
        return;
      }

      // Sending registration request to the backend
      const response = await axios.post('http://localhost:4000/api/question/register', { name });

      const { token, name: userName, score } = response.data;

      // Store token and user info in localStorage upon successful registration
      localStorage.setItem('token', token);
      localStorage.setItem('name', userName);
      localStorage.setItem('score', score);

      // Redirect to the main page after successful registration
      navigate('/main');
    } catch (error) {
      setErrorMessage('Registration failed. Please try again.'); // Display error message
      console.error('Registration error:', error.response ? error.response.data : error.message);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <>
      <h1>Quiz Application</h1>

      <div className="instructions">
        <h2>Welcome to the Quiz!</h2>
        <p>Enter your name to begin the quiz and challenge yourself with questions. Good luck!</p>
        <p><strong>Note:</strong> You will be redirected to the quiz after registration.</p>
      </div>

      <div className="register">
        <form onSubmit={handleRegister}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
          <button type="submit" disabled={isLoading}>Register</button>
        </form>

        {isLoading && <div className="loading">Registering...</div>}  {/* Loading spinner/message */}

        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Error message display */}
      </div>
    </>
  );
};

export default Dash;
