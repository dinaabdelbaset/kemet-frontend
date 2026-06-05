const fs = require('fs');

const src1 = "C:\\Users\\Technologist\\.gemini\\antigravity-ide\\brain\\86bfc323-5c0a-49fc-a1d7-302318cb9519\\dahab_360_1780271608524.png";
const dest1 = "./public/dahab_360.png";

const src2 = "C:\\Users\\Technologist\\.gemini\\antigravity-ide\\brain\\86bfc323-5c0a-49fc-a1d7-302318cb9519\\pyramids_360_1780271627934.png";
const dest2 = "./public/pyramids_360.png";

try {
  fs.copyFileSync(src1, dest1);
  console.log("Success copying dahab_360.png");
} catch (e) {
  console.error("Error 1:", e.message);
}

try {
  fs.copyFileSync(src2, dest2);
  console.log("Success copying pyramids_360.png");
} catch (e) {
  console.error("Error 2:", e.message);
}
