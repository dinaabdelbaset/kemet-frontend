const Jimp = require('jimp');

async function removeWhiteBg() {
  try {
    const image = await Jimp.read('public/images/logo.png');
    
    // Iterate over all pixels
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      // Get RGBA values
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      const alpha = this.bitmap.data[idx + 3];

      // If pixel is near white (tolerance > 240)
      if (red > 230 && green > 230 && blue > 230) {
        // Set alpha to 0 (transparent)
        this.bitmap.data[idx + 3] = 0;
      }
    });

    await image.writeAsync('public/images/logo.png');
    console.log('Background removed successfully!');
  } catch (error) {
    console.error('Error removing background:', error);
  }
}

removeWhiteBg();
