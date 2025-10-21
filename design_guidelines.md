# Recruitment Tracker Design Guidelines - Harcourts Cooper & Co

## Design System Foundation

**Brand Identity**: Precise, calm, confident with Navy anchor and controlled Cyan accents.

## Color Palette

**Primary Colors:**
- Navy: `#001F3A` - Primary brand color for headers, navigation, key actions
- Cyan: `#00AEEF` - Accent for CTAs, links, active states, focus rings
- White: `#FFFFFF` - Base background color

**Neutrals:**
- Light Grey: `#F2F2F2` - Subtle backgrounds, alternating rows
- Mid Grey: `#CCCCCC` - Borders, dividers
- Dark Grey: `#666666` - Secondary text, muted content

**UI State Colors:**
- Success: Standard green for confirmed status
- Warning: Standard amber for pending actions
- Error: Standard red for validation

## Typography

**Typeface**: Source Sans Pro (all weights)

**Hierarchy:**
- Page Titles: Bold, 32-40px, Navy, tight leading
- Section Headers: Semibold, 24-28px, Navy
- Card Titles: Semibold, 18-20px, Navy
- Body Text: Regular, 14-16px, Dark Grey
- Labels: Semibold, 14px, Dark Grey
- Helper Text: Regular, 12-13px, Mid Grey

**Rules:**
- Headings in title case or uppercase
- Body text in sentence case
- Maintain consistent tracking throughout

## Layout System

**Grid & Spacing:**
- 8-point spacing scale: Use units of 4, 8, 12, 16, 24, 32, 48
- Max content width: 1280px
- Content gutters: 24-32px
- Component padding: 16-24px standard

**Radius:**
- Small (inputs, pills): 8px
- Medium (cards): 12px
- Large (modals, feature tiles): 16px

**Elevation:**
- Level 1: `0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)`
- Level 2: `0 4px 12px rgba(0,0,0,0.08)`
- Use sparingly, prefer subtle shadows

## Module-Specific Design

### 1. Admin Interface

**Layout**: Clean dashboard grid with card-based sections

**Leaders Management:**
- Table with columns: Name, Email, Total Points, Recruits Count, Actions
- Add Leader button (Navy background, white text) in top-right
- Inline edit and delete icons (Cyan on hover)

**Types & Points Configuration:**
- Side-by-side cards or single combined table
- Type name, Point value, Actions columns
- Visual indicator showing point values (subtle Cyan accent)

**User Management:**
- Role badges using Navy/Cyan color coding
- Filter/search bar with Cyan focus ring

### 2. Recruits Module

**Layout**: Full-width table with action sidebar

**Table Design:**
- Columns: Name, Leader, Type, Date, Mobile, Email, Status, Actions
- Row height: 48-56px
- Zebra striping with very light grey (#F2F2F2)
- Right-aligned numeric data
- Status badges: "Submitted" (amber), "Confirmed" (green)

**Filters:**
- Top bar with status toggles, date range picker, leader dropdown
- Apply glassmorphism for filter panel over white background

**Add/Edit Form:**
- Modal with 16px radius
- Single column layout
- Clear required field indicators (asterisk in Cyan)
- Inline validation with error states

### 3. Public Submission Form

**Layout**: Centered form (max-width 600px) with light glassmorphism

**Design:**
- Hero section with glass card containing form
- Navy heading: "Submit New Recruit"
- White/glass background with subtle border
- All fields clearly labeled with asterisks for required
- Large submit button (Navy, full-width or prominent)
- Success state shows confirmation message

**Background**: Consider subtle Navy-tinted gradient or authentic local photography (lightly blurred) behind glass form

### 4. Scorecard Dashboard

**Layout**: Presentation-optimized table designed for screenshots and slideshows

**Table Design:**
- Clean, professional layout with generous spacing
- Columns: Rank, Leader Name, Total Points, This Week Points, Change indicator
- Header row: Navy background, white text
- Data rows: White background, subtle borders
- Alternating row backgrounds optional (very light grey)

**Visual Enhancements:**
- Change indicators: Up arrow (green), Down arrow (red), Dash (neutral)
- Top 3 positions highlighted with subtle Cyan accent border
- Point values bold and prominent
- Weekly changes shown in smaller, secondary font

**Export-Ready:**
- Optimized for 1920x1080 or 16:9 ratio
- High contrast for projector visibility
- Clean borders and clear typography
- Minimal decorative elements

## Glassmorphism Implementation

**When to Use:**
- Navigation bars over imagery
- Cards overlaying photos or gradients
- Modal overlays
- Public form background

**Light Glass:**
```
Background: rgba(255,255,255,0.6)
Backdrop blur: 10px
Border: 1px solid rgba(255,255,255,0.7)
Shadow: Level 1
```

**Dark Glass (rare use):**
```
Background: rgba(0,31,58,0.35)
Backdrop blur: 12px
Border: 1px solid rgba(255,255,255,0.18)
Text: White
```

**Accessibility**: Ensure AA contrast on all glass surfaces

## Component Patterns

**Buttons:**
- Primary: Navy background, white text, 2px Cyan focus ring
- Secondary: Outline Navy, Navy text on white
- Hover: Slight opacity change (90%)

**Inputs:**
- White fill, 1px light border, 8px radius
- Focus: 2px Cyan ring outside border
- Error: Red border, error text below

**Tables:**
- Left-align text, right-align numbers
- Truncate with tooltips, no wrapping
- Sortable columns with subtle indicators

**Status Badges:**
- Pill shape (large radius)
- Submitted: Amber background, dark text
- Confirmed: Green background, white text

**Navigation:**
- Top bar Navy on white
- Active: Cyan underline or indicator
- Text-led, icons secondary

## Motion & Accessibility

**Animation:**
- Subtle only: 150-250ms transitions
- Respect reduced motion preferences
- Fade-ins for modals, slide for drawers

**Accessibility:**
- WCAG AA contrast minimum
- Visible focus states on all interactive elements
- Keyboard navigation support
- Screen reader labels on icon buttons

## Images

**No hero images needed** - This is an internal utility application focused on data management and efficiency. Use clean white backgrounds with optional subtle Navy-tinted gradients for visual interest in the public form only.

**Photography Guidelines (if needed):**
- Authentic, naturally lit
- Light adjustments only
- Keep professional and genuine

## Key Principles

**Do:**
- Keep layouts clean, aligned, predictable
- Use Navy to anchor, Cyan to guide action
- Let content and data clarity drive design
- Maintain generous white space

**Don't:**
- Overuse glassmorphism or shadows
- Mix random type sizes or weights
- Create overly decorative interfaces
- Compromise data readability for aesthetics

This design system prioritizes **professional clarity and efficient data management** while maintaining the sophisticated Harcourts Cooper & Co brand identity.