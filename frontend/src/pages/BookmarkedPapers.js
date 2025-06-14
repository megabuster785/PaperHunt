import { useEffect, useState } from 'react';
import axios from 'axios';

const BookmarkedPapers = () => {
  const [papers, setPapers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const limit = 10;

  useEffect(() => {
  const fetchBookmarkedPapers = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      setLoading(true);
      setPapers([]); 
      const res = await axios.get(`http://localhost:5000/api/users/bookmarked?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      setPapers(res.data.papers || []);
      setTotalPages(res.data.totalPages || 1);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch bookmarked papers');
    } finally {
      setLoading(false);
    }
  };

  fetchBookmarkedPapers();
}, [page]);


  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Bookmarked Papers</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : papers.length === 0 ? (
        <p>No bookmarked papers found.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {papers.map(paper => (
              <li key={paper._id} className="p-4 border rounded shadow">
                <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline"
          >
            {paper.title}
          </a>
                <p className="text-sm text-gray-600">{paper.abstract?.slice(0, 150)}...</p>
              </li>
            ))}
          </ul>

      
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="self-center">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookmarkedPapers;
