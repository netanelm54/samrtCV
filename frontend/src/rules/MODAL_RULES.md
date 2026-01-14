# Modal Component Rules

This document outlines the rules and patterns for creating modals in this application.

## Architecture

All modals should follow a consistent pattern using the `BaseModal` component as the foundation.

The modal system has three layers:
1. **ModalWrapper** (`components/common/ModalWrapper.vue`) - Handles accessibility and focus trap
2. **BaseModal** (`components/BaseModal.vue`) - Provides styling and structure
3. **Specific Modals** (e.g., `UpsellModal.vue`) - Contains modal-specific content

## ModalWrapper Component

The `ModalWrapper` component (in `components/common/`) provides:
- **Accessibility (a11y)**:
  - ARIA attributes (role="dialog", aria-modal, aria-labelledby, aria-describedby)
  - Keyboard navigation (ESC to close, Tab trapping)
  - Screen reader support
- **Focus Trap**:
  - Traps focus within the modal
  - Prevents focus from escaping to background content
  - Restores focus to previous element when closed
- **Body Scroll Lock**: Prevents background scrolling when modal is open
- **Teleport**: Renders modal at body level (prevents z-index issues)

**Note**: `ModalWrapper` should NOT be used directly. Use `BaseModal` instead.

## BaseModal Component

The `BaseModal` component provides:
- Overlay with backdrop
- Close button (optional)
- Consistent animations
- Size variants (small, medium, large, full)
- Uses `ModalWrapper` for accessibility and focus trap

### Usage

```vue
<BaseModal :show="isVisible" size="medium" @close="handleClose">
  <!-- Your modal content here -->
</BaseModal>
```

### Props

- `show` (Boolean): Controls modal visibility
- `showCloseButton` (Boolean, default: true): Show/hide close button
- `closeOnOverlay` (Boolean, default: true): Close when clicking overlay
- `size` (String, default: 'medium'): Modal size - 'small', 'medium', 'large', 'full'

### Events

- `close`: Emitted when modal should be closed

## Creating a New Modal

### Step 1: Create Component File

Create a new file: `YourModal.vue` in the `components` directory.

### Step 2: Use BaseModal

```vue
<template>
  <BaseModal :show="show" size="medium" @close="$emit('close')">
    <!-- Your specific content -->
    <h2 id="modal-title">Modal Title</h2>
    <p id="modal-description">Modal content...</p>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue'

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])
</script>

<style scoped>
/* Only styles specific to this modal */
</style>
```

### Step 3: Rules to Follow

1. **Always use BaseModal**: Don't create custom overlay/container logic
2. **Don't use ModalWrapper directly**: BaseModal wraps ModalWrapper for you
3. **Keep styles scoped**: Only add styles specific to your modal content
4. **Use props for configuration**: Pass data via props, emit events for actions
5. **Accessibility is automatic**: ModalWrapper handles all a11y features
6. **Focus trap is automatic**: Focus is trapped within modal automatically
7. **Consistent sizing**: Use size prop (small/medium/large/full) instead of custom widths
8. **Provide IDs for accessibility**: Use `title-id` and `description-id` props for better screen reader support
9. **Follow A11Y guidelines**: See `A11Y_RULES.md` for complete accessibility requirements

## Examples

### Simple Modal
```vue
<BaseModal :show="show" @close="show = false">
  <h2>Simple Modal</h2>
  <p>Content here</p>
</BaseModal>
```

### Modal with Custom Actions
```vue
<BaseModal :show="show" @close="$emit('close')">
  <h2>Confirm Action</h2>
  <button @click="$emit('confirm')">Confirm</button>
  <button @click="$emit('close')">Cancel</button>
</BaseModal>
```

### Large Modal
```vue
<BaseModal :show="show" size="large" @close="$emit('close')">
  <!-- Large content -->
</BaseModal>
```

## Benefits

- **Consistency**: All modals look and behave the same
- **Maintainability**: Changes to BaseModal affect all modals
- **Reusability**: Easy to create new modals
- **Accessibility**: Built-in accessibility features
- **Performance**: Teleport prevents z-index stacking issues

## Current Modals

- `UpsellModal.vue` - Upsell offer after analysis download
- `BaseModal.vue` - Base modal component (use this for all modals)
- `ModalWrapper.vue` - Accessibility and focus trap wrapper (used by BaseModal, don't use directly)

## Folder Structure

```
components/
├── common/
│   └── ModalWrapper.vue    # Accessibility & focus trap (internal use)
├── BaseModal.vue            # Base modal component (use this)
└── UpsellModal.vue          # Example specific modal

rules/
└── MODAL_RULES.md           # This file
```

## Future Modals

When creating new modals, follow this pattern:
1. Import BaseModal (NOT ModalWrapper)
2. Wrap content in BaseModal
3. Define props and emits
4. Add only modal-specific styles
5. Accessibility and focus trap are handled automatically

