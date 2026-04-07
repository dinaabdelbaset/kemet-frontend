const fetchVideos = async () => {
  const queries = ['burger', 'chocolate%20cake', 'pouring%20coffee', 'salad'];
  for (const q of queries) {
    try {
      const res = await fetch(`https://www.pexels.com/search/videos/${q}/`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        }
      });
      const text = await res.text();
      const match = text.match(/https:\/\/videos\.pexels\.com\/video-files\/\d+\/[^"'\s]+\.mp4/);
      console.log(`${q}: ${match ? match[0] : 'not found'}`);
    } catch (e) {
      console.log(`${q}: Error ${e.message}`);
    }
  }
};
fetchVideos();
