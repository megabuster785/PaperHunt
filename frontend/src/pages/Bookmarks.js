// src/pages/Bookmarks.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const Bookmarks = () => {
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get(`${process.env.REACT_APP_API_BASE}/users/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPapers(res.data);
    };

    fetchBookmarks();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Your Bookmarked Papers</h2>
      <div className="grid gap-4">
        {papers.map(paper => (
          <div key={paper._id} className="p-4 bg-white rounded-xl shadow">
            <h3 className="text-lg font-semibold text-purple-700">{paper.title}</h3>
            <p className="text-sm text-gray-700 mt-1">{paper.summary?.substring(0, 150)}...</p>
            <a href={paper.link || paper.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline mt-2 inline-block">Read More</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;