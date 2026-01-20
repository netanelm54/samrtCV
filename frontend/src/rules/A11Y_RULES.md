# Accessibility (A11Y) Rules & Guidelines

**IMPORTANT: All new code and changes MUST follow these accessibility guidelines.**

This document outlines accessibility requirements based on WCAG 2.1 Level AA standards and ARIA best practices. Every developer must review and apply these rules when writing or modifying code.

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [ARIA Guidelines](#aria-guidelines)
3. [Semantic HTML](#semantic-html)
4. [Color & Contrast](#color--contrast)
5. [Keyboard Navigation](#keyboard-navigation)
6. [Focus Management](#focus-management)
7. [Form Accessibility](#form-accessibility)
8. [Dynamic Content](#dynamic-content)
9. [Images & Icons](#images--icons)
10. [Testing Checklist](#testing-checklist)
11. [Common Patterns](#common-patterns)

---

## Core Principles

### 1. **Semantic HTML First**
- Always use semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<header>`, `<footer>`, etc.)
- Only use ARIA when semantic HTML is insufficient
- Never use `<div>` or `<span>` for interactive elements without proper ARIA

### 2. **Progressive Enhancement**
- Ensure core functionality works without JavaScript
- Add ARIA attributes to enhance, not replace, semantic HTML

### 3. **Keyboard Accessibility**
- All interactive elements must be keyboard accessible
- Tab order should be logical and intuitive
- Provide visible focus indicators

### 4. **Screen Reader Support**
- Use ARIA labels and descriptions appropriately
- Announce dynamic content changes
- Provide context for interactive elements

---

## ARIA Guidelines

### When to Use ARIA

✅ **Use ARIA when:**
- Creating custom widgets (tabs, modals, dropdowns)
- Adding labels/descriptions not visible on screen
- Indicating dynamic content changes
- Describing relationships between elements

❌ **Don't use ARIA when:**
- Semantic HTML already provides the information
- It conflicts with native HTML semantics
- You're unsure of the correct usage

### ARIA Roles

```vue
<!-- ✅ Good: Use semantic HTML -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<!-- ✅ Good: Custom widget needs ARIA -->
<div role="button" tabindex="0" aria-label="Close dialog">
  ×
</div>

<!-- ❌ Bad: Redundant ARIA -->
<button role="button">Click me</button>
```

### ARIA States and Properties

```vue
<!-- ✅ Good: Required form field -->
<input 
  type="text" 
  aria-required="true" 
  aria-describedby="field-hint"
/>

<!-- ✅ Good: Dynamic content -->
<div role="status" aria-live="polite" aria-busy="false">
  Processing complete
</div>

<!-- ✅ Good: Error message -->
<div role="alert" aria-live="assertive">
  Error: Invalid email address
</div>
```

### Common ARIA Patterns

| Pattern | ARIA Attributes | Example |
|---------|----------------|---------|
| Button | `aria-label`, `aria-pressed` (if toggle) | `<button aria-label="Close modal">×</button>` |
| Form Field | `aria-required`, `aria-describedby`, `aria-invalid` | `<input aria-required="true" aria-describedby="hint">` |
| Modal | `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby` | `<div role="dialog" aria-modal="true">` |
| Navigation | `role="navigation"`, `aria-label` | `<nav role="navigation" aria-label="Main menu">` |
| Live Region | `aria-live`, `aria-atomic` | `<div aria-live="polite">Status updates</div>` |
| List | `role="list"`, `role="listitem"` | `<ul role="list"><li role="listitem">` |

---

## Semantic HTML

### Required Semantic Elements

```vue
<!-- ✅ Always use semantic elements -->
<header role="banner">
  <h1>Page Title</h1>
</header>

<main role="main">
  <section aria-labelledby="section-title">
    <h2 id="section-title">Section Title</h2>
  </section>
</main>

<footer role="contentinfo">
  <p>Copyright</p>
</footer>
```

### Headings Hierarchy

- Use `<h1>` once per page (main title)
- Maintain logical heading order (h1 → h2 → h3, etc.)
- Never skip heading levels
- Use headings to structure content, not for styling

```vue
<!-- ✅ Good: Proper hierarchy -->
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>

<!-- ❌ Bad: Skipped levels -->
<h1>Main Title</h1>
<h3>Subsection Title</h3> <!-- Missing h2 -->
```

---

## Color & Contrast

### WCAG AA Requirements

- **Normal text (16px+)**: Minimum contrast ratio of **4.5:1**
- **Large text (18px+ or 14px+ bold)**: Minimum contrast ratio of **3:1**
- **Interactive elements**: Minimum contrast ratio of **3:1**

### Color Usage

```vue
<!-- ✅ Good: High contrast -->
<p style="color: #333;">Text on white background</p>
<p style="color: #e0e0e0;">Text on dark background</p>

<!-- ❌ Bad: Low contrast -->
<p style="color: #ccc;">Text on white background</p> <!-- Too light -->
```

### Don't Rely on Color Alone

- Always provide text labels or icons in addition to color
- Use patterns, shapes, or text to convey information

```vue
<!-- ✅ Good: Color + text -->
<span class="error" style="color: #c33;">
  ⚠️ Error: Invalid input
</span>

<!-- ❌ Bad: Color only -->
<span style="color: red;"></span> <!-- No text or icon -->
```

### Focus Indicators

- All focusable elements must have visible focus indicators
- Minimum 2px outline, preferably 3px
- Use high contrast colors (e.g., var(--color-primary))

```vue
<!-- ✅ Good: Visible focus -->
.button:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}
```

---

## Keyboard Navigation

### Tab Order

- Tab order should follow visual flow (top to bottom, left to right)
- All interactive elements must be keyboard accessible
- Use `tabindex="0"` for custom interactive elements
- Use `tabindex="-1"` to remove from tab order (but allow programmatic focus)

```vue
<!-- ✅ Good: Logical tab order -->
<form>
  <input type="text" />
  <input type="email" />
  <button type="submit">Submit</button>
</form>

<!-- ✅ Good: Custom widget -->
<div 
  role="button" 
  tabindex="0"
  @keydown.enter="handleClick"
  @keydown.space.prevent="handleClick"
>
  Custom Button
</div>
```

### Keyboard Shortcuts

- Support standard shortcuts (Enter, Space, Escape, Arrow keys)
- Document custom shortcuts
- Provide alternative methods for complex interactions

```vue
<!-- ✅ Good: Keyboard support -->
<div 
  @click="handleClick"
  @keydown.enter="handleClick"
  @keydown.space.prevent="handleClick"
  @keydown.esc="handleClose"
>
  Interactive Element
</div>
```

---

## Focus Management

### Focus Trapping (Modals)

- Trap focus within modals
- Return focus to trigger element when modal closes
- Focus first focusable element when modal opens

```vue
<!-- ✅ Good: Modal focus management -->
<ModalWrapper 
  @close="handleClose"
  :close-on-escape="true"
>
  <!-- Focus automatically trapped -->
</ModalWrapper>
```

### Skip Links

- Provide skip links for main content
- Skip links should be first focusable element

```vue
<!-- ✅ Good: Skip link -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```

### Focus Indicators

- Always provide visible focus indicators
- Use `:focus-visible` for keyboard focus only
- Ensure focus indicators meet contrast requirements

```vue
/* ✅ Good: Focus styles */
.button:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}
```

---

## Form Accessibility

### Required Fields

- Use `required` attribute
- Add `aria-required="true"`
- Provide visual indicator (e.g., asterisk)
- Include `aria-label` for screen readers

```vue
<!-- ✅ Good: Accessible form field -->
<label for="email">
  Email Address 
  <span class="required" aria-label="required">*</span>
</label>
<input 
  id="email"
  type="email"
  required
  aria-required="true"
  aria-describedby="email-hint"
/>
<small id="email-hint">We'll never share your email</small>
```

### Error Messages

- Use `role="alert"` for error messages
- Use `aria-live="assertive"` for immediate errors
- Associate errors with fields using `aria-describedby` or `aria-errormessage`
- Use `aria-invalid="true"` on invalid fields

```vue
<!-- ✅ Good: Error handling -->
<input 
  type="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<div id="email-error" role="alert" aria-live="assertive">
  Please enter a valid email address
</div>
```

### Form Labels

- Always use `<label>` elements
- Associate labels with inputs using `for` attribute
- Use `aria-label` only when label cannot be visible

```vue
<!-- ✅ Good: Proper label -->
<label for="username">Username</label>
<input id="username" type="text" />

<!-- ✅ Good: Hidden label -->
<input 
  type="search"
  aria-label="Search products"
  placeholder="Search..."
/>
```

---

## Dynamic Content

### Live Regions

- Use `aria-live` to announce dynamic content
- Use `aria-live="polite"` for non-urgent updates
- Use `aria-live="assertive"` for urgent/error messages
- Use `aria-atomic="true"` to announce entire region

```vue
<!-- ✅ Good: Status updates -->
<div role="status" aria-live="polite" aria-busy="false">
  Processing complete
</div>

<!-- ✅ Good: Error messages -->
<div role="alert" aria-live="assertive" aria-atomic="true">
  Error: Payment failed
</div>

<!-- ✅ Good: Loading state -->
<div role="status" aria-live="polite" aria-busy="true">
  Loading...
</div>
```

### Loading States

- Use `aria-busy="true"` during loading
- Provide loading text or spinner with `aria-label`
- Update `aria-busy` to `false` when complete

```vue
<!-- ✅ Good: Loading indicator -->
<div aria-busy="true" aria-live="polite">
  <div class="spinner" aria-label="Loading"></div>
  <span>Processing your request...</span>
</div>
```

---

## Images & Icons

### Alt Text

- Always provide `alt` text for images
- Use empty `alt=""` for decorative images
- Describe content, not appearance

```vue
<!-- ✅ Good: Descriptive alt text -->
<img src="chart.png" alt="Sales increased 25% in Q4 2023" />

<!-- ✅ Good: Decorative image -->
<img src="decoration.png" alt="" aria-hidden="true" />
```

### Icons

- Use `aria-hidden="true"` for decorative icons
- Provide text labels for icon-only buttons
- Use `aria-label` for icon buttons

```vue
<!-- ✅ Good: Icon button -->
<button aria-label="Close dialog">
  <span aria-hidden="true">×</span>
</button>

<!-- ✅ Good: Icon with text -->
<button>
  <span aria-hidden="true">✓</span>
  <span>Save</span>
</button>
```

---

## Testing Checklist

Before submitting code, verify:

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Escape key closes modals/dropdowns
- [ ] Enter/Space activate buttons

### Screen Reader Testing
- [ ] Test with NVDA (Windows) or VoiceOver (Mac)
- [ ] All content is announced correctly
- [ ] Form labels are associated properly
- [ ] Error messages are announced
- [ ] Dynamic content updates are announced

### Visual Testing
- [ ] Color contrast meets WCAG AA standards
- [ ] Text is readable at 200% zoom
- [ ] Focus indicators are visible
- [ ] No information conveyed by color alone

### Code Review
- [ ] Semantic HTML used where possible
- [ ] ARIA attributes used correctly
- [ ] No redundant ARIA
- [ ] All images have alt text
- [ ] Forms have proper labels

---

## Common Patterns

### Accessible Button

```vue
<template>
  <button
    @click="handleClick"
    :disabled="isDisabled"
    :aria-label="ariaLabel"
    :aria-pressed="isPressed"
    class="button"
  >
    <span v-if="icon" aria-hidden="true">{{ icon }}</span>
    <span>{{ label }}</span>
  </button>
</template>

<style scoped>
.button {
  min-height: 44px;
  min-width: 44px;
}

.button:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
```

### Accessible Modal

```vue
<template>
  <BaseModal
    :show="show"
    :title-id="'modal-title'"
    :description-id="'modal-description'"
    @close="handleClose"
  >
    <h2 id="modal-title">Modal Title</h2>
    <p id="modal-description">Modal description</p>
    <!-- Content -->
  </BaseModal>
</template>
```

### Accessible Form Field

```vue
<template>
  <div class="form-group">
    <label for="field-id">
      Field Label
      <span v-if="required" class="required" aria-label="required">*</span>
    </label>
    <input
      id="field-id"
      type="text"
      :required="required"
      :aria-required="required"
      :aria-invalid="hasError"
      :aria-describedby="hintId"
      @input="handleInput"
    />
    <small v-if="hint" :id="hintId" class="hint">{{ hint }}</small>
    <div v-if="error" role="alert" aria-live="assertive">
      {{ error }}
    </div>
  </div>
</template>
```

### Accessible Pricing Card

```vue
<template>
  <div
    class="pricing-card"
    :class="{ selected: isSelected }"
    role="button"
    :aria-pressed="isSelected"
    :aria-label="`Select ${title} for $${price}`"
    tabindex="0"
    @click="handleSelect"
    @keydown.enter="handleSelect"
    @keydown.space.prevent="handleSelect"
  >
    <h3>{{ title }}</h3>
    <div aria-label="Price: ${{ price }}">${{ price }}</div>
  </div>
</template>
```

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [A11Y Project](https://www.a11yproject.com/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension for testing

---

## Quick Reference

### Minimum Requirements Checklist

- [ ] Semantic HTML used
- [ ] ARIA attributes added where needed
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Form labels associated
- [ ] Error messages announced
- [ ] Images have alt text
- [ ] Dynamic content has live regions
- [ ] Minimum touch target: 44x44px

---

**Remember: Accessibility is not optional. Every change must consider users with disabilities.**
