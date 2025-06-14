import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [myPapers, setMyPapers] = useState([]);
  const [bookmarkedPapers, setBookmarkedPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
  const fetchProfileData = async () => {
    const token = localStorage.getItem('accessToken');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    };

    try {
      const [profileRes, statsRes, myPapersRes, bookmarksRes] = await Promise.all([
        axios.get('http://localhost:5000/api/users/profile', config),
        axios.get('http://localhost:5000/api/users/stats', config),
        axios.get('http://localhost:5000/api/users/mypapers', config),
        axios.get('http://localhost:5000/api/users/bookmarked', config)
      ]);

      console.log("Bookmarks response:", bookmarksRes.data);

      setProfile(profileRes.data);
      setStats(statsRes.data);
      setMyPapers(myPapersRes.data);
      setBookmarkedPapers(
    Array.isArray(bookmarksRes.data.papers)
    ? bookmarksRes.data.papers
    : []
);

     console.log("Bookmarks response:", bookmarksRes.data);

      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  fetchProfileData();
}, []);


  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const token = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      setUploading(true);
      const res = await axios.post('http://localhost:5000/api/users/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      setProfile(prev => ({ ...prev, avatar: res.data.avatar }));
      setAvatarFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
        <img
          src={profile.avatar ? `http://localhost:5000${profile.avatar}` : '/default-avatar.png'}
          alt="Avatar"
          className="w-24 h-24 rounded-full border shadow object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{profile.username}</h2>
          <p className="text-gray-600">{profile.email}</p>

          <div className="mt-2 flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="text-sm"
            />
            <button
              onClick={handleAvatarUpload}
              disabled={uploading}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>

     
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h4 className="text-lg font-semibold">Papers Added</h4>
          <p className="text-xl">{stats.totalPapersAdded}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h4 className="text-lg font-semibold">Bookmarked</h4>
          <p className="text-xl">{stats.totalBookmarkedPapers}</p>
        </div>
      </div>

     
      <section>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold">Latest Added Papers</h3>
          <Link to="/papers?filter=my" className="text-blue-600 hover:underline text-sm">View All</Link>
        </div>
        <ul className="space-y-2">
          {myPapers.slice(0, 3).map(paper => (
            <li key={paper._id} className="p-3 bg-white rounded shadow border">
              <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline"
          >
            {paper.title}
          </a>
              <p className="text-sm text-gray-600">{paper.abstract?.slice(0, 100)}...</p>
            </li>
          ))}
        </ul>
      </section>

    
     
<section>
  <div className="flex justify-between items-center mb-2">
    <h3 className="text-xl font-bold">Bookmarked Papers</h3>
    <Link to="/bookmarks" className="text-blue-600 hover:underline text-sm">View All</Link>
  </div>

  {bookmarkedPapers.length === 0 ? (
    <p className="text-gray-500 text-sm">No bookmarks yet.</p>
  ) : (
    <ul className="space-y-2">
      {bookmarkedPapers.slice(0, 3).map(paper => (
        <li key={paper._id} className="p-3 bg-white rounded shadow border">
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline"
          >
            {paper.title}
          </a>
          <p className="text-sm text-gray-600">{paper.abstract?.slice(0, 100)}...</p>
        </li>
      ))}
    </ul>
  )}
</section>

    </div>
  );
};

export default Profile;
