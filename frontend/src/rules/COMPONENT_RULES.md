# Component Separation Rules

This document outlines the rules and best practices for separating components in this application.

## When to Create a New Component

### 1. **Duplicate Elements**
If you find yourself copying and pasting similar HTML structures, create a reusable component.

**Example:**
```vue
<!-- ❌ Bad: Duplicated feature cards -->
<div class="feature-card">
  <div class="feature-icon">📊</div>
  <h4>Match Score</h4>
  <p>Description...</p>
</div>
<div class="feature-card">
  <div class="feature-icon">🔍</div>
  <h4>Missing Keywords</h4>
  <p>Description...</p>
</div>

<!-- ✅ Good: Reusable component with loop -->
<FeatureCard
  v-for="feature in features"
  :key="feature.id"
  :icon="feature.icon"
  :title="feature.title"
  :description="feature.description"
/>
```

### 2. **Repeated Patterns (3+ times)**
If the same pattern appears 3 or more times, extract it into a component.

### 3. **Logical Separation**
Separate components by:
- **Feature/Function**: Each major feature should be its own component
- **Step/Stage**: Multi-step forms should have separate step components
- **Reusability**: If something can be reused, make it a component

### 4. **Complexity**
If a component exceeds ~200 lines or has multiple responsibilities, consider splitting it.

## Component Structure

### File Organization
```
components/
├── common/              # Reusable, generic components
│   ├── ModalWrapper.vue
│   ├── PricingCard.vue
│   └── FeatureCard.vue
├── FormStep.vue         # Feature-specific components
├── PricingStep.vue
└── Home.vue               # Page-level components
```

### Naming Conventions
- **Common components**: Generic names (e.g., `PricingCard`, `FeatureCard`)
- **Feature components**: Descriptive names (e.g., `FormStep`, `PricingStep`, `UpsellModal`)
- **Page components**: Page names (e.g., `Home`, `SuccessPage`)

## Using Loops Instead of Duplication

### Rule: Use `v-for` for Repeated Elements

**Before (Duplicated):**
```vue
<div class="pricing-card">...</div>
<div class="pricing-card">...</div>
<div class="pricing-card">...</div>
```

**After (With Loop):**
```vue
<PricingCard
  v-for="option in pricingOptions"
  :key="option.id"
  :title="option.title"
  :price="option.price"
  :description="option.description"
  :features="option.features"
  :badge="option.badge"
  :badge-type="option.badgeType"
  :is-selected="selectedOption === option.id"
  @select="selectOption(option.id)"
/>
```

### Data-Driven Approach

Move static data to arrays/objects:

```javascript
const pricingOptions = [
  {
    id: 'analysis',
    title: 'Analysis Only',
    price: 5,
    description: 'Get detailed CV analysis report',
    features: ['Match Score', 'Missing Keywords', 'Actionable Recommendations']
  },
  {
    id: 'improved',
    title: 'Improved CV',
    price: 18,
    description: 'Get 2 improved CV templates',
    features: ['Traditional Classic Template', 'Modern Minimalist Template', 'Ready to send'],
    badge: 'Most Popular',
    badgeType: 'popular'
  },
  // ...
]
```

## Component Communication

### Props Down, Events Up
- **Props**: Pass data from parent to child
- **Events**: Emit actions from child to parent

```vue
<!-- Parent -->
<ChildComponent
  :data="parentData"
  @action="handleAction"
/>

<!-- Child -->
<script setup>
defineProps(['data'])
defineEmits(['action'])
</script>
```

## Best Practices

### 1. **Single Responsibility**
Each component should have one clear purpose.

### 2. **Props Validation**
Always define prop types and defaults:

```vue
defineProps({
  title: {
    type: String,
    required: true
  },
  optional: {
    type: String,
    default: 'default value'
  }
})
```

### 3. **Scoped Styles**
Use `<style scoped>` to prevent style conflicts.

### 4. **Composition Over Duplication**
- Extract common logic into composables
- Extract common UI into components
- Use loops instead of copy-paste

### 5. **Documentation**
Add comments for complex components explaining:
- What it does
- Required props
- Emitted events
- Usage examples

## Examples

### ✅ Good Component Structure

```vue
<!-- PricingCard.vue - Reusable component -->
<template>
  <div class="pricing-card" @click="$emit('select')">
    <h4>{{ title }}</h4>
    <div class="price">${{ price }}</div>
    <ul>
      <li v-for="feature in features" :key="feature">
        ✓ {{ feature }}
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  price: Number,
  features: Array
})
defineEmits(['select'])
</script>
```

### ❌ Bad: Duplicated Code

```vue
<!-- Don't do this -->
<div class="pricing-card">
  <h4>Option 1</h4>
  <div class="price">$5</div>
  <ul>
    <li>Feature 1</li>
    <li>Feature 2</li>
  </ul>
</div>
<div class="pricing-card">
  <h4>Option 2</h4>
  <div class="price">$18</div>
  <ul>
    <li>Feature 1</li>
    <li>Feature 2</li>
  </ul>
</div>
```

## Checklist

Before creating a new component, ask:
- [ ] Is this pattern repeated 3+ times?
- [ ] Can this be reused elsewhere?
- [ ] Does this have a clear, single responsibility?
- [ ] Can I use a loop instead of duplication?
- [ ] Is the component name descriptive?

## Current Reusable Components

- `common/PricingCard.vue` - Pricing option cards
- `common/FeatureCard.vue` - Feature display cards
- `common/ModalWrapper.vue` - Modal accessibility wrapper
- `BaseModal.vue` - Base modal component
- `FormStep.vue` - Form step component
- `PricingStep.vue` - Pricing step component

