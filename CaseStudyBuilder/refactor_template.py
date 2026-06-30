import os

file_path = 'templates/case_study_render.html'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Update Title and Subtitle
content = content.replace('Swiggy Daily: The Routine Meal Revolution | UX Case Study', '{{ project_title }} | UX Case Study')
content = content.replace('Swiggy Daily: The Routine Meal Revolution.', '{{ project_title }}.')
content = content.replace('Transforming the fragmented tiffin ecosystem into a predictable, subscription-based daily meal experience for urban professionals.', '{{ project_subtitle }}')

# 2. Update Metadata
content = content.replace('<span class="meta-label">Role:</span> Principal Product Architect', '<span class="meta-label">Role:</span> {{ role }}')
content = content.replace('<span class="meta-label">Duration:</span> 12 Weeks', '<span class="meta-label">Duration:</span> {{ duration }}')
content = content.replace('<span class="meta-label">Client:</span> Swiggy', '<span class="meta-label">Client:</span> {{ client }}')

# 3. Update Overview and Problem
content = content.replace('Solving the daily meal crisis for urban students and working professionals through a unified tiffin subscription platform.', '{{ overview_summary }}')
content = content.replace('Swiggy Daily addresses the structured eating challenges faced by urban dwellers. While food delivery is optimized for instant cravings, daily meal planning remains fragmented and stressful.', '{{ project_overview_p1 }}')
content = content.replace('The goal was to evolve Swiggy from an on-demand platform into a routine-based ecosystem, integrating local tiffin vendors into a flexible, reliable subscription experience.', '{{ project_overview_p2 }}')

# 4. Update Images (Hero)
content = content.replace('/static/reference_assets/images/swiggy_daily_hero_final_transparent.png', '{{ hero_image_url }}')

# 5. Asset normalization (Flask url_for)
content = content.replace('href="/static/reference_assets/css/', 'href="{{ url_for(\'static\', filename=\'reference_assets/css/')
content = content.replace('.css">', '.css\') }}">')

with open(file_path, 'w') as f:
    f.write(content)

print("Template refactored successfully.")
