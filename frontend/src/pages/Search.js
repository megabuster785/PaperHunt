// src/pages/Search.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = debounce(async (searchTerm) => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE}/papers/search`, {
        params: { query: searchTerm },
      });
      setResults(res.data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    fetchResults(query);
  }, [query]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Search Papers</h2>
      <input
        type="text"
        className="w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="Search by title, abstract, or tags..."
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <div className="space-y-4">
          {results.map((paper) => (
            <div key={paper._id} className="p-4 bg-white rounded-xl shadow">
              <h3 className="text-lg font-semibold text-purple-700">{paper.title}</h3>
              <p className="text-sm text-gray-700 mt-1">{paper.summary?.substring(0, 150)}...</p>
              <a href={paper.link || paper.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline mt-2 inline-block">Read More</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;