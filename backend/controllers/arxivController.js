const axios = require('axios');
const xml2js = require('xml2js');
const Paper = require('../models/Paper');

exports.fetchFromArxiv = async (req, res) => {
  const searchQuery = req.query.q || 'machine learning';
  const arxivUrl = `http://export.arxiv.org/api/query?search_query=all:${searchQuery}&start=0&max_results=5`;

  try {
    const response = await axios.get(arxivUrl);
    const parser = new xml2js.Parser();

    parser.parseString(response.data, async (err, result) => {
      if (err) return res.status(500).json({ message: 'Error parsing XML', err });

      const entries = result.feed.entry || [];

      const newPapers = [];

      await Promise.all(entries.map(async (entry) => {
        const url = entry.id[0];

        const exists = await Paper.findOne({ url, addedBy: req.user.id });

        if (exists) return;

        const paper = new Paper({
          title: entry.title[0].trim(),
          authors: entry.author.map(a => a.name[0]),
          abstract: entry.summary[0].trim(),
          url: url,
          published: entry.published[0],
          source: 'arXiv',
        });

        const saved = await paper.save();
        newPapers.push(saved);
      }));

      res.status(200).json(newPapers); 
    });

  } catch (error) {
    console.error('arXiv fetch error:', error.message || error);
    res.status(500).json({ message: 'Failed to fetch from arXiv', error });
  }
};
