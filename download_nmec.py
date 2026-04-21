import urllib.request
import ssl
import os
import re

context = ssl._create_unverified_context()
url = "https://en.wikipedia.org/wiki/National_Museum_of_Egyptian_Civilization"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
html = urllib.request.urlopen(req, context=context).read().decode('utf-8')

imgs = []
matches = re.findall(r'src="(//upload\.wikimedia\.org/wikipedia/commons/thumb/[^"]+\.(?:jpg|png))"', html, re.IGNORECASE)
for src in matches:
    full = "https:" + src
    parts = full.split('/')
    full = '/'.join(parts[:-1]).replace('/thumb/', '/')
    if full not in imgs and 'logo' not in full.lower():
        imgs.append(full)

good_imgs = [img for img in imgs if 'svg' not in img.lower()][:4]

os.makedirs('public/museums', exist_ok=True)
for i, img_url in enumerate(good_imgs):
    try:
        req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
        data = urllib.request.urlopen(req, context=context).read()
        with open(f"public/museums/nmec_{i+1}.jpg", "wb") as f:
            f.write(data)
        print(f"Downloaded {img_url}")
    except Exception as e:
        print(f"Failed {img_url}: {e}")
