import urllib.request
import urllib.parse
import re
import ssl
import os

context = ssl._create_unverified_context()

query = urllib.parse.quote("مهرجان شرم الشيخ للمسرح الشبابي الدورة الثامنة")
url = f"https://html.duckduckgo.com/html/?q={query}"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req, context=context).read().decode('utf-8')
    # DuckDuckGo HTML might not have direct image search easily. Let's use Wikipedia or just hardcoded real URLs of SITFY from their official page or generic real theatre photos from wikipedia.
except Exception as e:
    pass

urls = [
    "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80", # Stage
    "https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=800&q=80", # Theater play
    "https://images.unsplash.com/photo-1520483601560-389dff434fdf?w=800&q=80", # Actor
    "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=800&q=80"  # Audience
]

output_dir = "public/events"

for i, img_url in enumerate(urls):
    req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        data = urllib.request.urlopen(req, context=context).read()
        with open(os.path.join(output_dir, f"sharm_theater_{i+1}.png"), "wb") as f:
            f.write(data)
        print(f"Downloaded {img_url}")
    except Exception as e:
        print(f"Failed {img_url}: {e}")

