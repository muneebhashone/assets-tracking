# Monitoring API Documentation

**Base URL:** `{your-domain}/api`

---

## Get Sync Health Status

**API Route:** `/monitoring/health`  
**Method:** `GET`  
**Response Type:** `200 OK`  
**Error Type:** `500 Internal Server Error`  
**Inputs:** None

### Response Body

```json
{
  "status": "success",
  "message": "Sync health retrieved successfully",
  "data": {
    "totalActive": 150,
    "recentFailures": 5,
    "avgResponseTime": 1250,
    "successRate": 94.5,
    "status": "healthy",
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  }
}
```

### Status Values

- `healthy` - Success rate > 80% and failures < 10
- `warning` - Success rate 50-80% or failures 10-20
- `critical` - Success rate < 50% or failures > 20

---

## Get Shipment Sync History

**API Route:** `/monitoring/shipments/:id/sync-history`  
**Method:** `GET`  
**Response Type:** `200 OK`  
**Error Type:** `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`  
**Inputs:**

- **Path Parameters:**
  - `id` (required): Shipment ID (positive integer)
- **Query Parameters:**
  - `limit` (optional): Number of records to return (1-100, default: 20)

### Response Body

```json
{
  "status": "success",
  "message": "Sync history retrieved successfully",
  "data": [
    {
      "id": 1,
      "shipmentId": 123,
      "success": true,
      "error": null,
      "timestamp": "2024-01-15T10:30:00.000Z",
      "attemptNumber": 1,
      "apiResponseTime": 1250
    },
    {
      "id": 2,
      "shipmentId": 123,
      "success": false,
      "error": "API timeout",
      "timestamp": "2024-01-15T09:30:00.000Z",
      "attemptNumber": 2,
      "apiResponseTime": 30000
    }
  ]
}
```

---

## Get Failed Syncs

**API Route:** `/monitoring/failed-syncs`  
**Method:** `GET`  
**Response Type:** `200 OK`  
**Error Type:** `400 Bad Request`, `500 Internal Server Error`  
**Inputs:**

- **Query Parameters:**
  - `hours` (optional): Hours to look back (1-168, default: 24)
  - `threshold` (optional): Failure count threshold (positive integer, default: 3)

### Response Body

```json
{
  "status": "success",
  "message": "Failed syncs retrieved successfully",
  "data": [
    {
      "shipmentId": 123,
      "carrier": "MAERSK",
      "trackingNumber": "MSKU1234567",
      "lastSyncAttempt": "2024-01-15T08:30:00.000Z",
      "failureCount": 5,
      "recentErrors": [
        "API timeout",
        "Invalid API response structure",
        "Circuit breaker is OPEN"
      ]
    }
  ]
}
```

---

## Retry Sync for Shipment

**API Route:** `/monitoring/retry-sync/:id`  
**Method:** `POST`  
**Response Type:** `200 OK`  
**Error Type:** `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`  
**Inputs:**

- **Path Parameters:**
  - `id` (required): Shipment ID (positive integer)

### Success Response Body

```json
{
  "status": "success",
  "message": "Sync retry initiated successfully",
  "data": {
    "success": true,
    "message": "Sync retry initiated for shipment 123",
    "jobId": "shipment:123"
  }
}
```

### Error Response Body

```json
{
  "status": "error",
  "message": "Failed to retry sync",
  "data": {
    "success": false,
    "message": "Shipment not found"
  }
}
```

---

## Get Sync Statistics

**API Route:** `/monitoring/stats`  
**Method:** `GET`  
**Response Type:** `200 OK`  
**Error Type:** `400 Bad Request`, `500 Internal Server Error`  
**Inputs:**

- **Query Parameters:**
  - `days` (optional): Number of days to analyze (1-30, default: 7)

### Response Body

```json
{
  "status": "success",
  "message": "Sync statistics retrieved successfully",
  "data": {
    "dailyStats": [
      {
        "date": "2024-01-15",
        "attempts": 150,
        "successes": 142,
        "failures": 8,
        "avgResponseTime": 1250
      },
      {
        "date": "2024-01-14",
        "attempts": 145,
        "successes": 140,
        "failures": 5,
        "avgResponseTime": 1180
      }
    ],
    "topFailureReasons": [
      {
        "error": "API timeout",
        "count": 25
      },
      {
        "error": "Invalid API response structure",
        "count": 12
      },
      {
        "error": "Circuit breaker is OPEN",
        "count": 8
      }
    ]
  }
}
```

---

## Get Circuit Breaker Status

**API Route:** `/monitoring/circuit-breaker`  
**Method:** `GET`  
**Response Type:** `200 OK`  
**Error Type:** `500 Internal Server Error`  
**Inputs:** None

### Response Body

```json
{
  "status": "success",
  "message": "Circuit breaker status retrieved successfully",
  "data": {
    "state": "CLOSED",
    "failureCount": 2,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Circuit Breaker States

- `CLOSED` - Normal operation, requests allowed
- `OPEN` - Circuit breaker triggered, requests blocked
- `HALF_OPEN` - Testing if service has recovered

---

## Common Error Responses

### 400 Bad Request

```json
{
  "status": "error",
  "message": "Invalid input",
  "data": {
    "issues": [
      {
        "path": ["id"],
        "message": "Expected number, received string"
      }
    ]
  }
}
```

### 404 Not Found

```json
{
  "status": "error",
  "message": "Shipment not found"
}
```

### 500 Internal Server Error

```json
{
  "status": "error",
  "message": "Database connection failed"
}
```

---

## Authentication

All monitoring endpoints require valid authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Rate Limiting

Monitoring endpoints are subject to rate limiting:

- **Health endpoint:** 60 requests per minute
- **Other endpoints:** 30 requests per minute

---

## Usage Examples

### Check Overall Sync Health

```bash
curl -X GET \
  "{base-url}/api/monitoring/health" \
  -H "Authorization: Bearer <token>"
```

### Get Sync History for Specific Shipment

```bash
curl -X GET \
  "{base-url}/api/monitoring/shipments/123/sync-history?limit=10" \
  -H "Authorization: Bearer <token>"
```

### Retry Failed Sync

```bash
curl -X POST \
  "{base-url}/api/monitoring/retry-sync/123" \
  -H "Authorization: Bearer <token>"
```

### Get Weekly Statistics

```bash
curl -X GET \
  "{base-url}/api/monitoring/stats?days=7" \
  -H "Authorization: Bearer <token>"
```
