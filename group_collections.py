import os
import re

collections_groups = {
    "src/collections/Articles.ts": "Manajemen Konten",
    "src/collections/Categories.ts": "Manajemen Konten",
    "src/collections/Services.ts": "Manajemen Konten",
    "src/collections/PolicyReviews.ts": "Manajemen Konten",
    "src/collections/TeamMembers.ts": "Manajemen Konten",
    "src/collections/ContactSubmissions.ts": "Data Audiens",
    "src/collections/Subscribers.ts": "Data Audiens",
}

for file_path, group_name in collections_groups.items():
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, 'r') as f:
        content = f.read()
        
    if 'group:' not in content:
        # Some might already have an admin block for the collection root (right after slug or export const)
        # It's safer to just look for `slug: '...'` and inject admin: { group: '...' } 
        # But wait, if there is already an admin: { useAsTitle: '...' } right below slug: '...', we should insert group inside it.
        
        # Regex to find `slug: '...', \n admin: {`
        match = re.search(r"slug:\s*'[^']+',\s*admin:\s*\{", content)
        if match:
            # Insert group: '...', after admin: {
            content = content[:match.end()] + f"\n    group: '{group_name}'," + content[match.end():]
        else:
            # Just insert admin: { group: '...' } after slug
            content = re.sub(r"(slug:\s*'[^']+',)", f"\\1\n  admin: {{\n    group: '{group_name}',\n  }},", content, count=1)
            
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"Updated {file_path}")
