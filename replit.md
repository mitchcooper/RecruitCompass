# Recruitment Tracker - Internal Competition Management System

## Overview
A web application for managing internal recruitment tracking and running a competition among leaders. Built with React, Express, PostgreSQL, and designed following Harcourts Cooper & Co brand guidelines.

## Purpose
- Track recruits submitted by leaders
- Manage recruitment types and point allocations
- Run weekly competitions with scoreboards
- Provide public submission forms for leaders
- Allow HR team to review and confirm submissions

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL (via DATABASE_URL)
- **Styling**: Source Sans Pro font, Navy (#001F3A) primary, Cyan (#00AEEF) accent

## Project Structure

### Database Schema
All tables use `recruiter_` prefix except for users/user_profiles:

- **users**: Shared user accounts (email, role)
- **user_profiles**: User profile information
- **recruiter_leaders**: Leaders who recruit (name, email)
- **recruiter_types**: Recruitment types (Papers, New Starter, Established)
- **recruiter_points**: Point allocations per type
- **recruiter_recruits**: Recruit submissions with status (Submitted/Confirmed)

### Application Modules

#### 1. Admin Module (`/admin`)
Four tabs for managing:
- **Leaders**: Add/edit leaders, view their stats
- **Types**: Manage recruitment types
- **Points**: Allocate points to each type
- **Users**: User account management

#### 2. Recruits Module (`/recruits`)
HR interface to:
- View all recruits in a table
- Filter by status (Submitted/Confirmed), leader, date range
- Add new recruits (auto-marked as Confirmed)
- Confirm or reject submitted recruits from public form

#### 3. Public Form (`/public-form`)
Standalone page with glassmorphism design:
- Publicly accessible form for leaders
- Submit recruits with all required fields
- Auto-marked as "Submitted" status
- Success confirmation message

#### 4. Scorecard Dashboard (`/scorecard`)
Presentation-optimized table showing:
- Leader rankings
- Total points and weekly points
- Change indicators (up/down/neutral)
- Top 3 highlighted with accent border
- Designed for slideshows and email screenshots

## Design System

### Colors
- Primary (Navy): #001F3A (--primary)
- Accent (Cyan): #00AEEF (--accent)
- Background: White
- Neutrals: Light grey (#F2F2F2), Mid grey (#CCCCCC), Dark grey (#666666)

### Typography
- Font: Source Sans Pro (all weights)
- Headings: Bold, Navy
- Body: Regular, Dark grey for secondary text

### Spacing & Layout
- 8-point grid system (4, 8, 12, 16, 24, 32, 48)
- Max content width: 1280px
- Card radius: 12px (--radius-md)
- Input radius: 8px (--radius-sm)

### Glassmorphism
Applied to public form with:
- Semi-transparent white background
- 10px backdrop blur
- Subtle borders and shadows

## Features

### Pre-seeded Data
- **Types**: Papers, New Starter, Established
- **Points**: Papers (2), New Starter (10), Established (20)

### Status Workflow
1. Leaders submit via public form → Status: "Submitted"
2. HR reviews in Recruits module → Can confirm or reject
3. HR adds directly → Status: "Confirmed"
4. Only "Confirmed" recruits count toward scorecard

### Scoring System
- Each recruit type has assigned points
- Leaders accumulate points from confirmed recruits
- Weekly points tracked for competition
- Scorecard shows rankings and changes

## Recent Changes
- Initial project setup with schema-first development
- All data models defined with Drizzle ORM
- Complete frontend component library built
- Harcourts Cooper & Co design system implemented
- Navigation with header layout
- All four main modules with polished UI

## User Preferences
- Clean, professional interface
- 8-point spacing system strictly followed
- Navy and Cyan color scheme throughout
- Glassmorphism for public-facing form
- Elegant, presentation-ready scorecard

## Project Architecture
- Schema-first development approach
- Horizontal layer implementation (Schema → Frontend → Backend → Integration)
- Reusable component library
- Type-safe with TypeScript throughout
- TanStack Query for data fetching (to be integrated)
- Form validation with Zod schemas

## API Routes (To Be Implemented)
- `/api/leaders` - CRUD for leaders
- `/api/types` - CRUD for recruitment types
- `/api/points` - Update point allocations
- `/api/recruits` - CRUD for recruits, status updates
- `/api/scorecard` - Get leader stats and rankings
- `/api/users` - User management

## Development Status
**Task 1 Complete**: Schema and frontend components built
**Next**: Backend implementation with PostgreSQL integration
**Then**: Integration with TanStack Query and testing
