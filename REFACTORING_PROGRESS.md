# KoiKata - Shadcn/Tailwind Refactoring Progress

## Overview
Refactoring the KoiKata Japanese learning app to use Shadcn/ui best practices with Material You (Material Design 3) design system and Tailwind CSS.

## Completed Work

### 1. Infrastructure Setup ✅
- **Installed Dependencies:**
  - `tailwindcss` - Utility-first CSS framework
  - `postcss` & `autoprefixer` - CSS processing
  - `class-variance-authority` - Component variant management
  - `clsx` & `tailwind-merge` - Class name utilities

- **Configuration Files Created:**
  - `tailwind.config.js` - Tailwind configuration with Material You design tokens
  - `postcss.config.js` - PostCSS configuration
  - `src/lib/utils.js` - `cn()` utility function for class merging

### 2. Design System (Material You) ✅
**New `src/index.css` with:**
- Material You color system (HSL-based for easy theming)
- Complete typography scale (headline, title, body, label variants)
- Elevation shadows (shadow-md3-1, shadow-md3-2, shadow-md3-3)
- Border radius tokens (sm, md, lg, xl, full)
- Proper font loading (Roboto for UI, Noto Sans JP for Japanese)
- Accessibility-focused base styles
- State layer patterns for hover/active states
- Smooth animations and transitions

**Color Tokens:**
- Primary: Purple (#6750A4) - buttons, links, focus states
- Secondary: Light lavender - chips, pills, less prominent containers
- Tertiary: Mauve - accent elements, FABs
- Surface variants: Tonal backgrounds for depth hierarchy
- Destructive: Error states

### 3. Core UI Components ✅
Created Shadcn-style reusable components in `src/components/ui/`:

#### `button.jsx`
- 9 variants: filled, tonal, outlined, text, elevated, filled-tonal, ghost, destructive
- 4 sizes: sm, md, lg, icon
- Full-width support
- Proper focus states and active scaling
- Built with `class-variance-authority` for type-safe variants

#### `card.jsx`
- 3 variants: elevated (with shadow), filled (tonal), outlined
- Compound components: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Hover shadow transitions

#### `badge.jsx`
- 5 variants: primary, secondary, tertiary, outline, destructive
- Pill-shaped design (rounded-full)

#### `progress.jsx`
- 4 color variants: primary, secondary, tertiary, destructive
- Smooth transitions
- Percentage-based value system

#### `dialog.jsx`
- Full-screen modal overlay with backdrop blur
- Animated entrance (fade + scale)
- Compound components: Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
- Responsive sizing

#### `menu-card.jsx`
- Interactive list item component
- Supports icon (string or React component), title, subtitle, meta text, badge
- Hover scale and shadow effects
- Arrow indicator
- Companion `MenuCardList` for grouped lists

### 4. Layout Components ✅
#### `app-shell.jsx` (New)
- **Header:** 
  - Sticky top positioning
  - Conditional back button with navigation history
  - Centered title
  - Material You elevation
  
- **Main Content:**
  - Flex-based scrollable content area
  - Max-width container for consistency
  
- **Bottom Navigation:**
  - 3 tabs: Home, Progress, Settings
  - Active state with primary color and bottom indicator pill
  - Lucide React icons
  - Hover states with tonal overlays
  - Responsive touch targets

### 5. Refactored Screens ✅
#### `home-screen.jsx`
- **Material You Card Design:**
  - Gradient-accented activity cards
  - Large kana icons with gradient backgrounds
  - Hover scale effects
  - Clear typography hierarchy
  
- **Activities Grid:**
  - 5 learning activities with descriptions
  - Color-coded gradients per activity
  - Smooth hover animations
  - Accessible button labels

#### `kana-quiz-screen.jsx`
- **Mode Selection:**
  - Clean MenuCard list
  - Settings button in header
  - 3 quiz modes with descriptions
  
- **Quiz Interface:**
  - **HUD:** Lives (hearts), score, streak indicator
  - **Timer:** Progress bar with color change when urgent
  - **Question Card:** Large, centered, with feedback animations
  - **Options Grid:** 2-column layout, clear visual feedback
  - **Animations:** Shake on wrong, pulse on correct
  
- **Game Over Dialog:**
  - Full-screen modal
  - Score display with gradient icon
  - Best streak callout
  - Play Again / Home actions

### 6. Removed Code ✅
- **Deleted:**
  - Old theme system (`useTheme` hook removed from App.jsx)
  - All theme-specific CSS (vaporwave, playful, swiss, etc.)
  - Legacy CSS files (backed up to `.backup`)
  - Old Button and Card CSS modules

## Key Improvements

### Design Benefits
1. **Consistent Design Language:** Material You provides cohesive, modern aesthetic
2. **Accessibility:** Proper focus states, ARIA labels, semantic HTML
3. **Responsive:** Works across device sizes with touch-friendly targets
4. **Performance:** CSS utility classes are more performant than CSS-in-JS
5. **Themeable:** HSL color system makes future theming trivial

### Developer Experience
1. **Reusable Components:** Shadcn pattern promotes composition
2. **Type-Safe Variants:** CVA provides autocomplete and type checking potential
3. **Utility-First:** Tailwind reduces custom CSS sprawl
4. **Maintainable:** Clear component boundaries and naming
5. **Scalable:** Easy to add new variants and components

## Remaining Work

### Components to Refactor
- [ ] `ProgressScreen.jsx`
- [ ] `KanaSettingsScreen.jsx`
- [ ] `KanaQuizSettingsScreen.jsx`
- [ ] `WordSearchScreen.jsx`
- [ ] `WritingScreen.jsx`
- [ ] `VerbDrillScreen.jsx`
- [ ] `SentenceBuilderScreen.jsx`

### Additional UI Components Needed
- [ ] Input / Select components (for settings screens)
- [ ] Switch / Checkbox components
- [ ] Tabs component (for multi-panel screens)
- [ ] Toast / Snackbar (for feedback messages)
- [ ] Slider component (for adjustable settings)
- [ ] Skeleton loaders (for loading states)

### Enhancements
- [ ] Add loading states to data-heavy components
- [ ] Implement page transitions
- [ ] Add micro-interactions (ripple effects, etc.)
- [ ] Create specialized game components (timer, lives counter, etc.)
- [ ] Build out settings panel with Material You switches
- [ ] Add dark mode support (already scaffolded in Tailwind config)

## File Structure
```
src/
├── components/
│   ├── layout/
│   │   └── app-shell.jsx          ✅ NEW - Material You app structure
│   └── ui/                         ✅ NEW - Shadcn-style components
│       ├── badge.jsx
│       ├── button.jsx
│       ├── card.jsx
│       ├── dialog.jsx
│       ├── menu-card.jsx
│       └── progress.jsx
├── lib/
│   └── utils.js                    ✅ NEW - cn() utility
├── screens/
│   ├── home-screen.jsx             ✅ REFACTORED
│   ├── kana-quiz-screen.jsx        ✅ REFACTORED
│   ├── ProgressScreen.jsx          ⏳ TODO
│   ├── KanaSettingsScreen.jsx      ⏳ TODO
│   ├── KanaQuizSettingsScreen.jsx  ⏳ TODO
│   ├── WordSearchScreen.jsx        ⏳ TODO
│   ├── WritingScreen.jsx           ⏳ TODO
│   ├── VerbDrillScreen.jsx         ⏳ TODO
│   └── SentenceBuilderScreen.jsx   ⏳ TODO
├── App.jsx                         ✅ UPDATED
├── index.css                       ✅ COMPLETE REWRITE
└── main.jsx                        (unchanged)
```

## Design Tokens Reference

### Colors (HSL Format)
```css
--primary: 266 47% 49%           /* #6750A4 Purple */
--secondary: 270 42% 90%         /* #E8DEF8 Lavender */
--tertiary: 345 24% 43%          /* #7D5260 Mauve */
--background: 0 5% 99%           /* #FFFBFE Off-white */
--surface: 290 17% 96%           /* #F3EDF7 Tinted surface */
--destructive: 0 84% 37%         /* #BA1A1A Red */
```

### Typography Scale
- Display: 56px (3.5rem) - Hero headlines
- Headline: 32px-56px - Page titles
- Title: 14px-22px - Section headers, card titles
- Body: 12px-16px - Paragraph text
- Label: 11px-14px - Buttons, chips, captions

### Spacing
- Base unit: 4px (Tailwind default)
- Common: 4px, 8px, 12px, 16px, 24px, 32px, 48px

### Border Radius
- sm: 8px - Small elements
- md: 12px - Medium elements  
- lg: 16px - Large elements
- xl: 24px - Cards
- full: 9999px - Pills, badges, circular elements

## Notes
- All CSS linter warnings about @tailwind and @apply are expected - they're Tailwind directives
- Old CSS backed up to `src/index.css.backup`
- Theme system removed - future theming should use CSS variables
- All functionality preserved while updating UI
- Accessibility maintained with proper ARIA labels and focus states
