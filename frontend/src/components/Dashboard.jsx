import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';

const Dashboard = () => {
  const [trending, setTrending] = useState([]);
  
  useEffect(() => {
    // Fetch trending topics from backend
    axios.get('/api/articles/trending')
      .then(res => setTrending(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="dashboard">
      <h1>News Analytics Dashboard</h1>
      <div className="trending-section">
        <h2>Trending Categories (Last 24h)</h2>
        <ul>
          {trending.map(topic => (
            <li key={topic._id}>
              <strong>{topic._id}</strong> - {topic.count} articles 
              (Avg Sentiment: {topic.avgSentiment?.toFixed(2)})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
