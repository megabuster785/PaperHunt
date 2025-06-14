import { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarDays, Star, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const TrendingSection = () => {
  const [papers, setPapers] = useState([]);
  const [sort, setSort] = useState('desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE}/papers/trending?order=${sort}`
        );
        setPapers(res.data.data);
      } catch (err) {
        console.error('Failed to fetch trending papers', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [sort]);

  return (
    <section className="bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-center text-purple-700">Trending Papers</h2>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-md px-2 py-1"
          >
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center"><Loader2 className="animate-spin h-6 w-6" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper) => (
              <div
                key={paper._id}
                className="bg-white shadow-sm border rounded-lg p-4 flex flex-col justify-between"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-blue-700 hover:underline">
                    <a href={paper.url || paper.link} target="_blank" rel="noopener noreferrer">
                      {paper.title}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {paper.summary?.slice(0, 120)}...
                  </p>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <div><strong>Authors:</strong> {paper.authors?.join(', ')}</div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span>{paper.source || 'Unknown source'}</span>

                  </div>
                  {paper.source === 'github' && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{paper.stars} stars</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    <span>
                        {(() => {
                            const dateStr = paper.published || paper.createdAt;
                            const dateObj = new Date(dateStr);
                            return isNaN(dateObj) ? 'Unknown date' : dateObj.toLocaleDateString();
                        })()}
                        </span>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingSection;
