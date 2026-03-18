# YieldNewsHub Brand Guide

> **Version 2.0** | Monochrome + Neon Purple Cyberpunk Design System

---

## Overview

YieldNewsHub's design system embraces a **monochrome cyberpunk aesthetic** - a sophisticated palette of blacks, grays, and whites punctuated by vibrant **neon purple accents**. This creates a futuristic, high-tech feel that reflects the cutting-edge nature of DeFi and cryptocurrency.

### Design Philosophy

- **Monochrome Foundation**: Pure blacks and grays create depth and hierarchy
- **Neon Purple Accent**: A single, powerful accent color for emphasis and brand recognition
- **High Contrast**: Ensuring readability and accessibility in all conditions
- **Subtle Effects**: Glows, gradients, and animations that enhance without overwhelming

---

## Color Palette

### Primary Accent Colors

The neon purple family is the signature of YieldNewsHub, used sparingly for maximum impact.

| Token | Value | Usage |
|-------|-------|-------|
| `accent` | `#A855F7` | Primary accent, CTAs, highlights |
| `accentLight` | `#C084FC` | Hover states, links |
| `accentDark` | `#7C3AED` | Active states, gradients |
| `accentMuted` | `rgba(168, 85, 247, 0.6)` | Subtle highlights |

### Secondary Accent

| Token | Value | Usage |
|-------|-------|-------|
| `secondary` | `#8B5CF6` | Secondary actions |
| `secondaryLight` | `#A78BFA` | Secondary hover |
| `secondaryDark` | `#6D28D9` | Secondary active |

### Background Colors

A carefully crafted spectrum of dark tones creates visual hierarchy.

| Token | Value | Usage |
|-------|-------|-------|
| `bgDeep` | `#000000` | Page background |
| `bgDark` | `#0A0A0A` | Elevated background |
| `bgCard` | `#111111` | Card backgrounds |
| `bgCardHover` | `#1A1A1A` | Card hover state |
| `bgInput` | `#0D0D0D` | Form inputs |
| `bgSurface` | `#141414` | Secondary surfaces |
| `bgElevated` | `#1C1C1C` | Modals, dropdowns |

### Gray Scale

| Token | Value | Usage |
|-------|-------|-------|
| `gray50` | `#FAFAFA` | Brightest gray |
| `gray100` | `#F4F4F5` | Light backgrounds |
| `gray200` | `#E4E4E7` | Borders (light) |
| `gray300` | `#D4D4D8` | Disabled text |
| `gray400` | `#A1A1AA` | Secondary text |
| `gray500` | `#71717A` | Muted text |
| `gray600` | `#52525B` | Disabled states |
| `gray700` | `#3F3F46` | Subtle borders |
| `gray800` | `#27272A` | Card surfaces |
| `gray900` | `#18181B` | Deep surfaces |

### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `success` | `#22C55E` | Positive values, APY |
| `warning` | `#F59E0B` | Caution states |
| `error` | `#EF4444` | Errors, negative values |
| `info` | `#A855F7` | Informational (accent) |

### Text Colors

| Token | Value | Usage |
|-------|-------|-------|
| `textPrimary` | `#FFFFFF` | Headings, primary text |
| `textSecondary` | `#A1A1AA` | Secondary text |
| `textMuted` | `#71717A` | Captions, labels |
| `textDisabled` | `#52525B` | Disabled text |
| `textAccent` | `#A855F7` | Accent text, links |

---

## Typography

### Font Families

```css
/* Primary sans-serif */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Monospace for data */
font-family: 'JetBrains Mono', 'SF Mono', Monaco, Consolas, monospace;

/* Display headings */
font-family: 'Space Grotesk', 'Inter', sans-serif;
```

### Font Sizes

| Token | Size | Pixels | Usage |
|-------|------|--------|-------|
| `xs` | 0.75rem | 12px | Captions, labels |
| `sm` | 0.875rem | 14px | Body small |
| `base` | 1rem | 16px | Body text |
| `lg` | 1.125rem | 18px | Lead text |
| `xl` | 1.25rem | 20px | H4 |
| `2xl` | 1.5rem | 24px | H3 |
| `3xl` | 1.875rem | 30px | H2 |
| `4xl` | 2.25rem | 36px | H1 |
| `5xl` | 3rem | 48px | Display |

### Font Weights

| Token | Weight | Usage |
|-------|--------|-------|
| `light` | 300 | Light emphasis |
| `normal` | 400 | Body text |
| `medium` | 500 | Subtle emphasis |
| `semibold` | 600 | Strong emphasis |
| `bold` | 700 | Headings |

---

## Spacing

We use an 8px base unit for consistent spacing.

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight gaps |
| `sm` | 8px | Small gaps |
| `md` | 16px | Default gaps |
| `lg` | 24px | Section gaps |
| `xl` | 32px | Large sections |
| `xxl` | 48px | Page sections |
| `xxxl` | 64px | Hero sections |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 4px | Small elements |
| `md` | 8px | Inputs, buttons |
| `lg` | 12px | Cards |
| `xl` | 16px | Large cards |
| `2xl` | 24px | Modals |
| `full` | 9999px | Pills, avatars |

---

## Effects

### Box Shadows

```css
/* Subtle shadow */
shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5);

/* Medium shadow */
shadow-md: 0 4px 6px rgba(0, 0, 0, 0.5);

/* Large shadow */
shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);

/* Accent glow */
shadow-accent: 0 4px 14px rgba(168, 85, 247, 0.25);
shadow-accent-lg: 0 8px 30px rgba(168, 85, 247, 0.35);
```

### Glow Effects

```css
/* Accent glow - for hover states and emphasis */
glow-accent: 0 0 20px rgba(168, 85, 247, 0.4),
             0 0 40px rgba(168, 85, 247, 0.15),
             0 0 60px rgba(168, 85, 247, 0.05);

/* Subtle glow */
glow-accent-subtle: 0 0 10px rgba(168, 85, 247, 0.25);

/* Strong glow - for important elements */
glow-accent-strong: 0 0 30px rgba(168, 85, 247, 0.5),
                    0 0 60px rgba(168, 85, 247, 0.25);
```

### Gradients

```css
/* Primary gradient - CTAs and highlights */
gradient-primary: linear-gradient(135deg, #A855F7 0%, #6D28D9 100%);

/* Secondary gradient */
gradient-secondary: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%);

/* Background gradient */
gradient-dark: linear-gradient(180deg, #000000 0%, #0A0A0A 50%, #111111 100%);

/* Glow overlay */
gradient-glow: radial-gradient(ellipse at 50% 0%,
               rgba(168, 85, 247, 0.12) 0%,
               rgba(139, 92, 246, 0.06) 40%,
               transparent 70%);

/* Card gradient */
gradient-card: linear-gradient(135deg,
               rgba(168, 85, 247, 0.05) 0%,
               rgba(139, 92, 246, 0.02) 100%);
```

---

## Transitions

| Token | Value | Usage |
|-------|-------|-------|
| `fast` | 0.15s ease | Micro-interactions |
| `normal` | 0.25s ease | Standard transitions |
| `slow` | 0.4s ease | Large elements |
| `bounce` | 0.5s bounce | Playful interactions |
| `spring` | 0.6s spring | Emphasis animations |

---

## Components

### Buttons

#### Primary Button
- Background: `gradient-primary`
- Color: `textPrimary`
- Shadow: `shadow-accent`
- Hover: Subtle lift + glow effect

#### Secondary Button
- Background: `gray800`
- Border: `1px solid border`
- Color: `textPrimary`
- Hover: `gray700` background

#### Ghost Button
- Background: Transparent
- Color: `textSecondary`
- Hover: `gray800` background

#### Outline Button
- Background: Transparent
- Border: `1px solid borderAccent`
- Color: `accent`
- Hover: Accent background

### Cards

```css
/* Base card */
background: #111111;
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 12px;
backdrop-filter: blur(16px);

/* Card hover */
background: #1A1A1A;
border-color: rgba(168, 85, 247, 0.4);
box-shadow: 0 10px 15px rgba(0, 0, 0, 0.5),
            0 0 10px rgba(168, 85, 247, 0.25);
```

### Inputs

```css
/* Base input */
background: #0D0D0D;
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 8px;
color: #FFFFFF;
padding: 12px 16px;

/* Focus state */
border-color: rgba(168, 85, 247, 0.4);
box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
```

### Badges

```css
/* Default */
background: #27272A;
color: #A1A1AA;

/* Primary/Accent */
background: rgba(168, 85, 247, 0.15);
color: #C084FC;
border: 1px solid rgba(168, 85, 247, 0.4);

/* Success */
background: rgba(34, 197, 94, 0.15);
color: #22C55E;

/* Warning */
background: rgba(245, 158, 11, 0.15);
color: #F59E0B;

/* Error */
background: rgba(239, 68, 68, 0.15);
color: #EF4444;
```

### Tables

```css
/* Header */
background: #141414;
border-bottom: 1px solid rgba(255, 255, 255, 0.08);

/* Row */
border-bottom: 1px solid rgba(255, 255, 255, 0.04);

/* Row hover */
background: #1A1A1A;
```

---

## Accessibility

### Color Contrast

All text combinations meet WCAG 2.1 AA standards:

- Primary text on dark backgrounds: 17.1:1
- Secondary text on dark backgrounds: 7.1:1
- Muted text on dark backgrounds: 4.6:1

### Focus States

All interactive elements have visible focus indicators:
```css
*:focus-visible {
  outline: 2px solid #A855F7;
  outline-offset: 2px;
}
```

### Motion Preferences

Respect user motion preferences:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Responsive Breakpoints

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Extra large screens |

---

## Usage Examples

### Using Theme in Components

```jsx
import { theme } from '../styles/theme';

const Button = ({ children, variant = 'primary' }) => (
  <button
    style={{
      background: variant === 'primary'
        ? theme.colors.gradientPrimary
        : theme.colors.gray800,
      color: theme.colors.textPrimary,
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      borderRadius: theme.radius.md,
      transition: theme.transition.fast,
    }}
  >
    {children}
  </button>
);
```

### Card with Hover Effect

```jsx
const Card = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: theme.colors.bgCard,
        border: `1px solid ${isHovered
          ? theme.colors.borderAccent
          : theme.colors.border}`,
        borderRadius: theme.radius.lg,
        boxShadow: isHovered
          ? `${theme.shadows.lg}, ${theme.colors.glowAccentSubtle}`
          : theme.shadows.md,
        transition: theme.transition.normal,
      }}
    >
      {children}
    </div>
  );
};
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2024 | Monochrome + Neon Purple redesign |
| 1.0 | 2024 | Initial cyberpunk theme |

---

*Last updated: February 2024*
