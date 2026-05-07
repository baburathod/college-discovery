# Loom Video Presentation Guide

**Target Length:** 6 - 8 Minutes
**Goal:** Prove architectural maturity, UX focus, and professional engineering boundaries.

---

### Section 1: Introduction (30 seconds)
- **The Hook:** "Hi, I'm [Your Name]. For this assessment, I chose Track B: The College Discovery Platform."
- **The Philosophy:** "Instead of building a dozen half-finished features, my goal was to build a production-grade MVP. I prioritized reliability, clear decision-support UX, and robust backend security over flashy, over-engineered designs."

### Section 2: Architecture Overview (1.5 minutes)
- **The Stack:** "I built this using the Next.js 14 App Router and TypeScript. For the backend, I used PostgreSQL managed via Prisma."
- **State & Auth:** "For complex state, like the comparison engine, I integrated Zustand. Authentication is securely handled via NextAuth.js."
- **The 'Why':** "I intentionally leveraged React Server Components to query Prisma directly. This eliminates internal network latency, which is the Vercel-recommended approach, while still maintaining clean REST APIs for external client access."

### Section 3: Feature Demo (3-4 minutes) *[Screen Share Active]*
- **Discovery (Listing):** 
  - *Action:* Type in the search bar.
  - *Talking Point:* "Notice how the search is debounced by 500ms. It doesn't spam the API on every keystroke, but it syncs directly to the URL so the results are bookmarkable."
- **Detail View & Skeleton:**
  - *Action:* Click a college. 
  - *Talking Point:* "We use a precise CSS skeleton while loading to prevent Cumulative Layout Shift. The page structure is strictly hierarchical to prevent cognitive overload."
- **The Compare Engine (Crucial):**
  - *Action:* Add 2 colleges to compare.
  - *Talking Point:* "This isn't just a table. It evaluates the data and highlights the best value, lowest fees, and highest ratings. The state is globally persisted using Zustand, meaning if I refresh the page right now, my comparison survives. That's critical for a decision-support tool."
- **Dashboard & Save Flow:**
  - *Action:* Save the comparison, go to dashboard.
  - *Talking Point:* "In the dashboard, I can easily resume a comparison. When I do, the app revalidates the IDs against the backend and safely re-hydrates the Zustand store."

### Section 4: Engineering Decisions (1.5 minutes)
- **Optimistic UI:** "On the dashboard, when you unsave an item, I aggressively update the React state first so the UI feels instant. The network request happens in the background. If it fails, I automatically rollback the UI state."
- **Performance:** "In the API routes, I utilized Prisma's \`Promise.all()\` to run count queries and pagination queries concurrently, nearly doubling the route speed."
- **Security:** "All mutate APIs explicitly verify ownership. For example, \`resource.userId === session.user.id\`. IDOR vulnerabilities are a massive issue in standard CRUD apps, and I made sure this architecture is protected against them from day one."

### Section 5: Edge Cases & Tradeoffs (1 minute)
- **Edge Cases:** "I spent a lot of time on empty states. Invalid routes trigger strict 404 boundaries. If an image link breaks, a fallback container loads. If you try to compare more than 3 colleges, a toast politely blocks you to maintain mobile responsiveness."
- **The Tradeoff:** "To wrap up: I could have spent this time building an AI chatbot or complex animations. But I made the tradeoff to prioritize core reliability, database integrity, and a seamless, integrated UX. I wanted to submit something that could realistically be deployed to production today."
- **Outro:** "Thank you for reviewing my code."
