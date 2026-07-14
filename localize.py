import os
import re

directories = [
    "src/collections",
    "src/globals"
]

def localize_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Regex to find field definitions and add localized: true
    # We look for a block that has name: '...', type: 'text'|'textarea'|'richText'
    # and we insert localized: true if not present.
    # We want to skip name: 'slug', 'color', 'gradient', 'waNumber' etc.

    # This regex is a bit complex for multiline.
    # Instead, let's process line by line, keeping track of the current field name and type.
    lines = content.split('\n')
    out_lines = []
    
    in_field = False
    current_field_name = None
    current_field_type = None
    field_start_idx = -1
    brace_depth = 0
    
    # A simpler approach: regex replace for common patterns.
    # match: type: '(text|textarea|richText)'
    # check if the preceding lines have a name that we shouldn't localize.
    
    pass

# Actually, an easier way is to use regex substitutions with lookbehinds/lookaheads or just find/replace blocks.
def regex_localize():
    # Let's just do a simpler search and replace for type: 'text' or 'textarea' or 'richText'
    # We replace:
    # type: 'text',
    # with:
    # type: 'text',
    # localized: true,
    pass

import sys

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Exclude certain field names from being localized
    exclude_names = ['slug', 'color', 'gradient', 'waNumber', 'logoUrl', 'suffix', 'initials', 'badge']
    
    # Find all blocks of { ... } that represent a field.
    # Since regex can't parse nested { }, we can just find type: 'text' and insert localized: true right after it,
    # then later remove localized: true if the name is in the exclude list.
    
    # Add localized: true after type: 'text', 'textarea', 'richText'
    new_content = re.sub(r"(type:\s*'(text|textarea|richText)',)", r"\1\n              localized: true,", content)
    
    # Fix indentation - it might be wrong, but it's JS so it doesn't break, just formatting.
    # Let's run prettier afterwards.
    
    # Now we need to remove localized: true for excluded names.
    # This is hacky. Let's do it better by reading lines.
    lines = content.split('\n')
    for i in range(len(lines)):
        line = lines[i]
        if re.search(r"type:\s*'(text|textarea|richText)'", line):
            # look back to find name
            name_match = None
            for j in range(i, max(-1, i-5), -1):
                m = re.search(r"name:\s*'([^']+)'", lines[j])
                if m:
                    name_match = m.group(1)
                    break
            
            if name_match not in exclude_names:
                # check if localized: true is already on the next lines
                already = False
                for j in range(i, min(len(lines), i+4)):
                    if 'localized: true' in lines[j]:
                        already = True
                        break
                if not already:
                    # Insert localized: true
                    indent = len(line) - len(line.lstrip())
                    lines[i] = line + "\n" + (" " * indent) + "localized: true,"
    
    with open(filepath, 'w') as f:
        f.write('\n'.join(lines))

for d in directories:
    for f in os.listdir(d):
        if f.endswith('.ts'):
            process_file(os.path.join(d, f))

print("Localization added.")
