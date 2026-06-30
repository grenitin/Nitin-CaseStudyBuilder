# Accessibility Checker - Execution Playbook

This playbook defines the step-by-step strategy for building the backend engine, outlining which specialist role owns each step of the execution phase.

## Step 1: Headless Automation Setup
**Role:** Accessibility Engineer
**Action:** Implement `scripts/checker.py` using Playwright or BeautifulSoup to fetch the HTML, CSS, and DOM structure of the provided URL.
**Deliverable:** A script that can successfully scrape a webpage and return a structured JSON of elements (images, forms, links, text).

## Step 2: Objective Rule Evaluation
**Role:** Accessibility Engineer
**Action:** Write programmatic tests against the scraped DOM to evaluate:
- Contrast Ratios
- Presence of ARIA Roles
- Form Labels
- Skip Links
**Deliverable:** A score and pass/fail status for the objective WCAG guidelines.

## Step 3: LLM Integration for Subjective Rules
**Role:** LLM Integrator
**Action:** Use the frontend-provided API Key and Model (Gemini/GPT-4/Claude) to send the scraped data (like image `alt` attributes and error strings) to the LLM.
**Action:** Prompt the LLM to evaluate subjective rules (Are the alt texts descriptive? Are the error messages clear? Are fonts readable?).
**Deliverable:** LLM-generated pass/fail statuses and specific, actionable suggestions for subjective guidelines.

## Step 4: Backend API Stitching
**Role:** Backend Developer
**Action:** Update `app.py` to receive the frontend POST request, route the URL and API Key to `scripts/checker.py`, and aggregate the results from Step 2 and Step 3.
**Deliverable:** The `/analyze` endpoint securely processes the request and returns the fully combined audit report in JSON format.

## Step 5: End-to-End Testing & UI Validation
**Role:** QA Tester
**Action:** Run the agent against known accessible and inaccessible websites. Verify the score calculation, test error handling (invalid URLs/Keys, API rate limits), and ensure the UI correctly displays the results.
**Deliverable:** A fully polished, production-ready Accessibility Checker Agent.
