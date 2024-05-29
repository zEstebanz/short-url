const express = require('express');
const app = express();
const cors = require('cors');
const dns = require('dns');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Almacenar las URLs acortadas
let urlDatabase = [];
let urlCounter = 1;

// Ruta POST para acortar URLs
app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;
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

// Ruta GET para redirigir a la URL original
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);
  const urlEntry = urlDatabase.find(entry => entry.short_url === shortUrl);

  if (urlEntry) {
    res.redirect(urlEntry.original_url);
  } else {
    res.json({ error: 'No URL found' });
  }
});

// Iniciar el servidor
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
