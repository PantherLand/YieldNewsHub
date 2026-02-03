# YieldNewsHub Brand Guide

## Design Philosophy

**"Cyberpunk Finance"** - 融合专业 DeFi 美学与赛博朋克霓虹风格，创造大气、前卫、可信赖的视觉体验。

灵感来源:
- **Aave**: 深紫蓝渐变，专业暗色调
- **Uniswap**: 标志性霓虹粉红 (#FF007A)
- **Morpho**: 简洁现代，蓝色为主
- **Cyberpunk 2077**: 霓虹发光，高对比度，未来感

---

## Color System

### Primary Colors (主色调)

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Cyber Purple** | `#A855F7` | 168, 85, 247 | 主要品牌色，按钮，强调 |
| **Electric Cyan** | `#06B6D4` | 6, 182, 212 | 次要强调，链接，图标 |
| **Neon Pink** | `#FF007A` | 255, 0, 122 | 热点强调，CTA按钮 |

### Background Colors (背景色)

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Deep Black** | `#050508` | 5, 5, 8 | 主背景 |
| **Dark Purple** | `#0D0A1A` | 13, 10, 26 | 次要背景 |
| **Card Dark** | `#12101F` | 18, 16, 31 | 卡片背景 |
| **Card Hover** | `#1A1730` | 26, 23, 48 | 卡片悬停 |

### Semantic Colors (语义色)

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Neon Green** | `#00FF88` | 0, 255, 136 | 成功，APY上涨，正面 |
| **Neon Orange** | `#FF8800` | 255, 136, 0 | 警告，中等风险 |
| **Neon Red** | `#FF3366` | 255, 51, 102 | 错误，高风险 |

### Text Colors (文字色)

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Primary Text** | `#F8FAFC` | 248, 250, 252 | 主要文字 |
| **Secondary Text** | `#A0AEC0` | 160, 174, 192 | 次要文字 |
| **Muted Text** | `#64748B` | 100, 116, 139 | 辅助文字 |

### Border Colors (边框色)

| Name | Hex | Usage |
|------|-----|-------|
| **Border Default** | `rgba(168, 85, 247, 0.2)` | 默认边框 |
| **Border Hover** | `rgba(168, 85, 247, 0.5)` | 悬停边框 |
| **Border Glow** | `rgba(6, 182, 212, 0.4)` | 发光边框 |

---

## Gradients (渐变)

### Primary Gradient
```css
background: linear-gradient(135deg, #A855F7 0%, #06B6D4 50%, #FF007A 100%);
```

### Dark Gradient (Background)
```css
background: linear-gradient(180deg, #050508 0%, #0D0A1A 50%, #12101F 100%);
```

### Glow Gradient (Header)
```css
background: radial-gradient(ellipse at 50% 0%, rgba(168, 85, 247, 0.15) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 80%);
```

### Card Gradient
```css
background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%);
```

### Button Gradient
```css
background: linear-gradient(135deg, #A855F7 0%, #8B5CF6 50%, #06B6D4 100%);
```

---

## Typography

### Font Stack
```css
/* Primary (UI) */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Monospace (Numbers, Code) */
font-family: 'JetBrains Mono', 'SF Mono', Monaco, Consolas, monospace;
```

### Type Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Display | 32px | 800 | 1.2 | 大标题 |
| Heading 1 | 24px | 700 | 1.3 | 页面标题 |
| Heading 2 | 18px | 600 | 1.4 | 卡片标题 |
| Body | 14px | 400 | 1.6 | 正文 |
| Small | 12px | 500 | 1.5 | 辅助文字 |
| Tiny | 11px | 600 | 1.4 | 标签，徽章 |

---

## Spacing System

```
xs:  4px   (0.25rem)
sm:  8px   (0.5rem)
md:  16px  (1rem)
lg:  24px  (1.5rem)
xl:  32px  (2rem)
2xl: 48px  (3rem)
3xl: 64px  (4rem)
```

---

## Border Radius

```
sm:   6px   - 小元素 (badges, tags)
md:   12px  - 中等元素 (buttons, inputs)
lg:   16px  - 大元素 (cards)
xl:   24px  - 特大元素 (containers)
full: 9999px - 圆形 (avatars, pills)
```

---

## Effects

### Glow Effect (Cyberpunk Signature)
```css
/* Purple Glow */
box-shadow: 0 0 20px rgba(168, 85, 247, 0.3),
            0 0 40px rgba(168, 85, 247, 0.1);

/* Cyan Glow */
box-shadow: 0 0 20px rgba(6, 182, 212, 0.3),
            0 0 40px rgba(6, 182, 212, 0.1);

/* Pink Glow (Accent) */
box-shadow: 0 0 20px rgba(255, 0, 122, 0.3);
```

### Glass Effect (Cards)
```css
background: rgba(18, 16, 31, 0.8);
backdrop-filter: blur(12px);
border: 1px solid rgba(168, 85, 247, 0.2);
```

### Scanline Effect (Optional Cyberpunk)
```css
background-image: repeating-linear-gradient(
  0deg,
  transparent,
  transparent 2px,
  rgba(168, 85, 247, 0.03) 2px,
  rgba(168, 85, 247, 0.03) 4px
);
```

---

## Animations

### Transition Timing
```css
--transition-fast:   150ms ease-out;
--transition-normal: 250ms ease-out;
--transition-slow:   400ms ease-out;
```

### Glow Pulse Animation
```css
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
  50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.5), 0 0 60px rgba(6, 182, 212, 0.2); }
}
```

### Scanline Animation
```css
@keyframes scanline {
  0% { background-position: 0 0; }
  100% { background-position: 0 100%; }
}
```

---

## Component Styles

### Buttons

**Primary Button:**
- Background: Primary Gradient
- Border: none
- Border Radius: md (12px)
- Padding: 12px 24px
- Font: 14px, weight 600
- Shadow: Purple Glow on hover

**Secondary Button:**
- Background: transparent
- Border: 1px solid Border Default
- Border Radius: md (12px)
- Hover: Border Hover + subtle glow

### Cards

- Background: Card Dark with Glass Effect
- Border: 1px solid Border Default
- Border Radius: lg (16px)
- Hover: Card Hover background + Border Glow

### Tables

- Header: Dark Purple background
- Rows: Alternating subtle backgrounds
- Hover: Card Hover + left border accent (Cyber Purple)

### Badges/Tags

- Background: Color with 15% opacity
- Border: none
- Border Radius: full
- Font: Tiny (11px), weight 600

---

## Logo

### Concept
结合蝴蝶（Morpho灵感）和上升曲线（Yield），加入霓虹发光效果。

### Colors
- Primary: Cyber Purple to Electric Cyan gradient
- Accent: Neon Green (chart line)
- Glow: Purple outer glow

### Minimum Size
- Desktop: 40px
- Mobile: 32px

---

## Usage Examples

### APY Display (Success)
```css
color: #00FF88;
text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
```

### Important Score (8+)
```css
background: rgba(0, 255, 136, 0.15);
color: #00FF88;
border: 1px solid rgba(0, 255, 136, 0.3);
```

### Warning/Medium Score (5-7)
```css
background: rgba(255, 136, 0, 0.15);
color: #FF8800;
border: 1px solid rgba(255, 136, 0, 0.3);
```

---

## Responsive Breakpoints

```
mobile:  < 640px
tablet:  640px - 1024px
desktop: > 1024px
```

---

## Accessibility

- 所有文字对比度 >= 4.5:1 (WCAG AA)
- 交互元素有明确的 focus 状态
- 动画支持 `prefers-reduced-motion`
- 颜色不是唯一的信息传达方式

---

*Brand Guide v1.0 - YieldNewsHub Cyberpunk Finance Theme*
