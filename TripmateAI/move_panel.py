import re

with open('src/components/Recommendations.jsx', 'r') as f:
    content = f.read()

# Find the Travel Group Panel block
panel_regex = re.compile(r'( {6}\{/\* Travel Group Panel \*/\}.*? {6}</div>\n)\n {6}\{/\* Scrollable cards list \*/\}', re.DOTALL)
match = panel_regex.search(content)

if not match:
    print("Could not find Travel Group Panel block")
    exit(1)

panel_block = match.group(1)
content = content.replace(panel_block + "\n", "")

# Find the Bottom input bar
bottom_regex = re.compile(r'( {6}\{/\* Bottom input bar \*/\})')
match2 = bottom_regex.search(content)

if not match2:
    print("Could not find Bottom input bar")
    exit(1)

# Insert the panel_block before the Bottom input bar
content = content.replace("      {/* Bottom input bar */}", panel_block + "\n      {/* Bottom input bar */}")

with open('src/components/Recommendations.jsx', 'w') as f:
    f.write(content)

print("Moved successfully")
