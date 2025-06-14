import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Search, Loader2,LockIcon } from 'lucide-react';
import {toast} from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const PapersSection = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [bookmarked, setBookmarked] = useState({});
  const [expanded, setExpanded] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [source, setSource] = useState(null);




  const navigate = useNavigate();
  const { user } = useAuth();
  
  
  const fetchPapers = async () => {
  setLoading(true);
  try {
    const res = await axiosInstance.get(`/papers`, {
      params: {
        sortBy: 'createdAt',
        order: sort,
        addedBy: user.id,
        page,
        limit,
      },
    });
    setPapers(res.data.data);
    setTotal(res.data.total);
    console.log("Fetched papers:", res.data);
  } catch (err) {
    console.error('Failed to fetch papers', err);
  } finally {
    setLoading(false);
  }
};
const fetchBookmarkedPapers = async () => {
  try {
    const res = await axiosInstance.get(`/users/bookmarkedIds`); 
    const ids = res.data.bookmarkedIds || [];

    
    const bookmarkMap = {};
    ids.forEach(id => {
      bookmarkMap[id] = true;
    });

    setBookmarked(bookmarkMap);
  } catch (err) {
    console.error('Failed to fetch bookmarked papers', err);
  }
};


useEffect(() => {
  if (user?.id) {
    fetchPapers(); 
    fetchBookmarkedPapers(); 
  }
}, [page, sort, user?.id]);




  useEffect(() => {
  if (!user || !papers.length) return;

  console.log("User ID:", user.id);
  papers.forEach(paper => console.log("AddedBy:", paper.addedBy));
}, [user?.id, papers.map(p => p.addedBy).join(',')]);


  const handleBookmark = async (id) => {
    try {
      await axiosInstance.post(`/papers/bookmark/${id}`);
      setBookmarked((prev) => ({ ...prev, [id]: true }));
    } catch (err) {
      console.error('Bookmark failed', err);
    }
  };

  const handleRemoveBookmark = async (id) => {
    try {
      await axiosInstance.delete(`/papers/bookmark/${id}`);
      setBookmarked((prev) => ({ ...prev, [id]: false }));
    } catch (err) {
      console.error('Remove bookmark failed', err);
    }
  };



const handleDelete = async (paperId) => {
  try {
    await axiosInstance.delete(`/papers/${paperId}`);
    toast.success('Paper deleted successfully');

  
    setPapers(prev => prev.filter(p => String(p._id || p.id) !== String(paperId)));

  } catch (err) {
    if (err.response?.status === 403 || err.response?.status === 404) {
      toast.error(err.response?.data?.message || 'You are not allowed to delete this paper');
    } else {
      toast.error('Something went wrong while deleting');
    }
    console.error('Delete failed', err);
  }
};



 const handleSearch = async () => {
  const trimmed = search.trim();
  if (!trimmed) {
    console.warn("Empty search input; skipping API call.");
    return;
  }

  try {
    const res = await axiosInstance.get(`/papers/search`, {
      params: { query: trimmed,addedBy:user.id},
    });
    setPapers(res.data.data);
  } catch (err) {
    console.error('Search failed', err);
  }
};


  const fetchFromSource = async (selectedSource) => {
  setLoading(true);
  try {
    const res = await axiosInstance.get(`/papers/source/${selectedSource}`, {
      params: {
        page,
        limit,
        addedBy: user.id,
      },
    });

    setPapers(res.data.data);
    setTotal(res.data.total);
    console.log(`Fetched ${selectedSource} papers:`, res.data);
  } catch (err) {
    console.error(`Fetch from ${selectedSource} failed`, err);
  } finally {
    setLoading(false);
  }
};



  return (
    <section className="px-4 py-10 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between gap-4 mb-6">
         <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            placeholder="Search by title, abstract, or tags (e.g., GANs, arXiv, vision)"
            className="border rounded-md px-4 py-2 flex-grow min-w-[200px]"
          />

          <button
            onClick={handleSearch}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Search
          </button>

          <button
            onClick={() => fetchFromSource('github')}
            className="bg-gray-800 text-white px-4 py-2 rounded-md"
          >
            Fetch from GitHub
          </button>
          <button
            onClick={() => fetchFromSource('arXiv')}
            className="bg-purple-700 text-white px-4 py-2 rounded-md"
          >
            Fetch from ArXiv
          </button>
        
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border px-2 py-2 rounded-md"
          >
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin h-6 w-6" />
          </div>
        ) : papers.length === 0 ? (
  <div className="text-center text-gray-500 py-10 text-lg font-medium">
    No papers found.
  </div>
) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper) => (
              <div
                key={paper.id}
                className="bg-white border rounded-lg p-4 shadow hover:shadow-md flex flex-col justify-between"
              >
                <div className="mb-2">
                  <a
                      href={paper.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 font-semibold text-lg hover:underline"
                    >
                      {paper.title}
                    </a>

                 <p className="text-sm text-gray-600 mt-1">
                    {(expanded[paper.id] 
                      ? (paper.abstract || paper.summary) 
                      : (paper.abstract || paper.summary)?.slice(0, 120))}

                    {(paper.abstract || paper.summary)?.length > 120 && (
                      <button 
                        onClick={() => setExpanded(prev => ({ ...prev, [paper.id]: !prev[paper.id] }))}
                        className="text-blue-500 ml-1 underline text-sm"
                      >
                        {expanded[paper.id] ? 'Read less' : 'Read more'}
                      </button>
                    )}
                  </p>

                  <div className="text-xs text-gray-500 mt-2">
                    <p><strong>Source:</strong> {paper.source || 'Unknown'}</p>
                    <p><strong>Date:</strong> {new Date(paper.createdAt || paper.published).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  {bookmarked[paper.id] ? (
                    <button onClick={() => handleRemoveBookmark(paper.id)}>
                      <BookmarkCheck className="text-green-600" />
                    </button>
                  ) : (
                    <button onClick={() => handleBookmark(paper.id)}>
                      <Bookmark className="text-gray-500" />
                    </button>
                  )}
                {String(user?.id) === String(paper.addedBy) ? (
                  <button onClick={() => handleDelete(paper.id)} className="text-red-500 hover:underline">
                    Delete
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-gray-400 cursor-not-allowed">
                    <LockIcon className="w-4 h-4" />
                    <span className="text-sm">Not allowed</span>
                  </div>
                )}
                </div>
              </div>
            ))}
          </div>
        )}
      
                <div className="flex justify-center items-center gap-4 mt-10">
                  <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <span className="text-gray-700 font-medium">
                    Page {page} of {Math.ceil(total / limit)}
                  </span>

                  <button
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={page >= Math.ceil(total / limit)}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>

                      </div>
                    </section>
                  );
                };

export default PapersSection;
                