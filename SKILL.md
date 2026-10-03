---
name: admin-dashboard-design
description: Design, audit, or implement responsive admin dashboards and internal management interfaces with clear information hierarchy, compact operational layouts, accessible controls, complete UI states, and reusable project-native components. Use for admin portals, CMS panels, operations consoles, settings areas, user management, monitoring, billing, content management, and dashboard design-system work.
---

# Admin Dashboard Design

Create admin interfaces that feel calm, precise, trustworthy, and efficient. Optimize for repeated operational work rather than marketing impact. Preserve the host project's brand and component system; apply this skill as a design and interaction framework, not as a fixed visual theme.

## Scope and intent

Use this skill to:

- audit an existing admin dashboard;
- design a new admin shell or page;
- implement or refactor admin UI components;
- define reusable admin patterns and tokens;
- improve responsiveness, density, accessibility, or state handling.

Do not change business logic, permissions, API behavior, billing rules, or data semantics for a visual request. Do not redesign the public product merely to make it match the admin area.

## Start with the project

Before proposing or implementing UI:

1. Inspect the existing design system, global styles, layout shell, routing, shared components, and at least one representative admin page.
2. Identify the project's font, semantic colors, spacing scale, radii, borders, elevation, icon library, and breakpoint conventions.
3. Reuse existing components and tokens when they are sound. Introduce a new primitive only when the existing system cannot express a recurring need.
4. Preserve functional behavior and data contracts unless the request explicitly changes them.
5. Determine whether the task is an audit, a design specification, or an implementation. An audit must not mutate code.

If the project has no usable design system, use the fallback foundation below and document the new tokens in the project's normal source of truth.

## Design principles

### Operational clarity

- Give each page one clear purpose and one dominant action.
- Put the page title, short context, and primary action in a stable header region.
- Prefer plain labels over clever language and ambiguous icon-only controls.
- Show current state, ownership, and consequences near the control they affect.

### Compact, not cramped

- Reduce decorative space before reducing readable type or touch targets.
- Use denser rows for repeated records and more space for decisions, forms, and destructive confirmations.
- Keep metadata visually quiet but readable.
- Avoid large empty hero-like regions inside operational pages.

### Progressive disclosure

- Keep frequent actions visible.
- Move rare, advanced, and destructive actions into secondary panels or overflow menus.
- Reveal filters, bulk actions, and diagnostics when they become relevant.
- Never hide a required recovery action behind hover-only UI.

### Calm hierarchy

- Use typography and spacing before adding color, borders, or shadows.
- Reserve the brand accent for focus, selection, and primary actions.
- Use status colors only for meaning, always paired with text or an icon.
- Avoid decorative gradients, excessive glass effects, glowing borders, and nested cards.

### Predictability

- Similar objects must use the same layout and action placement.
- Navigation, filters, pagination, dialogs, and feedback should behave consistently across pages.
- Preserve user input after errors and retain filters when users move between a list and a record when practical.

## Information architecture

Organize navigation around administrator jobs rather than database tables. Prefer five to nine top-level destinations. Group larger products into clear domains such as:

- Overview
- Content or catalog
- Users and access
- Billing or plans
- Communications
- Operations or monitoring
- Settings

Use nested navigation only when a domain has multiple meaningful destinations. Do not expose every editor section as a permanent top-level item.

The overview page should answer:

1. What is the current system state?
2. What needs attention?
3. What changed recently?
4. What are the most common next actions?

Do not fill the overview with vanity metrics. Every metric should support a decision, reveal risk, or lead to a relevant detail view.

## Application shell

Use a stable shell with:

- a top bar for global identity, environment, search if useful, and account controls;
- a left navigation rail on desktop;
- an overlay drawer or compact menu on mobile;
- a main region with `min-width: 0` and no page-level horizontal overflow.

Recommended starting dimensions when the project has no established values:

- Top bar: 56–64 px.
- Desktop sidebar: 224–248 px.
- Collapsed desktop rail: 56–64 px only when labels remain discoverable.
- Main desktop padding: 28–40 px.
- Tablet padding: 20–28 px.
- Mobile padding: 16 px; 12 px only for data-dense tables or very small screens.

Keep the shell width-fluid. Do not make zooming below 100% create excessive blank gutters or abnormally wide cards. Use sensible maximum widths for reading-heavy forms, but allow tables and monitoring views to use the available canvas.

The sidebar should:

- keep the product/admin identity compact;
- show a clear active state with a quiet accent surface;
- scroll independently when long;
- keep account and exit actions stable without duplicating the full profile from the top bar;
- close after navigation on mobile;
- preserve a minimum 44 × 44 px touch target.

## Page composition

Use this default hierarchy and omit sections that are not needed:

1. Page header: title, one-line context, primary action.
2. Attention region: errors, pending approvals, incomplete setup, or urgent queues.
3. Summary region: three to five decision-relevant metrics.
4. Primary work surface: table, editor, queue, or configuration form.
5. Secondary context: recent activity, publishing status, audit information, or help.

Do not turn every region into a card. A card must represent a meaningful group, independent object, or elevated surface.

## Visual foundation

Prefer the project's existing tokens. If none exist, begin with semantic roles rather than hardcoded component colors.

### Neutral light foundation

- App background: `#F5F5F7`
- Surface: `#FFFFFF`
- Soft surface: `#F7F7F8`
- Primary text: `#1D1D1F`
- Secondary text: `#515154`
- Muted text: `#6E6E73`
- Subtle text: `#86868B`
- Border: `#D2D2D7`
- Soft border: `#E1E1E5`

Map the project brand into `accent`, `accent-hover`, `accent-soft`, and `focus-ring`. Do not make every link or icon use the accent.

### Semantic roles

- Success: completed, live, verified, healthy.
- Warning: needs attention, low balance, degraded service.
- Error: failure, blocked state, destructive action.
- Information: selected, active, or explanatory state.

Meet WCAG AA contrast. Never rely on color alone.

### Type, shape, and elevation

- Page title: 24–32 px, semibold, compact tracking.
- Section title: 16–20 px, semibold.
- Body: 14–16 px.
- Repeated row/metadata text: 12–14 px, never so small that normal zoom is required.
- Small controls: 8 px radius.
- Inputs, buttons, and standard cards: 10–12 px radius.
- Large cards and dialogs: 14–16 px radius.
- Prefer a soft 1 px border. Use shadows only to communicate floating elevation.

Use a 4 px spacing unit with an 8 px base rhythm. Typical gaps are 8, 12, 16, 24, and 32 px.

## Component patterns

### Buttons

- One primary action per local region.
- Use verb-first labels: “Add user,” “Publish changes,” “Save template.”
- Secondary actions use a neutral border or quiet text treatment.
- Destructive actions use an error treatment and remain separated from ordinary actions.
- Minimum interactive size is 44 × 44 px, even when the visible glyph is smaller.
- Show progress inside the initiating control and prevent duplicate submission.

### Metric cards

- Show label, value, and one short explanatory detail.
- Use tabular numerals where supported.
- Keep equal visual weight unless one metric genuinely needs attention.
- Make the card clickable only when it leads to a useful filtered view; otherwise do not add hover affordance.
- Use one column on narrow phones, two on ordinary phones/tablets when space permits, and three to five on desktop based on content width.

### Tables and record lists

- Prefer tables for comparison and lists for scanning heterogeneous records.
- Keep column headers visible for long data regions.
- Align numbers consistently and use tabular numerals.
- Put the most identifying field first and actions last.
- Use row-level overflow menus for secondary actions; keep the most frequent action visible when justified.
- Provide search, filters, result count, sorting, pagination or virtualization, loading, empty, error, and no-results states.
- On mobile, either preserve essential columns in a controlled horizontal scroll region or recompose each row as a record card. Never allow the page itself to scroll horizontally.
- Bulk selection must reveal a clear contextual action bar and identify how many records are selected.

### Forms and editors

- Constrain reading-heavy forms to roughly 640–800 px unless side-by-side preview is essential.
- Group fields by user intent, not database structure.
- Keep labels visible above fields; placeholders are examples, not labels.
- Put validation next to the field and explain recovery.
- Use sticky save controls only for long forms and ensure they do not cover content.
- Warn before navigating away from unsaved changes.
- For content editors, provide preview and publishing state without pretending that save and publish are the same action.

### Filters

- Show the most-used filters by default.
- Place advanced filters in a popover or drawer.
- Display active filters as removable tokens or a concise summary.
- Always provide “Clear filters” when a filtered zero-result state is possible.
- Avoid auto-submitting expensive server filters on every keystroke; debounce or use an explicit apply action when appropriate.

### Menus and popovers

- Anchor to the trigger and keep inside the viewport.
- Use an opaque or sufficiently solid surface; background text must not show through.
- Close on selection, Escape, and safe outside interaction.
- Separate destructive items with spacing or a divider.
- Do not make the menu wider than its content requires.

### Dialogs and drawers

- Use dialogs for focused decisions and short forms; use drawers for contextual inspection or multi-step side work.
- Keep title, close control, and footer actions visible.
- Scroll the body, not the entire viewport.
- Use nearly full-screen dialogs on narrow phones when content is substantial.
- Confirmation copy must name the affected object and consequence.

### Charts and monitoring

- Use charts to reveal change, distribution, or comparison—not to decorate the overview.
- Always provide precise values through labels, tooltips, or a data view.
- Use consistent units and time ranges.
- Keep legends close to the chart and allow wrapping.
- Show loading, unavailable, empty, partial, and stale-data states.
- Do not solve overlap by shrinking labels below readability.

### Feedback

- Success feedback should be quiet and brief.
- Errors should state what failed and the next recovery action.
- Deduplicate repeated notifications.
- Keep system-wide alerts separate from field validation.
- Avoid flashing, blinking, and indefinite spinners without status text.

## States are part of the design

Design and implement these states where relevant:

- loading or skeleton;
- empty and first-use;
- filtered empty;
- success;
- recoverable error;
- permission denied;
- offline or degraded service;
- disabled with an explanation;
- partial data;
- destructive confirmation;
- unsaved changes;
- stale or last-updated state.

Never leave a blank region or disabled control without explaining why and what can happen next.

## Responsive behavior

Validate at minimum:

- 320 px phone;
- 360–390 px phone;
- 768 px tablet;
- 1024 px small desktop;
- 1280 px desktop;
- 1536 px or wider desktop;
- 200% browser zoom.

Recompose instead of merely shrinking:

- Desktop sidebar → mobile overlay drawer.
- Inline page actions → primary visible action plus overflow.
- Multi-column metrics → one or two columns.
- Wide table → contained horizontal region or record cards.
- Side-by-side editor/preview → tabs or stacked sections.
- Persistent filter row → compact filter trigger with active-count badge.

Prevent cumulative nested padding from making mobile content too narrow. Fixed headers, sticky toolbars, and drawers must not cover the first or last actionable content.

## Accessibility and interaction

- Use semantic landmarks and a logical heading order.
- Every control needs an accessible name.
- Preserve visible focus indicators.
- Support keyboard navigation for menus, dialogs, tables, and forms.
- Lock background scrolling when an overlay is open and restore focus to its trigger when closed.
- Respect reduced-motion preferences.
- Use motion only for continuity, state transition, and progress; avoid decorative motion in routine admin work.
- Do not place essential actions behind hover.
- Announce important asynchronous updates without over-announcing routine polling.

## Permissions and destructive work

- Hide actions the user cannot perform when absence is clearer; disable with an explanation when awareness is important.
- Distinguish role, status, and verification state.
- Confirm high-impact actions and show the exact target.
- Prefer reversible archive/deactivate flows over deletion when the product supports them.
- Record or expose audit information for consequential administrative changes when available.
- Never expose secrets, raw tokens, credentials, or sensitive personal data as visual decoration.

## Implementation workflow

For implementation tasks:

1. State the page purpose and primary user job.
2. Map existing components and tokens that can be reused.
3. Define the responsive composition before polishing desktop details.
4. Implement the smallest coherent set of shared primitives and page changes.
5. Add or preserve all relevant states.
6. Verify keyboard use, focus, contrast, overflow, long text, empty data, and error recovery.
7. Run the project's lint, tests, and production build in proportion to the change.
8. Visually inspect the required widths and 200% zoom.

For audit-only tasks, report findings without changing files. Prioritize findings by user impact:

- High: blocks tasks, hides content, breaks permissions, accessibility, or mobile use.
- Medium: causes confusion, inconsistency, or unnecessary effort.
- Low: polish that does not materially affect task completion.

Each finding should identify the observed problem, user impact, recommended change, and the component or pattern to reuse.

## Anti-patterns

Avoid:

- marketing-style hero sections inside admin pages;
- every item rendered as a large card;
- icon-only navigation without reliable labels or tooltips;
- low-contrast gray text used to simulate elegance;
- transparent menus that expose content behind them;
- many equally prominent primary buttons;
- destructive actions adjacent to routine actions;
- desktop tables squeezed into phone width;
- fixed heights that clip translated or user-generated content;
- unexplained status dots;
- vanity metrics without a decision path;
- polling animations or notifications that continually distract the operator;
- one-off colors, shadows, and spacing values when project tokens exist.

## Completion checklist

Before handoff, confirm:

- [ ] The page has one clear purpose and primary action.
- [ ] Navigation reflects administrator jobs and current location.
- [ ] Layout works at 320 px, 768 px, 1280 px, and 200% zoom.
- [ ] No page-level horizontal scrolling occurs.
- [ ] Text wraps without clipping and touch targets are at least 44 × 44 px.
- [ ] Loading, empty, error, success, disabled, and permission states are intentional.
- [ ] Tables, charts, and forms remain usable with real and long data.
- [ ] Focus, keyboard navigation, labels, contrast, and reduced motion are verified.
- [ ] Destructive actions are separated and confirmed appropriately.
- [ ] Existing business behavior and authorization boundaries remain intact.
- [ ] New patterns are reusable and documented in the project's normal design source of truth.

