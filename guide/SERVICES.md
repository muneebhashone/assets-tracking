# FrateZone - Services & Data Layer Documentation

## Overview

This guide provides comprehensive documentation of the FrateZone service layer architecture, data management patterns, and integration with external services. The application uses a service-oriented architecture with React Query for state management and Axios for HTTP communications.

## Service Layer Architecture

### Service Organization

The services are organized by domain in the `services/` directory:

```
services/
├── auth.services.ts          # Authentication and user session management
├── auth.mutations.ts         # Authentication mutations (login, logout)
├── shipment.queries.ts       # Shipment data fetching and caching
├── shipment.mutations.ts     # Shipment creation and updates
├── user.queries.ts           # User management queries
├── user.mutations.ts         # User creation and updates
├── companies.queries.ts      # Company data management
├── companies.mutations.ts    # Company operations
├── monitoring.queries.ts     # System monitoring and health checks
├── monitoring.mutations.ts   # Monitoring operations (retry sync, etc.)
├── changelog.queries.ts      # Changelog management
├── changelog.mutations.ts    # Changelog operations
├── searates.queries.ts       # External SeaRates API integration
├── tracking.mutations.ts     # Tracking operations
├── upload.mutations.ts       # File upload operations
├── types.common.ts           # Shared type definitions
└── admin/                    # Admin-specific services
    ├── user.mutations.ts     # Admin user management
    ├── shipment.mutations.ts # Admin shipment operations
    ├── support.queries.ts    # Support ticket management
    ├── support.mutations.ts  # Support operations
    └── assigns.queries.ts    # Credit assignment management
```

### Service Pattern

#### Query Services (Data Fetching)
```typescript
// services/shipment.queries.ts
export const useShipmentList = (params: ShipmentListParams) => {
  return useQuery({
    queryKey: ['shipments', 'list', params],
    queryFn: () => getShipmentList(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!params.companyId, // Conditional fetching
  });
};

// Implementation function
const getShipmentList = async (params: ShipmentListParams) => {
  const response = await apiAxios.get('/shipments', { params });
  return response.data;
};
```

#### Mutation Services (Data Modification)
```typescript
// services/shipment.mutations.ts
export const useCreateShipment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateShipmentData) => createShipment(data),
    onSuccess: (newShipment) => {
      // Update cache with new shipment
      queryClient.invalidateQueries(['shipments', 'list']);
      
      // Optionally add to cache directly
      queryClient.setQueryData(
        ['shipments', 'detail', newShipment.id],
        newShipment
      );
      
      toast.success('Shipment created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create shipment');
    },
  });
};
```

## Authentication Services

### Core Authentication Functions

#### Authentication Service (`services/auth.services.ts`)
```typescript
import { apiAxios } from '@/utils/api.utils';
import { AUTH_KEY } from '@/utils/constants';

// Get current user from token
export const currentUser = async (token: string) => {
  const response = await apiAxios.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.user;
};

// Refresh user data
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: () => {
      const token = localStorage.getItem(AUTH_KEY);
      if (!token) throw new Error('No token found');
      return currentUser(token);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
  });
};
```

#### Authentication Mutations (`services/auth.mutations.ts`)
```typescript
// Login mutation
export const useLogin = () => {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiAxios.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Store token
      localStorage.setItem(AUTH_KEY, data.token);
      
      // Set cookie for SSR
      document.cookie = `${AUTH_KEY}=${data.token}; path=/; max-age=86400`;
      
      // Redirect to dashboard
      router.push('/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: async () => {
      await apiAxios.post('/auth/logout');
    },
    onSettled: () => {
      // Clear local storage
      localStorage.removeItem(AUTH_KEY);
      
      // Clear cookie
      document.cookie = `${AUTH_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
      
      // Clear query cache
      queryClient.clear();
      
      // Redirect to login
      router.push('/signin');
    },
  });
};
```

## Shipment Services

### Shipment Query Services (`services/shipment.queries.ts`)

#### Shipment List
```typescript
export interface ShipmentListParams {
  page?: number;
  limit?: number;
  status?: ShipmentStatus;
  search?: string;
  companyId?: number;
  startDate?: string;
  endDate?: string;
  carrier?: string;
}

export const useShipmentList = (params: ShipmentListParams) => {
  return useQuery({
    queryKey: ['shipments', 'list', params],
    queryFn: async () => {
      const response = await apiAxios.get('/shipments', { params });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true, // For pagination
  });
};
```

#### Shipment Detail
```typescript
export const useShipmentDetail = (id: string) => {
  return useQuery({
    queryKey: ['shipments', 'detail', id],
    queryFn: async () => {
      const response = await apiAxios.get(`/shipments/${id}`);
      return response.data.shipment;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes for live data
  });
};
```

#### Shipment Statistics
```typescript
export const useShipmentStats = (companyId?: number) => {
  return useQuery({
    queryKey: ['shipments', 'stats', companyId],
    queryFn: async () => {
      const params = companyId ? { companyId } : {};
      const response = await apiAxios.get('/shipments/stats', { params });
      return response.data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};
```

### Shipment Mutation Services (`services/shipment.mutations.ts`)

#### Create Shipment
```typescript
export interface CreateShipmentData {
  trackingNumber: string;
  carrier: string;
  trackWith: 'CONTAINER_NUMBER' | 'MBL_NUMBER';
  origin: string;
  destination: string;
  etd?: string;
  eta?: string;
  customerInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
  references?: Array<{
    type: string;
    value: string;
  }>;
}

export const useCreateShipment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateShipmentData) => {
      const response = await apiAxios.post('/shipments', data);
      return response.data.shipment;
    },
    onSuccess: (newShipment) => {
      // Invalidate shipment lists
      queryClient.invalidateQueries(['shipments', 'list']);
      queryClient.invalidateQueries(['shipments', 'stats']);
      
      // Add to detail cache
      queryClient.setQueryData(
        ['shipments', 'detail', newShipment.id],
        newShipment
      );
      
      toast.success('Shipment created successfully');
    },
  });
};
```

#### Bulk Upload
```typescript
export const useBulkShipmentUpload = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiAxios.post('/shipments/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000, // 60 seconds for large files
      });
      
      return response.data;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries(['shipments', 'list']);
      queryClient.invalidateQueries(['shipments', 'stats']);
      
      toast.success(`${result.successful} shipments uploaded successfully`);
      
      if (result.failed > 0) {
        toast.warning(`${result.failed} uploads failed`);
      }
    },
  });
};
```

## User Management Services

### User Query Services (`services/user.queries.ts`)

#### User List
```typescript
export interface UserListParams {
  page?: number;
  limit?: number;
  role?: RoleType;
  companyId?: number;
  isActive?: boolean;
  search?: string;
}

export const useUserList = (params: UserListParams) => {
  return useQuery({
    queryKey: ['users', 'list', params],
    queryFn: async () => {
      const response = await apiAxios.get('/users', { params });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
```

#### User Detail
```typescript
export const useUserDetail = (id: string) => {
  return useQuery({
    queryKey: ['users', 'detail', id],
    queryFn: async () => {
      const response = await apiAxios.get(`/users/${id}`);
      return response.data.user;
    },
    enabled: !!id,
  });
};
```

### User Mutation Services (`services/user.mutations.ts`)

#### Update Profile
```typescript
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await apiAxios.put('/users/profile', data);
      return response.data.user;
    },
    onSuccess: (updatedUser) => {
      // Update current user cache
      queryClient.setQueryData(['auth', 'currentUser'], updatedUser);
      
      // Update user detail cache
      queryClient.setQueryData(
        ['users', 'detail', updatedUser.id],
        updatedUser
      );
      
      toast.success('Profile updated successfully');
    },
  });
};
```

## Company Services

### Company Query Services (`services/companies.queries.ts`)

#### Company List
```typescript
export const useCompanyList = (params: CompanyListParams = {}) => {
  return useQuery({
    queryKey: ['companies', 'list', params],
    queryFn: async () => {
      const response = await apiAxios.get('/companies', { params });
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // Companies don't change often
  });
};
```

#### Company Detail
```typescript
export const useCompanyDetail = (id: string) => {
  return useQuery({
    queryKey: ['companies', 'detail', id],
    queryFn: async () => {
      const response = await apiAxios.get(`/companies/${id}`);
      return response.data.company;
    },
    enabled: !!id,
  });
};
```

## Monitoring Services

### Monitoring Query Services (`services/monitoring.queries.ts`)

#### System Health
```typescript
export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['monitoring', 'health'],
    queryFn: async () => {
      const response = await apiAxios.get('/monitoring/health');
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 15000, // 15 seconds
  });
};
```

#### Failed Syncs
```typescript
export interface FailedSyncsParams {
  hours?: number;
  threshold?: number;
  carrier?: string;
}

export const useFailedSyncs = (params: FailedSyncsParams = {}) => {
  return useQuery({
    queryKey: ['monitoring', 'failed-syncs', params],
    queryFn: async () => {
      const response = await apiAxios.get('/monitoring/failed-syncs', { params });
      return response.data;
    },
    staleTime: 60000, // 1 minute
  });
};
```

#### Sync History
```typescript
export const useSyncHistory = (shipmentId: string, limit: number = 20) => {
  return useQuery({
    queryKey: ['monitoring', 'sync-history', shipmentId, limit],
    queryFn: async () => {
      const response = await apiAxios.get(
        `/monitoring/shipments/${shipmentId}/sync-history`,
        { params: { limit } }
      );
      return response.data;
    },
    enabled: !!shipmentId,
  });
};
```

### Monitoring Mutation Services (`services/monitoring.mutations.ts`)

#### Retry Sync
```typescript
export const useRetrySync = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (shipmentId: string) => {
      const response = await apiAxios.post(`/monitoring/retry-sync/${shipmentId}`);
      return response.data;
    },
    onSuccess: (data, shipmentId) => {
      // Invalidate related queries
      queryClient.invalidateQueries(['monitoring', 'failed-syncs']);
      queryClient.invalidateQueries(['monitoring', 'sync-history', shipmentId]);
      queryClient.invalidateQueries(['shipments', 'detail', shipmentId]);
      
      toast.success('Sync retry initiated successfully');
    },
  });
};
```

## External API Integration

### SeaRates API Integration (`services/searates.queries.ts`)

#### Tracking Data
```typescript
export const useSeaRatesTracking = (
  trackingNumber: string,
  carrier: string
) => {
  return useQuery({
    queryKey: ['searates', 'tracking', trackingNumber, carrier],
    queryFn: async () => {
      const response = await apiAxios.get('/external/searates/track', {
        params: { trackingNumber, carrier }
      });
      return response.data;
    },
    enabled: !!(trackingNumber && carrier),
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404 (not found) or 400 (bad request)
      if (error.response?.status === 404 || error.response?.status === 400) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
```

#### Carrier List
```typescript
export const useCarrierList = () => {
  return useQuery({
    queryKey: ['searates', 'carriers'],
    queryFn: async () => {
      const response = await apiAxios.get('/external/searates/carriers');
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (carriers rarely change)
    cacheTime: 24 * 60 * 60 * 1000,
  });
};
```

## File Upload Services

### Upload Service (`services/upload.mutations.ts`)

#### Single File Upload
```typescript
export const useFileUpload = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiAxios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // Handle progress if needed
        },
      });
      
      return response.data;
    },
    onError: (error) => {
      if (error.response?.status === 413) {
        toast.error('File too large. Maximum size is 10MB.');
      } else {
        toast.error('File upload failed. Please try again.');
      }
    },
  });
};
```

#### Multiple File Upload
```typescript
export const useMultipleFileUpload = () => {
  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });
      
      const response = await apiAxios.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000, // 2 minutes for multiple files
      });
      
      return response.data;
    },
  });
};
```

## Data Types and Interfaces

### Common Types (`services/types.common.ts`)

```typescript
// Base API Response
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data: T;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// Shipment Types
export type ShipmentStatus = 'PLANNED' | 'IN_TRANSIT' | 'DELIVERED' | 'DISCHARGED' | 'UNKNOWN';

export interface Shipment {
  id: number;
  trackingNumber: string;
  carrier: string;
  status: ShipmentStatus;
  trackWith: 'CONTAINER_NUMBER' | 'MBL_NUMBER';
  origin: string;
  destination: string;
  etd?: string;
  eta?: string;
  customerInfo?: CustomerInfo;
  containers?: Container[];
  movements?: Movement[];
  createdAt: string;
  updatedAt: string;
}

// User Types
export type RoleType = 
  | 'SUPER_ADMIN'
  | 'SUB_ADMIN'
  | 'WHITE_LABEL_ADMIN'
  | 'WHITE_LABEL_SUB_ADMIN'
  | 'CLIENT_SUPER_USER'
  | 'CLIENT_USER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: RoleType;
  companyId?: number;
  company?: Company;
  permissions: string[];
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Company Types
export interface Company {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
  settings: CompanySettings;
  createdAt: string;
  updatedAt: string;
}

export interface CompanySettings {
  trackingCredits: number;
  features: string[];
  branding?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
}
```

## Error Handling Patterns

### Global Error Handling

#### API Error Interceptor
```typescript
// utils/api.utils.ts
apiAxios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem(AUTH_KEY);
      window.location.href = '/signin';
      return;
    }
    
    // Handle server errors
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    
    // Handle validation errors
    if (error.response?.status === 400) {
      const message = error.response.data?.message || 'Invalid request';
      toast.error(message);
    }
    
    throw error;
  }
);
```

#### Service-Level Error Handling
```typescript
export const useShipmentDetail = (id: string) => {
  return useQuery({
    queryKey: ['shipments', 'detail', id],
    queryFn: async () => {
      try {
        const response = await apiAxios.get(`/shipments/${id}`);
        return response.data.shipment;
      } catch (error) {
        if (error.response?.status === 404) {
          throw new Error('Shipment not found');
        }
        throw error;
      }
    },
    enabled: !!id,
    onError: (error) => {
      console.error('Failed to fetch shipment:', error);
    },
  });
};
```

## Caching Strategies

### Query Key Patterns

#### Hierarchical Query Keys
```typescript
// Good - Hierarchical and specific
['shipments', 'list', { page: 1, status: 'IN_TRANSIT' }]
['shipments', 'detail', shipmentId]
['users', 'list', { companyId: 123 }]
['monitoring', 'failed-syncs', { hours: 24 }]

// Avoid - Flat and non-specific
['shipmentsList']
['shipment123']
['failedSyncs']
```

#### Cache Invalidation Patterns
```typescript
// Specific invalidation
queryClient.invalidateQueries(['shipments', 'list']);

// Broader invalidation
queryClient.invalidateQueries(['shipments']);

// Conditional invalidation
queryClient.invalidateQueries({
  queryKey: ['shipments', 'list'],
  predicate: (query) => {
    const params = query.queryKey[2] as any;
    return params?.companyId === updatedShipment.companyId;
  },
});
```

### Optimistic Updates

#### Example: Update Shipment Status
```typescript
export const useUpdateShipmentStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ShipmentStatus }) => {
      const response = await apiAxios.patch(`/shipments/${id}/status`, { status });
      return response.data.shipment;
    },
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['shipments', 'detail', id]);
      
      // Snapshot current value
      const previousShipment = queryClient.getQueryData(['shipments', 'detail', id]);
      
      // Optimistically update
      queryClient.setQueryData(['shipments', 'detail', id], (old: any) => ({
        ...old,
        status,
        updatedAt: new Date().toISOString(),
      }));
      
      return { previousShipment };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousShipment) {
        queryClient.setQueryData(
          ['shipments', 'detail', variables.id],
          context.previousShipment
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries(['shipments', 'detail', variables.id]);
      queryClient.invalidateQueries(['shipments', 'list']);
    },
  });
};
```

## Performance Optimization

### Query Optimization

#### Selective Data Fetching
```typescript
export const useShipmentSummary = (id: string) => {
  return useQuery({
    queryKey: ['shipments', 'summary', id],
    queryFn: async () => {
      const response = await apiAxios.get(`/shipments/${id}/summary`);
      return response.data;
    },
    enabled: !!id,
    select: (data) => ({
      // Transform data to only include needed fields
      id: data.id,
      trackingNumber: data.trackingNumber,
      status: data.status,
      carrier: data.carrier,
    }),
  });
};
```

#### Background Refetching
```typescript
export const useShipmentDetail = (id: string) => {
  return useQuery({
    queryKey: ['shipments', 'detail', id],
    queryFn: () => getShipmentDetail(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 60 * 1000, // 30 minutes background refetch
    refetchIntervalInBackground: true,
  });
};
```

### Memory Management

#### Query Cleanup
```typescript
// Set shorter cache times for large datasets
export const useLargeShipmentList = (params: ShipmentListParams) => {
  return useQuery({
    queryKey: ['shipments', 'large-list', params],
    queryFn: () => getLargeShipmentList(params),
    cacheTime: 5 * 60 * 1000, // 5 minutes instead of default 10
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
```

## Testing Services

### Service Testing Patterns

#### Mocking Services
```typescript
// __tests__/services/shipment.queries.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useShipmentList } from '@/services/shipment.queries';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useShipmentList', () => {
  it('should fetch shipment list successfully', async () => {
    const { result } = renderHook(
      () => useShipmentList({ page: 1, limit: 10 }),
      { wrapper: createWrapper() }
    );
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    
    expect(result.current.data).toBeDefined();
  });
});
```

#### Integration Testing
```typescript
// __tests__/services/integration.test.ts
describe('Service Integration', () => {
  it('should create shipment and update cache', async () => {
    const queryClient = new QueryClient();
    const { result } = renderHook(() => useCreateShipment(), {
      wrapper: createWrapper(queryClient),
    });
    
    const shipmentData = {
      trackingNumber: 'TEST123',
      carrier: 'MAERSK',
      trackWith: 'CONTAINER_NUMBER' as const,
      origin: 'Shanghai',
      destination: 'Los Angeles',
    };
    
    await act(async () => {
      result.current.mutate(shipmentData);
    });
    
    // Verify cache was updated
    const listQuery = queryClient.getQueryData(['shipments', 'list']);
    expect(listQuery).toBeDefined();
  });
});
```

This comprehensive services documentation provides all the necessary information for understanding and working with the FrateZone data layer and external integrations.