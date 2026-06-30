import os
import re

html_path = "/Users/ni3_kr/Documents/UX/CaseStudyBuilder/static/case_study_template/case_study.html"
base_dir = os.path.dirname(html_path)

with open(html_path, 'r') as f:
    content = f.read()

# Find all href and src
refs = re.findall(r'(?:href|src)="([^"]+)"', content)

print(f"Checking references in {html_path}:")
for ref in refs:
    if ref.startswith('http') or ref.startswith('#'):
        continue
    
    full_path = os.path.join(base_dir, ref)
    if os.path.exists(full_path):
        print(f"[OK] {ref}")
    else:
        print(f"[MISSING] {ref} -> {full_path}")
