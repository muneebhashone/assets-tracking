# FrateZone - Development Guide

## Development Environment Setup

### Prerequisites
- **Node.js**: Version 20.12.* (specified in `package.json:89`)
- **Package Manager**: pnpm (not npm or yarn)
- **IDE**: VS Code recommended with TypeScript and Tailwind CSS extensions
- **Browser**: Chrome/Edge with React Developer Tools

### Initial Setup
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser to http://localhost:3000
```

## Code Style Guidelines

### Biome Configuration
The project uses Biome instead of ESLint/Prettier for faster performance:

- **Configuration**: `biome.json`
- **Rules**: Tab indentation, double quotes, specific linting rules
- **Integration**: Built into the development workflow

### TypeScript Standards
- **Strict Mode**: Enabled with comprehensive type checking
- **Type Definitions**: Located in `types/` directory
- **Interface Naming**: Use descriptive names with proper domain context
- **Generic Types**: Use meaningful names instead of single letters

```typescript
// Good
interface ShipmentListParams {
  page: number;
  limit: number;
  status?: ShipmentStatus;
}

// Avoid
interface Params {
  p: number;
  l: number;
  s?: string;
}
```

### Component Standards

#### File Naming Conventions
- **Components**: PascalCase (e.g., `ShipmentTable.tsx`)
- **Pages**: PascalCase with Page suffix (e.g., `DashboardPage.tsx`)
- **Utilities**: camelCase (e.g., `auth.utils.ts`)
- **Types**: camelCase with `.types.ts` suffix

#### Component Structure
```typescript
// 1. Imports (external libraries first, then internal)
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

// 2. Type definitions
interface ComponentProps {
  id: string;
  className?: string;
}

// 3. Component implementation
export function Component({ id, className }: ComponentProps) {
  // 4. Hooks (data fetching, state, effects)
  const { data, isLoading } = useQuery(...);
  const [state, setState] = useState(...);
  
  // 5. Event handlers
  const handleClick = () => {
    // Implementation
  };
  
  // 6. Early returns for loading/error states
  if (isLoading) return <div>Loading...</div>;
  
  // 7. Main render
  return (
    <div className={className}>
      {/* Component content */}
    </div>
  );
}
```

## Architecture Patterns

### Service Layer Pattern

All API interactions should go through the service layer in the `services/` directory:

```typescript
// services/domain.queries.ts
export const useDomainList = (params: DomainParams) => {
  return useQuery({
    queryKey: ['domain', params],
    queryFn: () => getDomainList(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!params.requiredField,
  });
};

export const useDomainMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: DomainData) => createDomain(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['domain']);
      toast.success('Domain created successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
```

### Form Development Pattern

#### Using React Hook Form + Zod
All forms should use this pattern for consistency:

```typescript
// 1. Define schema in lib/form-schema.ts or inline
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  role: z.enum(["ADMIN", "USER"], {
    required_error: "Role is required",
  }),
});

type FormData = z.infer<typeof formSchema>;

// 2. Component implementation
export function FormComponent() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  
  const mutation = useDomainMutation();
  
  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </Form>
  );
}
```

### Table Development Pattern

Use Tanstack Table for all data tables:

```typescript
// components/tables/domain-table/columns.tsx
export const columns: ColumnDef<DomainItem>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <StatusBadge status={status} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

// components/tables/domain-table/domain-table.tsx
export function DomainTable({ data }: { data: DomainItem[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  
  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>No results.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
```

## State Management Guidelines

### React Query Best Practices

#### Query Key Patterns
Use consistent query key patterns for better cache management:

```typescript
// Good - Hierarchical and descriptive
['shipments', 'list', { page: 1, status: 'ACTIVE' }]
['shipments', 'detail', shipmentId]
['users', 'list', { companyId: 123 }]

// Avoid - Flat and unclear
['shipmentsList']
['shipment123']
['allUsers']
```

#### Error Handling
Implement consistent error handling across the application:

```typescript
export const useShipmentDetail = (id: string) => {
  return useQuery({
    queryKey: ['shipments', 'detail', id],
    queryFn: () => getShipmentDetail(id),
    enabled: !!id,
    retry: (failureCount, error) => {
      // Don't retry on 404 errors
      if (error.response?.status === 404) return false;
      return failureCount < 3;
    },
    throwOnError: (error) => {
      // Let error boundary handle 500 errors
      return error.response?.status >= 500;
    },
  });
};
```

#### Optimistic Updates
Use optimistic updates for better user experience:

```typescript
export const useUpdateShipment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateShipmentData) => updateShipment(data),
    onMutate: async (data) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['shipments', 'detail', data.id]);
      
      // Snapshot the previous value
      const previousShipment = queryClient.getQueryData(['shipments', 'detail', data.id]);
      
      // Optimistically update
      queryClient.setQueryData(['shipments', 'detail', data.id], (old: any) => ({
        ...old,
        ...data,
      }));
      
      return { previousShipment };
    },
    onError: (err, data, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ['shipments', 'detail', data.id],
        context?.previousShipment
      );
    },
    onSettled: (data) => {
      // Always refetch after error or success
      queryClient.invalidateQueries(['shipments', 'detail', data?.id]);
    },
  });
};
```

### Component State Guidelines

#### When to Use Different State Types
- **useState**: Local component state (UI state, form inputs)
- **useQuery**: Server data that needs caching
- **URL params**: Filters, pagination, search terms
- **Context**: Truly global state (theme, auth user)

```typescript
// Good - Different state types for different concerns
function ShipmentList() {
  // URL state for filters (shareable, bookmarkable)
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local UI state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Server state with caching
  const { data: shipments } = useShipmentList({
    page: Number(searchParams.get('page')) || 1,
    status: searchParams.get('status') || undefined,
  });
  
  return (
    // Component JSX
  );
}
```

## Component Development Best Practices

### Permission-Based Rendering
Use the permission wrapper for role-based access:

```typescript
import { PermissionWrapper } from '@/components/wrapper/permission-wrapper';

function AdminControls() {
  return (
    <PermissionWrapper permissions={['SUPER_ADMIN']}>
      <Button>Admin Only Action</Button>
    </PermissionWrapper>
  );
}
```

### Error Boundaries
Implement error boundaries for robust error handling:

```typescript
// components/error-boundary.tsx
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    
    return this.props.children;
  }
}
```

### Loading States
Implement consistent loading states across the application:

```typescript
function DataComponent() {
  const { data, isLoading, error } = useQuery(...);
  
  if (error) {
    return <ErrorMessage error={error} />;
  }
  
  if (isLoading) {
    return <SkeletonLoader />;
  }
  
  if (!data?.length) {
    return <EmptyState message="No data found" />;
  }
  
  return (
    <div>
      {data.map(item => (
        <DataItem key={item.id} item={item} />
      ))}
    </div>
  );
}
```

## Styling Guidelines

### Tailwind CSS Best Practices

#### Component Variants
Use class-variance-authority for component variants:

```typescript
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

#### Responsive Design
Follow mobile-first responsive design principles:

```typescript
// Good - Mobile first
<div className="flex flex-col md:flex-row gap-4 p-4 md:p-8">
  <aside className="w-full md:w-64 lg:w-80">
    {/* Sidebar content */}
  </aside>
  <main className="flex-1">
    {/* Main content */}
  </main>
</div>
```

#### Status Color System
Use the predefined status color system from `utils/constants.ts:80-98`:

```typescript
// Use StatusBadgeColor for consistent colors
const { color, hexColorCode } = StatusBadgeColor[status];

// In components
<Badge className={`bg-${color} text-white`}>
  {status}
</Badge>
```

### Custom Components
When creating custom components, follow the shadcn/ui patterns:

```typescript
// components/ui/custom-component.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

interface CustomComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const CustomComponent = React.forwardRef<HTMLDivElement, CustomComponentProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-md border',
          // Variants
          variant === 'default' && 'bg-background text-foreground',
          variant === 'secondary' && 'bg-secondary text-secondary-foreground',
          // Sizes
          size === 'sm' && 'p-2 text-sm',
          size === 'md' && 'p-4',
          size === 'lg' && 'p-6 text-lg',
          className
        )}
        {...props}
      />
    );
  }
);

CustomComponent.displayName = 'CustomComponent';

export { CustomComponent };
```

## Testing Guidelines

### Testing Strategy
While not currently implemented, follow these patterns when adding tests:

#### Unit Testing
Test individual components and utilities:

```typescript
// __tests__/utils/auth.utils.test.ts
import { hasPermission } from '@/utils/auth.utils';

describe('hasPermission', () => {
  it('should return true for super admin', () => {
    const user = { role: 'SUPER_ADMIN', permissions: [] };
    expect(hasPermission(user, ['VIEW_SHIPMENT'])).toBe(true);
  });
  
  it('should return false for insufficient permissions', () => {
    const user = { role: 'CLIENT_USER', permissions: ['VIEW_SHIPMENT'] };
    expect(hasPermission(user, ['DELETE_SHIPMENT'])).toBe(false);
  });
});
```

#### Integration Testing
Test component interactions and API integration:

```typescript
// __tests__/components/ShipmentForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ShipmentForm } from '@/components/forms/shipment-creation-form';

describe('ShipmentForm', () => {
  it('should submit form with valid data', async () => {
    const queryClient = new QueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <ShipmentForm />
      </QueryClientProvider>
    );
    
    fireEvent.change(screen.getByLabelText('Tracking Number'), {
      target: { value: 'MSKU1234567' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Create Shipment' }));
    
    await waitFor(() => {
      expect(screen.getByText('Shipment created successfully')).toBeInTheDocument();
    });
  });
});
```

## Performance Guidelines

### React Query Performance
- **Stale Time**: Set appropriate stale times to reduce unnecessary refetches
- **Query Invalidation**: Be specific about what queries to invalidate
- **Background Refetch**: Use `refetchOnWindowFocus` judiciously
- **Infinite Queries**: Use for large datasets with pagination

### Component Performance
- **Memoization**: Use `useMemo` and `useCallback` for expensive calculations
- **Component Splitting**: Split large components into smaller ones
- **Lazy Loading**: Use `React.lazy` for route-based code splitting
- **Virtual Scrolling**: Consider for large lists (react-window)

### Bundle Optimization
- **Import Analysis**: Regularly analyze bundle size
- **Tree Shaking**: Import only what you need from libraries
- **Dynamic Imports**: Use for large dependencies
- **Image Optimization**: Use Next.js Image component

## Development Workflow

### Branch Strategy
- **Main Branch**: `main` - production-ready code
- **Feature Branches**: `feature/feature-name` - new features
- **Bug Fixes**: `fix/bug-description` - bug fixes
- **Hotfixes**: `hotfix/critical-fix` - urgent production fixes

### Commit Messages
Follow conventional commit format:

```
feat: add shipment bulk upload functionality

- Implement Excel file parsing with exceljs
- Add drag-and-drop interface with react-dropzone
- Include validation for required columns
- Add progress tracking for upload process

Fixes #123
```

### Code Review Process
1. **Self Review**: Review your own code before creating PR
2. **Automated Checks**: Ensure all builds and lints pass
3. **Peer Review**: At least one approval required
4. **Testing**: Test the changes in staging environment
5. **Documentation**: Update relevant documentation

### Development Commands

```bash
# Development
pnpm dev                 # Start development server
pnpm dev --turbo        # Start with turbo (if available)

# Building
pnpm build              # Build for production
pnpm start              # Start production server

# Code Quality
pnpm lint               # Run Next.js linting
pnpm prettier           # Format code with Prettier
pnpm type-check         # Run TypeScript compiler (if configured)

# Package Management
pnpm add package-name           # Add dependency
pnpm add -D package-name        # Add dev dependency
pnpm remove package-name        # Remove dependency
pnpm update                     # Update all dependencies
```

## Debugging Guidelines

### React Query Debugging
Use React Query DevTools in development:

```typescript
// In development, add to your app
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <>
      {/* Your app */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

### Network Debugging
- **Browser DevTools**: Use Network tab to inspect API calls
- **React DevTools**: Inspect component state and props
- **Query DevTools**: Monitor cache state and refetch behavior

### Common Issues and Solutions

#### Performance Issues
```typescript
// Problem: Too many re-renders
function Component({ data }) {
  const processedData = data.map(item => ({ ...item, processed: true }));
  return <List data={processedData} />;
}

// Solution: Memoize expensive calculations
function Component({ data }) {
  const processedData = useMemo(
    () => data.map(item => ({ ...item, processed: true })),
    [data]
  );
  return <List data={processedData} />;
}
```

#### State Synchronization Issues
```typescript
// Problem: Stale closures in event handlers
function Component() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setTimeout(() => {
      setCount(count + 1); // Uses stale count
    }, 1000);
  };
  
  return <button onClick={handleClick}>Count: {count}</button>;
}

// Solution: Use functional updates
function Component() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setTimeout(() => {
      setCount(prev => prev + 1); // Uses current count
    }, 1000);
  };
  
  return <button onClick={handleClick}>Count: {count}</button>;
}
```

## Environment-Specific Development

### Development Environment
- **Hot Reloading**: Automatic browser refresh on code changes
- **Source Maps**: Detailed error traces with line numbers
- **DevTools**: React Query DevTools and React DevTools
- **Error Overlay**: Full-screen error display in development

### Staging Environment
- **Production Build**: Test with production optimizations
- **Real API**: Connect to staging API endpoints
- **Performance Testing**: Monitor performance metrics
- **Integration Testing**: Test with real data

### Production Environment
- **Optimized Build**: Minified and compressed assets
- **Error Reporting**: Centralized error logging
- **Performance Monitoring**: Real-time performance metrics
- **Security**: All security measures enabled

## Best Practices Summary

### Do's
- ✅ Use TypeScript for all new code
- ✅ Follow the established component patterns
- ✅ Use React Query for server state management
- ✅ Implement proper error handling and loading states
- ✅ Use permission wrappers for role-based access
- ✅ Follow the service layer pattern for API calls
- ✅ Write descriptive commit messages
- ✅ Test your changes thoroughly

### Don'ts
- ❌ Don't use global client state libraries (Redux, Zustand) without good reason
- ❌ Don't bypass the service layer for API calls
- ❌ Don't ignore TypeScript errors
- ❌ Don't create components without proper type definitions
- ❌ Don't use inline styles instead of Tailwind classes
- ❌ Don't commit without running linting and formatting
- ❌ Don't create large, monolithic components
- ❌ Don't ignore loading and error states