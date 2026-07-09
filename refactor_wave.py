import os
import re

files_to_check = [
    "src/app/mitra/page.tsx",
    "src/app/kontak/page.tsx",
    "src/app/layanan/[slug]/page.tsx",
    "src/app/karir/page.tsx",
    "src/app/tim/page.tsx",
    "src/app/tentang-kami/page.tsx"
]

wave_pattern = re.compile(r'<div style={{ position: "absolute", bottom: 0, left: 0, right: 0, lineHeight: 0 }}>\s*<svg viewBox="0 0 1440 48" style={{ display: "block", width: "100%", height: "48px" }}>\s*<path d="M0,48 L1440,48 L1440,16 Q1080,48 720,24 Q360,0 0,24 Z" fill="([^"]+)" />\s*</svg>\s*</div>')

for file_path in files_to_check:
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, 'r') as f:
        content = f.read()
        
    # Check if there is a match
    match = wave_pattern.search(content)
    if match:
        fill_color = match.group(1)
        
        # Replace the wave
        new_wave = f'<WaveDivider fill="{fill_color}" />'
        content = wave_pattern.sub(new_wave, content)
        
        # Add import at the top (after other imports)
        if 'import { WaveDivider }' not in content:
            # find last import
            last_import_idx = content.rfind('import ')
            if last_import_idx != -1:
                end_of_line = content.find('\n', last_import_idx)
                content = content[:end_of_line+1] + 'import { WaveDivider } from "@/components/ui/WaveDivider";\n' + content[end_of_line+1:]
        
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"Updated {file_path}")
