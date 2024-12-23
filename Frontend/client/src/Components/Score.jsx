import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Score.css'; // Optional CSS for styling

const Score = () => {
  const [allScores, setAllScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/question/scores');
        setAllScores(response.data);  // Save scores to state
        setIsLoading(false);  // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching scores:', error);
        setIsLoading(false);  // Stop loading even if there's an error
      }
    };

    fetchScores();
  }, []);  // Empty dependency means this runs once on component mount

  return (
    <div className="dashboard-container">
      <h1>Leaderboard</h1>

      {isLoading ? (
        <p>Loading leaderboard...</p>
      ) : (
        <div className="leaderboard">
          <ul>
            {allScores.length === 0 ? (
              <p>No scores available</p>
            ) : (
              allScores.map((user, index) => (
                <li key={index} className="score-item">
                  <strong>{index + 1}. {user.name}</strong>: {user.score} points
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Score;
