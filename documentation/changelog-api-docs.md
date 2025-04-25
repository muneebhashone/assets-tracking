# Changelog API Documentation

## Base URL

```
/api/changelogs
```

## Data Model

### Changelog Object

| Field         | Type   | Description                   |
| ------------- | ------ | ----------------------------- |
| `id`          | number | Unique identifier             |
| `title`       | string | Title of the changelog        |
| `description` | string | Detailed description          |
| `type`        | enum   | Type of changelog (see below) |
| `releaseDate` | string | ISO date string of release    |
| `changes`     | object | Details of changes            |
| `createdBy`   | number | User ID who created the entry |
| `createdAt`   | string | Creation timestamp            |
| `updatedAt`   | string | Last update timestamp         |

### Type Enum Values

- `FEATURE`
- `BUGFIX`
- `SECURITY`
- `IMPROVEMENT`
- `BREAKING_CHANGE`

### Changes Object Structure

```json
{
  "features": ["Feature 1", "Feature 2"],
  "fixes": ["Fix 1", "Fix 2"],
  "improvements": ["Improvement 1", "Improvement 2"]
}
```

## Endpoints

### Get All Changelogs

```
GET /api/changelogs
```

**Query Parameters:**

- `limitParam` (optional): Number of results per page (default: 10)
- `pageParam` (optional): Page number (default: 1)
- `type` (optional): Filter by changelog type

**Response:**

```json
{
  "data": [Changelog objects],
  "meta": {
    "total": number,
    "page": number,
    "limit": number
  }
}
```

**Access:** Public (all roles)

### Get Changelog by ID

```
GET /api/changelogs/:id
```

**Parameters:**

- `id`: Changelog ID (in path)

**Response:** Single Changelog object

**Access:** Public (all roles)

### Create Changelog

```
POST /api/changelogs
```

**Request Body:**

```json
{
  "title": "string (required)",
  "description": "string (required)",
  "type": "enum (required)",
  "releaseDate": "string (optional)",
  "changes": {
    "features": ["string"] (optional),
    "fixes": ["string"] (optional),
    "improvements": ["string"] (optional)
  }
}
```

**Response:** Created Changelog object

**Access:** SUPER_ADMIN only

### Update Changelog

```
PUT /api/changelogs/:id
```

**Parameters:**

- `id`: Changelog ID (in path)

**Request Body:** Same as Create (all fields optional)

**Response:** Updated Changelog object

**Access:** SUPER_ADMIN only

### Delete Changelog

```
DELETE /api/changelogs/:id
```

**Parameters:**

- `id`: Changelog ID (in path)

**Response:** 204 No Content

**Access:** SUPER_ADMIN only

## Error Responses

| Status | Description                            |
| ------ | -------------------------------------- |
| 400    | Bad Request - Invalid input data       |
| 401    | Unauthorized - Authentication required |
| 403    | Forbidden - Insufficient permissions   |
| 404    | Not Found - Changelog doesn't exist    |
| 500    | Server Error                           |
