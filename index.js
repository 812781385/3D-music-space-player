const express = require('express');
const app = express();
const request = require('request');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/getMusic', (req, res) => {
  const id = req.query.id;
  const audioUrl = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
  request.get(audioUrl).on('response', function(response) {
    if (response.statusCode === 200) {
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Access-Control-Allow-Origin': '*' // Allow Cross-Origin Resource Sharing
      });
      response.pipe(res);
    } else {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('Error fetching audio file');
    }
  })
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  // 启动浏览器并打开URL
  (async () => {
    const open = await import('open');
    open.default(`http://localhost:${port}`);
  })();
});
