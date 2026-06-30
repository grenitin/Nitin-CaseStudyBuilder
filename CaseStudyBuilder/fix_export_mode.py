import os
import re

file_path = 'templates/case_study_render.html'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Remove previous style additions to start clean
content = re.sub(r'<style>\s*/\* Accordion Styling \*/.*?</style>', '', content, flags=re.DOTALL)
content = re.sub(r'<style>\s*/\* Export Mode Override - Force Expansion \*/.*?</style>', '', content, flags=re.DOTALL)

# 2. Add THE Master Style Block
master_style = """
    <style>
        /* --- Case Study Builder: Dual-State Accordion & Export Mode --- */
        
        /* State A: Interactive Accordions (Preview) */
        .cs-section .cs-section-content {
            max-height: 0;
            overflow: hidden;
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            visibility: hidden;
        }
        
        .cs-section.cs-expanded .cs-section-content {
            max-height: 20000px;
            opacity: 1;
            visibility: visible;
            padding: var(--cs-vertical-padding) var(--cs-side-padding) var(--cs-expanded-bottom) var(--cs-side-padding);
        }

        /* State B: Global Export Mode Override (Download) */
        body.export-mode .cs-section-content {
            max-height: none !important;
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
            padding: var(--cs-vertical-padding) var(--cs-side-padding) var(--cs-expanded-bottom) var(--cs-side-padding) !important;
        }
        
        /* Hide all Accordion Toggles and reveal markers in Export Mode */
        body.export-mode .cs-section-header::after,
        body.export-mode .cs-accordion-section .cs-section-header::after {
            display: none !important;
            content: none !important;
        }
        
        body.export-mode .cs-section-header {
            cursor: default !important;
            pointer-events: none !important;
        }

        /* Disable Reveal-on-Scroll animations in Export Mode */
        body.export-mode .reveal {
            opacity: 1 !important;
            visibility: visible !important;
            transform: none !important;
        }
    </style>
"""

content = content.replace('</head>', master_style + '</head>')

with open(file_path, 'w') as f:
    f.write(content)

print("Template updated with Master Export Mode logic.")
