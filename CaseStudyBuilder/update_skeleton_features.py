import os
import re

file_path = 'templates/case_study_render.html'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Remove Top Panel (Navigation)
content = re.sub(r'<nav>.*?</nav>', '', content, flags=re.DOTALL)
content = re.sub(r'<div class="menu-overlay".*?</div>', '', content, flags=re.DOTALL)

# 2. Add Export Mode CSS and Accordion Styling
style_addition = """
    <style>
        /* Accordion Styling */
        .cs-section-content {
            display: none;
            overflow: hidden;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            transform: translateY(10px);
        }
        .cs-section.cs-expanded .cs-section-content {
            display: block;
            opacity: 1;
            transform: translateY(0);
        }
        .cs-section-header {
            cursor: pointer;
        }
        
        /* Export Mode Override */
        body.export-mode .cs-section-content {
            display: block !important;
            opacity: 1 !important;
            transform: none !important;
            max-height: none !important;
        }
        body.export-mode .cs-section-header {
            cursor: default !important;
            pointer-events: none !important;
        }
        body.export-mode .accordion-indicator {
            display: none !important;
        }
    </style>
"""
content = content.replace('</head>', style_addition + '</head>')

# 3. Ensure all sections are accordions
content = content.replace('class="cs-section reveal"', 'class="cs-section reveal cs-accordion-section"')

# 4. Add body class injection for Export Mode
content = content.replace('<body class="dark-mode">', '<body class="dark-mode {{ body_class }}">')

with open(file_path, 'w') as f:
    f.write(content)

print("Template updated with Accordion and Export Mode logic.")
