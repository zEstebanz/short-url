require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use('/public', express.static(`${process.cwd()}/public`));

// HTML File
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// URL Shortener API
let urlDatabase = [];
let urlCounter = 1;

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  const urlPattern = /^(http|https):\/\/[^ "]+$/;

  if (!urlPattern.test(url)) {
    return res.json({ error: 'invalid url' });
  }

  const hostname = new URL(url).hostname;

  dns.lookup(hostname, (err, address) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    const shortUrl = urlCounter++;
    urlDatabase.push({ original_url: url, short_url: shortUrl });

    res.json({ original_url: url, short_url: shortUrl });
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);
  const urlEntry = urlDatabase.find(entry => entry.short_url === shortUrl);

  if (urlEntry) {
    res.redirect(urlEntry.original_url);
  } else {
    res.json({ error: 'No URL found' });
  }
});

// Start the Server
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
