# Brainstormer — Implementation Plan

## 1. Project Architecture

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3+
- **Animations**: Framer Motion (page transitions, sticky note physics, fade effects)
- **State**: React Context + useReducer (persisted to LocalStorage)
- **Icons**: Lucide React
- **ID generation**: nanoid

### Directory Structure

```
brainstormer/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout (fonts, global styles, Provider, AnimatePresence)
│   │   ├── page.tsx             # Root — redirects to /setup
│   │   ├── setup/
│   │   │   └── page.tsx         # Page 1: attendees, problem, mediator
│   │   ├── brainstorm/
│   │   │   └── page.tsx         # Page 2: sticky-note idea collection
│   │   └── review/
│   │       └── page.tsx         # Page 3: discard ideas, finalize
│   ├── components/
│   │   ├── ui/                  # Reusable primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Card.tsx
│   │   ├── sticky-note/
│   │   │   ├── StickyNote.tsx
│   │   │   └── StickyNoteBoard.tsx
│   │   ├── attendee/
│   │   │   ├── AttendeeList.tsx
│   │   │   └── AttendeeInput.tsx
│   │   ├── GettingToYesInfographic.tsx
│   │   ├── ProblemTextbox.tsx
│   │   ├── ProgressIndicator.tsx
│   │   └── PageTransition.tsx
│   ├── context/
│   │   └── BrainstormContext.tsx
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── storage.ts
│   │   ├── colors.ts
│   │   └── constants.ts
│   └── hooks/
│       └── useLocalStorage.ts
├── public/
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 2. Data Models / Type Definitions

```typescript
// src/types/index.ts

export type AppPhase = 'setup' | 'brainstorm' | 'review' | 'complete';

export interface Attendee {
  id: string;
  name: string;
  isMediator: boolean;
}

export interface Idea {
  id: string;
  content: string;
  isPreferred: boolean;
  createdAt: number;
  color: string;
}

export interface BrainstormState {
  phase: AppPhase;
  problemDescription: string;
  attendees: Attendee[];
  ideas: Idea[];
  discardedIdeaIds: string[];
}
```

---

## 3. State Management (BrainstormContext)

- **Provider** wraps `layout.tsx`
- **useReducer** with actions:
  - `SET_PROBLEM`
  - `ADD_ATTENDEE` / `REMOVE_ATTENDEE` / `SET_MEDIATOR`
  - `START_BRAINSTORM`
  - `ADD_IDEA` / `TOGGLE_PREFERRED` / `REMOVE_IDEA`
  - `END_BRAINSTORM`
  - `DISCARD_IDEA` / `RESTORE_IDEA`
  - `COMPLETE_SESSION`
  - `RESET_SESSION`
- **LocalStorage sync**: On every state change (debounced 500ms), serialize to `localStorage.setItem('brainstormer-state', JSON.stringify(state))`
- **Hydration**: On mount, read from LocalStorage; if valid, restore state.

---

## 4. Pages & Routing

### Page 1: `/setup` (Start Page)

**Layout:**
- Background: Subtle gradient
- Fade-in entrance animation (Framer Motion)
- App title "Brainstormer" with tagline

**Components:**
1. **GettingToYesInfographic** — Side panel showing key principles as cards
2. **ProblemTextbox** — Large textarea for issue description
3. **AttendeeList** — Add attendees, designate one as mediator
4. **"Brainstorm!" button** — Disabled until: problem non-empty, ≥ 2 attendees, exactly 1 mediator
5. **ProgressIndicator** — Step 1 of 3

**Validation on submit:**
- Problem must not be empty
- Must have ≥ 2 attendees
- Must have exactly 1 mediator

### Page 2: `/brainstorm` (Idea Collection)

**Layout:**
- Full-screen board for sticky notes
- Top bar: problem statement, phase indicator

**Components:**
1. **StickyNoteBoard** — Masonry/flow layout of notes
2. **StickyNote** — Each note:
   - Animated entrance (scale + rotation)
   - Colored background (random pastel palette)
   - Star toggle for "mostly preferred"
   - Delete button
   - Hover lift effect
3. **Input area** — Text input + "Add Idea" (Enter submits)
4. **"Brainstormed!" button** — Ends collection phase
5. **GettingToYesInfographic** — Collapsible reminder card with brainstorming rules

**Animations:**
- Notes: `scale: [0, 1]`, `opacity: [0, 1]`, `rotate: random(-3, 3)` with spring physics
- Preferred toggle: star pulse scale
- Delete: shrink + fade out
- Board reflows smoothly with Framer Motion `layout`

### Page 3: `/review` (Discard Ideas)

**Layout:**
- Two zones: "Keep" and "Discarded"

**Components:**
1. **Keep zone** — Remaining ideas as sticky notes (preferred toggle still active)
2. **Discarded zone** — Muted/transparent notes
3. **Click to discard** — Idea animates to discard zone
4. **Undo** — Restore from discarded with reverse animation
5. **"Finalize" button** — Triggers `COMPLETE_SESSION`, shows summary
6. **ProgressIndicator** — Step 3 of 3

### Summary View (after finalize)
- Final list of kept ideas (preferred first)
- Problem statement
- Attendee list
- "Start New Session" button (resets state)

---

## 5. Animations & Styling

### Page Transitions (Framer Motion AnimatePresence)
- Each page: `initial={{ opacity: 0, y: 20 }}`, `animate={{ opacity: 1, y: 0 }}`, `exit={{ opacity: 0, y: -20 }}`
- `AnimatePresence mode="wait"`

### Color Palette
```
Primary:   #4F46E5 (Indigo)
Secondary: #F59E0B (Amber)
Accent:    #10B981 (Emerald)
Bg:        #F8FAFC (Slate 50)
Text:      #1E293B (Slate 800)

Sticky note colors:
- Yellow:  #FEF3C7
- Green:   #D1FAE5
- Blue:    #DBEAFE
- Pink:    #FCE7F3
- Orange:  #FFEDD5
- Purple:  #F3E8FF
- Teal:    #CCFBF1
```

---

## 6. Getting to Yes Infographics Content

| # | Principle | Icon |
|---|-----------|------|
| 1 | **Separate people from the problem** | 👥→📋 |
| 2 | **Focus on interests, not positions** | 🔍→💡 |
| 3 | **Invent options for mutual gain** | 💡×💡 |
| 4 | **Insist on objective criteria** | ⚖️ |
| 5 | **Defer judgment** | ✋ |
| 6 | **Build on others' ideas** | 🧱 |

Each displayed as a card with staggered fade-in animation.

---

## 7. LocalStorage Persistence

```typescript
const STORAGE_KEY = 'brainstormer-state';

interface PersistedState {
  version: 1;
  savedAt: number;
  data: BrainstormState;
}
```

- **Read**: On mount, check `localStorage.getItem(STORAGE_KEY)`, parse, validate
- **Write**: After every state change (debounced 500ms)
- **Clear**: On "Start New Session"
- **Error handling**: Corrupt data → clear key, start fresh

---

## 8. Implementation Task Breakdown (Execution Order)

### Phase A: Project Scaffolding
1. Initialize Next.js project (`npx create-next-app@latest` with TypeScript, Tailwind, App Router)
2. Install dependencies: `framer-motion`, `lucide-react`, `nanoid`
3. Configure `tailwind.config.ts` with custom colors/fonts
4. Create directory structure

### Phase B: Types & State
5. Write `src/types/index.ts` with all interfaces
6. Write `src/utils/storage.ts` (localStorage get/set/clear)
7. Write `src/utils/colors.ts` (sticky note color palette + random picker)
8. Write `src/utils/constants.ts` (Getting to Yes principles data)
9. Write `src/context/BrainstormContext.tsx` (provider, reducer, actions)

### Phase C: Shared UI Components
10. Write `src/components/ui/Button.tsx`
11. Write `src/components/ui/Input.tsx`
12. Write `src/components/ui/Textarea.tsx`
13. Write `src/components/ui/Badge.tsx`
14. Write `src/components/ProgressIndicator.tsx`
15. Write `src/components/PageTransition.tsx`

### Phase D: Page 1 — Setup (`/setup`)
16. Write `src/components/GettingToYesInfographic.tsx`
17. Write `src/components/attendee/AttendeeInput.tsx`
18. Write `src/components/attendee/AttendeeList.tsx`
19. Write `src/components/ProblemTextbox.tsx`
20. Write `src/app/setup/page.tsx` (compose all setup components)

### Phase E: Page 2 — Brainstorm (`/brainstorm`)
21. Write `src/components/sticky-note/StickyNote.tsx`
22. Write `src/components/sticky-note/StickyNoteBoard.tsx`
23. Write `src/app/brainstorm/page.tsx`

### Phase F: Page 3 — Review (`/review`)
24. Write `src/app/review/page.tsx`

### Phase G: Root Layout & Routing
25. Write `src/app/layout.tsx` (Provider + global layout + AnimatePresence)
26. Write `src/app/page.tsx` (redirect to `/setup`)

### Phase H: Polish & Testing
27. Add focus rings and keyboard accessibility
28. Add responsive styles (mobile-first)
29. Add error boundaries
30. Run `npm run build` and fix any issues

---

## 9. Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "nanoid": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

---

## 10. Responsiveness & Accessibility

- **Mobile**: Single-column layout, collapsible infographic
- **Desktop**: Masonry sticky notes, sidebar infographic
- **Keyboard**: All actions Tab/Enter/Escape accessible
- **ARIA**: Labels on all interactive elements
- **Error states**: Toast for localStorage issues, disabled buttons with tooltips
