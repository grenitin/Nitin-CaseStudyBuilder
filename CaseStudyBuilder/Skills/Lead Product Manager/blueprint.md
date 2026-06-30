# Case Study Builder - Application Blueprint

## 1. Project Vision
To empower UI designers who focus on visual execution to effortlessly generate high-fidelity, research-backed UX case studies. By extracting strategic intent from design links (Figma/Marvel/Web), the platform automates the storytelling process using AI.

## 2. Information Architecture (The Swiggy Skeleton)
The application output must strictly adhere to the following structural hierarchy, derived from the **Swiggy Daily** reference:

1.  **Section 0: Premium Hero**
    *   Holographic image showcase of the UI.
    *   Dynamic Performance Badges (Revenue, Retention, Growth metrics).
    *   Contextual Metadata (Role, Duration, Client).
2.  **Section 1: Problem Space**
    *   Executive Overview.
    *   Detailed Problem Statement cards (Decision Fatigue, Fragmented Supply, etc.).
3.  **Section 2: The Empathy Phase**
    *   Business Goals & Market Opportunity.
    *   Competitive Analysis (Zomato, Local Tiffins, etc.).
    *   **Competitor Positioning Map** (Interactive 2-axis chart).
4.  **Section 3: Discovery & Research**
    *   User Research Methodology.
    *   User Personas (AI-generated based on design complexity).
    *   Affinity Wall & Empathy Grids.
5.  **Section 4: The Solution (High-Fidelity)**
    *   Information Architecture / User Flows.
    *   Visual Design System.
    *   Interactive Prototype Showcase.
6.  **Section 5: Impact & Learnings**
    *   Success Metrics.
    *   Future Roadmap & Lessons Learned.

## 3. End-to-End Application Flow

### **Step 1: Configuration Intake**
*   **User Action**: Pastes Figma/Marvel link.
*   **System Action**: Scrapes metadata and Suggests Brand Palette (Primary/Secondary color sync).

### **Step 2: Agentic Research Pipeline**
*   **User Action**: Triggers "Start Analysis."
*   **System Action**: Spawns a background thread that maps design components to UX research narratives using the Gemini AI Engine.
*   **Feedback**: Real-time HUD (Head-Up Display) shows task progress (e.g., "Synthesizing Competitor Map...").

### **Step 3: Structural Assembly**
*   **System Action**: Injects the AI-synthesized research into the modular Jinja2 "Swiggy-Skeleton" template.
*   **System Action**: Converts file-based assets (personas, images) into web-ready static paths.

### **Step 4: Final Preview & Export**
*   **User Action**: Reviews the generated case study.
*   **System Action**: Renders the final high-fidelity URL for the designer's portfolio.

## 4. Quality Guardrails
*   **Narrative Parity**: The AI must not hallucinate; all research insights must be logically derived from the design assets.
*   **Design Integrity**: The output must maintain "Boardroom Obsidian" aesthetic standards (glassmorphism, dark-mode first).
*   **Performance**: Sub-second rendering for the monitoring HUD.
