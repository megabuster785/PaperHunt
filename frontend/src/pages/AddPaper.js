import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AddPaper = () => {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('arXiv');
  const [papers, setPapers] = useState([]);
  const [added, setAdded] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);

  const fetchPapers = async () => {
  try {
    setLoading(true);
    const url =
      source === 'arXiv'
        ? `http://localhost:5000/api/papers/arxiv/fetch?q=${query}`
        : `http://localhost:5000/api/papers/github/fetch?query=${query}`;

    const token = localStorage.getItem('accessToken');

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setPapers(res.data);
    toast.success(`Fetched ${res.data.length} papers from ${source}`);
  } catch (err) {
    console.error('Fetch error:', err);
    toast.error(
      err.response?.status === 401
        ? 'Unauthorized. Please login again.'
        : 'Failed to fetch papers.'
    );
  } finally {
    setLoading(false);
  }
};

  const handleAdd = async (paper) => {
  try {
    setAddingId(paper._id || paper.id);

    const token = localStorage.getItem('accessToken');

    const { _id, id, ...paperData } = paper;

    const res = await axios.post(
      'http://localhost:5000/api/papers/addpaper',
      paperData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Store original paper ID in added list, NOT backend response ID
    setAdded(prev => [...prev, String(paper._id || paper.id).trim()]);

    toast.success('Paper added successfully!');
  } catch (err) {
    console.error('Add error:', err.response?.data || err.message);
    toast.error('Failed to add paper.');
  } finally {
    setAddingId(null);
  }
};

const checkIfAdded = (paper) => {
  const paperId = String(paper._id || paper.id);
  for (const addedId of added) {
    console.log('Comparing IDs:', addedId, paperId, typeof addedId, typeof paperId);
  }
  return added.some(id => String(id) === paperId);
};



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex space-x-4 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="Search query (e.g., machine learning)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="border p-2"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option value="arXiv">arXiv</option>
          <option value="github">GitHub</option>
        </select>
        <button
          onClick={fetchPapers}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Fetching...' : 'Fetch'}
        </button>
      </div>
        {papers.length === 0 && !loading && (
        <div className="text-gray-500 text-center mt-8">
          You can fetch papers from <span className="font-medium">arXiv</span> or <span className="font-medium">GitHub</span> using keywords like <em>"machine learning"</em>, <em>"quantum computing"</em>, etc.
        </div>
      )}

      <div className="space-y-4">
        {papers.map((paper, idx) => {
          const paperId = String(paper._id || paper.id);
          console.log('Paper ID in list:', paperId);
          const isAdded = checkIfAdded(paper);
          console.log(`Is paper ID ${paperId} added?`, isAdded);
          const isAdding = addingId === paperId;

          return (
            <div key={idx} className="border p-4 rounded shadow">
              <h2 className="font-bold text-lg">{paper.title}</h2>
              <p className="text-sm">By: {paper.authors?.join(', ')}</p>
              <p className="mt-2">{paper.abstract || paper.summary}</p>
              <a
                href={paper.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 text-sm"
              >
                View Source
              </a>
              <div className="mt-2">
                <button
                  onClick={() => handleAdd(paper)}
                  disabled={isAdded || isAdding}
                  className={`px-3 py-1 rounded text-white ${
                    isAdded
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600'
                  }`}
                >
                  {isAdded ? 'Added' : isAdding ? 'Adding...' : 'Add Paper'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddPaper;
