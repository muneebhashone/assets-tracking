# FrateZone - Technical Architecture

## Overview

FrateZone is built using modern web technologies with a focus on scalability, maintainability, and performance. The application follows Next.js 14 App Router patterns with a service-oriented architecture for data management.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js 14)                    │
├─────────────────────────────────────────────────────────────────┤
│  App Router                                                     │
│  ├── (auth) - Authentication pages                             │
│  ├── (dashboard) - Protected role-based pages                  │
│  └── Public pages - Support, shipment view, live location     │
├─────────────────────────────────────────────────────────────────┤
│  Components Layer                                               │
│  ├── page-client/ - Page-specific client components            │
│  ├── ui/ - shadcn/ui reusable components                      │
│  ├── forms/ - Form components with validation                  │
│  ├── tables/ - Tanstack table implementations                 │
│  └── layout/ - Layout and navigation components               │
├─────────────────────────────────────────────────────────────────┤
│  Services Layer (React Query + Axios)                          │
│  ├── auth.services.ts - Authentication management              │
│  ├── shipment.queries.ts - Shipment data operations           │
│  ├── monitoring.queries.ts - System monitoring               │
│  └── admin/ - Administrative operations                       │
├─────────────────────────────────────────────────────────────────┤
│  Utils & Configuration                                         │
│  ├── api.utils.ts - Axios configuration with interceptors     │
│  ├── auth.utils.ts - Authentication utilities                 │
│  └── constants.ts - Application constants                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                        ┌───────▼───────┐
                        │   Middleware   │
                        │ (Auth Guard)   │
                        └───────┬───────┘
                                │
                    ┌───────────▼────────────┐
                    │     Backend API        │
                    │  (External Service)    │
                    └────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼─────┐ ┌──────▼──────┐ ┌─────▼─────┐
        │  Database   │ │ SeaRates API │ │    S3     │
        │(PostgreSQL) │ │  (Tracking)  │ │ (Files)   │
        └─────────────┘ └─────────────┘ └───────────┘
```

## Core Architecture Patterns

### 1. Next.js 14 App Router Structure

#### Route Organization
```
app/
├── (auth)/                    # Route group for authentication
│   ├── layout.tsx            # Auth-specific layout
│   ├── signin/page.tsx       # Sign in page
│   └── signup/page.tsx       # Sign up page
├── (dashboard)/              # Route group for protected pages
│   └── dashboard/
│       ├── layout.tsx        # Dashboard layout with sidebar
│       ├── page.tsx          # Main dashboard
│       ├── shipment-list/    # Shipment management
│       ├── users/            # User management  
│       ├── company/          # Company management
│       ├── monitoring/       # System monitoring
│       └── support/          # Support tickets
├── view-shipment/            # Public shipment tracking
├── live-location/            # Public live tracking
└── support-request/          # Public support form
```

**Key Benefits:**
- **Route Groups**: `(auth)` and `(dashboard)` provide layout isolation
- **Nested Layouts**: Shared layouts reduce code duplication
- **File-based Routing**: Intuitive URL structure
- **Server Components**: Improved performance with server-side rendering

### 2. Authentication Flow

#### Implementation Details
- **File**: `middleware.ts:5-24`
- **Auth Key**: `AUTH_KEY` constant from `utils/constants.ts:9`
- **Token Storage**: HTTP-only cookies for security
- **Route Protection**: Middleware guards all `/dashboard/*` routes

```typescript
// middleware.ts:5-24
export async function middleware(request: NextRequest) {
  try {
    const accessToken = request.cookies.get(AUTH_KEY)?.value;
    
    if (!accessToken) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    
    const user = await currentUser(accessToken);
  } catch {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

#### User Context Flow
1. **Root Layout**: User data prefetched using React Query
2. **Auth Services**: `services/auth.services.ts` handles login/logout
3. **Token Management**: Automatic refresh and cleanup
4. **Role-based Access**: Permission wrapper components

### 3. Data Layer Architecture

#### React Query Implementation
- **Provider**: `components/layout/react-query-provider.tsx`
- **Query Client**: Configured with devtools and caching
- **Service Pattern**: Separate files for different domains

```typescript
// Service layer pattern example
// services/shipment.queries.ts
export const useShipmentList = (params: ShipmentListParams) => {
  return useQuery({
    queryKey: ['shipments', params],
    queryFn: () => getShipments(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

#### API Configuration
- **File**: `utils/api.utils.ts:4-42`
- **Base Configuration**: Axios instance with interceptors
- **Auth Interceptor**: Automatic token injection
- **Error Handling**: Standardized error responses

```typescript
// utils/api.utils.ts:4-42
export const apiAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  withCredentials: true,
});

// Request interceptor for auth token
apiAxios.interceptors.request.use((config) => {
  try {
    if (typeof localStorage.getItem(AUTH_KEY) === "string") {
      config.headers["Authorization"] = `Bearer ${localStorage.getItem(AUTH_KEY)}`;
    }
  } catch {}
  return config;
});
```

### 4. Component Architecture

#### Layered Component Structure

**1. Page Components (`components/page-client/`)**
- **Purpose**: Handle page-specific client-side logic
- **Examples**: `DashboardPage.tsx`, `ShipmentDetailPage.tsx`
- **Pattern**: Container components with data fetching

**2. UI Components (`components/ui/`)**
- **Purpose**: Reusable, styled components based on shadcn/ui
- **Examples**: `button.tsx`, `table.tsx`, `form.tsx`
- **Pattern**: Composable, accessible components with variants

**3. Business Components (Root `components/`)**
- **Purpose**: Feature-specific, reusable components
- **Examples**: `dashboard-nav.tsx`, `SearchBar.tsx`
- **Pattern**: Combines UI components with business logic

**4. Form Components (`components/forms/`)**
- **Purpose**: Specialized form implementations
- **Examples**: `shipment-creation-form.tsx`, `user-auth-form.tsx`
- **Pattern**: React Hook Form + Zod validation

**5. Table Components (`components/tables/`)**
- **Purpose**: Complex data table implementations
- **Examples**: `shipment-table/`, `users-table/`
- **Pattern**: Tanstack Table with sorting, filtering, pagination

#### Permission-Based Rendering
```typescript
// components/wrapper/permission-wrapper.tsx
export function PermissionWrapper({ 
  permissions, 
  children 
}: PermissionWrapperProps) {
  const { user } = useAuth();
  
  if (!hasPermission(user, permissions)) {
    return null;
  }
  
  return children;
}
```

### 5. State Management Strategy

#### Server State (React Query)
- **Caching**: Automatic caching with configurable stale times
- **Background Refetch**: Keep data fresh without user intervention
- **Optimistic Updates**: Immediate UI updates with rollback
- **Error Handling**: Centralized error states and retry logic

#### Client State (React Built-ins)
- **Component State**: useState for local component state
- **Context**: Limited use for authentication and theme
- **URL State**: Search params for filters and pagination
- **Form State**: React Hook Form for complex forms

#### No Global Client State Library
- **Reasoning**: React Query handles most state needs
- **Benefits**: Reduced complexity, better performance
- **Trade-offs**: More prop drilling for some shared state

### 6. Styling Architecture

#### Tailwind CSS Configuration
- **File**: `tailwind.config.ts`
- **Safelist**: Ensures all status colors are included in build
- **Custom Components**: shadcn/ui integration
- **Typography**: Poppins font family loaded in root layout

```typescript
// Example from tailwind config safelist
safelist: [
  "text-green-600", "text-blue-600", "text-yellow-600",
  "bg-green-600", "bg-blue-600", "bg-yellow-600",
  // Ensures dynamic status colors are included
]
```

#### Design System
- **Color Palette**: Status-based color coding system
- **Typography**: Consistent font weights and sizes
- **Spacing**: Tailwind's spacing scale
- **Components**: shadcn/ui for consistent look and feel

### 7. Integration Architecture

#### External API Integration

**SeaRates API Integration**
- **File**: `services/searates.queries.ts`
- **Purpose**: Real-time shipment tracking data
- **Implementation**: React Query with error handling
- **Rate Limiting**: Respects API limits with caching

**Google Maps Integration**
- **File**: `components/google-map/map.tsx`
- **Library**: `@googlemaps/js-api-loader`
- **Features**: Live location tracking, route visualization
- **Configuration**: API key via environment variables

**AWS S3 Integration**
- **File Upload**: `react-dropzone` for user interface
- **Rewrite Rules**: Next.js config for S3 proxy
- **File Types**: Support for Excel, CSV, images

```javascript
// next.config.js:17-24
async rewrites() {
  return [
    {
      source: "/bucket/:path*",
      destination: `${process.env.S3_BUCKET_URL}/:path*`,
    },
  ];
}
```

### 8. Security Architecture

#### Authentication Security
- **Token Storage**: HTTP-only cookies (server) + localStorage (client)
- **Route Protection**: Middleware-based authentication
- **API Security**: Bearer token authentication
- **Session Management**: Automatic token refresh

#### Authorization Patterns
- **Role-based Access Control**: Multiple user roles with hierarchical permissions
- **Permission Constants**: Centralized in `utils/constants.ts:62-78`
- **Component-level Protection**: Permission wrapper components
- **API-level Validation**: Backend validates all requests

#### Data Security
- **Input Validation**: Zod schemas for all forms
- **SQL Injection Protection**: Parameterized queries (backend)
- **XSS Protection**: React's built-in protection + input sanitization
- **CSRF Protection**: SameSite cookies and token validation

### 9. Performance Optimizations

#### Build Optimizations
- **Next.js Configuration**: `next.config.js:2-25`
- **TypeScript**: Build errors ignored for faster builds
- **Image Optimization**: Next.js Image component with remote patterns
- **Bundle Analysis**: Regular bundle size monitoring

#### Runtime Optimizations
- **React Query**: Aggressive caching reduces API calls
- **Server Components**: Reduced client-side JavaScript
- **Code Splitting**: Automatic route-based splitting
- **Image Loading**: Lazy loading with placeholder support

#### Database Optimizations
- **Query Optimization**: Efficient queries with proper indexing
- **Connection Pooling**: Managed at backend level
- **Caching Layer**: React Query + backend caching
- **Pagination**: Efficient large dataset handling

## Development Workflow

### 1. Component Development Pattern
```typescript
// 1. Define types
interface ComponentProps {
  // Type definitions
}

// 2. Implement component with hooks
export function Component({ prop }: ComponentProps) {
  // React Query for data
  const { data, isLoading } = useQuery(...);
  
  // Form handling if needed
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });
  
  // Render with error boundaries
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### 2. Service Layer Pattern
```typescript
// services/domain.queries.ts
export const useDomainQuery = (params: Params) => {
  return useQuery({
    queryKey: ['domain', params],
    queryFn: () => apiCall(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useDomainMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: MutationData) => apiCall(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['domain']);
    },
  });
};
```

### 3. Form Development Pattern
```typescript
// 1. Define Zod schema
const formSchema = z.object({
  field: z.string().min(1, "Required"),
});

// 2. Implement form component
export function FormComponent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  
  const mutation = useMutation({
    mutationFn: submitData,
    onSuccess: () => {
      // Handle success
    },
  });
  
  return (
    <Form {...form}>
      {/* Form fields */}
    </Form>
  );
}
```

## Deployment Architecture

### Production Environment
- **Server**: PM2 process manager with ecosystem configuration
- **Port Configuration**: Default port 3021 (configurable)
- **Process Management**: Single process with cluster mode available
- **Monitoring**: PM2 monitoring and logging

### Build Process
1. **Dependencies**: `pnpm install`
2. **Type Checking**: TypeScript compilation
3. **Build**: Next.js production build
4. **Asset Optimization**: Image optimization and compression
5. **Deployment**: PM2 start with ecosystem config

### Environment Management
- **Development**: `.env.local` file
- **Production**: Environment variables via hosting platform
- **Configuration**: `next.config.js` for build-time settings
- **Secrets**: Secure storage for API keys and tokens

## Monitoring and Observability

### Application Monitoring
- **Health Checks**: Built-in monitoring dashboard
- **Performance Tracking**: API response times and success rates
- **Error Tracking**: Comprehensive error logging
- **User Analytics**: Usage patterns and feature adoption

### System Monitoring
- **Sync Health**: Real-time tracking of external API integrations
- **Circuit Breaker**: Automatic protection against cascading failures
- **Failed Sync Management**: Retry mechanisms and manual intervention
- **Performance Metrics**: Database query performance and optimization

## Scalability Considerations

### Horizontal Scaling
- **Stateless Design**: No server-side session storage
- **Load Balancing**: Ready for multiple instance deployment
- **Database Scaling**: Connection pooling and read replicas
- **CDN Integration**: Static asset delivery optimization

### Vertical Scaling
- **Memory Management**: Efficient React Query caching
- **CPU Optimization**: Server-side rendering where beneficial
- **Database Optimization**: Query optimization and indexing
- **Bundle Size**: Regular monitoring and optimization

## Future Architecture Considerations

### Potential Enhancements
- **Microservices**: Split monolithic backend into domain services
- **Real-time Updates**: WebSocket integration for live data
- **Mobile Application**: React Native app using shared services
- **API Gateway**: Centralized API management and routing
- **Container Orchestration**: Docker and Kubernetes deployment
- **Monitoring Stack**: Prometheus, Grafana, and distributed tracing

### Migration Paths
- **Database Migration**: Support for multiple database providers
- **State Management**: Migration to more complex state management if needed
- **Internationalization**: Multi-language support framework
- **Accessibility**: Enhanced accessibility features and compliance