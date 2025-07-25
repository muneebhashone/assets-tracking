# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run Next.js linting
- `pnpm prettier` - Format code with Prettier
- Node.js version: 20.12.* (as specified in package.json engines)

## Architecture Overview

This is a Next.js 14 logistics/shipment tracking application called "FrateZone" that uses the App Router with a role-based dashboard system.

### Key Architecture Patterns

**Route Structure:**
- `(auth)` - Authentication pages (signin, signup)
- `(dashboard)` - Protected dashboard pages with role-based access
- Public pages - Support request, view shipment, live location tracking

**Authentication Flow:**
- Token-based auth using cookies with `AUTH_KEY` constant
- Middleware protects all `/dashboard/*` routes
- User context prefetched in root layout using React Query
- Auth services in `services/auth.services.ts` handle login/logout/user state

**Data Layer:**
- React Query for server state management with prefetching
- Services layer organized by domain (`services/` folder)
- Separate admin services in `services/admin/`
- Custom Axios instance with auth interceptors in `utils/api.utils.ts`

**Component Architecture:**
- Page components in `components/page-client/` (client-side logic)
- UI components using shadcn/ui patterns in `components/ui/`
- Form components centralized in `components/forms/`
- Table components with Tanstack Table in `components/tables/`
- Reusable business components at root `components/` level

**Styling & Code Quality:**
- Tailwind CSS with custom Tailwind config and safelist feature
- Biome for code formatting (tab indentation, double quotes, specific linting rules)  
- Typography uses Poppins font (weights: 200, 400, 600, 700, 800) loaded in root layout
- Prettier configured for additional formatting support

### Important Files

- `middleware.ts` - Route protection and auth validation
- `utils/api.utils.ts` - Axios configuration with auth interceptors
- `lib/form-schema.ts` - Zod schemas for form validation
- `constants/data.ts` - Application constants and static data
- `types/` - TypeScript type definitions organized by domain

### Development Notes

- Next.js config ignores TypeScript and ESLint build errors (`ignoreBuildErrors: true`)
- React Strict Mode is disabled (`reactStrictMode: false`)
- S3 bucket integration for file uploads with rewrite rules (`/bucket/:path*`)
- Google Maps integration for location tracking using `@googlemaps/js-api-loader`
- Permission-based component rendering using `permission-wrapper.tsx`
- Uses `pnpm` as package manager (not npm or yarn)

### Key Integrations & Libraries

- **Charts & Data Visualization:** @nivo/bar, @nivo/line, recharts for dashboard analytics
- **Form Handling:** react-hook-form with @hookform/resolvers and zod validation
- **Tables:** @tanstack/react-table for complex data tables with sorting/pagination
- **UI Components:** Radix UI primitives with shadcn/ui patterns
- **Maps:** Google Maps API integration for live location tracking
- **File Handling:** react-dropzone, exceljs, xlsx for file uploads and exports
- **State Management:** @tanstack/react-query for server state, no global client state lib
- **Date Handling:** date-fns and moment.js
- **Authentication:** Custom token-based auth (not NextAuth despite README reference)