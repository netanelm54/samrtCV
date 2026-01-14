# Pull Request

## Description
<!-- Describe your changes -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactoring
- [ ] Documentation update

## Accessibility Checklist
**All PRs must verify accessibility compliance:**

- [ ] Semantic HTML used where possible
- [ ] ARIA attributes added for custom widgets (if needed)
- [ ] Keyboard navigation tested and working
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast meets WCAG AA standards (4.5:1 for text, 3:1 for large text)
- [ ] Form labels properly associated with inputs
- [ ] Error messages announced to screen readers (aria-live)
- [ ] Images have appropriate alt text
- [ ] Dynamic content has live regions (aria-live)
- [ ] Minimum touch target size: 44x44px
- [ ] Tested with keyboard navigation (Tab, Enter, Space, Escape)
- [ ] Tested with screen reader (NVDA/VoiceOver) or automated tool

**See `frontend/src/rules/A11Y_RULES.md` for complete guidelines.**

## Testing
- [ ] Manual testing completed
- [ ] Accessibility testing completed
- [ ] Cross-browser testing (if applicable)

## Screenshots (if applicable)
<!-- Add screenshots here -->

## Related Issues
<!-- Link to related issues -->

---

**Note**: This PR will not be merged until all accessibility checks pass.
