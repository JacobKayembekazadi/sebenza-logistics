# API Documentation

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL and Versioning](#base-url-and-versioning)
- [Request/Response Format](#requestresponse-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [API Endpoints](#api-endpoints)
- [Webhooks](#webhooks)
- [SDK and Examples](#sdk-and-examples)

## Overview

The Sebenza Logistics Suite API provides programmatic access to all platform features including project management, invoicing, inventory management, and reporting. The API follows REST principles and uses JSON for data exchange.

### API Features

- **RESTful Design**: Standard HTTP methods and status codes
- **JSON Data Format**: All requests and responses use JSON
- **Authentication**: JWT-based authentication with role-based access
- **Rate Limiting**: Configurable limits to prevent abuse
- **Pagination**: Efficient handling of large datasets
- **Filtering & Sorting**: Flexible data querying options
- **Webhooks**: Real-time event notifications
- **Comprehensive Error Handling**: Detailed error messages and codes

### Current Status

> **Note**: This API documentation describes the planned API structure. The current version uses mock data and local state management. Database integration and full API implementation are planned for future releases.

## Authentication

### Authentication Methods

#### 1. JWT Bearer Token

All API requests require a valid JWT token in the Authorization header.

```http
Authorization: Bearer <your-jwt-token>
```

#### 2. API Key (Alternative)

For server-to-server integration, API keys can be used.

```http
X-API-Key: <your-api-key>
```

### Getting Authentication Token

#### Login Endpoint

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "admin"
    }
  }
}
```

#### Token Refresh

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### User Roles and Permissions

- **Admin**: Full access to all endpoints
- **Manager**: Access to team and project management endpoints
- **Employee**: Limited access to assigned projects and personal data
- **Client**: Read-only access to own projects and invoices

## Base URL and Versioning

### Base URL

```text
Production: https://api.sebenza.com/v1
Staging: https://staging-api.sebenza.com/v1
Development: http://localhost:3001/api
```

### API Versioning

The API uses URL versioning. The current version is `v1`.

```http
GET /api/v1/projects
```

### Version Headers

Include version information in headers:

```http
API-Version: 1.0
Accept: application/json
```

## Request/Response Format

### Request Format

#### Content Type

All requests must include the appropriate Content-Type header:

```http
Content-Type: application/json
```

#### Request Structure

```json
{
  "data": {
    // Request payload
  },
  "meta": {
    "timestamp": "2025-07-03T10:30:00Z",
    "requestId": "req-123-456-789"
  }
}
```

### Response Format

#### Success Response

```json
{
  "success": true,
  "data": {
    // Response payload
  },
  "meta": {
    "timestamp": "2025-07-03T10:30:00Z",
    "requestId": "req-123-456-789",
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

#### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-07-03T10:30:00Z",
    "requestId": "req-123-456-789"
  }
}
```

### Pagination

Large datasets are paginated using limit/offset:

```http
GET /api/v1/projects?page=2&limit=20&sort=createdAt&order=desc
```

#### Pagination Parameters

- **page**: Page number (default: 1)
- **limit**: Items per page (default: 20, max: 100)
- **sort**: Sort field (default: id)
- **order**: Sort direction (asc/desc, default: asc)

## Error Handling

### HTTP Status Codes

- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict (duplicate, etc.)
- **422 Unprocessable Entity**: Validation errors
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

### Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `AUTHENTICATION_ERROR` | Authentication failed |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `DUPLICATE_RESOURCE` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Internal server error |

### Error Response Examples

#### Validation Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```

#### Authentication Error

```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Invalid or expired token"
  }
}
```

## Rate Limiting

### Rate Limits

- **Authenticated Users**: 1000 requests per hour
- **Public Endpoints**: 100 requests per hour per IP
- **Webhook Endpoints**: 10 requests per minute

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1625140800
```

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 60 seconds."
  }
}
```

## API Endpoints

### Projects

#### List Projects

```http
GET /api/v1/projects
```

**Query Parameters:**

- `status`: Filter by status (active, completed, cancelled)
- `client_id`: Filter by client ID
- `search`: Search in project name and description
- `page`: Page number
- `limit`: Items per page

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "proj-123",
      "name": "Website Redesign",
      "description": "Complete website redesign project",
      "status": "active",
      "client": {
        "id": "client-456",
        "name": "Acme Corp"
      },
      "budget": 50000,
      "startDate": "2025-07-01",
      "endDate": "2025-09-30",
      "progress": 45,
      "teamMembers": [
        {
          "id": "user-789",
          "name": "John Doe",
          "role": "Project Manager"
        }
      ],
      "createdAt": "2025-07-01T10:00:00Z",
      "updatedAt": "2025-07-03T15:30:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

#### Create Project

```http
POST /api/v1/projects
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "New Project",
  "description": "Project description",
  "clientId": "client-456",
  "budget": 25000,
  "startDate": "2025-07-15",
  "endDate": "2025-10-15",
  "teamMembers": ["user-789", "user-012"]
}
```

#### Get Project

```http
GET /api/v1/projects/{projectId}
```

#### Update Project

```http
PUT /api/v1/projects/{projectId}
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Updated Project Name",
  "status": "completed",
  "progress": 100
}
```

#### Delete Project

```http
DELETE /api/v1/projects/{projectId}
Authorization: Bearer <token>
```

### Clients

#### List Clients

```http
GET /api/v1/clients
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "client-123",
      "name": "Acme Corporation",
      "email": "contact@acme.com",
      "phone": "+1-555-0123",
      "address": {
        "street": "123 Business Ave",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      },
      "taxId": "12-3456789",
      "paymentTerms": "net30",
      "status": "active",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

#### Create Client

```http
POST /api/v1/clients
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "New Client Corp",
  "email": "contact@newclient.com",
  "phone": "+1-555-0199",
  "address": {
    "street": "456 Client St",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02101",
    "country": "USA"
  },
  "taxId": "98-7654321",
  "paymentTerms": "net15"
}
```

### Invoices

#### List Invoices

```http
GET /api/v1/invoices
```

**Query Parameters:**

- `status`: Filter by status (draft, sent, paid, overdue)
- `client_id`: Filter by client ID
- `date_from`: Filter by date range start
- `date_to`: Filter by date range end

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "inv-123",
      "number": "INV-2025-001",
      "client": {
        "id": "client-456",
        "name": "Acme Corp"
      },
      "status": "sent",
      "issueDate": "2025-07-01",
      "dueDate": "2025-07-31",
      "subtotal": 10000,
      "taxAmount": 800,
      "total": 10800,
      "currency": "USD",
      "items": [
        {
          "id": "item-1",
          "description": "Website Development",
          "quantity": 40,
          "rate": 250,
          "amount": 10000
        }
      ],
      "payments": [
        {
          "id": "payment-1",
          "amount": 5000,
          "date": "2025-07-15",
          "method": "bank_transfer",
          "reference": "TXN-789"
        }
      ],
      "balance": 5800,
      "createdAt": "2025-07-01T10:00:00Z"
    }
  ]
}
```

#### Create Invoice

```http
POST /api/v1/invoices
Content-Type: application/json
Authorization: Bearer <token>

{
  "clientId": "client-456",
  "issueDate": "2025-07-03",
  "dueDate": "2025-08-02",
  "currency": "USD",
  "items": [
    {
      "description": "Consulting Services",
      "quantity": 20,
      "rate": 150,
      "taxRate": 8.5
    }
  ],
  "notes": "Payment due within 30 days"
}
```

### Inventory

#### List Inventory Items

```http
GET /api/v1/inventory
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "item-123",
      "sku": "SKU-001",
      "name": "Office Chair",
      "description": "Ergonomic office chair",
      "category": "furniture",
      "currentStock": 25,
      "reorderLevel": 10,
      "unitCost": 150.00,
      "sellingPrice": 249.99,
      "supplier": {
        "id": "supplier-456",
        "name": "Office Supplies Inc"
      },
      "location": "Warehouse A",
      "lastStockUpdate": "2025-07-01T14:30:00Z"
    }
  ]
}
```

#### Update Stock

```http
POST /api/v1/inventory/{itemId}/stock
Content-Type: application/json
Authorization: Bearer <token>

{
  "type": "adjustment",
  "quantity": -5,
  "reason": "damaged",
  "reference": "ADJ-001",
  "notes": "Water damage from leak"
}
```

### Employees

#### List Employees

```http
GET /api/v1/employees
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "emp-123",
      "employeeId": "EMP-001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@company.com",
      "phone": "+1-555-0156",
      "position": "Software Developer",
      "department": "Engineering",
      "hireDate": "2025-01-15",
      "status": "active",
      "salary": 75000,
      "manager": {
        "id": "emp-456",
        "name": "Jane Smith"
      },
      "skills": ["JavaScript", "React", "Node.js"],
      "address": {
        "street": "789 Developer Lane",
        "city": "San Francisco",
        "state": "CA",
        "zipCode": "94105"
      }
    }
  ]
}
```

### Reports

#### Financial Reports

```http
GET /api/v1/reports/financial
```

**Query Parameters:**

- `type`: Report type (profit_loss, balance_sheet, cash_flow)
- `period`: Time period (month, quarter, year)
- `start_date`: Start date (YYYY-MM-DD)
- `end_date`: End date (YYYY-MM-DD)

**Response:**

```json
{
  "success": true,
  "data": {
    "type": "profit_loss",
    "period": {
      "start": "2025-01-01",
      "end": "2025-06-30"
    },
    "revenue": {
      "total": 500000,
      "breakdown": [
        {
          "category": "Service Revenue",
          "amount": 450000
        },
        {
          "category": "Product Sales",
          "amount": 50000
        }
      ]
    },
    "expenses": {
      "total": 300000,
      "breakdown": [
        {
          "category": "Salaries",
          "amount": 200000
        },
        {
          "category": "Office Rent",
          "amount": 60000
        },
        {
          "category": "Utilities",
          "amount": 40000
        }
      ]
    },
    "netIncome": 200000,
    "generatedAt": "2025-07-03T16:00:00Z"
  }
}
```

## Webhooks

### Webhook Events

The API supports real-time notifications via webhooks for important events:

#### Supported Events

- `project.created`
- `project.updated`
- `project.completed`
- `invoice.created`
- `invoice.sent`
- `invoice.paid`
- `payment.received`
- `inventory.low_stock`
- `employee.hired`
- `employee.terminated`

#### Webhook Configuration

```http
POST /api/v1/webhooks
Content-Type: application/json
Authorization: Bearer <token>

{
  "url": "https://your-app.com/webhooks/sebenza",
  "events": ["invoice.paid", "project.completed"],
  "secret": "your-webhook-secret"
}
```

#### Webhook Payload

```json
{
  "event": "invoice.paid",
  "timestamp": "2025-07-03T16:30:00Z",
  "data": {
    "invoice": {
      "id": "inv-123",
      "number": "INV-2025-001",
      "total": 10800,
      "client": {
        "id": "client-456",
        "name": "Acme Corp"
      }
    },
    "payment": {
      "id": "payment-789",
      "amount": 10800,
      "method": "credit_card",
      "date": "2025-07-03"
    }
  }
}
```

#### Webhook Security

Webhooks are signed using HMAC-SHA256:

```javascript
const crypto = require('crypto')

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret)
  const digest = 'sha256=' + hmac.update(payload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
}
```

## SDK and Examples

### JavaScript SDK

```javascript
// Install: npm install @sebenza/logistics-sdk

import { SebenzaClient } from '@sebenza/logistics-sdk'

const client = new SebenzaClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.sebenza.com/v1'
})

// List projects
const projects = await client.projects.list({
  status: 'active',
  page: 1,
  limit: 20
})

// Create invoice
const invoice = await client.invoices.create({
  clientId: 'client-123',
  items: [
    {
      description: 'Consulting',
      quantity: 10,
      rate: 100
    }
  ]
})

// Update inventory
await client.inventory.updateStock('item-123', {
  type: 'received',
  quantity: 50,
  reference: 'PO-001'
})
```

### Python SDK

```python
# Install: pip install sebenza-logistics-sdk

from sebenza import SebenzaClient

client = SebenzaClient(
    api_key='your-api-key',
    base_url='https://api.sebenza.com/v1'
)

# List clients
clients = client.clients.list(status='active')

# Create project
project = client.projects.create({
    'name': 'New Project',
    'client_id': 'client-123',
    'budget': 25000
})

# Generate report
report = client.reports.financial(
    type='profit_loss',
    start_date='2025-01-01',
    end_date='2025-06-30'
)
```

### cURL Examples

#### Authentication

```bash
# Login
curl -X POST https://api.sebenza.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'
```

#### Projects

```bash
# List projects
curl -X GET https://api.sebenza.com/v1/projects \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/json"

# Create project
curl -X POST https://api.sebenza.com/v1/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test Project",
    "clientId": "client-123",
    "budget": 15000
  }'
```

#### Invoices

```bash
# Create invoice
curl -X POST https://api.sebenza.com/v1/invoices \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "client-123",
    "items": [
      {
        "description": "API Development",
        "quantity": 40,
        "rate": 125
      }
    ]
  }'
```

### Response Examples

#### Success Response

```bash
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "id": "proj-789",
    "name": "API Test Project",
    "status": "active"
  }
}
```

#### Error Response

```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "clientId",
        "message": "Client ID is required"
      }
    ]
  }
}
```

### Testing

#### Postman Collection

A complete Postman collection is available for testing all API endpoints:

```json
{
  "info": {
    "name": "Sebenza Logistics API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{authToken}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://api.sebenza.com/v1"
    }
  ]
}
```

#### Test Data

Use these test credentials for API testing:

```json
{
  "testUsers": [
    {
      "email": "admin@sebenza.com",
      "password": "password",
      "role": "admin"
    },
    {
      "email": "manager@sebenza.com",
      "password": "password",
      "role": "manager"
    }
  ],
  "testClients": [
    {
      "id": "client-test-001",
      "name": "Test Client Corp"
    }
  ]
}
```

---

*Last updated: July 3, 2025*
*Version: 1.0.0*

For API support and questions, contact our development team at api-support@sebenza.com
