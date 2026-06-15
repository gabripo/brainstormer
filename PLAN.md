# Brainstormer — Implementation Plan

## 1. Project Architecture

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3+
- **Animations**: Framer Motion (page transitions, sticky note physics, fade effects)
- **State**: React Context + useReducer (persisted to LocalStorage)
- **Icons**: Lucide React

### Directory Structure

```
brainstormer/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout (fonts, global styles, Provider, AnimatePresence)
│   │   ├── page.tsx             # Root — redirects to /setup
│   │   ├── setup/
│   │   │   └── page.tsx         # Page 1: frame session using Getting to Yes
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
│   │   ├── SituationInput.tsx    # Neutral situation + relationship dynamics
│   │   ├── InterestsInput.tsx    # Underlying interests & needs
│   │   ├── SessionNorms.tsx      # Commitment checklist (principles toggles)
│   │   ├── GettingToYesInfographic.tsx
│   │   ├── ProgressIndicator.tsx
│   │   └── PageTransition.tsx
│   ├── context/
│   │   └── BrainstormContext.tsx
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       ├── storage.ts
│       ├── colors.ts
│       └── constants.ts
├── public/
├── scripts/
│   └── postbuild.js
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
  situationDescription: string;    // Neutral framing of the issue
  relationshipDynamics: string;    // Personal dynamics (separate people from problem)
  interests: string;               // Underlying interests & needs
  attendees: Attendee[];
  ideas: Idea[];
  discardedIdeaIds: string[];
}
```

---

## 3. State Management (BrainstormContext)

- **Provider** wraps `layout.tsx`
- **useReducer** with actions:
  - `SET_SITUATION` / `SET_RELATIONSHIP_DYNAMICS` / `SET_INTERESTS`
  - `ADD_ATTENDEE` / `REMOVE_ATTENDEE` / `SET_MEDIATOR`
  - `START_BRAINSTORM`
  - `ADD_IDEA` / `TOGGLE_PREFERRED` / `REMOVE_IDEA`
  - `END_BRAINSTORM`
  - `DISCARD_IDEA` / `RESTORE_IDEA`
  - `COMPLETE_SESSION`
  - `RESET_SESSION`
- **Migration**: Old `problemDescription` key from previous sessions is migrated to `situationDescription` on load.
- **LocalStorage sync**: On every state change (debounced 500ms), serialize to `localStorage.setItem('brainstormer-state', JSON.stringify(state))`
- **Hydration**: On mount, read from LocalStorage; if valid, migrate and restore.

---

## 4. Pages & Routing

### Page 1: `/setup` (Start Page)

The landing page is structured around **"Getting to Yes" principled negotiation** — it guides users through preparation before brainstorming.

**Layout:**
- Background: Subtle gradient
- Fade-in entrance animation (Framer Motion)
- App title "Brainstormer" with tagline referencing Getting to Yes

**4 sections (each in a Card):**

| # | Section | Principle Applied | Input |
|---|---------|-------------------|-------|
| 1 | **The Situation** | Separate people from the problem | Two textareas: situation (neutral facts) + relationship dynamics |
| 2 | **Interests & Needs** | Focus on interests, not positions | Single textarea for underlying needs |
| 3 | **The Team** | — (attendee logistics) | Attendee list with mediator designation |
| 4 | **Session Norms** | All principles + brainstorming rules | Toggle chips for 6 norms — group commitment ritual |

**Components:**
1. **GettingToYesInfographic** — Side panel showing 4 principles as cards + mediator tip
2. **SituationInput** — Neutral situation framing + relationship dynamics (separates people from problem)
3. **InterestsInput** — Interests and needs identification (focus on interests, not positions)
4. **SessionNorms** — 6 toggleable commitment chips (principles + brainstorming rules)
5. **AttendeeList** — Add attendees, designate one as mediator
6. **"Brainstorm!" button** — Disabled until: situation non-empty, ≥ 2 attendees, exactly 1 mediator
7. **ProgressIndicator** — Step 1 of 3

**Validation on submit:**
- Situation must not be empty
- Must have ≥ 2 attendees
- Must have exactly 1 mediator
- Interests and norms are encouraged but not required

### Page 2: `/brainstorm` (Idea Collection)

**Layout:**
- Full-screen board for sticky notes
- Top bar: situation + interests + dynamics (collapsible), phase indicator

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
- Situation + interests + dynamics displayed
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

| # | Principle | Icon | Used On |
|---|-----------|------|---------|
| 1 | **Separate people from the problem** | 👥→📋 | Setup (SituationInput), Sidebar |
| 2 | **Focus on interests, not positions** | 🔍→💡 | Setup (InterestsInput), Sidebar |
| 3 | **Invent options for mutual gain** | 💡×💡 | Brainstorm page, Sidebar |
| 4 | **Insist on objective criteria** | ⚖️ | Review page, Sidebar |
| 5 | **Defer judgment** | ✋ | SessionNorms, Brainstorm sidebar |
| 6 | **Build on others' ideas** | 🧱 | SessionNorms, Brainstorm sidebar |

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

- **Read**: On mount, check `localStorage.getItem(STORAGE_KEY)`, parse, migrate old keys
- **Write**: After every state change (debounced 500ms)
- **Migration**: `problemDescription` → `situationDescription`
- **Clear**: On "Start New Session"
- **Error handling**: Corrupt data → clear key, start fresh

---

## 8. Implementation Task Breakdown (Execution Order)

### Phase A: Project Scaffolding
1. Initialize Next.js project
2. Install dependencies: `framer-motion`, `lucide-react`
3. Configure Tailwind with custom colors
4. Create directory structure

### Phase B: Types & State
5. Write `src/types/index.ts` with all interfaces
6. Write `src/utils/storage.ts` (localStorage get/set/clear)
7. Write `src/utils/colors.ts` (sticky note color palette)
8. Write `src/utils/constants.ts` (Getting to Yes principles data)
9. Write `src/context/BrainstormContext.tsx` (provider, reducer, actions, migration)

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
19. Write `src/components/SituationInput.tsx` (replaces ProblemTextbox)
20. Write `src/components/InterestsInput.tsx`
21. Write `src/components/SessionNorms.tsx`
22. Write `src/app/setup/page.tsx` (compose 4-section layout)

### Phase E: Page 2 — Brainstorm (`/brainstorm`)
23. Write `src/components/sticky-note/StickyNote.tsx`
24. Write `src/components/sticky-note/StickyNoteBoard.tsx`
25. Write `src/app/brainstorm/page.tsx`

### Phase F: Page 3 — Review (`/review`)
26. Write `src/app/review/page.tsx`

### Phase G: Root Layout & Routing
27. Write `src/app/layout.tsx` (Provider + global layout + AnimatePresence)
28. Write `src/app/page.tsx` (redirect to `/setup`)

### Phase H: Polish & Testing
29. Add focus rings and keyboard accessibility
30. Add responsive styles (mobile-first)
31. Add error boundaries
32. Run `npm run build` and fix any issues

---

## 9. Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0"
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
- **Desktop**: Side-by-side layout, sticky infographic panel
- **Keyboard**: All actions Tab/Enter/Escape accessible
- **ARIA**: Labels on all interactive elements
- **Error states**: Toast for localStorage issues, disabled buttons with tooltips
