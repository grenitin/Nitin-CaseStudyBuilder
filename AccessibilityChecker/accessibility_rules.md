# Accessibility Best Practices (Design & Development)

| Area | Guideline | Example |
| :--- | :--- | :--- |
| **Color** | Use sufficient contrast (min 4.5:1 for text) | Don’t use red/green as the only difference |
| **Typography** | Use readable fonts and size | Avoid cursive, small fonts |
| **Alt Text** | Add text descriptions to images | `<img alt="Man using a wheelchair">` |
| **Keyboard Navigation** | Ensure all functions work with the keyboard | Tab, Enter, Arrow keys |
| **Forms** | Label all inputs clearly | `<label for="email">Email:</label>` |
| **Focus State** | Show visible focus when tabbing | Outlines or shadows on buttons |
| **ARIA Roles** | Use roles like `role="dialog"` or `aria-label="Close"` | Helps screen readers understand content |
| **Skip Links** | Let users skip to main content | `<a href="#main">Skip to content</a>` |
| **Responsive Design** | Content should be zoomable (up to 200%) | Avoid fixed-width containers |
| **Error Handling** | Show clear, accessible error messages | “Please enter a valid email address” |
