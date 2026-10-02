---
inclusion: always
---

# Coding Standards — Hotel Management App

## TypeScript Rules

### Strictness

- `"strict": true` is required in every `tsconfig.json`. Never weaken it.
- Explicit return types on **all** exported functions and React component props interfaces.
- No `any`. Use `unknown` + type narrowing when the shape is truly unknown.
- No non-null assertions (`!`) unless accompanied by an inline comment proving it cannot be null.
- Enums must be `const enum` or a plain `as const` object — never mutable enum.

```typescript
// ✅ Correct
export type OrderStatus =
  | 'placed'
  | 'in-kitchen'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled';

// ❌ Avoid
enum OrderStatus { Placed, InKitchen }  // non-const enum compiles to runtime object
```

### Utility Types

Prefer built-in utility types over manual re-declaration:
`Partial<T>`, `Required<T>`, `Readonly<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`.

### Imports

- Use named exports exclusively. No default export for utility modules or types.
- Default export is acceptable **only** for React page/component files (convention imposed by
  React Router).
- Import order (enforced by ESLint `import/order`):
  1. Node built-ins
  2. External packages
  3. Internal aliases (`@/`)
  4. Relative imports

---

## React Component Conventions

### File Structure

Each component file follows this layout:

```typescript
// 1. Imports
import { useState } from 'react'
import type { Room } from '@/types/room'

// 2. Prop interface (exported for storybook/testing use)
export interface RoomCardProps {
  room: Room
  onSelect: (roomId: string) => void
}

// 3. Component (named, not anonymous arrow)
export function RoomCard({ room, onSelect }: RoomCardProps): JSX.Element {
  // 4. Hooks first
  const [expanded, setExpanded] = useState(false)

  // 5. Derived values / memoized values
  const priceLabel = `₹${room.price_per_night.toLocaleString('en-IN')}/night`

  // 6. Event handlers (useCallback when passed as prop)
  const handleSelect = (): void => {
    onSelect(room.id)
  }

  // 7. Render
  return (
    <article className="room-card" aria-label={`Room ${room.room_number}`}>
      {/* ... */}
    </article>
  )
}
```

### Component Rules

- One component per file. Filename = component name in PascalCase.
- Props must be destructured in the function signature, not accessed via `props.x`.
- Never mutate props or state directly; always return new objects/arrays.
- `key` props in lists must be stable IDs from the domain model — never array indices.
- Avoid `useEffect` for data fetching; use a `useQuery`-style custom hook instead.
- Side effects that cross component boundaries belong in a **service** or custom **hook**, not in
  event handlers inline in JSX.

### State Management

- Component-local state: `useState` / `useReducer`.
- Shared page-level state: lift to the nearest common ancestor.
- Cross-cutting concerns (auth, notifications): React Context with a typed provider.
- No Redux or Zustand unless the project explicitly adopts it via a steering update.

---

## Styling Patterns

- **Utility-first CSS** using Tailwind CSS classes (or the project's current CSS approach in
  `index.css`). Do not inline `style={{}}` objects for layout — use classes.
- Component-specific styles go in a `.module.css` file alongside the component if they cannot be
  expressed cleanly with utilities.
- Design tokens (colors, spacing) are defined as CSS custom properties in `index.css`:

```css
:root {
  --color-primary: #1a56db;
  --color-success: #0ea472;
  --color-warning: #e3a008;
  --color-danger:  #e02424;
  --radius-card:   0.5rem;
}
```

- Never hardcode hex colors outside of `index.css`.
- Mobile-first responsive design: base styles for mobile, `md:` and `lg:` breakpoints for larger
  screens.

---

## Error Handling

### API Calls

All API calls go through a typed `apiFetch` wrapper that:
1. Attaches the `Authorization` header from session storage.
2. Parses the JSON response.
3. Throws a typed `ApiError` on non-2xx responses.

```typescript
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly errorCode: string,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
```

Components catch errors in `try/catch` blocks inside hooks and set typed error state for
rendering feedback — never `console.error` alone.

### User-Facing Errors

- Validation errors: inline field-level messages, `role="alert"` on the container.
- Network/API errors: a dismissible `ErrorBanner` component at the top of the form/page.
- Fatal errors: an `ErrorBoundary` wrapping each route-level page component.

---

## Accessibility (a11y) Standards

- All interactive elements (`button`, `a`, custom controls) must have accessible names via
  visible text, `aria-label`, or `aria-labelledby`.
- Color is never the sole means of conveying information (e.g. add icon + text alongside color).
- Focus is always visible — never `outline: none` without a custom focus style.
- Modals must: trap focus while open, return focus to the trigger on close, have `role="dialog"`
  and `aria-modal="true"`, and be closable via `Escape`.
- Form inputs must: have a `<label>` (or `aria-label`), associate error messages via
  `aria-describedby`, and have `autocomplete` attributes on personal data fields.
- Status updates delivered asynchronously (order tracking, room status) must use
  `role="status"` or `aria-live="polite"` so screen readers announce them.
- Minimum touch target size: 44 × 44 px (WCAG 2.5.5).
- Color contrast ratio: ≥ 4.5:1 for normal text, ≥ 3:1 for large text (WCAG 1.4.3).

---

## Naming Conventions

| Kind | Convention | Example |
|------|-----------|---------|
| React component | PascalCase | `RoomCard`, `BookingTable` |
| React hook | camelCase with `use` prefix | `useRoomAvailability` |
| Type / Interface | PascalCase | `RoomBooking`, `OrderItem` |
| Enum-like const | SCREAMING_SNAKE_CASE keys | `ORDER_STATUS.PLACED` |
| Service class | PascalCase + `Service` suffix | `FolioService` |
| API route handler file | kebab-case | `room-bookings.ts` |
| CSS module file | ComponentName.module.css | `RoomCard.module.css` |
| Test file | `*.test.ts` or `*.spec.ts` | `folio.test.ts` |
| PBT file | `*.pbt.ts` | `order-pricing.pbt.ts` |

---

## Code Review Checklist

Before marking any implementation task complete, verify:

- [ ] No TypeScript errors (`npx tsc --noEmit` exits 0)
- [ ] All exported functions have explicit return types
- [ ] No `any` types introduced
- [ ] All new UI components have `aria-label` or visible text labels
- [ ] API errors are caught and surfaced to the user
- [ ] `key` props in lists use stable domain IDs
- [ ] No hardcoded colors or magic numbers outside config/tokens
- [ ] New domain types added to the appropriate `types/` file
