# UX Brief: [Project Name]

**Author:** [Founder name]
**Date:** [YYYY-MM-DD]

---

## Design Direction

- **Style:** [e.g., Clean/minimal, dark mode, playful, corporate]
- **Reference:** [Link to Figma, screenshots, or "similar to X product"]
- **Brand colors:** [e.g., Primary: #C9935E, Background: #0c0c0c]
- **Fonts:** [e.g., Inter (body), Playfair Display (headings)]
- **Component library:** [e.g., shadcn/ui, Tailwind UI, custom]

## User Flow — Happy Path

> The main journey a user takes. Numbered steps, one path.

1. User lands on [landing page / login screen]
2. User [signs up / logs in] via [method]
3. User sees [dashboard / onboarding / main view]
4. User [primary action — what they came to do]
5. User [completes task / gets result]
6. User [next action / logout / share]

## Screens

> List each screen with purpose and key elements. Link to Figma frames if available.

### Screen 1: [Name]
- **Purpose:** [What does this screen do?]
- **Key elements:** [Nav, hero, form, table, etc.]
- **Figma:** [Link or "Operator designs based on description"]

### Screen 2: [Name]
- **Purpose:**
- **Key elements:**
- **Figma:**

### Screen 3: [Name]
- **Purpose:**
- **Key elements:**
- **Figma:**

## Edge Cases

> This is the most important section. Without these, Operator/AI will make arbitrary decisions.

| Scenario | What to show | Notes |
|----------|-------------|-------|
| **Empty state** (no data yet) | [e.g., illustration + "No items yet. Create your first."] | |
| **Loading state** | [e.g., skeleton loader / spinner / nothing] | |
| **Error state** (API fails) | [e.g., toast: "Something went wrong. Try again."] | |
| **Long content** (overflow) | [e.g., truncate with "..." after 80 chars] | |
| **Offline/slow connection** | [e.g., "You appear to be offline" banner] | |
| **Mobile (< 768px)** | [e.g., stack columns, hide sidebar, bottom nav] | |
| **Permission denied** | [e.g., "You don't have access to this page"] | |
| **Session expired** | [e.g., redirect to login with "Session expired" message] | |

## Copy

> Key UI text. Prevents Operator from writing placeholder copy that ships to production.

| Element | Text | Notes |
|---------|------|-------|
| Page title | [e.g., "Dashboard"] | |
| Primary CTA | [e.g., "Get Started"] | Not "Submit" |
| Empty state | [e.g., "No results yet."] | |
| Error toast | [e.g., "Something went wrong. Please try again."] | |
| Success toast | [e.g., "Saved successfully."] | |
| Confirm delete | [e.g., "Are you sure? This cannot be undone."] | |

## Accessibility Requirements

- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader labels on icons and images
- [ ] Color contrast ratio >= 4.5:1
- [ ] Focus indicators visible
- [ ] Form inputs have associated labels

## Acceptance Criteria (UX — verified before steg 4)

> For product-level acceptance criteria (Gate C, end of steg 2), see PRD.md.

- [ ] Happy path works on desktop and mobile
- [ ] All edge cases from table above are handled
- [ ] Copy matches this document (no placeholder text)
- [ ] Accessibility requirements met
