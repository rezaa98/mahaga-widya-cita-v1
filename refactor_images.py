import os
import re

files = {
    "src/components/HomePage.tsx": [
        (r'<img src={article\.imageUrl} alt={article\.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />',
         r'<Image src={article.imageUrl} alt={article.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />')
    ],
    "src/app/artikel/page.tsx": [
        (r'overflow: "hidden"\s*}}>', r'overflow: "hidden", position: "relative" }}>'),
        (r'<img src={article\.imageUrl} alt={article\.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />',
         r'<Image src={article.imageUrl} alt={article.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />')
    ],
    "src/app/artikel/[slug]/page.tsx": [
        (r'overflow: "hidden",\s*display: "flex"', r'position: "relative", overflow: "hidden", display: "flex"'),
        (r'<img src={article\.imageUrl} alt={article\.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />',
         r'<Image src={article.imageUrl} alt={article.title} fill style={{ objectFit: "cover" }} priority sizes="100vw" />')
    ]
}

for file_path, replacements in files.items():
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r') as f:
        content = f.read()
    
    for old_regex, new_text in replacements:
        content = re.sub(old_regex, new_text, content)
        
    if 'import Image from' not in content:
        # find first import
        content = 'import Image from "next/image";\n' + content
        
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")
