# Sebenza Logistics Suite - API Documentation

## Overview

This document provides comprehensive documentation for the Sebenza Logistics Suite REST API. The API follows RESTful conventions and uses JWT authentication for secure access.

**Base URL**: `http://localhost:3002/api` (development)  
**Authentication**: Bearer token (JWT)  
**Content Type**: `application/json`

## Quick Start

1. **Login** to obtain an authentication token
2. **Include the token** in the Authorization header for all subsequent requests
3. **Use standard HTTP methods** (GET, POST, PUT, DELETE) for CRUD operations

### Example Request
```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@sebenza.com", "password": "admin123"}'
```

## Authentication

### POST `/api/auth/login`
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "admin@sebenza.com",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "admin-user-id",
      "name": "Admin User",
      "email": "admin@sebenza.com",
      "role": "admin",
      "avatar": "https://placehold.co/100x100.png"
    },
    "company": {
      "name": "Default Corp",
      "userCount": 5,
      "logo": "https://placehold.co/100x100/4338CA/FFFFFF.png",
      "address": "123 Business Rd, Suite 456, Big City, USA",
      "phone": "555-0199",
      "email": "contact@defaultcorp.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### POST `/api/auth/signup`
Register a new user and company.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "companyName": "My Company",
  "userCount": 10
}
```

## Projects

### GET `/api/projects`
Retrieve a list of projects with pagination and search.

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 10): Items per page
- `search` (string): Search in name, location, description
- `sortBy` (string): Field to sort by
- `sortOrder` ('asc' | 'desc', default: 'asc'): Sort direction

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "proj-1",
      "name": "East Coast Distribution Center",
      "location": "Newark, NJ",
      "description": "Expansion of the main distribution hub to increase capacity by 30%.",
      "status": "Active",
      "progress": 75,
      "endDate": "2024-12-31"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

### POST `/api/projects`
Create a new project.

**Request Body:**
```json
{
  "name": "New Project",
  "location": "Test Location",
  "description": "Project description",
  "status": "Active",
  "endDate": "2024-12-31"
}
```

### GET `/api/projects/{id}`
Retrieve a specific project.

### PUT `/api/projects/{id}`
Update a specific project.

### DELETE `/api/projects/{id}`
Delete a specific project.

## Tasks

### GET `/api/tasks`
Retrieve a list of tasks with pagination and search.

**Query Parameters:**
- `page`, `limit`, `search`, `sortBy`, `sortOrder`: Same as projects
- `projectId` (string): Filter tasks by project ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "task-1",
      "projectId": "proj-1",
      "name": "Install new shelving units",
      "status": "DONE",
      "assignee": "John Doe",
      "dueDate": "2024-11-15"
    }
  ]
}
```

### POST `/api/tasks`
Create a new task.

**Request Body:**
```json
{
  "projectId": "proj-1",
  "name": "Task name",
  "status": "PENDING",
  "assignee": "John Doe",
  "dueDate": "2024-12-31"
}
```

**Status Options:** `PENDING`, `IN_PROGRESS`, `DONE`, `BLOCKED`, `SCHEDULED`

### GET, PUT, DELETE `/api/tasks/{id}`
Standard CRUD operations for individual tasks.

## Clients

### GET `/api/clients`
Retrieve a list of clients with pagination and search.

**Query Parameters:**
Same pagination and search parameters as projects.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "client-1",
      "name": "Nexus Corp",
      "email": "contact@nexuscorp.com",
      "phone": "555-0101",
      "address": "123 Nexus Way, Silicon Valley, CA",
      "avatar": "https://placehold.co/100x100/A6B1E1/FFFFFF.png"
    }
  ]
}
```

### POST `/api/clients`
Create a new client.

**Request Body:**
```json
{
  "name": "Client Name",
  "email": "client@example.com",
  "phone": "555-0123",
  "address": "123 Client St, City, State 12345"
}
```

### GET, PUT, DELETE `/api/clients/{id}`
Standard CRUD operations for individual clients.

## Invoices

### GET `/api/invoices`
Retrieve a list of invoices with pagination and search.

**Query Parameters:**
- Standard pagination parameters
- `clientId` (string): Filter by client
- `projectId` (string): Filter by project
- `status` ('Paid' | 'Pending' | 'Partial'): Filter by status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "INV-001",
      "client": "Nexus Corp",
      "amount": 2500.00,
      "tax": 200,
      "discount": 50,
      "lateFee": 0,
      "paidAmount": 2650.00,
      "status": "Paid",
      "date": "2024-10-15",
      "projectId": "proj-1",
      "type": "Standard"
    }
  ]
}
```

### POST `/api/invoices`
Create a new invoice.

**Request Body:**
```json
{
  "client": "Client Name",
  "amount": 1000.00,
  "tax": 80.00,
  "discount": 50.00,
  "status": "Pending",
  "date": "2024-12-01",
  "type": "Standard",
  "projectId": "proj-1"
}
```

**Invoice Types:** `Standard`, `Retainer`, `Pro-forma`  
**Invoice Status:** `Paid`, `Pending`, `Partial`

## Employees

### GET `/api/employees`
Retrieve a list of employees with pagination and search.

**Query Parameters:**
- Standard pagination parameters
- `department` (string): Filter by department
- `role` (string): Filter by employee role

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "emp-1",
      "name": "Alice Johnson",
      "role": "Manager",
      "department": "Operations",
      "email": "alice.j@sebenza.com",
      "avatar": "https://placehold.co/100x100.png",
      "timesheetEnabled": true,
      "payrollManaged": true
    }
  ]
}
```

### POST `/api/employees`
Create a new employee.

**Request Body:**
```json
{
  "name": "Employee Name",
  "role": "Manager",
  "department": "Operations",
  "email": "employee@sebenza.com",
  "timesheetEnabled": true,
  "payrollManaged": true
}
```

**Employee Roles:** `Manager`, `Warehouse Staff`, `Accountant`, `Driver`, `Contractor`

## Inventory

### GET `/api/inventory`
Retrieve a list of stock items with pagination and search.

**Query Parameters:**
- Standard pagination parameters
- `warehouseId` (string): Filter by warehouse
- `status` (string): Filter by item status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "stock-1",
      "reference": "REF-001",
      "senderName": "Supplier ABC",
      "receiverName": "Client XYZ",
      "description": "Electronic components",
      "quantity": 100,
      "weight": 50.5,
      "value": 1500.00,
      "status": "In Warehouse",
      "entryDate": "2024-10-15",
      "warehouseId": "warehouse-1",
      "warehouseName": "Main Warehouse"
    }
  ]
}
```

### POST `/api/inventory`
Create a new stock item.

**Request Body:**
```json
{
  "reference": "REF-NEW",
  "senderName": "Sender Name",
  "receiverName": "Receiver Name",
  "description": "Item description",
  "quantity": 10,
  "weight": 25.0,
  "value": 500.00,
  "status": "In Warehouse",
  "entryDate": "2024-12-01",
  "warehouseId": "warehouse-1"
}
```

**Stock Status:** `In Warehouse`, `In Transit`, `Delivered`

## Warehouses

### GET `/api/warehouses`
Retrieve a list of warehouses with pagination and search.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "warehouse-1",
      "name": "Main Warehouse",
      "location": "Newark, NJ"
    }
  ]
}
```

### POST `/api/warehouses`
Create a new warehouse.

**Request Body:**
```json
{
  "name": "Warehouse Name",
  "location": "City, State"
}
```

## Messaging

### GET `/api/messages`
Retrieve a list of messages with pagination and search.

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 10): Items per page
- `search` (string): Search in subject, sender, recipient
- `sortBy` (string): Field to sort by
- `sortOrder` ('asc' | 'desc', default: 'asc'): Sort direction

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "msg-1",
      "subject": "Meeting Reminder",
      "sender": "admin@sebenza.com",
      "recipient": "john@example.com",
      "status": "Sent",
      "sentAt": "2025-07-04T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### POST `/api/messages`
Send a new message.

**Request Body:**
```json
{
  "subject": "Message Subject",
  "recipient": "recipient@example.com",
  "body": "Message content"
}
```

### GET, DELETE `/api/messages/{id}`
Retrieve or delete a specific message.

## Contacts

### GET `/api/contacts`
Retrieve a list of contacts with pagination and search.

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 10): Items per page
- `search` (string): Search in name, email, phone
- `sortBy` (string): Field to sort by
- `sortOrder` ('asc' | 'desc', default: 'asc'): Sort direction

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "contact-1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "555-0123",
      "address": "123 Elm St, Springfield, IL",
      "avatar": "https://placehold.co/100x100/FF5733/FFFFFF.png"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### POST `/api/contacts`
Create a new contact.

**Request Body:**
```json
{
  "name": "Contact Name",
  "email": "contact@example.com",
  "phone": "555-0456",
  "address": "456 Oak St, Metropolis, IL"
}
```

### GET, PUT, DELETE `/api/contacts/{id}`
Standard CRUD operations for individual contacts.

## Error Responses

All endpoints may return error responses in the following format:

### Authentication Error (401)
```json
{
  "success": false,
  "error": "Authentication required"
}
```

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Authentication Headers

For all protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Messaging and Contacts

### Contacts

#### GET `/api/contacts`
Get all contacts for the authenticated user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "contact-1",
      "name": "John Doe",
      "email": "john@example.com", 
      "phone": "+1234567890",
      "company": "Example Corp",
      "avatar": "https://placehold.co/40x40.png",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### POST `/api/contacts`
Create a new contact.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890", 
  "company": "Example Corp"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "contact-2",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Example Corp",
    "avatar": "https://placehold.co/40x40.png",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### PUT `/api/contacts/{id}`
Update an existing contact.

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "+1234567891",
  "company": "Updated Corp"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "contact-1",
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "phone": "+1234567891",
    "company": "Updated Corp",
    "avatar": "https://placehold.co/40x40.png",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T16:45:00Z"
  }
}
```

#### DELETE `/api/contacts/{id}`
Delete a contact.

**Response:**
```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

### Messages

#### GET `/api/messages`
Get all messages for the authenticated user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "msg-1",
      "content": "Hello, this is a test message",
      "sender": "admin@sebenza.com",
      "recipient": "john@example.com",
      "subject": "Test Message",
      "type": "email",
      "status": "sent",
      "timestamp": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### POST `/api/messages`
Create a new message.

**Request Body:**
```json
{
  "content": "Hello, this is a test message",
  "sender": "admin@sebenza.com", 
  "recipient": "john@example.com",
  "subject": "Test Message",
  "type": "email"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "msg-2",
    "content": "Hello, this is a test message",
    "sender": "admin@sebenza.com",
    "recipient": "john@example.com", 
    "subject": "Test Message",
    "type": "email",
    "status": "sent",
    "timestamp": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### PUT `/api/messages/{id}`
Update an existing message.

**Request Body:**
```json
{
  "content": "Updated message content",
  "subject": "Updated Subject"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "msg-1",
    "content": "Updated message content",
    "sender": "admin@sebenza.com",
    "recipient": "john@example.com",
    "subject": "Updated Subject", 
    "type": "email",
    "status": "sent",
    "timestamp": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T16:45:00Z"
  }
}
```

#### DELETE `/api/messages/{id}`
Delete a message.

**Response:**
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

## Time Tracking

### Time Entries

#### GET `/api/time-entries`
Get all time entries for the authenticated user.

**Query Parameters:**
- `projectId` (optional): Filter by project ID
- `employeeId` (optional): Filter by employee ID
- `startDate` (optional): Filter entries from this date (ISO format)
- `endDate` (optional): Filter entries until this date (ISO format)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "entry-1",
      "projectId": "project-1",
      "taskId": "task-1",
      "employeeId": "emp-1",
      "startTime": "2024-01-15T09:00:00Z",
      "endTime": "2024-01-15T17:00:00Z",
      "duration": 480,
      "description": "Working on feature implementation",
      "billable": true,
      "approved": false,
      "createdAt": "2024-01-15T09:00:00Z",
      "updatedAt": "2024-01-15T17:00:00Z"
    }
  ]
}
```

#### POST `/api/time-entries`
Create a new time entry.

**Request Body:**
```json
{
  "projectId": "project-1",
  "taskId": "task-1",
  "employeeId": "emp-1",
  "startTime": "2024-01-15T09:00:00Z",
  "endTime": "2024-01-15T17:00:00Z",
  "description": "Working on feature implementation",
  "billable": true
}
```

#### PUT `/api/time-entries/{id}`
Update an existing time entry.

**Request Body:**
```json
{
  "description": "Updated description",
  "billable": false,
  "approved": true
}
```

#### DELETE `/api/time-entries/{id}`
Delete a time entry.

**Response:**
```json
{
  "success": true,
  "message": "Time entry deleted successfully"
}
```

### Timer Operations

#### POST `/api/time-entries/start-timer`
Start a new timer for time tracking.

**Request Body:**
```json
{
  "projectId": "project-1",
  "taskId": "task-1",
  "employeeId": "emp-1",
  "description": "Starting work on new feature"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "entry-2",
    "projectId": "project-1",
    "taskId": "task-1", 
    "employeeId": "emp-1",
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": null,
    "duration": 0,
    "description": "Starting work on new feature",
    "billable": true,
    "approved": false,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

#### POST `/api/time-entries/stop-timer`
Stop an active timer.

**Request Body:**
```json
{
  "entryId": "entry-2"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "entry-2",
    "projectId": "project-1",
    "taskId": "task-1",
    "employeeId": "emp-1", 
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T14:00:00Z",
    "duration": 240,
    "description": "Starting work on new feature",
    "billable": true,
    "approved": false,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T14:00:00Z"
  }
}
```

### Timesheets

#### GET `/api/timesheets`
Get all timesheets.

**Query Parameters:**
- `employeeId` (optional): Filter by employee ID
- `period` (optional): Filter by period (week, month)
- `startDate` (optional): Filter from this date
- `endDate` (optional): Filter until this date

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "timesheet-1",
      "employeeId": "emp-1",
      "period": "2024-W03",
      "startDate": "2024-01-15",
      "endDate": "2024-01-21",
      "totalHours": 40,
      "billableHours": 35,
      "status": "pending",
      "submittedAt": "2024-01-21T17:00:00Z",
      "approvedAt": null,
      "createdAt": "2024-01-15T09:00:00Z",
      "updatedAt": "2024-01-21T17:00:00Z",
      "entries": ["entry-1", "entry-2"]
    }
  ]
}
```

#### POST `/api/timesheets`
Create a new timesheet.

**Request Body:**
```json
{
  "employeeId": "emp-1",
  "period": "2024-W03",
  "startDate": "2024-01-15",
  "endDate": "2024-01-21",
  "entries": ["entry-1", "entry-2"]
}
```

#### PUT `/api/timesheets/{id}`
Update an existing timesheet.

**Request Body:**
```json
{
  "status": "approved",
  "approvedAt": "2024-01-22T09:00:00Z"
}
```

#### DELETE `/api/timesheets/{id}`
Delete a timesheet.

**Response:**
```json
{
  "success": true,
  "message": "Timesheet deleted successfully"
}
```

## Complete API Endpoint List

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Core Business Entities (Full CRUD)

- `GET|POST /api/projects` - Projects collection
- `GET|PUT|DELETE /api/projects/[id]` - Individual project
- `GET|POST /api/tasks` - Tasks collection  
- `GET|PUT|DELETE /api/tasks/[id]` - Individual task
- `GET|POST /api/clients` - Clients collection
- `GET|PUT|DELETE /api/clients/[id]` - Individual client
- `GET|POST /api/invoices` - Invoices collection
- `GET|PUT|DELETE /api/invoices/[id]` - Individual invoice
- `GET|POST /api/employees` - Employees collection
- `GET|PUT|DELETE /api/employees/[id]` - Individual employee
- `GET|POST /api/inventory` - Inventory items collection
- `GET|PUT|DELETE /api/inventory/[id]` - Individual inventory item
- `GET|POST /api/warehouses` - Warehouses collection
- `GET|PUT|DELETE /api/warehouses/[id]` - Individual warehouse

### Extended Business Entities (Full CRUD)

- `GET|POST /api/hr` - Job postings collection
- `GET|PUT|DELETE /api/hr/[id]` - Individual job posting
- `GET|POST /api/suppliers` - Suppliers collection
- `GET|PUT|DELETE /api/suppliers/[id]` - Individual supplier
- `GET|POST /api/purchase-orders` - Purchase orders collection
- `GET|PUT|DELETE /api/purchase-orders/[id]` - Individual purchase order
- `GET|POST /api/expenses` - Expenses collection
- `GET|PUT|DELETE /api/expenses/[id]` - Individual expense
- `GET|POST /api/payments` - Payments collection
- `GET|PUT|DELETE /api/payments/[id]` - Individual payment
- `GET|POST /api/estimates` - Estimates collection
- `GET|PUT|DELETE /api/estimates/[id]` - Individual estimate
- `GET|POST /api/assets` - Assets collection
- `GET|PUT|DELETE /api/assets/[id]` - Individual asset

### Messaging and Contacts

- `GET|POST /api/messages` - Messages collection
- `GET|DELETE /api/messages/[id]` - Individual message
- `GET|POST /api/contacts` - Contacts collection
- `GET|PUT|DELETE /api/contacts/[id]` - Individual contact

**Total:** 36 API endpoints covering all major business entities

## Next Steps

The current implementation provides a solid foundation for the Sebenza Logistics Suite API. Future enhancements will include:

1. **Database Integration** - Replace in-memory storage with PostgreSQL
2. **Advanced Authentication** - Multi-factor authentication, SSO
3. **File Upload** - Document and image upload capabilities
4. **Real-time Features** - WebSocket support for live updates
5. **Payment Processing** - Integration with payment gateways
6. **Email Notifications** - Automated email alerts and reports
7. **Advanced Reporting** - Custom report generation
8. **API Versioning** - Support for multiple API versions

---

**Last Updated:** July 4, 2025  
**API Version:** 1.0  
**Status:** Phase 1.2 Core API Development ✅ Complete
