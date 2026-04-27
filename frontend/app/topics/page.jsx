'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Topics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await axios.get('http://localhost:5000/api/topics');
        // Filter out null/empty topics
        const validTopics = response.data.filter(t => t);
        setTopics(validTopics);
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTopics();
  }, []);

  if (loading) return <div className="p-8">Loading topics...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Explore Topics</h1>
      <div className="flex flex-wrap gap-4">
        {topics.map((topic, index) => (
          <div key={index} className="bg-blue-100 text-blue-800 px-6 py-3 rounded-full text-lg cursor-pointer hover:bg-blue-200 transition-colors">
            {topic}
          </div>
        ))}
        {topics.length === 0 && (
          <p className="text-gray-500">No topics found.</p>
        )}
      </div>
    </div>
  );
}
