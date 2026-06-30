import re

with open('templates/case_study_render.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace H1 title
content = re.sub(r'<h1 class="ds-heading-h1 cs-title-centered"[^>]*>FIPA Enterprise Redesign</h1>', 
                 '<h1 class="ds-heading-h1 cs-title-centered" style="font-size: 44px !important;">{{ title }}</h1>', content)

# Replace Subtitle
content = re.sub(r'<p class="cs-subtitle-centered">Streamlining complex supply chain procurement[^<]*</p>',
                 '<p class="cs-subtitle-centered">{{ subtitle }}</p>', content)

# Overview text replacement
content = re.sub(r'<p>Centralizing the employee ecosystem to eliminate operational bottlenecks[^<]*</p>',
                 '<p>{{ problem_statement }}</p>', content)

content = re.sub(r'<p>Girnar Careline relies on a robust workforce, but their legacy HR portal was creating\s*operational bottlenecks.[^<]*</p>\s*<p>The goal was to design a centralized[^<]*</p>',
                 '<p>{{ problem_statement }}</p>', content)

# Empathy section replacement
empathy_pattern = re.compile(r'<!-- 1\. EMPATHY -->.*?</section>', re.DOTALL)
empathy_replacement = """<!-- 1. EMPATHY -->
            {% for artifact in artifacts %}
            {% if artifact.type == 'behavioral_findings' %}
            <section class="cs-section reveal">
                <div class="cs-section-header">
                    <div class="cs-section-marker">E</div>
                    <h2 class="ds-heading-h2">{{ artifact.title }}</h2>
                </div>
                <div class="cs-section-content">
                    <div class="cs-grid-3">
                        {% for pillar in artifact.pillars %}
                        <div class="ds-card">
                            <h4 style="color: var(--accent); margin-bottom: 1rem;">{{ pillar.title }}</h4>
                            <p>{{ pillar.insight }}</p>
                        </div>
                        {% endfor %}
                    </div>
                </div>
            </section>
            {% endif %}
            {% endfor %}"""
content = empathy_pattern.sub(empathy_replacement, content)

# Define section replacement
define_pattern = re.compile(r'<!-- 2\. DEFINE -->.*?</section>', re.DOTALL)
define_replacement = """<!-- 2. DEFINE -->
            {% for artifact in artifacts %}
            {% if artifact.type == 'hmw_questions' %}
            <section class="cs-section reveal">
                <div class="cs-section-header">
                    <div class="cs-section-marker">D</div>
                    <h2 class="ds-heading-h2">{{ artifact.title }}</h2>
                </div>
                <div class="cs-section-content">
                    <ul style="list-style-type: none; padding: 0;">
                        {% for q in artifact.questions %}
                        <li style="margin-bottom: 1rem; padding: 1.5rem; background: rgba(255,255,255,0.02); border-left: 4px solid var(--accent); border-radius: 4px;">
                            <h4 style="font-size: 1.2rem; margin: 0;">{{ q }}</h4>
                        </li>
                        {% endfor %}
                    </ul>
                </div>
            </section>
            {% endif %}
            {% endfor %}"""
content = define_pattern.sub(define_replacement, content)

# Ideate section replacement
ideate_pattern = re.compile(r'<!-- 3\. IDEATE -->.*?</section>', re.DOTALL)
ideate_replacement = """<!-- 3. IDEATE -->
            {% for artifact in artifacts %}
            {% if artifact.type == 'scamper_board' %}
            <section class="cs-section reveal">
                <div class="cs-section-header">
                    <div class="cs-section-marker">I</div>
                    <h2 class="ds-heading-h2">{{ artifact.title }}</h2>
                </div>
                <div class="cs-section-content">
                    <div class="cs-grid-2">
                        {% for point in artifact.points %}
                        <div class="ds-card">
                            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 0.5rem;">{{ point.method }}</div>
                            <h4 style="margin-bottom: 0.5rem;">{{ point.action }}</h4>
                            <p style="color: var(--accent);">{{ point.benefit }}</p>
                        </div>
                        {% endfor %}
                    </div>
                </div>
            </section>
            {% elif artifact.type == 'solution_pivot' %}
            <section class="cs-section reveal">
                <div class="cs-section-header">
                    <div class="cs-section-marker">P</div>
                    <h2 class="ds-heading-h2">{{ artifact.title }}</h2>
                </div>
                <div class="cs-section-content">
                    <div class="ds-card" style="border: 1px solid var(--accent);">
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="color: #ff5252; margin-bottom: 0.5rem;">Before</h4>
                            <p>{{ artifact.pivot.before }}</p>
                        </div>
                        <div style="margin-bottom: 1.5rem; padding-left: 1.5rem; border-left: 2px solid var(--text-secondary);">
                            <h4 style="color: var(--text-secondary); margin-bottom: 0.5rem;">The Pivot Logic</h4>
                            <p>{{ artifact.pivot.pivot_logic }}</p>
                        </div>
                        <div>
                            <h4 style="color: #4CAF50; margin-bottom: 0.5rem;">After</h4>
                            <p>{{ artifact.pivot.after }}</p>
                        </div>
                    </div>
                </div>
            </section>
            {% endif %}
            {% endfor %}"""
content = ideate_pattern.sub(ideate_replacement, content)

# Solution section replacement
solution_pattern = re.compile(r'<!-- 4\. SOLUTION -->.*?</section>', re.DOTALL)
solution_replacement = """<!-- 4. SOLUTION -->
            <section class="cs-section reveal">
                <div class="cs-section-header">
                    <div class="cs-section-marker">S</div>
                    <h2 class="ds-heading-h2">High-Fidelity Solution</h2>
                </div>
                <div class="cs-section-content">
                    <div style="width: 100%; text-align: center; margin-bottom: 2rem;">
                        <img src="{{ hero_secondary_url }}" style="max-width: 100%; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);" alt="UI Screenshot">
                    </div>
                    {% for artifact in artifacts %}
                    {% if artifact.type == 'ui_preview' %}
                    <div class="cs-grid-3">
                        {% for annotation in artifact.annotations %}
                        <div class="ds-card">
                            <h4 style="color: var(--accent); margin-bottom: 0.5rem;">{{ annotation.title }}</h4>
                            <p>{{ annotation.rationale }}</p>
                        </div>
                        {% endfor %}
                    </div>
                    {% endif %}
                    {% endfor %}
                </div>
            </section>"""
content = solution_pattern.sub(solution_replacement, content)

# The Testing and Reflections section are mostly okay, I will just leave them as they were if they loop correctly.
# Wait, let's check testing section:
testing_pattern = re.compile(r'<!-- 5\. TESTING -->.*?</section>', re.DOTALL)
testing_replacement = ""
content = testing_pattern.sub(testing_replacement, content)

with open('templates/case_study_render.html', 'w', encoding='utf-8') as f:
    f.write(content)
    
print("Template dynamized successfully.")
