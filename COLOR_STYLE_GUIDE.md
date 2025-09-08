# 🎨 Orbit IQ Color Style Guide

## Overview

This document defines the complete color system for the Orbit IQ platform. The color system is designed to be consistent, accessible, and easily maintainable through CSS custom properties (CSS variables).

## 🎯 Design Principles

1. **Consistency**: All colors follow a systematic approach with consistent naming conventions
2. **Accessibility**: Colors meet WCAG contrast requirements for readability
3. **Maintainability**: Centralized color management through CSS variables
4. **Scalability**: Easy to update themes and add new color variations
5. **Semantic Meaning**: Colors have clear semantic purposes (success, error, warning, etc.)

## 🏗️ Color Architecture

### CSS Custom Properties System

All colors are defined as CSS custom properties in `src/styles/colors.css` and mapped to Tailwind classes in `tailwind.config.js`. This allows for:

- **Global Theme Changes**: Update colors in one place
- **Runtime Theme Switching**: Change themes dynamically
- **Consistent Usage**: Same colors across all components
- **Easy Maintenance**: No hardcoded color values

## 🎨 Color Categories

### 1. Brand Colors

The primary brand identity colors that represent Orbit IQ.

#### Primary (Teal)
- **Purpose**: Main brand color, primary actions, links
- **Usage**: Buttons, links, focus states, brand elements
- **Shades**: 50 (lightest) to 900 (darkest)
- **Main Color**: `#0F7173` (primary-500)

```css
--color-primary-500: #0F7173;  /* Main brand color */
```

#### Secondary (Blue)
- **Purpose**: Secondary actions, complementary elements
- **Usage**: Secondary buttons, highlights, accents
- **Shades**: 50 to 900
- **Main Color**: `#4D6CFA` (secondary-500)

```css
--color-secondary-500: #4D6CFA;  /* Main secondary color */
```

#### Accent (Dark Teal)
- **Purpose**: Accent elements, special highlights
- **Usage**: Special buttons, unique elements
- **Shades**: 50 to 900
- **Main Color**: `#0B5563` (accent-500)

```css
--color-accent-500: #0B5563;  /* Main accent color */
```

### 2. Semantic Colors

Colors that convey specific meanings and states.

#### Success (Green)
- **Purpose**: Success states, positive actions, confirmations
- **Usage**: Success messages, completed states, positive indicators
- **Main Color**: `#22c55e` (success-500)

#### Warning (Amber)
- **Purpose**: Warning states, caution messages
- **Usage**: Warning alerts, pending states, caution indicators
- **Main Color**: `#f59e0b` (warning-500)

#### Error (Red)
- **Purpose**: Error states, destructive actions, failures
- **Usage**: Error messages, delete buttons, failure indicators
- **Main Color**: `#ef4444` (error-500)

#### Info (Blue)
- **Purpose**: Informational messages, neutral information
- **Usage**: Info alerts, help text, neutral information
- **Main Color**: `#3b82f6` (info-500)

### 3. Neutral Colors (Gray Scale)

Versatile grays for text, borders, and backgrounds.

- **Gray-50**: `#f9fafb` - Lightest backgrounds
- **Gray-100**: `#f3f4f6` - Light backgrounds
- **Gray-200**: `#e5e7eb` - Borders, dividers
- **Gray-300**: `#d1d5db` - Disabled states
- **Gray-400**: `#9ca3af` - Placeholder text
- **Gray-500**: `#6b7280` - Secondary text
- **Gray-600**: `#4b5563` - Primary text (light mode)
- **Gray-700**: `#374151` - Dark text
- **Gray-800**: `#1f2937` - Very dark text
- **Gray-900**: `#111827` - Darkest text

### 4. Surface Colors

Background colors for different UI elements.

- **Background**: `#F7F0F0` - Main page background
- **Surface**: `#FFFFFF` - Card and modal backgrounds
- **Surface Alt**: `#FBF7F4` - Alternative surface color
- **Surface Elevated**: `#FFFFFF` - Elevated surfaces (modals, dropdowns)

### 5. Text Colors

Text colors for different contexts and hierarchies.

- **Text Primary**: `#050404` - Main text color
- **Text Secondary**: `#230C0F` - Secondary text
- **Text Muted**: `#6b7280` - Muted/disabled text
- **Text Inverse**: `#FFFFFF` - Text on dark backgrounds
- **Text Placeholder**: `#9ca3af` - Placeholder text

### 6. Status Colors

Pre-defined colors for common status states.

- **Status Active**: Success green
- **Status Inactive**: Error red
- **Status Pending**: Warning amber

## 🛠️ Usage Guidelines

### Tailwind Classes

Use Tailwind classes that map to our CSS variables:

```html
<!-- Brand Colors -->
<div class="bg-primary-500 text-white">Primary Button</div>
<div class="bg-secondary-500 text-white">Secondary Button</div>

<!-- Semantic Colors -->
<div class="bg-success-500 text-white">Success</div>
<div class="bg-error-500 text-white">Error</div>
<div class="bg-warning-500 text-white">Warning</div>
<div class="bg-info-500 text-white">Info</div>

<!-- Surface Colors -->
<div class="bg-surface">Card Background</div>
<div class="bg-background">Page Background</div>

<!-- Text Colors -->
<p class="text-text-primary">Primary Text</p>
<p class="text-text-secondary">Secondary Text</p>
<p class="text-text-muted">Muted Text</p>
```

### Component Classes

Use our pre-defined component classes for consistent styling:

```html
<!-- Buttons -->
<button class="btn-primary">Primary Action</button>
<button class="btn-secondary">Secondary Action</button>
<button class="btn-outline">Outline Button</button>
<button class="btn-danger">Delete Action</button>

<!-- Status Badges -->
<span class="status-active">Active</span>
<span class="status-inactive">Inactive</span>
<span class="status-pending">Pending</span>

<!-- Alerts -->
<div class="alert-success">Success Message</div>
<div class="alert-error">Error Message</div>
<div class="alert-warning">Warning Message</div>
<div class="alert-info">Info Message</div>

<!-- Cards -->
<div class="card">Standard Card</div>
<div class="card-elevated">Elevated Card</div>
<div class="card-interactive">Interactive Card</div>
```

## 🎨 Color Combinations

### Primary Combinations
- **Primary + White**: High contrast, primary actions
- **Primary + Primary-50**: Subtle backgrounds, hover states
- **Primary + Primary-100**: Light backgrounds, inactive states

### Semantic Combinations
- **Success + Success-50**: Success backgrounds
- **Error + Error-50**: Error backgrounds
- **Warning + Warning-50**: Warning backgrounds
- **Info + Info-50**: Info backgrounds

### Neutral Combinations
- **Gray-900 + White**: High contrast text
- **Gray-600 + Gray-50**: Standard text on light background
- **Gray-400 + Gray-100**: Muted text on light background

## 🔧 Theme Customization

### Changing Brand Colors

To update the brand colors, modify the CSS variables in `src/styles/colors.css`:

```css
:root {
  /* Update primary brand color */
  --color-primary-500: #your-new-color;
  
  /* Update secondary brand color */
  --color-secondary-500: #your-new-color;
  
  /* Update accent brand color */
  --color-accent-500: #your-new-color;
}
```

### Adding New Colors

1. Add the color to `src/styles/colors.css`:
```css
:root {
  --color-custom-500: #your-color;
}
```

2. Add it to `tailwind.config.js`:
```js
colors: {
  custom: {
    500: 'var(--color-custom-500)',
  }
}
```

3. Use it in your components:
```html
<div class="bg-custom-500 text-white">Custom Color</div>
```

## 🌙 Dark Theme (Future)

The color system is prepared for dark theme implementation:

```css
[data-theme="dark"] {
  --color-background: #1a1a1a;
  --color-surface: #2d2d2d;
  --color-text-primary: #ffffff;
  /* ... other dark theme colors */
}
```

## 📱 Responsive Considerations

Colors work consistently across all device sizes. The color system is designed to be:

- **Touch-friendly**: Sufficient contrast for touch interfaces
- **Screen-reader compatible**: High contrast ratios
- **Print-friendly**: Colors that work in print media

## ♿ Accessibility

### Contrast Ratios

All color combinations meet WCAG AA standards:

- **Normal text**: 4.5:1 contrast ratio minimum
- **Large text**: 3:1 contrast ratio minimum
- **UI components**: 3:1 contrast ratio minimum

### Color Blindness

The color system is designed to be accessible to users with color vision deficiencies:

- **Not relying solely on color**: Icons and text accompany color indicators
- **High contrast**: Sufficient contrast even for color-blind users
- **Semantic meaning**: Colors have consistent meanings across the platform

## 🚀 Implementation Examples

### Status Indicators
```html
<!-- User Status -->
<span class="status-active">Active User</span>
<span class="status-inactive">Inactive User</span>
<span class="status-pending">Pending Approval</span>

<!-- Project Status -->
<div class="bg-success-100 text-success-800 border border-success-200">
  Project Completed
</div>
```

### Form States
```html
<!-- Input States -->
<input class="input" placeholder="Normal input" />
<input class="input-error" placeholder="Error state" />
<input class="input-success" placeholder="Success state" />
```

### Button Variations
```html
<!-- Action Buttons -->
<button class="btn-primary">Save Changes</button>
<button class="btn-secondary">Cancel</button>
<button class="btn-outline">Learn More</button>
<button class="btn-danger">Delete</button>
```

## 📋 Best Practices

1. **Use Semantic Colors**: Choose colors based on meaning, not appearance
2. **Maintain Consistency**: Use the same colors for the same purposes
3. **Test Accessibility**: Verify contrast ratios and color blindness compatibility
4. **Use Component Classes**: Prefer component classes over direct color classes
5. **Document Custom Colors**: Document any custom colors added to the system

## 🔄 Migration Guide

### From Hardcoded Colors

**Before:**
```html
<div class="bg-blue-500 text-white">Button</div>
```

**After:**
```html
<div class="btn-primary">Button</div>
```

### From Inconsistent Colors

**Before:**
```html
<div class="bg-green-100 text-green-800">Success</div>
<div class="bg-emerald-100 text-emerald-800">Success</div>
```

**After:**
```html
<div class="alert-success">Success</div>
<div class="alert-success">Success</div>
```

## 📚 Resources

- [CSS Custom Properties Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)
- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Color Blindness Accessibility](https://webaim.org/articles/visual/colorblind)

---

*This color style guide is a living document that evolves with the Orbit IQ platform. For questions or suggestions, please contact the design team.*
