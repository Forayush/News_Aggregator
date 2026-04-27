'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Sources() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSources() {
      try {
        const response = await axios.get('http://localhost:5000/api/sources');
        setSources(response.data);
      } catch (error) {
        console.error('Error fetching sources:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSources();
  }, []);

  if (loading) return <div className="p-8">Loading sources...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">News Sources</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources.map(source => (
          <div key={source._id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{source.name}</h2>
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mb-4 block">
              {source.url}
            </a>
            {source.category && (
              <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm">
                {source.category}
              </span>
            )}
          </div>
        ))}
        {sources.length === 0 && (
          <p className="text-gray-500 col-span-full">No sources found.</p>
        )}
      </div>
    </div>
  );
}
