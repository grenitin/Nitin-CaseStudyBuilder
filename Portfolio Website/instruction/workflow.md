# UX Case Study Creation Workflow

This document outlines the mandatory step-by-step process for creating new UX case studies within this portfolio project.

## Phase 1: Initiation
1. **Trigger**: When the user says "New Case Study", the AI must ask for the **Project Name**.
2. **Setup**:
   - Create a new folder named after the **Project Name**.
   - Copy the contents of the `Parent` folder (the Parent Clone Case Study) into this new folder.
   - **Critical**: Ensure no damage to the existing codebase, HTML structure, responsiveness, style guide, or design system.
3. **Platform Confirmation**: Ask "Is this project for: Mobile Application, Web/Desktop Application, or Both?".
4. **Problem Statement**: Ask "I’m ready. Please share the Problem Statement."

## Phase 2: Research & Content
1. **Analysis**: Thoroughly analyze the provided Problem Statement.
2. **Research**: Conduct independent research based on the problem statement.
3. **Drafting**: Fill every section of the cloned case study detail page with structured, meaningful content (referencing the Swiggy Daily standard).
4. **Consistency**: Ensure alignment with the existing Information Architecture (IA) and design system.
5. **Review**: Share the clickable Local URL for review.
6. **Hold**: Wait for "Done" or "Approved from my side" before proceeding to visuals.

## Phase 3: Visuals & Showcases
1. **Asset Check**: Ask "Do you already have a Hero Image, High-Fidelity Screens, Diagrams, or Visual Assets for this project? (Yes/No)".
2. **Asset Creation (if No)**:
   - Create Hero Sections, High-Fidelity Screens, Mockups, and Showcases based on the platform type (Mobile/Desktop/Both).
   - Create dedicated Showcase Sections (separate for Mobile and Desktop if both are required).
3. **Alignment**: Ensure visuals align with the narrative, user journey, and research insights.
4. **Final Review**: Share the Final Project URL.
5. **Final Approval**: Wait for "Done" or "Approved from my side".

## Phase 4: Integration
1. **Home Page Update**: Add the new case study to the `index.html` under the "Featured Case Studies" section.
2. **Styling Parity**: Ensure the new card matches existing structure, hover effects, spacing, and animations.
3. **Linking**: Ensure the card is fully linked to the new case study detail page.

## Critical Constraints
- **Zero Damage**: Do not modify or break the core framework, margin-padding system, or responsive logic.
- **System Integrity**: Maintain the Parent Clone structure throughout.
- **Seamless Integration**: Every new component must feel native to the existing design system.
