import os
import re

file_path = 'templates/case_study_render.html'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Remove Top Panel (Navigation and Overlays)
# More aggressive regex for nav and overlay
content = re.sub(r'<nav>.*?</nav>', '', content, flags=re.DOTALL)
content = re.sub(r'<!-- FULL SCREEN MENU OVERLAY -->.*?<div class="menu-overlay".*?</div>', '', content, flags=re.DOTALL)

# 2. Update Export Mode CSS and Accordion Styling
# We'll replace the previous style block if it exists, or add it to </head>
style_addition = """
    <style>
        /* Export Mode Override - Force Expansion */
        body.export-mode .cs-section-content {
            max-height: none !important;
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
            padding: var(--cs-vertical-padding) var(--cs-side-padding) var(--cs-expanded-bottom) var(--cs-side-padding) !important;
        }
        body.export-mode .cs-section-header {
            cursor: default !important;
            pointer-events: none !important;
        }
        body.export-mode .cs-section-header::after {
            display: none !important;
        }
        
        /* Ensure all sections can be accordions */
        .cs-accordion-section .cs-section-header {
            cursor: pointer;
        }
    </style>
"""

if '</head>' in content:
    content = content.replace('</head>', style_addition + '</head>')

# 3. Add body class injection for Export Mode (if not already there)
if '{{ body_class }}' not in content:
    content = content.replace('<body class="dark-mode">', '<body class="dark-mode {{ body_class }}">')

with open(file_path, 'w') as f:
    f.write(content)

print("Template updated with robust Export Mode logic and Nav removal.")
