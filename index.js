const express = require('express');
const path = require('path');
const request = require('request');
const app = express();
const cheerio = require('cheerio');
const cors = require('cors');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/getMusic', (req, res) => {
  const id = req.query.id;
  const audioUrl = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
  request.get(audioUrl).on('response', function(response) {
    if (response.statusCode === 200) {
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Access-Control-Allow-Origin': '*'
      });
      response.pipe(res);
    } else {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('Error fetching audio file');
    }
  })
});

app.get('/getMusicList', (req, res) => {
  const url = 'https://music.163.com/discover/toplist';
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0'
  };
  
  request({ url, headers }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(body);
      const musicData = $('ul.f-hide');
  
      const urlLists = [];
      musicData.find('a').each((index, element) => {
        const musicId = $(element).attr('href').slice(9);
        const musicName = $(element).text();
        urlLists.push({ name: musicName, id: musicId });
      });
  
      const jsonData = JSON.stringify(urlLists, null, 2);
      res.json(urlLists);
    } else {
      res.status(500).send('Failed to fetch music data');
    }
  });
});


const port = 3001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  (async () => {
    const open = await import('open');
    open.default(`http://localhost:${port}`);
  })();
});
