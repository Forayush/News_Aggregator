'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Topics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/topics`);
        setTopics(response.data.filter(Boolean));
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopics();
  }, []);

  return (
    <div className="page-shell">
      <section className="page-header">
        <p className="eyebrow">Coverage map</p>
        <h1>Explore Topics</h1>
        <p>Browse every category currently detected in the article archive.</p>
      </section>

      {loading ? (
        <div className="topic-cloud">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <span key={item} className="topic-pill skeleton-pill" />
          ))}
        </div>
      ) : topics.length > 0 ? (
        <div className="topic-cloud">
          {topics.map((topic) => (
            <span key={topic} className="topic-pill">
              {topic}
            </span>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No topics found</h3>
          <p>Topics will appear after articles are ingested and categorized.</p>
        </div>
      )}
    </div>
  );
}
