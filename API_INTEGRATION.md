# Funifier API Integration Guide

This document provides detailed information about how the Character Star Stats Studio integrates with the Funifier API.

## Base Configuration

### API Endpoint
- **Default URL**: `https://service2.funifier.com`
- **API Version**: v3
- **Base Path**: `/v3/characterstarstats`

### Authentication
All API requests require a bearer token in the Authorization header:

```http
Authorization: Bearer <your-token-here>
```

The token is configured during the initial authentication flow and stored securely in the browser's localStorage.

## API Endpoints

### Areas

#### List All Areas
```http
GET /v3/characterstarstats
```

**Response:**
```json
[
  {
    "_id": "combat-skills",
    "title": "Combat Skills"
  },
  {
    "_id": "social-skills",
    "title": "Social Skills"
  }
]
```

#### Get Area Details
```http
GET /v3/characterstarstats/area/:id
```

**Parameters:**
- `id` (path) - Area ID

**Response:**
```json
{
  "_id": "combat-skills",
  "title": "Combat Skills"
}
```

#### Create Area
```http
POST /v3/characterstarstats/area
Content-Type: application/json
```

**Request Body:**
```json
{
  "_id": "combat-skills",
  "title": "Combat Skills"
}
```

**Validation Rules:**
- `_id`: Required, must be unique, lowercase letters/numbers/hyphens only
- `title`: Required, display name for the area

**Response:**
```json
{
  "_id": "combat-skills",
  "title": "Combat Skills"
}
```

#### Delete Area
```http
DELETE /v3/characterstarstats/area/:id
```

**Parameters:**
- `id` (path) - Area ID to delete

**Response:**
```json
{
  "success": true
}
```

**Note:** Deleting an area may also delete associated levels depending on API configuration.

---

### Levels

#### List Levels
```http
GET /v3/characterstarstats/level
```

**Query Parameters:**
- `area` (optional) - Filter by area ID
- `orderby` (optional) - Field to sort by (e.g., "position")
- `reverse` (optional) - Reverse sort order (true/false)

**Example:**
```http
GET /v3/characterstarstats/level?area=combat-skills&orderby=position
```

**Response:**
```json
[
  {
    "_id": "level-id-1",
    "area": "combat-skills",
    "level": "Beginner",
    "position": 0,
    "minPoints": 0
  },
  {
    "_id": "level-id-2",
    "area": "combat-skills",
    "level": "Intermediate",
    "position": 1,
    "minPoints": 100
  }
]
```

#### Get Level Details
```http
GET /v3/characterstarstats/level/:id
```

**Parameters:**
- `id` (path) - Level ID

**Response:**
```json
{
  "_id": "level-id-1",
  "area": "combat-skills",
  "level": "Beginner",
  "position": 0,
  "minPoints": 0
}
```

#### Create Level
```http
POST /v3/characterstarstats/level
Content-Type: application/json
```

**Request Body:**
```json
{
  "area": "combat-skills",
  "level": "Beginner",
  "position": 0,
  "minPoints": 0
}
```

**Validation Rules:**
- `area`: Required, must reference an existing area ID
- `level`: Required, display name for the level
- `position`: Required, non-negative integer (0-based ordering)
- `minPoints`: Required, non-negative integer (points threshold)

**Response:**
```json
{
  "_id": "generated-level-id",
  "area": "combat-skills",
  "level": "Beginner",
  "position": 0,
  "minPoints": 0
}
```

#### Delete Level
```http
DELETE /v3/characterstarstats/level/:id
```

**Parameters:**
- `id` (path) - Level ID to delete

**Response:**
```json
{
  "success": true
}
```

---

### Player Evaluation

#### Evaluate Player Progress
```http
GET /v3/characterstarstats/player/:id
```

**Parameters:**
- `id` (path) - Player ID

**Response:**
```json
{
  "player": "player-123",
  "stats": [
    {
      "area": "combat-skills",
      "percent_completed": 45.5,
      "next_points": 55,
      "next_level": {
        "_id": "level-id-2",
        "area": "combat-skills",
        "level": "Intermediate",
        "position": 1,
        "minPoints": 100
      },
      "total_levels": 5
    },
    {
      "area": "social-skills",
      "percent_completed": 100,
      "next_points": 0,
      "next_level": null,
      "total_levels": 3
    }
  ]
}
```

**Response Fields:**
- `player`: Player ID
- `stats`: Array of area statistics
  - `area`: Area ID
  - `percent_completed`: Progress percentage (0-100)
  - `next_points`: Points needed to reach next level (0 if completed)
  - `next_level`: Next level object or null if completed
  - `total_levels`: Total number of levels in this area

---

## Error Handling

### HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data or validation error
- `401 Unauthorized` - Missing or invalid bearer token
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Error Response Format

```json
{
  "error": {
    "message": "Validation failed",
    "details": "Area ID must be unique"
  }
}
```

### Common Errors

#### Authentication Error (401)
```json
{
  "error": {
    "message": "Unauthorized",
    "details": "Invalid or missing bearer token"
  }
}
```

**Solution:** Verify your bearer token and re-authenticate if necessary.

#### Validation Error (400)
```json
{
  "error": {
    "message": "Validation failed",
    "details": "Area ID already exists"
  }
}
```

**Solution:** Check the validation rules and ensure all required fields are provided correctly.

#### Not Found Error (404)
```json
{
  "error": {
    "message": "Resource not found",
    "details": "Area with ID 'invalid-id' does not exist"
  }
}
```

**Solution:** Verify the resource ID exists before attempting to access or modify it.

---

## Implementation in the Studio

### API Service Class

The studio uses a centralized `FunifierAPIService` class located in `src/services/FunifierAPIService.ts`:

```typescript
class FunifierAPIService {
  constructor(config: AuthConfig);
  
  // Area methods
  getAreas(): Promise<Area[]>;
  getArea(id: string): Promise<Area>;
  createArea(area: CreateAreaRequest): Promise<Area>;
  deleteArea(id: string): Promise<void>;
  
  // Level methods
  getLevels(params?: LevelQueryParams): Promise<Level[]>;
  getLevel(id: string): Promise<Level>;
  createLevel(level: CreateLevelRequest): Promise<Level>;
  deleteLevel(id: string): Promise<void>;
  
  // Player evaluation
  evaluatePlayer(playerId: string): Promise<PlayerStats>;
}
```

### Request Interceptors

All requests automatically include:
- `Authorization` header with bearer token
- `Content-Type: application/json` for POST requests
- Error transformation for user-friendly messages

### Error Transformation

API errors are transformed into user-friendly messages:

```typescript
// API Error
{ error: { message: "Validation failed", details: "..." } }

// Transformed Error
"Validation failed: ..."
```

---

## Rate Limiting

The Funifier API may implement rate limiting. If you encounter rate limit errors:

1. Implement exponential backoff
2. Cache responses where appropriate
3. Batch operations when possible

---

## Best Practices

### 1. Always Validate Before Sending
Validate data on the client side before making API requests to reduce unnecessary calls.

### 2. Handle Errors Gracefully
Always implement proper error handling and display user-friendly messages.

### 3. Use Appropriate HTTP Methods
- `GET` for reading data
- `POST` for creating resources
- `DELETE` for removing resources

### 4. Secure Token Storage
Store bearer tokens securely and never expose them in client-side code or logs.

### 5. Implement Loading States
Show loading indicators during API calls to improve user experience.

---

## Testing API Integration

### Using cURL

Test authentication:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://service2.funifier.com/v3/characterstarstats
```

Create an area:
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"_id":"test-area","title":"Test Area"}' \
  https://service2.funifier.com/v3/characterstarstats/area
```

### Using Postman

1. Create a new request
2. Set the method (GET, POST, DELETE)
3. Add the Authorization header: `Bearer YOUR_TOKEN`
4. Set the URL to the appropriate endpoint
5. For POST requests, add the JSON body
6. Send the request and verify the response

---

## Support

For API-related issues:
- Funifier API Documentation: https://docs.funifier.com
- API Support: support@funifier.com

For Studio-specific issues:
- GitHub Issues: [Your Repository URL]
