const axios = require('axios');
const Paper = require('../models/Paper'); 

exports.fetchGitHubRepos = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

   
    const response = await axios.get(
      `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=5`,
      {
        headers: {
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'PaperHunt-App'
        }
      }
    );

    const results = response.data.items;
    const newPapers = [];

   
    await Promise.all(results.map(async (repo) => {
      const exists = await Paper.findOne({ url: repo.html_url, addedBy: req.user.id });

      if (exists) return; 

      const paper = new Paper({
        title: repo.name,
        authors: [repo.owner.login],
        abstract: repo.description,
        source: 'github',
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language
      });

      const saved = await paper.save();
      newPapers.push(saved);
    }));

    return res.json(newPapers); 
  } catch (error) {
    console.error('GitHub fetch error:', error.message || error);
    return res.status(500).json({ message: 'Error fetching GitHub repos' });
  }
};
