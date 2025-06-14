const Paper = require('../models/Paper');
const axios = require('axios');           
const User = require('../models/User');

exports.getPapers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      source,
      title,
      addedBy,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};
    if (source) query.source = source;
    if (addedBy) query.addedBy = addedBy;
    if (title) query.title = { $regex: title, $options: 'i' };

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const papers = await Paper.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Paper.countDocuments(query);
    const formatted = papers.map(p => {
      const obj = p.toObject();
      obj.id = obj._id;
      delete obj._id;
      return obj;
});

    res.json({ total, page: parseInt(page), limit: parseInt(limit), data: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.bookmarkPaper = async (req, res) => {
  try {
    const userId = req.user.id;
    const paperId = req.params.paperId;

    const paper = await Paper.findById(paperId);
    if (!paper) return res.status(404).json({ message: 'Paper not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isAlreadyBookmarked = user.bookmarkedPapers.some(
      id => id.toString() === paperId
    );

    if (!isAlreadyBookmarked) {
      user.bookmarkedPapers.push(paperId);
      await user.save();
    }

    return res.status(200).json({ message: 'Paper bookmarked successfully' });
  } catch (err) {
    console.error('Bookmark error:', err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};
exports.removeBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const paperId = req.params.paperId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const originalLength = user.bookmarkedPapers.length;
    user.bookmarkedPapers = user.bookmarkedPapers.filter(
      id => id.toString() !== paperId
    );

    if (user.bookmarkedPapers.length !== originalLength) {
      await user.save();
      return res.status(200).json({ message: 'Paper removed from bookmarks' });
    } else {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

  } catch (err) {
    console.error('Remove bookmark error:', err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

exports.addPaper = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID missing in request' });
    }

    // Prevent duplicate for the same user
    const existing = await Paper.findOne({
      title: req.body.title,
      addedBy: userId,
    });

    if (existing) {
      return res.status(400).json({ message: 'You already added this paper' });
    }

    // Else add new paper with addedBy = this user
    const newPaper = new Paper({
      ...req.body,
      addedBy: userId,
    });

    const savedPaper = await newPaper.save();
    const paperObj = savedPaper.toObject();
    paperObj.id = paperObj._id;
    delete paperObj._id;

    res.status(201).json(paperObj);
  } catch (err) {
    console.error("Error while adding paper:", err.message);
    res.status(500).json({
      message: 'Failed to add paper',
      error: err.message,
    });
  }
};


 exports.searchPapers = async (req, res) => {
  try {
    const userId = req.user?.id; 

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
    const query = req.query.query?.trim();
    const { page = 1, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    const searchQuery = {
      addedBy: userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { abstract: { $regex: query, $options: 'i' } },
      ]
    };


    const papers = await Paper.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Paper.countDocuments(searchQuery);

    const formatted = papers.map(p => {
      const obj = p.toObject();
      obj.id = obj._id;
      delete obj._id;
      return obj;
    });

    res.json({ data: formatted, total, page: parseInt(page), limit: parseInt(limit) });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getPapersBySource = async (req, res) => {
  try {
    const userId = req.user?.id; // assumes auth middleware sets req.user

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { page = 1, limit = 10 } = req.query;
    const source = req.params.source;

    const filter = {
      source,
      addedBy: userId 
    };

    const papers = await Paper.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Paper.countDocuments(filter);

    const formatted = papers.map(p => ({ ...p.toObject(), id: p._id, _id: undefined }));

    res.json({ data: formatted, page: parseInt(page), total, limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching papers by source' });
  }
};

  exports.deletePaper = async (req, res) => {
  try {
    const paperId = req.params.id;
    const userId = req.user.id; 

    const deletedPaper = await Paper.findOneAndDelete({ _id: paperId, addedBy: userId });

    if (!deletedPaper) {
      return res.status(404).json({ message: 'Paper not found or you do not have permission to delete this paper' });
    }

    res.status(204).send(); 
  } catch (error) {
    console.error('Error deleting paper:', error);
    res.status(500).json({ message: 'Failed to delete paper' });
  }
};

  exports.getTrendingPapers = async (req, res) => {
  try {
    const order = req.query.order === 'asc' ? 1 : -1;

    
    const papers = await Paper.aggregate([
      {
        $addFields: {
          sortDate: {
            $ifNull: [
              { $toDate: "$published" }, 
              "$createdAt"               
            ]
          }
        }
      },
      { $sort: { sortDate: order } },
      { $limit: 10 }
    ]);

    res.status(200).json({ data: papers });

  } catch (error) {
    console.error('Trending error:', error);
    res.status(500).json({ message: 'Failed to fetch trending papers' });
  }
};
