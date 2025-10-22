# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server (with hot reload)
npm run dev

# Build for production (client + server)
npm run build

# Start production server
npm start

# Type checking
npm run check

# Database schema push (applies schema to database)
npm run db:push
```

## Architecture Overview

This is a full-stack TypeScript application for recruitment tracking and competition management. The architecture follows a schema-first development approach with clear separation of concerns.

**Stack:**
- Frontend: React 18 + TypeScript + Vite + Wouter (routing) + TanStack Query
- Backend: Express.js with TypeScript
- Database: PostgreSQL with Drizzle ORM
- UI: shadcn/ui components + Tailwind CSS v4
- Validation: Zod schemas

## Database Schema & Patterns

### Table Naming Convention
All recruiter-specific tables use the `recruiter_` prefix:
- `recruiter_leaders` - Leaders who recruit
- `recruiter_types` - Recruitment types (Papers, New Starter, Established)
- `recruiter_points` - Point allocations per type
- `recruiter_recruits` - Individual recruit submissions

User tables do NOT use the prefix:
- `users` - User accounts
- `user_profiles` - User profile information

### Key Relationships
- Recruits reference both a leader (recruiter_leaders.id) and a type (recruiter_types.id)
- Points table has a unique constraint on typeId (one-to-one with types)
- All foreign keys use CASCADE on delete
- Schema defined in `shared/schema.ts` with Drizzle relations and Zod validation schemas

## Backend Architecture

### Layer Structure
1. **Routes** (`server/routes.ts`) - Express route handlers, request validation, error handling
2. **Storage** (`server/storage.ts`) - Database abstraction layer with IStorage interface
3. **Database** (`server/db.ts`) - Drizzle client initialization
4. **Schema** (`shared/schema.ts`) - Shared types and schemas used by both frontend and backend

### Storage Layer Pattern
All database operations go through the `storage` singleton (DatabaseStorage class):
```typescript
import { storage } from "./storage";

// Usage in routes
const leaders = await storage.getAllLeaders();
const recruit = await storage.createRecruit(data);
```

This abstraction allows for testing with mock implementations and keeps route handlers clean.

### API Endpoints

**Leaders:**
- `GET /api/leaders` - List all leaders with stats
- `GET /api/leaders/:id` - Single leader
- `POST /api/leaders` - Create leader
- `PATCH /api/leaders/:id` - Update leader
- `DELETE /api/leaders/:id` - Delete leader

**Types:**
- `GET /api/types` - List recruitment types
- `POST /api/types` - Create type
- `PATCH /api/types/:id` - Update type
- `DELETE /api/types/:id` - Delete type

**Points:**
- `GET /api/points` - Get all types with their point allocations
- `POST /api/points` - Upsert points for a type

**Recruits:**
- `GET /api/recruits?status=X&leaderId=Y&dateFrom=Z&dateTo=W` - List with filters
- `GET /api/recruits/:id` - Single recruit
- `POST /api/recruits` - Create recruit
- `PATCH /api/recruits/:id/status` - Update status (Submitted/Confirmed)
- `DELETE /api/recruits/:id` - Delete recruit

**Scorecard:**
- `GET /api/scorecard?weekStart=DATE` - Leader statistics and rankings

**Users:**
- `GET /api/users` - List all users with profiles
- `POST /api/users` - Create user (with profile if name provided)
- `PATCH /api/users/:id` - Update user (and profile if name provided)
- `DELETE /api/users/:id` - Delete user (cascade deletes profile)

**Seed:**
- `POST /api/seed` - Initialize database with default types, points, and sample leaders

## Frontend Architecture

### Module-Based Structure
The application is organized into 4 main modules, each with dedicated page and component folders:

```
client/src/
├── pages/
│   ├── admin.tsx          - Admin dashboard with tabs
│   ├── recruits.tsx       - HR recruit management
│   ├── public-form.tsx    - Public submission form
│   └── scorecard.tsx      - Leaderboard display
├── components/
│   ├── admin/            - Admin-specific components
│   ├── recruits/         - Recruits table and filters
│   ├── public-form/      - Form components
│   ├── scorecard/        - Scorecard table
│   ├── layout/           - NavLayout, headers
│   └── ui/               - shadcn/ui components
└── lib/
    ├── queryClient.ts    - TanStack Query config
    └── utils.ts          - cn() helper
```

### Routing
Uses Wouter (lightweight React router):
- `/` - Redirects to `/scorecard`
- `/public-form` - Standalone form (no NavLayout)
- `/scorecard` - Public leaderboard
- `/recruits` - HR recruit management (requires NavLayout)
- `/admin` - Admin dashboard with tabs (requires NavLayout)

### Data Fetching Pattern
TanStack Query is used for all API calls:
```typescript
const { data: leaders } = useQuery({
  queryKey: ['/api/leaders'],
  queryFn: async () => {
    const res = await fetch('/api/leaders');
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  }
});
```

Mutations use `useMutation` with optimistic updates and query invalidation.

## Design System Essentials

### Brand Colors (from Harcourts Cooper & Co)
- **Navy** (`#001F3A`) - Primary brand color for headers, navigation, key actions
- **Cyan** (`#00AEEF`) - Accent for CTAs, links, active states, focus rings
- **White** (`#FFFFFF`) - Base background
- Neutrals: Light Grey (#F2F2F2), Mid Grey (#CCCCCC), Dark Grey (#666666)

### Spacing System
Strict 8-point grid: Use units of 4, 8, 12, 16, 24, 32, 48px

### Typography
Font: Source Sans Pro (all weights)
- Headings: Bold, Navy
- Body: Regular, 14-16px
- Labels: Semibold, 14px

### Component Patterns
- **Glassmorphism**: Applied to public-form with backdrop-blur and semi-transparent backgrounds
- **Status Badges**: "Submitted" (amber), "Confirmed" (green)
- **Tables**: Zebra striping with #F2F2F2, right-align numbers, left-align text

Full design guidelines in `design_guidelines.md`.

## Key Business Logic

### Status Workflow
Recruits have two statuses: "Submitted" or "Confirmed"

1. **Public Form Submission** → Status: "Submitted"
   - Leaders submit via `/public-form`
   - Auto-marked as "Submitted"
   - Requires HR review

2. **HR Review** → Status: "Confirmed" or deleted
   - HR reviews in `/recruits` module
   - Can confirm (changes status) or delete

3. **Direct HR Entry** → Status: "Confirmed"
   - HR adds directly in `/recruits`
   - Auto-marked as "Confirmed"

**Important:** Only "Confirmed" recruits count toward scorecard points.

### Scoring System
- Each recruitment type has assigned points (defined in recruiter_points table)
- Pre-seeded: Papers (2), New Starter (10), Established (20)
- Leaders accumulate points from confirmed recruits only
- Scorecard calculates total points and weekly points (if weekStart provided)
- Rankings sorted by total points descending

## Database Migrations

This project uses Drizzle Kit for schema management:

```bash
# Push schema changes to database
npm run db:push
```

Configuration in `drizzle.config.ts`. Requires `DATABASE_URL` environment variable (PostgreSQL connection string).

## Type Safety

The project maintains type safety from database to frontend:
1. Drizzle schema defines table types
2. `createInsertSchema` generates Zod validators
3. Type exports from `shared/schema.ts` used in both frontend and backend
4. Extended types for relations: `RecruitWithRelations`, `TypeWithPoints`, `LeaderWithStats`

Always use the insert schemas for validation before database operations.

## Common Patterns

### Adding a New Field to Recruits
1. Update table definition in `shared/schema.ts`
2. Update `insertRecruitSchema` with validation
3. Run `npm run db:push` to update database
4. Update `storage.ts` if new query logic needed
5. Update frontend forms and display components

### Adding a New API Endpoint
1. Add route handler in `server/routes.ts`
2. Validate request body with Zod schema
3. Call storage layer method (add to IStorage interface if new)
4. Return JSON with appropriate status code
5. Add error handling (catch Zod errors for 400, general errors for 500)

### Creating a New Module/Page
1. Add page component in `client/src/pages/`
2. Create component folder in `client/src/components/[module-name]/`
3. Add route in `App.tsx` with or without NavLayout
4. Use TanStack Query for data fetching
5. Follow 8-point spacing and brand color guidelines
