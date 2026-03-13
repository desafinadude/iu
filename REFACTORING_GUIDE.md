# Shadcn/Tailwind Refactoring Guide

This guide explains the pattern for refactoring the remaining KoiKata screens to use the new Material You + Shadcn component system.

## Component Library Overview

### Core UI Components (`src/components/ui/`)

#### Layout & Structure
- **`card.jsx`** - Container component with variants (elevated, filled, outlined)
- **`menu-card.jsx`** - Interactive list items with icons and descriptions
- **`dialog.jsx`** - Modal overlays for results, confirmations, etc.
- **`settings.jsx`** - Specialized components for settings screens

#### Interactive Elements
- **`button.jsx`** - Primary interactive element with 9 variants
- **`badge.jsx`** - Small labels for status, categories, etc.
- **`switch.jsx`** - Toggle component for boolean settings
- **`label.jsx`** - Form labels with consistent typography
- **`progress.jsx`** - Progress bars with color variants

#### Quiz-Specific
- **`quiz.jsx`** - Specialized quiz components:
  - `QuizHUD` - Lives, score, streak display
  - `QuizTimer` - Animated countdown timer
  - `QuizPromptCard` - Question card with feedback states
  - `QuizOption` - Answer button with correct/wrong states
  - `QuizOptionsGrid` - Grid container for options

### Utility Functions
- **`cn(...classes)`** - Merges Tailwind classes intelligently (from `src/lib/utils.js`)

## Refactoring Pattern

### Step 1: Remove Old CSS Imports
```jsx
// OLD
import './MyScreen.css'

// NEW - No CSS import needed
```

### Step 2: Import Components
```jsx
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { MenuCard, MenuCardList } from '../components/ui/menu-card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { cn } from '../lib/utils'
```

### Step 3: Replace Layout Structure

#### OLD Pattern:
```jsx
<div className="my-screen">
  <div className="my-screen__header">
    <h2 className="my-screen__title">Title</h2>
  </div>
  <div className="my-screen__content">
    {/* content */}
  </div>
</div>
```

#### NEW Pattern:
```jsx
<div className="flex flex-col gap-6 p-4">
  {/* Header */}
  <div className="text-center py-4">
    <h2 className="text-headline-small mb-2">Title</h2>
    <p className="text-body-medium text-muted-foreground">Description</p>
  </div>
  
  {/* Content */}
  {/* ... */}
</div>
```

### Step 4: Replace Buttons

#### OLD:
```jsx
<button className="btn btn--primary btn--lg" onClick={handleClick}>
  Click Me
</button>
```

#### NEW:
```jsx
<Button variant="filled" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

**Button Variants:**
- `filled` - Primary CTA (purple background)
- `tonal` - Secondary actions (light lavender)
- `outlined` - Tertiary actions with border
- `text` - Minimal actions
- `elevated` - Floating appearance
- `filled-tonal` - Tertiary color (mauve)
- `ghost` - Minimal hover effect
- `destructive` - Delete/cancel actions

### Step 5: Replace Cards

#### OLD:
```jsx
<div className="custom-card">
  <div className="custom-card__header">
    <h3>{title}</h3>
  </div>
  <div className="custom-card__content">
    {content}
  </div>
</div>
```

#### NEW:
```jsx
<Card variant="elevated">
  <CardHeader>
    <CardTitle>{title}</CardTitle>
  </CardHeader>
  <CardContent>
    {content}
  </CardContent>
</Card>
```

### Step 6: Replace Menu/List Items

#### OLD:
```jsx
<button className="menu-card" onClick={onSelect}>
  <span className="menu-card__icon">🎯</span>
  <div className="menu-card__body">
    <h3 className="menu-card__title">Title</h3>
    <p className="menu-card__subtitle">Description</p>
  </div>
</button>
```

#### NEW:
```jsx
<MenuCard
  icon="🎯"
  title="Title"
  subtitle="Description"
  onClick={onSelect}
/>

{/* Or with React icon */}
<MenuCard
  icon={<Settings />}
  title="Title"
  subtitle="Description"
  onClick={onSelect}
/>

{/* Grouped list */}
<MenuCardList label="Choose an option">
  <MenuCard {...} />
  <MenuCard {...} />
  <MenuCard {...} />
</MenuCardList>
```

## Typography Classes

Use Material You typography scale instead of custom classes:

```jsx
// Headlines (bold, for page titles)
<h1 className="text-headline-large">...</h1>      // 56px
<h2 className="text-headline-medium">...</h2>     // 40px
<h2 className="text-headline-small">...</h2>      // 32px

// Titles (medium weight, for sections)
<h3 className="text-title-large">...</h3>         // 22px
<h3 className="text-title-medium">...</h3>        // 16px
<h3 className="text-title-small">...</h3>         // 14px

// Body (regular weight, for content)
<p className="text-body-large">...</p>            // 16px
<p className="text-body-medium">...</p>           // 14px
<p className="text-body-small">...</p>            // 12px

// Labels (medium weight, for buttons/chips)
<span className="text-label-large">...</span>     // 14px
<span className="text-label-medium">...</span>    // 12px
<span className="text-label-small">...</span>     // 11px
```

## Color Classes

```jsx
// Text colors
text-foreground              // Main text
text-muted-foreground        // Secondary text
text-primary                 // Purple accent
text-secondary-foreground    // Dark on light lavender
text-destructive             // Error red

// Background colors
bg-background                // Page background
bg-surface                   // Card background
bg-surface-container         // Tinted container
bg-primary                   // Purple
bg-secondary                 // Light lavender
bg-destructive               // Error red

// Border colors
border-border                // Default border
border-primary               // Purple border
```

## Common Layout Patterns

### Full-Screen Container:
```jsx
<div className="flex flex-col h-full">
  {/* Header */}
  <div className="...">Header content</div>
  
  {/* Scrollable content */}
  <div className="flex-1 overflow-y-auto">
    Content
  </div>
  
  {/* Fixed footer */}
  <div className="...">Footer content</div>
</div>
```

### Centered Content:
```jsx
<div className="flex flex-col items-center justify-center p-6">
  <Card className="w-full max-w-md">
    {/* ... */}
  </Card>
</div>
```

### Grid of Cards:
```jsx
<div className="grid grid-cols-1 gap-4">
  {items.map(item => (
    <Card key={item.id}>...</Card>
  ))}
</div>

{/* 2-column on larger screens */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* ... */}
</div>
```

## Animation Classes

```jsx
// Hover scale
className="hover:scale-[1.02] transition-transform"

// Active press
className="active:scale-95 transition-transform"

// Fade in
className="animate-fade-in"

// Scale in (for dialogs)
className="animate-scale-in"

// Shake (for errors)
className="animate-shake"

// Pulse success
className="animate-pulse-success"
```

## Responsive Patterns

```jsx
// Hide on mobile, show on tablet+
className="hidden md:block"

// Different padding on mobile vs desktop
className="p-4 md:p-6 lg:p-8"

// Responsive grid
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"

// Responsive text size
className="text-body-medium md:text-body-large"
```

## Screen-Specific Patterns

### Quiz Screens
```jsx
import { QuizHUD, QuizTimer, QuizPromptCard, QuizOption, QuizOptionsGrid } from '../components/ui/quiz'

function QuizScreen() {
  return (
    <div className="flex flex-col h-full">
      <QuizHUD lives={3} score={10} streak={5} />
      <QuizTimer timeLeft={8} maxTime={10} />
      
      <QuizPromptCard japanese={true} feedback="correct">
        あ
      </QuizPromptCard>
      
      <QuizOptionsGrid>
        <QuizOption japanese={false}>a</QuizOption>
        <QuizOption japanese={false}>i</QuizOption>
        <QuizOption japanese={false}>u</QuizOption>
        <QuizOption japanese={false}>e</QuizOption>
      </QuizOptionsGrid>
    </div>
  )
}
```

### Settings Screens
```jsx
import { SettingsGroup, SettingItem } from '../components/ui/settings'
import { Switch } from '../components/ui/switch'

function SettingsScreen() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <SettingsGroup title="General">
        <SettingItem
          label="Sound Effects"
          description="Play audio for answers"
        >
          <Switch checked={soundOn} onCheckedChange={setSoundOn} />
        </SettingItem>
      </SettingsGroup>
    </div>
  )
}
```

### List Screens
```jsx
<MenuCardList label="Choose a mode">
  {modes.map(mode => (
    <MenuCard
      key={mode.id}
      icon={mode.icon}
      title={mode.title}
      subtitle={mode.description}
      onClick={() => selectMode(mode.id)}
    />
  ))}
</MenuCardList>
```

### Result/Dialog Screens
```jsx
<Dialog open={isGameOver}>
  <DialogContent className="text-center">
    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
      <span className="text-4xl">★</span>
    </div>
    
    <DialogHeader>
      <DialogTitle>Congratulations!</DialogTitle>
      <DialogDescription>
        You scored {score} points
      </DialogDescription>
    </DialogHeader>

    <DialogFooter>
      <Button variant="filled" fullWidth onClick={onPlayAgain}>
        Play Again
      </Button>
      <Button variant="text" fullWidth onClick={onHome}>
        Back to Home
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Accessibility Checklist

- [ ] Use semantic HTML (`<button>`, `<nav>`, `<main>`, etc.)
- [ ] Include `aria-label` for icon-only buttons
- [ ] Use `aria-current="page"` for active navigation
- [ ] Include `aria-live` regions for dynamic updates
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Ensure focus states are visible
- [ ] Use proper heading hierarchy (h1 → h2 → h3)
- [ ] Add loading/disabled states to buttons

## Testing Checklist

After refactoring a screen:

- [ ] Visual appearance matches Material You design
- [ ] All functionality still works
- [ ] Hover states are smooth
- [ ] Active/press states have feedback
- [ ] Touch targets are at least 44×44px
- [ ] Animations don't cause jank
- [ ] Responsive on mobile and desktop
- [ ] Dark mode ready (if implemented)

## Migration Path for Remaining Screens

### Priority 1 (User-facing):
1. **KanaQuizSettingsScreen** - Use `SettingsGroup` + `SettingItem` + `Switch`
2. **WordSearchScreen** - Use `MenuCard` for theme picker, `Dialog` for results
3. **WritingScreen** - Use `MenuCard` for set/mode picker, `Dialog` for results
4. **VerbDrillScreen** - Use `MenuCard` for verb picker, quiz components for drill
5. **SentenceBuilderScreen** - Custom layout but use `Card`, `Button`, `Dialog`

### Priority 2 (Edge cases):
- Update remaining CSS imports
- Remove all `./ScreenName.css` files
- Test edge cases and error states

## Pro Tips

1. **Use `cn()` for conditional classes:**
   ```jsx
   <div className={cn(
     'base-class',
     isActive && 'active-class',
     isDisabled && 'disabled-class'
   )} />
   ```

2. **Gradient backgrounds:**
   ```jsx
   <div className="bg-gradient-to-br from-purple-500 to-purple-700">
   ```

3. **Japanese text:**
   ```jsx
   <span className="font-japanese">あいうえお</span>
   ```

4. **Full-width buttons in groups:**
   ```jsx
   <div className="flex flex-col gap-2">
     <Button variant="filled" fullWidth>Primary</Button>
     <Button variant="text" fullWidth>Secondary</Button>
   </div>
   ```

5. **Icon + Text buttons:**
   ```jsx
   <Button variant="outlined">
     <Settings className="w-4 h-4" />
     Settings
   </Button>
   ```

## Common Pitfalls

❌ **Don't:**
- Mix old CSS classes with Tailwind
- Use inline styles when Tailwind classes exist
- Create one-off components without checking existing library
- Forget to remove old CSS imports

✅ **Do:**
- Use existing components whenever possible
- Follow Material You spacing (4px grid)
- Maintain consistent border radius
- Use semantic color tokens (primary, secondary, etc.)
- Test on mobile and desktop

## Need Help?

Refer to completed screens for patterns:
- **HomeScreen** - Card grid layout
- **KanaQuizScreen** - Quiz pattern with dialog
- **ProgressScreen** - Tabs and progress display
- **SettingsScreen** - Settings groups pattern

All components have TypeScript-style JSDoc comments and follow Shadcn conventions.
