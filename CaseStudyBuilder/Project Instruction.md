# Project Instruction: Case Study Builder

This document serves as the master mandate for all lead roles working on the Case Study Builder. All development and design tasks must strictly adhere to the guidelines established here.

---

## 1. The Global Mandate (The Swiggy Skeleton)
The **Swiggy Daily Case Study** is the **Immutable Skeleton** for this platform. 
*   **Structural Integrity**: All "Information Architecture" boxes, sections, and layout hierarchies must be identical to the Swiggy reference.
*   **Immutable Boxes**: No lead may alter the skeletal structure of the output page. All AI-generated content must "fit" into these pre-defined boxes.
*   **Dual-State Accordion Logic**: All case study sections must be implemented as **Accordions**.
    *   **State A (Preview)**: Accordions are functional and interactive (expand/collapse).
    *   **State B (Export/Download)**: All accordions are forced into an "Expanded" state and the accordion UI triggers are hidden to ensure a clean, continuous image export.
*   **UI Cleanliness**: The top navigation panel (Back to Home, Menu, Theme icons) must be **Removed** from the skeleton as they are not part of the generated output.

---

## 2. Instructions for Lead UI/UX Designer
### **Task: Adaptive Visual Anchors & Theming**
*   **Device Frame System**: Create a library of high-fidelity, transparent device frames (e.g., iPhone 15 Pro for Mobile, Minimalist Browser for Web).
*   **Adaptive Hero Section**: Design the Hero layout to automatically switch between a vertical mobile frame or a horizontal web frame based on the user's platform selection.
*   **Solution Showcase**: Design the High-Fidelity and Mid-Fidelity sections to eleganty mask AI-extracted screenshots into these device frames, maintaining design system parity.
*   **Theme Presets**: Define the visual tokens for "Professional," "Modern," and "Minimalist" themes that will be injected into the skeleton.

---

## 3. Instructions for Full Stack Developer Lead
### **Task: Technical Foundation & Variable Engine**
*   **Variable Theming Engine**: Implement a CSS variable system (`:root`) that injects user-selected color palettes and themes into the Swiggy skeleton without altering the HTML structure.
*   **Accordion Implementation**: Build the CSS/JS logic for the Dual-State accordions. Use a specific class (e.g., `.export-mode`) to force expansion during downloads.
*   **Top Panel Removal**: Strip the `<nav>` and header controls from the Swiggy skeleton to create a standalone report view.
*   **Dynamic Data Mapping**: Build the logic that maps AI-synthesized research (from the Gemini engine) into the specific `id` or `class` of the Swiggy IA boxes.
*   **Dynamic Frame Injection**: Implement the logic to "wrap" AI-extracted screenshots into the designer-defined device frames (Mobile/Web) in the Hero and Solution sections.
*   **Performance Monitoring**: Ensure the real-time HUD accurately reflects the completion of each "Swiggy Skeleton" section.

---

## 4. Instructions for Lead Product Manager
### **Task: Narrative Logic & Dual-State Mandate**
*   **Dual-State Instruction**: Clearly define the requirement for developers: Sections must be interactive accordions in "Preview" but auto-expand and hide triggers in "Export" mode.
*   **AI Narrative Alignment**: Ensure the Gemini extraction engine is prompted to generate content that fits the *length and tone* required for the Swiggy boxes.
*   **Quality Assurance**: Perform a "Parity Audit" after every build to ensure the generated case study feels like a professional research document.

---

## 5. Instructions for Lead Tester
### **Task: Dual-State Verification**
*   **Preview Audit**: Verify that all sections (Overview, Empathy, Discovery, Solution) expand and collapse smoothly in the browser.
*   **Export Parity Test**: Conduct a "Download as Image" test to ensure that 100% of the content is visible and that no accordion UI elements or "hidden" sections exist in the final file.
*   **Top Panel Audit**: Confirm that the navigation bar and theme toggles are completely absent from the render.
