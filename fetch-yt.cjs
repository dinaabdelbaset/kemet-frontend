const https = require('https');

https.get('https://www.youtube.com/results?search_query=Gventures+Felfela', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const match = data.match(/"videoId":"([^"]+)"/);
    if (match) {
      console.log(match[1]);
    }
  });
});
