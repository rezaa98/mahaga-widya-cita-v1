import os
import requests
from duckduckgo_search import DDGS
from io import BytesIO
from PIL import Image

partners = [
    {"name": "Kementerian PAN-RB", "query": "Logo Kementerian PANRB png transparent"},
    {"name": "BKN", "query": "Logo BKN Badan Kepegawaian Negara png transparent"},
    {"name": "BPKP", "query": "Logo BPKP png transparent"},
    {"name": "LAN RI", "query": "Logo LAN Lembaga Administrasi Negara png transparent"},
    {"name": "Setjen DPR RI", "query": "Logo DPR RI png transparent"},
    {"name": "Bappenas", "query": "Logo Bappenas png transparent"},
    {"name": "Kemendagri", "query": "Logo Kemendagri png transparent"},
    {"name": "Kemenkeu", "query": "Logo Kemenkeu png transparent"},
    {"name": "KemenPUPR", "query": "Logo PUPR png transparent"},
    {"name": "Ombudsman RI", "query": "Logo Ombudsman RI png transparent"},
]

ddgs = DDGS()

os.makedirs('public/media', exist_ok=True)

for p in partners:
    print(f"Searching for {p['name']}...")
    try:
        results = ddgs.images(
            p['query'],
            safesearch='off',
            size='Medium',
            type_image='transparent',
            layout='Square',
            max_results=5
        )
        
        saved = False
        for r in results:
            url = r.get('image')
            if not url: continue
            
            try:
                # Try fetching the image
                headers = {'User-Agent': 'Mozilla/5.0'}
                res = requests.get(url, headers=headers, timeout=5)
                if res.status_code == 200:
                    img = Image.open(BytesIO(res.content))
                    
                    # Must be valid image
                    if img.format not in ['PNG', 'JPEG', 'WEBP']:
                        continue
                        
                    # Save as PNG
                    filename = f"partner_{''.join(e for e in p['name'] if e.isalnum()).lower()}.png"
                    filepath = os.path.join('public/media', filename)
                    
                    img.save(filepath, format='PNG')
                    print(f"Saved {p['name']} from {url}")
                    saved = True
                    break
            except Exception as e:
                # print(f"Error fetching {url}: {e}")
                continue
                
        if not saved:
            print(f"Failed to find and save logo for {p['name']}")
            
    except Exception as e:
        print(f"Error searching {p['name']}: {e}")
