# FrateZone - API Documentation

## Overview

FrateZone's frontend communicates with a backend API service through a well-structured service layer. The API follows RESTful principles with JWT-based authentication and comprehensive error handling.

## API Configuration

### Base Configuration
**File**: `utils/api.utils.ts:4-42`

```typescript
export const apiAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  withCredentials: true,
});
```

**Environment Variable**: `NEXT_PUBLIC_API_URL`
- **Development**: `http://localhost:8000` (or your backend URL)
- **Production**: Your production API domain

### Authentication System

#### Token Management
- **Storage**: HTTP-only cookies + localStorage for client-side access
- **Header**: `Authorization: Bearer <token>`
- **Automatic Injection**: Request interceptor adds token to all requests
- **Error Handling**: Automatic logout on 401 responses

```typescript
// Request interceptor for authentication
apiAxios.interceptors.request.use((config) => {
  try {
    if (typeof localStorage.getItem(AUTH_KEY) === "string") {
      config.headers["Authorization"] = `Bearer ${localStorage.getItem(AUTH_KEY)}`;
    }
  } catch {}
  return config;
});
```

## Service Layer Architecture

### Service Organization
Services are organized by domain in the `services/` directory:

```
services/
├── auth.services.ts          # Authentication services
├── shipment.queries.ts       # Shipment data operations
├── user.queries.ts           # User management
├── companies.queries.ts      # Company operations
├── monitoring.queries.ts     # System monitoring
├── changelog.queries.ts      # Changelog management
├── searates.queries.ts       # External API integration
├── upload.mutations.ts       # File upload operations
└── admin/                    # Admin-specific operations
    ├── user.mutations.ts
    ├── shipment.mutations.ts
    ├── support.queries.ts
    └── assigns.queries.ts
```

### Query vs Mutation Pattern
- **Queries**: Data fetching operations (GET requests)
- **Mutations**: Data modification operations (POST, PUT, DELETE)

## Authentication API

### Login
**Service**: `services/auth.mutations.ts`

```typescript
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => 
      apiAxios.post('/auth/login', credentials),
    onSuccess: (response) => {
      // Store token and redirect
      localStorage.setItem(AUTH_KEY, response.data.token);
    },
  });
};
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "status": "success",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "CLIENT_USER",
    "permissions": ["VIEW_SHIPMENT", "CREATE_SHIPMENT"]
  }
}
```

### Current User
**Service**: `services/auth.services.ts`

```typescript
export const currentUser = async (token: string) => {
  const response = await apiAxios.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

### Logout
```typescript
export const useLogout = () => {
  return useMutation({
    mutationFn: () => apiAxios.post('/auth/logout'),
    onSuccess: () => {
      localStorage.removeItem(AUTH_KEY);
      // Redirect to login
    },
  });
};
```

## Shipment API

### Shipment List
**Service**: `services/shipment.queries.ts`

```typescript
export const useShipmentList = (params: ShipmentListParams) => {
  return useQuery({
    queryKey: ['shipments', 'list', params],
    queryFn: () => apiAxios.get('/shipments', { params }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (`PLANNED`, `IN_TRANSIT`, `DELIVERED`, `DISCHARGED`, `UNKNOWN`)
- `search`: Search term for tracking numbers, container numbers
- `companyId`: Filter by company (admin only)
- `startDate`: Date range start
- `endDate`: Date range end

**Response**:
```json
{
  "status": "success",
  "data": {
    "shipments": [
      {
        "id": 123,
        "trackingNumber": "MSKU1234567",
        "carrier": "MAERSK",
        "status": "IN_TRANSIT",
        "origin": "Shanghai",
        "destination": "Los Angeles",
        "etd": "2024-01-15T08:00:00Z",
        "eta": "2024-01-30T18:00:00Z",
        "createdAt": "2024-01-10T10:00:00Z",
        "updatedAt": "2024-01-15T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15
    }
  }
}
```

### Shipment Detail
```typescript
export const useShipmentDetail = (id: string) => {
  return useQuery({
    queryKey: ['shipments', 'detail', id],
    queryFn: () => apiAxios.get(`/shipments/${id}`),
    enabled: !!id,
  });
};
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "shipment": {
      "id": 123,
      "trackingNumber": "MSKU1234567",
      "carrier": "MAERSK",
      "status": "IN_TRANSIT",
      "trackWith": "CONTAINER_NUMBER",
      "origin": {
        "port": "Shanghai",
        "country": "China",
        "coordinates": [121.4737, 31.2304]
      },
      "destination": {
        "port": "Los Angeles",
        "country": "USA",
        "coordinates": [-118.2437, 34.0522]
      },
      "containers": [
        {
          "number": "MSKU1234567",
          "type": "20GP",
          "status": "IN_TRANSIT",
          "movements": [
            {
              "location": "Shanghai Port",
              "event": "LOADED",
              "timestamp": "2024-01-15T08:00:00Z",
              "vessel": "MAERSK ESSEX"
            }
          ]
        }
      ],
      "route": {
        "currentLocation": {
          "lat": 35.6762,
          "lng": 139.6503
        },
        "path": [
          [121.4737, 31.2304],
          [139.6503, 35.6762],
          [-118.2437, 34.0522]
        ]
      },
      "timeline": [
        {
          "date": "2024-01-15T08:00:00Z",
          "event": "Container loaded at Shanghai",
          "status": "COMPLETED"
        },
        {
          "date": "2024-01-30T18:00:00Z",
          "event": "Expected arrival at Los Angeles",
          "status": "PLANNED"
        }
      ]
    }
  }
}
```

### Create Shipment
```typescript
export const useCreateShipment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateShipmentData) => 
      apiAxios.post('/shipments', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['shipments', 'list']);
    },
  });
};
```

**Request Body**:
```json
{
  "trackingNumber": "MSKU1234567",
  "carrier": "MAERSK",
  "trackWith": "CONTAINER_NUMBER",
  "origin": "Shanghai",
  "destination": "Los Angeles",
  "etd": "2024-01-15T08:00:00Z",
  "eta": "2024-01-30T18:00:00Z",
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "references": [
    {
      "type": "BOOKING_NUMBER",
      "value": "BK123456"
    }
  ]
}
```

### Bulk Shipment Upload
```typescript
export const useBulkShipmentUpload = () => {
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiAxios.post('/shipments/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  });
};
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "processed": 100,
    "successful": 95,
    "failed": 5,
    "errors": [
      {
        "row": 6,
        "error": "Invalid tracking number format",
        "data": { "trackingNumber": "INVALID123" }
      }
    ]
  }
}
```

## User Management API

### User List
**Service**: `services/user.queries.ts`

```typescript
export const useUserList = (params: UserListParams) => {
  return useQuery({
    queryKey: ['users', 'list', params],
    queryFn: () => apiAxios.get('/users', { params }),
  });
};
```

**Query Parameters**:
- `page`: Page number
- `limit`: Items per page
- `role`: Filter by user role
- `companyId`: Filter by company
- `isActive`: Filter by active status
- `search`: Search in name, email

### Create User
**Service**: `services/admin/user.mutations.ts`

```typescript
export const useCreateUser = () => {
  return useMutation({
    mutationFn: (data: CreateUserData) => 
      apiAxios.post('/admin/users', data),
  });
};
```

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "CLIENT_USER",
  "companyId": 123,
  "permissions": ["VIEW_SHIPMENT", "CREATE_SHIPMENT"],
  "isActive": true
}
```

## Company Management API

### Company List
**Service**: `services/companies.queries.ts`

```typescript
export const useCompanyList = (params: CompanyListParams) => {
  return useQuery({
    queryKey: ['companies', 'list', params],
    queryFn: () => apiAxios.get('/companies', { params }),
  });
};
```

### Create Company
```typescript
export const useCreateCompany = () => {
  return useMutation({
    mutationFn: (data: CreateCompanyData) => 
      apiAxios.post('/companies', data),
  });
};
```

**Request Body**:
```json
{
  "name": "Acme Logistics",
  "email": "contact@acme.com",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "settings": {
    "trackingCredits": 1000,
    "features": ["BULK_UPLOAD", "API_ACCESS"]
  }
}
```

## Monitoring API

### System Health
**Service**: `services/monitoring.queries.ts`

```typescript
export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['monitoring', 'health'],
    queryFn: () => apiAxios.get('/monitoring/health'),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "totalActive": 150,
    "recentFailures": 5,
    "avgResponseTime": 1250,
    "successRate": 94.5,
    "status": "healthy",
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}
```

### Failed Syncs
**Reference**: `api-documentation/monitoring-api.md:84-117`

```typescript
export const useFailedSyncs = (params: FailedSyncsParams) => {
  return useQuery({
    queryKey: ['monitoring', 'failed-syncs', params],
    queryFn: () => apiAxios.get('/monitoring/failed-syncs', { params }),
  });
};
```

**Query Parameters**:
- `hours`: Hours to look back (1-168, default: 24)
- `threshold`: Failure count threshold (default: 3)

### Retry Sync
```typescript
export const useRetrySync = () => {
  return useMutation({
    mutationFn: (shipmentId: string) => 
      apiAxios.post(`/monitoring/retry-sync/${shipmentId}`),
  });
};
```

### Sync History
```typescript
export const useSyncHistory = (shipmentId: string, limit?: number) => {
  return useQuery({
    queryKey: ['monitoring', 'sync-history', shipmentId, limit],
    queryFn: () => apiAxios.get(`/monitoring/shipments/${shipmentId}/sync-history`, {
      params: { limit }
    }),
    enabled: !!shipmentId,
  });
};
```

## Support System API

### Support Tickets
**Service**: `services/admin/support.queries.ts`

```typescript
export const useSupportTickets = (params: SupportTicketsParams) => {
  return useQuery({
    queryKey: ['support', 'tickets', params],
    queryFn: () => apiAxios.get('/admin/support', { params }),
  });
};
```

### Create Support Ticket
```typescript
export const useCreateSupportTicket = () => {
  return useMutation({
    mutationFn: (data: CreateSupportTicketData) => 
      apiAxios.post('/support', data),
  });
};
```

**Request Body**:
```json
{
  "subject": "Issue with shipment tracking",
  "description": "Unable to track shipment MSKU1234567",
  "priority": "MEDIUM",
  "category": "TRACKING_ISSUE",
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "attachments": ["file1.jpg", "file2.pdf"]
}
```

## Changelog API

### Changelog List
**Service**: `services/changelog.queries.ts`

```typescript
export const useChangelogList = (params: ChangelogParams) => {
  return useQuery({
    queryKey: ['changelog', 'list', params],
    queryFn: () => apiAxios.get('/changelog', { params }),
  });
};
```

### Create Changelog
```typescript
export const useCreateChangelog = () => {
  return useMutation({
    mutationFn: (data: CreateChangelogData) => 
      apiAxios.post('/changelog', data),
  });
};
```

**Request Body**:
```json
{
  "version": "2.1.0",
  "title": "Enhanced Monitoring Dashboard",
  "description": "Added new monitoring features and improved performance",
  "type": "FEATURE",
  "changes": [
    "Added real-time sync monitoring",
    "Improved error reporting",
    "Enhanced user interface"
  ],
  "releaseDate": "2024-01-15T00:00:00Z"
}
```

## File Upload API

### File Upload
**Service**: `services/upload.mutations.ts`

```typescript
export const useFileUpload = () => {
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiAxios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  });
};
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "filename": "document.pdf",
    "url": "/bucket/uploads/uuid-document.pdf",
    "size": 1024576,
    "type": "application/pdf"
  }
}
```

## External API Integration

### SeaRates API
**Service**: `services/searates.queries.ts`

```typescript
export const useSeaRatesTracking = (trackingNumber: string, carrier: string) => {
  return useQuery({
    queryKey: ['searates', 'tracking', trackingNumber, carrier],
    queryFn: () => apiAxios.get('/external/searates/track', {
      params: { trackingNumber, carrier }
    }),
    enabled: !!(trackingNumber && carrier),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};
```

### Carrier List
```typescript
export const useCarrierList = () => {
  return useQuery({
    queryKey: ['searates', 'carriers'],
    queryFn: () => apiAxios.get('/external/searates/carriers'),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
```

## Error Handling

### Error Response Format
All API errors follow a consistent format:

```json
{
  "status": "error",
  "message": "Validation failed",
  "data": {
    "issues": [
      {
        "path": ["trackingNumber"],
        "message": "Tracking number is required"
      }
    ]
  }
}
```

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/expired token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **429**: Too Many Requests (rate limited)
- **500**: Internal Server Error

### Error Handling in Services
```typescript
export const useShipmentList = (params: ShipmentListParams) => {
  return useQuery({
    queryKey: ['shipments', 'list', params],
    queryFn: () => apiAxios.get('/shipments', { params }),
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    onError: (error) => {
      // Global error handling
      if (error.response?.status === 401) {
        // Redirect to login
        window.location.href = '/signin';
      }
    },
  });
};
```

## Rate Limiting

### Rate Limit Headers
The API includes rate limiting information in response headers:
- `X-RateLimit-Limit`: Maximum requests per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when window resets

### Rate Limits by Endpoint
- **Authentication**: 5 requests per minute
- **Shipment Operations**: 100 requests per minute
- **Monitoring**: 30 requests per minute
- **File Upload**: 10 requests per minute

## Pagination

### Standard Pagination
Most list endpoints support pagination:

**Query Parameters**:
- `page`: Page number (starts from 1)
- `limit`: Items per page (max 100)

**Response Format**:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Cursor-based Pagination
For real-time data endpoints:

**Query Parameters**:
- `cursor`: Cursor for next page
- `limit`: Items per page

**Response Format**:
```json
{
  "data": [...],
  "pagination": {
    "nextCursor": "eyJpZCI6MTIzfQ==",
    "hasMore": true
  }
}
```

## Caching Strategy

### React Query Configuration
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 3,
    },
  },
});
```

### Cache Invalidation Patterns
```typescript
// Invalidate specific queries
queryClient.invalidateQueries(['shipments', 'list']);

// Invalidate all shipment queries
queryClient.invalidateQueries(['shipments']);

// Remove specific query from cache
queryClient.removeQueries(['shipments', 'detail', shipmentId]);

// Set query data manually
queryClient.setQueryData(['shipments', 'detail', shipmentId], newData);
```

## API Testing

### Testing with React Query
```typescript
// Mock service for testing
const mockShipmentList = {
  data: {
    shipments: [
      { id: 1, trackingNumber: 'TEST123', status: 'IN_TRANSIT' }
    ],
    pagination: { page: 1, limit: 10, total: 1, totalPages: 1 }
  }
};

// Test hook
const { result } = renderHook(() => useShipmentList({}), {
  wrapper: createWrapper(queryClient),
});

expect(result.current.data).toEqual(mockShipmentList.data);
```

### API Mocking
For development and testing, you can mock API responses:

```typescript
// Mock successful response
apiAxios.defaults.adapter = (config) => {
  return Promise.resolve({
    data: mockData,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  });
};
```

## Security Considerations

### API Security Best Practices
1. **Authentication**: All protected endpoints require valid JWT tokens
2. **Authorization**: Role-based access control on all endpoints
3. **Input Validation**: Server-side validation for all inputs
4. **Rate Limiting**: Prevents abuse and DoS attacks
5. **CORS**: Configured for specific origins only
6. **HTTPS**: All communication encrypted in production

### Token Security
- **Storage**: Secure HTTP-only cookies for server-side operations
- **Expiration**: Tokens have reasonable expiration times
- **Refresh**: Automatic token refresh mechanism
- **Logout**: Proper token cleanup on logout

## Integration Guide

### Adding New API Endpoints

1. **Create Service Function**:
```typescript
// services/new-feature.queries.ts
export const useNewFeature = (params: NewFeatureParams) => {
  return useQuery({
    queryKey: ['new-feature', params],
    queryFn: () => apiAxios.get('/new-feature', { params }),
  });
};
```

2. **Add Type Definitions**:
```typescript
// types/new-feature.types.ts
export interface NewFeatureParams {
  id: string;
  filters?: FilterOptions;
}

export interface NewFeatureResponse {
  data: NewFeatureData[];
  pagination: PaginationInfo;
}
```

3. **Use in Components**:
```typescript
// components/NewFeatureComponent.tsx
export function NewFeatureComponent() {
  const { data, isLoading, error } = useNewFeature({ id: '123' });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

This comprehensive API documentation provides all the necessary information for understanding and integrating with the FrateZone API system.