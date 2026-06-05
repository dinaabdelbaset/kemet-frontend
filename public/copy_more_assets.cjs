const fs = require('fs');

const mappings = [
  {
    src: "C:\\Users\\Technologist\\.gemini\\antigravity-ide\\brain\\86bfc323-5c0a-49fc-a1d7-302318cb9519\\hotel_bath_360_1780280147027.png",
    dest: "./public/hotel_bath_360.png"
  },
  {
    src: "C:\\Users\\Technologist\\.gemini\\antigravity-ide\\brain\\86bfc323-5c0a-49fc-a1d7-302318cb9519\\hotel_balcony_360_1780280164525.png",
    dest: "./public/hotel_balcony_360.png"
  },
  {
    src: "C:\\Users\\Technologist\\.gemini\\antigravity-ide\\brain\\86bfc323-5c0a-49fc-a1d7-302318cb9519\\monument_inside_360_1780280183127.png",
    dest: "./public/monument_inside_360.png"
  },
  {
    src: "C:\\Users\\Technologist\\.gemini\\antigravity-ide\\brain\\86bfc323-5c0a-49fc-a1d7-302318cb9519\\monument_aerial_360_1780280199741.png",
    dest: "./public/monument_aerial_360.png"
  }
];

mappings.forEach(m => {
  try {
    fs.copyFileSync(m.src, m.dest);
    console.log(`Success: Copied to ${m.dest}`);
  } catch (e) {
    console.error(`Error copying to ${m.dest}:`, e.message);
  }
});
