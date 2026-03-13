# Theme System Guide

## Overview

KoiKata now supports **3 distinct visual themes** that dramatically change the look and feel of the app while keeping all components and functionality intact. Each theme has its own design philosophy, color palette, typography, and special effects.

## Available Themes

### 1. **Material You** (Default)
**Design Philosophy:** Google's Material Design 3 system with personal, adaptive, and modern aesthetics.

**Key Features:**
- Purple seed color (#6750A4) with harmonious color palette
- Soft, organic border radius (8-24px)
- Subtle elevation shadows
- Roboto font family (UI) + Noto Sans JP (Japanese)
- State layers for interactive feedback
- Clean, professional appearance

**Best For:** General use, accessibility, modern feel

**Colors:**
- Background: `#FFFBFE` (Warm off-white)
- Primary: `#6750A4` (Purple)
- Secondary: `#E8DEF8` (Light lavender)
- Foreground: `#1C1B1F` (Near black)

---

### 2. **Comic Book** 🎨
**Design Philosophy:** Hand-drawn graphic novel aesthetic with authentic imperfection and playful energy.

**Key Features:**
- **Wobbly borders**: Irregular border-radius using elliptical values (255px 8px 180px 8px / 8px 180px 8px 255px)
- **Hard ink shadows**: Solid offset shadows with no blur (3px-8px offset)
- **Halftone patterns**: Subtle dot-screen textures on backgrounds mimicking newsprint
- **Dashed dividers**: All separators use dashed borders
- **Handwritten fonts**: 
  - Headings: Kalam (bold marker)
  - Body/UI: Patrick Hand (legible handwriting)

**Special Effects:**
- Global halftone texture overlay (8px dot grid, 5% opacity)
- Cards get stronger halftone on muted backgrounds (12px grid, 7% opacity)
- Buttons have physical press behavior (shadow collapses to 0, translates 5px)
- Thicker borders everywhere (2-3px instead of 1-2px)

**Colors:**
- Background: `#fdfbf7` (Warm paper)
- Primary: `#ff4d4d` (Red correction marker)
- Secondary: `#2d5da1` (Ballpoint blue)
- Tertiary: `#fff9c4` (Post-it yellow)
- Foreground: `#2d2d2d` (Pencil black)

**Best For:** Creative tools, journaling, educational apps, playful experiences

**Animation:**
```css
/* Button press */
hover: box-shadow: 3px 3px 0px, transform: translate(2px, 2px)
active: box-shadow: none, transform: translate(5px, 5px)
```

---

### 3. **Vaporwave** 🌃
**Design Philosophy:** Neon retro-futuristic aesthetic celebrating 1980s digital nostalgia with CRT monitors and arcade cabinets.

**Key Features:**
- **Dark void background**: Near-black purple (#090014)
- **Pure neon colors**: 
  - Magenta (#FF00FF)
  - Cyan (#00FFFF)
  - Orange (#FF9900)
- **CRT scanlines**: Animated horizontal line overlay across entire viewport
- **Perspective grid floor**: CSS-transformed wireframe grid receding to horizon
- **Neon glow effects**: Box-shadows with color blur instead of black shadows
- **Sharp geometric borders**: ALL radius set to 0 (no rounded corners)
- **Terminal fonts**:
  - Headings: Orbitron (futuristic geometric)
  - Body/UI: Share Tech Mono (monospace terminal)
- **Gradient text**: Headlines use multi-stop gradient fills (orange → magenta → cyan)

**Special Effects:**
1. **Global CRT Scanlines**:
   ```css
   background: linear-gradient(rgba(18,16,20,0) 50%, rgba(0,0,0,0.25) 50%);
   background-size: 100% 4px;
   animation: scanlines 0.1s linear infinite;
   ```

2. **Perspective Grid Background**:
   ```css
   transform: perspective(500px) rotateX(60deg) translateY(-100px) scale(2);
   background-image: 
     linear-gradient(transparent 95%, rgba(255, 0, 255, 0.3) 95%),
     linear-gradient(90deg, transparent 95%, rgba(255, 0, 255, 0.3) 95%);
   background-size: 40px 40px;
   ```

3. **Neon Glow on Everything**:
   - Buttons: `0 0 15px rgba(0, 255, 255, 0.2)`
   - Buttons hover: `0 0 25px rgba(0, 255, 255, 0.4), 0 0 35px rgba(255, 0, 255, 0.2)`
   - Cards: `0 0 20px rgba(0, 255, 255, 0.15)`
   - Inputs: `0 0 10px rgba(0, 255, 255, 0.2)`

4. **Floating Sun Gradient**:
   ```css
   background-image: radial-gradient(
     circle at 50% -50%,
     rgba(255, 153, 0, 0.15),
     rgba(255, 0, 255, 0.1),
     transparent 60%
   );
   ```

**Colors:**
- Background: `#090014` (Digital void)
- Primary: `#FF00FF` (Hot magenta)
- Secondary: `#00FFFF` (Electric cyan)
- Tertiary: `#FF9900` (Sunset orange)
- Foreground: `#E0E0E0` (Chrome silver)

**Best For:** Creative portfolios, music apps, gaming interfaces, artistic projects

**Text Treatment:**
- All headings: uppercase, wide letter-spacing (0.05-0.1em)
- Gradient text fill with drop-shadow glow
- Buttons: uppercase with wider tracking

---

## How to Switch Themes

### In the App:
1. Navigate to **Settings** screen
2. Scroll to **Appearance** section
3. Tap your preferred theme card
4. Theme switches instantly with no reload

### Programmatically:
```javascript
import { useTheme } from '../hooks/useTheme'

function MyComponent() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme('vaporwave')}>
      Go Vaporwave
    </button>
  )
}
```

### Available Theme IDs:
- `'material'` - Material You (default)
- `'comic'` - Comic Book
- `'vaporwave'` - Vaporwave

---

## Technical Implementation

### CSS Variables
All themes use CSS custom properties for colors, typography, shadows, and radii:

```css
:root {
  --background: 0 5% 99%;
  --primary: 266 47% 49%;
  --font-sans: 'Roboto', sans-serif;
  --radius-md: 0.75rem;
  --shadow-2: 0px 2px 6px 2px rgba(0, 0, 0, 0.15);
}

[data-theme="comic"] {
  --background: 33 35% 98%;
  --primary: 0 100% 65%;
  --font-sans: 'Patrick Hand', cursive;
  --radius-md: 255px 15px 225px 15px / 15px 225px 15px 255px;
  --shadow-2: 5px 5px 0px 0px #2d2d2d;
}

[data-theme="vaporwave"] {
  --background: 280 91% 4%;
  --primary: 300 100% 50%;
  --font-sans: 'Share Tech Mono', monospace;
  --radius-md: 0;
  --shadow-2: 0 0 20px rgba(255, 0, 255, 0.3);
}
```

### Component Compatibility
All existing components work with all themes because they use semantic color tokens:
- `bg-background` → adapts to theme background
- `text-primary` → adapts to theme primary color
- `border-border` → adapts to theme border color
- `shadow-md3-2` → adapts to theme shadow style

### Theme-Specific Overrides
Special effects are applied globally per theme in `index.css`:
- Comic: Halftone textures, hard shadows, wobbly radii
- Vaporwave: Scanlines, grid, neon glows, sharp corners

---

## Font Loading

All theme fonts are loaded via Google Fonts in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=
  Kalam:wght@400;700
  &family=Patrick+Hand
  &family=Orbitron:wght@400;700;900
  &family=Share+Tech+Mono
  &family=Roboto:wght@400;500;700
  &family=Noto+Sans+JP:wght@400;700
  &display=swap" 
  rel="stylesheet" />
```

---

## Design System Files

### Updated Files:
1. **`src/index.css`** - Theme definitions, CSS variables, special effects
2. **`src/hooks/useTheme.js`** - Theme state management
3. **`tailwind.config.js`** - Font family configuration
4. **`src/screens/settings-screen.jsx`** - Theme selector UI

### Key Patterns:
- HSL color values for easier manipulation
- CSS custom properties for runtime switching
- Global `[data-theme="..."]` attribute on `<html>`
- Pseudo-elements for decorative overlays (scanlines, halftone)

---

## Accessibility Notes

### Comic Book Theme:
- ✅ Hard shadows improve depth perception
- ✅ Thicker borders increase visibility
- ⚠️ Wobbly borders may be disorienting for some users
- ✅ Handwritten fonts maintain AA contrast ratios at 17px+

### Vaporwave Theme:
- ⚠️ Dark background requires careful contrast management
- ✅ Neon colors provide high contrast against dark void
- ⚠️ Scanline animation can trigger vestibular issues (consider adding reduce-motion)
- ✅ Monospace font improves readability for dyslexia

### Recommended:
Add `prefers-reduced-motion` support to disable animations:
```css
@media (prefers-reduced-motion: reduce) {
  [data-theme="vaporwave"] body::before {
    animation: none;
  }
}
```

---

## Examples

### Material You
```
Clean, modern cards with soft shadows
Rounded corners, gentle colors
Professional and accessible
```

### Comic Book
```
╔═══════════════════════╗
║  WOBBLY CARD!        ║ ← Hand-drawn borders
║  ..................  ║ ← Halftone dots
║  Hard ink shadow →   ║
╚═══════════════════════╝
     ▼▼▼ (5px offset, no blur)
```

### Vaporwave
```
┏━━━━━━━━━━━━━━━━━━━━━┓  ← Sharp corners
┃ ░░ NEON GLOW ░░     ┃  ← Cyan glow
┃ ╔══════════════╗    ┃  ← Grid lines
┃ ║   ▓▓▓▓▓▓▓▓   ║    ┃  ← Magenta accent
┃ ╚══════════════╝    ┃
┗━━━━━━━━━━━━━━━━━━━━━┛
  ▓▓▓ Scanlines ▓▓▓
```

---

## Future Enhancements

Potential additions:
- [ ] **Brutalist theme** - Raw HTML, system fonts, no styling
- [ ] **Neumorphism theme** - Soft UI with extruded shadows
- [ ] **Glassmorphism theme** - Frosted glass effects
- [ ] **High Contrast theme** - WCAG AAA compliance
- [ ] **Theme customizer** - User-defined colors

---

## Credits

**Design Briefs:**
- Comic Book theme inspired by DESIGN_BRIEF1.md
- Vaporwave theme inspired by DESIGN_BRIEF2.md
- Material You follows Google's Material Design 3 spec

**Fonts:**
- Kalam, Patrick Hand, Orbitron, Share Tech Mono - Google Fonts
- Noto Sans JP - Japanese language support
