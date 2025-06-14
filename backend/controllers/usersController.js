const User = require('../models/User');
const Paper = require('../models/Paper');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('bookmarkedPapers');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { username, email, password } = req.body;

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password; 

    const updatedUser = await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Count total papers added by the user
    const totalAdded = await Paper.countDocuments({ addedBy: userId });

    // Find the user and populate valid bookmarked papers
    const user = await User.findById(userId).populate({
      path: 'bookmarkedPapers',
      select: '_id' // Only need the ID to count valid bookmarks
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Filter out null entries (i.e., deleted papers)
    const validBookmarks = user.bookmarkedPapers.filter(Boolean);

    res.json({
      totalPapersAdded: totalAdded,
      totalBookmarkedPapers: validBookmarks.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};


exports.getMyPapers = async (req, res) => {
  try {
    const papers = await Paper.find({ addedBy: req.user.id });
    res.json(papers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user papers' });
  }
};


exports.getMyBookmarkedPapers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findById(req.user.id).populate({
      path: 'bookmarkedPapers',
      select: 'title abstract url'
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    
    const validBookmarks = user.bookmarkedPapers.filter(Boolean);

    // Clean up: remove invalid paper IDs from DB if any
    if (validBookmarks.length !== user.bookmarkedPapers.length) {
      await User.findByIdAndUpdate(req.user.id, {
        $set: { bookmarkedPapers: validBookmarks.map(p => p._id) }
      });
    }

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginated = validBookmarks.slice(startIndex, startIndex + parseInt(limit));

    res.status(200).json({
      papers: paginated,
      currentPage: parseInt(page),
      totalPages: Math.ceil(validBookmarks.length / limit),
      totalItems: validBookmarks.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch bookmarked papers' });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    res.status(200).json({ message: 'Avatar uploaded successfully', avatar: user.avatar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Avatar upload failed' });
  }
};
// GET /api/users/bookmarked/ids
exports.getBookmarkedPaperIds = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('bookmarkedPapers');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ bookmarkedIds: user.bookmarkedPapers.filter(Boolean) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch bookmarked IDs' });
  }
};


