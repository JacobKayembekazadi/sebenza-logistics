# Testing Strategy

## Table of Contents

- [Overview](#overview)
- [Testing Philosophy](#testing-philosophy)
- [Testing Types](#testing-types)
- [Testing Tools and Framework](#testing-tools-and-framework)
- [Test Organization](#test-organization)
- [Testing Best Practices](#testing-best-practices)
- [CI/CD Integration](#cicd-integration)
- [Performance Testing](#performance-testing)
- [Quality Metrics](#quality-metrics)

## Overview

This document outlines the comprehensive testing strategy for the Sebenza Logistics Suite, ensuring high-quality, reliable, and maintainable code through systematic testing approaches.

### Testing Goals

- **Reliability**: Ensure core business logic works correctly
- **User Experience**: Validate user interactions and workflows
- **Performance**: Maintain acceptable response times and scalability
- **Security**: Verify data protection and access controls
- **Regression Prevention**: Catch breaking changes early

## Testing Philosophy

### Test Pyramid Strategy

```text
           /\
          /  \
         / UI \      <- Few, High-Value E2E Tests
        /______\
       /        \
      /Integration\   <- Moderate Integration Tests
     /__________\
    /            \
   /   Unit Tests  \  <- Many, Fast Unit Tests
  /________________\
```

### Principles

- **Test Early, Test Often**: Write tests during development
- **Test Behavior, Not Implementation**: Focus on what, not how
- **Fast Feedback**: Prioritize quick-running tests
- **Maintainable Tests**: Write clear, simple, and well-documented tests
- **Risk-Based Testing**: Focus on critical business paths

## Testing Types

### 1. Unit Tests

**Purpose**: Test individual functions, components, and utilities in isolation.

**Scope**:

- Utility functions (`src/lib/utils.ts`)
- Data transformation functions
- Custom hooks
- Component logic (props, state, events)

**Example**:

```typescript
// utils.test.ts
import { formatCurrency, validateEmail } from '@/lib/utils'

describe('formatCurrency', () => {
  it('should format positive numbers correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })

  it('should handle zero values', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('should format negative numbers', () => {
    expect(formatCurrency(-500)).toBe('-$500.00')
  })
})

describe('validateEmail', () => {
  it('should validate correct email formats', () => {
    expect(validateEmail('test@example.com')).toBe(true)
    expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true)
  })

  it('should reject invalid email formats', () => {
    expect(validateEmail('invalid-email')).toBe(false)
    expect(validateEmail('test@')).toBe(false)
  })
})
```

### 2. Component Tests

**Purpose**: Test React components in isolation with mocked dependencies.

**Scope**:

- Component rendering
- User interactions
- Props handling
- State management
- Event handling

**Example**:

```typescript
// invoice-form-dialog.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { InvoiceFormDialog } from '@/components/accounting/invoice-form-dialog'

const mockProps = {
  open: true,
  onOpenChange: jest.fn(),
  onSave: jest.fn(),
  invoice: null
}

describe('InvoiceFormDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render form fields correctly', () => {
    render(<InvoiceFormDialog {...mockProps} />)
    
    expect(screen.getByLabelText(/client/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/invoice number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('should validate required fields', async () => {
    render(<InvoiceFormDialog {...mockProps} />)
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/client is required/i)).toBeInTheDocument()
    })
  })

  it('should call onSave with correct data', async () => {
    render(<InvoiceFormDialog {...mockProps} />)
    
    fireEvent.change(screen.getByLabelText(/client/i), {
      target: { value: 'Test Client' }
    })
    fireEvent.change(screen.getByLabelText(/invoice number/i), {
      target: { value: 'INV-001' }
    })
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }))
    
    await waitFor(() => {
      expect(mockProps.onSave).toHaveBeenCalledWith({
        client: 'Test Client',
        invoiceNumber: 'INV-001',
        // ... other expected fields
      })
    })
  })
})
```

### 3. Integration Tests

**Purpose**: Test interactions between multiple components and systems.

**Scope**:

- Page-level component integration
- API integration with mock backends
- Context providers and consumers
- Complex user workflows

**Example**:

```typescript
// dashboard.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { DataProvider } from '@/contexts/data-context'
import { AuthProvider } from '@/contexts/auth-context'
import DashboardPage from '@/app/dashboard/page'

const mockAuthUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com'
}

const mockDashboardData = {
  totalRevenue: 50000,
  activeProjects: 12,
  pendingInvoices: 5,
  recentActivities: []
}

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider initialUser={mockAuthUser}>
    <DataProvider initialData={mockDashboardData}>
      {children}
    </DataProvider>
  </AuthProvider>
)

describe('Dashboard Integration', () => {
  it('should display dashboard metrics correctly', async () => {
    render(<DashboardPage />, { wrapper: Wrapper })
    
    await waitFor(() => {
      expect(screen.getByText('$50,000')).toBeInTheDocument()
      expect(screen.getByText('12')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  it('should handle loading and error states', async () => {
    const errorWrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider initialUser={mockAuthUser}>
        <DataProvider error="Failed to load data">
          {children}
        </DataProvider>
      </AuthProvider>
    )

    render(<DashboardPage />, { wrapper: errorWrapper })
    
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
  })
})
```

### 4. End-to-End (E2E) Tests

**Purpose**: Test complete user journeys in a browser environment.

**Scope**:

- Critical business workflows
- User authentication flows
- Multi-page interactions
- Form submissions and data persistence

**Example**:

```typescript
// invoice-workflow.e2e.test.ts
import { test, expect } from '@playwright/test'

test.describe('Invoice Management Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'test@example.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-button"]')
    await expect(page).toHaveURL('/dashboard')
  })

  test('should create, edit, and delete an invoice', async ({ page }) => {
    // Navigate to invoices
    await page.click('[data-testid="nav-invoices"]')
    await expect(page).toHaveURL('/invoices')

    // Create new invoice
    await page.click('[data-testid="create-invoice"]')
    await page.fill('[data-testid="client-select"]', 'Test Client')
    await page.fill('[data-testid="invoice-number"]', 'INV-001')
    await page.fill('[data-testid="amount"]', '1000')
    await page.click('[data-testid="save-invoice"]')

    // Verify invoice appears in list
    await expect(page.locator('[data-testid="invoice-list"]')).toContainText('INV-001')

    // Edit invoice
    await page.click('[data-testid="edit-invoice-INV-001"]')
    await page.fill('[data-testid="amount"]', '1500')
    await page.click('[data-testid="save-invoice"]')

    // Verify changes
    await expect(page.locator('[data-testid="invoice-INV-001"]')).toContainText('$1,500')

    // Delete invoice
    await page.click('[data-testid="delete-invoice-INV-001"]')
    await page.click('[data-testid="confirm-delete"]')

    // Verify deletion
    await expect(page.locator('[data-testid="invoice-list"]')).not.toContainText('INV-001')
  })
})
```

## Testing Tools and Framework

### Core Testing Stack

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "@playwright/test": "^1.40.0",
    "msw": "^2.0.0"
  }
}
```

### Tool Configuration

#### Jest Configuration (`jest.config.js`)

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

#### Playwright Configuration (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
  },
})
```

#### Mock Service Worker Setup (`src/mocks/handlers.ts`)

```typescript
import { http, HttpResponse } from 'msw'

export const handlers = [
  // Invoice API mocks
  http.get('/api/invoices', () => {
    return HttpResponse.json([
      { id: '1', number: 'INV-001', client: 'Test Client', amount: 1000 },
      { id: '2', number: 'INV-002', client: 'Another Client', amount: 2000 },
    ])
  }),

  http.post('/api/invoices', async ({ request }) => {
    const newInvoice = await request.json()
    return HttpResponse.json({
      id: '3',
      ...newInvoice,
      createdAt: new Date().toISOString(),
    }, { status: 201 })
  }),

  // Authentication mocks
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json()
    
    if (email === 'test@example.com' && password === 'password123') {
      return HttpResponse.json({
        user: { id: '1', email, name: 'Test User' },
        token: 'mock-jwt-token'
      })
    }
    
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }),
]
```

## Test Organization

### File Structure

```text
src/
├── __tests__/                 # Unit tests
│   ├── lib/
│   │   ├── utils.test.ts
│   │   └── data.test.ts
│   ├── hooks/
│   │   └── use-auth.test.ts
│   └── components/
│       ├── ui/
│       │   └── button.test.tsx
│       └── accounting/
│           └── invoice-form-dialog.test.tsx
├── __integration__/           # Integration tests
│   ├── dashboard.test.tsx
│   ├── auth-flow.test.tsx
│   └── invoice-management.test.tsx
└── mocks/                     # Mock data and handlers
    ├── handlers.ts
    ├── server.ts
    └── data.ts

tests/
└── e2e/                       # End-to-end tests
    ├── auth.spec.ts
    ├── invoice-workflow.spec.ts
    ├── dashboard.spec.ts
    └── user-management.spec.ts
```

### Naming Conventions

- **Unit Tests**: `ComponentName.test.tsx` or `functionName.test.ts`
- **Integration Tests**: `feature-area.integration.test.tsx`
- **E2E Tests**: `user-workflow.e2e.test.ts` or `feature.spec.ts`

### Test Data Management

```typescript
// src/mocks/data.ts
export const mockUsers = {
  admin: {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  },
  manager: {
    id: '2',
    email: 'manager@example.com',
    name: 'Manager User',
    role: 'manager',
  },
  user: {
    id: '3',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
  },
}

export const mockInvoices = [
  {
    id: '1',
    number: 'INV-001',
    client: 'Acme Corp',
    amount: 5000,
    status: 'pending',
    dueDate: '2025-08-01',
  },
  {
    id: '2',
    number: 'INV-002',
    client: 'Tech Solutions',
    amount: 7500,
    status: 'paid',
    dueDate: '2025-07-15',
  },
]
```

## Testing Best Practices

### 1. Writing Effective Tests

**Do:**

- Write descriptive test names that explain the expected behavior
- Use the Arrange-Act-Assert (AAA) pattern
- Test one thing at a time
- Use data-testid attributes for reliable element selection
- Mock external dependencies

**Don't:**

- Test implementation details
- Write overly complex tests
- Rely on CSS selectors that change frequently
- Test multiple scenarios in a single test
- Ignore test maintenance

### 2. Test Data Management

```typescript
// Good: Use factories for test data
const createMockInvoice = (overrides = {}) => ({
  id: 'invoice-1',
  number: 'INV-001',
  client: 'Test Client',
  amount: 1000,
  status: 'pending',
  ...overrides,
})

// Usage
const paidInvoice = createMockInvoice({ status: 'paid' })
const overdueInvoice = createMockInvoice({ 
  status: 'overdue', 
  dueDate: '2025-01-01' 
})
```

### 3. Async Testing

```typescript
// Testing async operations
it('should load invoice data', async () => {
  render(<InvoiceList />)
  
  // Wait for loading to complete
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })
  
  // Verify data is displayed
  expect(screen.getByText('INV-001')).toBeInTheDocument()
})
```

### 4. Error Handling Tests

```typescript
it('should display error message when API fails', async () => {
  // Mock API failure
  server.use(
    http.get('/api/invoices', () => {
      return new HttpResponse(null, { status: 500 })
    })
  )

  render(<InvoiceList />)
  
  await waitFor(() => {
    expect(screen.getByText(/failed to load invoices/i)).toBeInTheDocument()
  })
})
```

## CI/CD Integration

### GitHub Actions Workflow (`.github/workflows/test.yml`)

```yaml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run type checking
      run: npm run typecheck
    
    - name: Run linting
      run: npm run lint
    
    - name: Run unit tests
      run: npm run test:unit
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload test results
      uses: actions/upload-artifact@v4
      if: failure()
      with:
        name: test-results
        path: |
          test-results/
          playwright-report/
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "npm run test:unit && npm run test:integration",
    "test:unit": "jest --testPathPattern=__tests__",
    "test:integration": "jest --testPathPattern=__integration__",
    "test:e2e": "playwright test",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

## Performance Testing

### Load Testing

Use tools like Artillery or k6 for API load testing:

```javascript
// load-test.js (Artillery)
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50

scenarios:
  - name: "Invoice API Load Test"
    requests:
      - get:
          url: "/api/invoices"
      - post:
          url: "/api/invoices"
          json:
            client: "Load Test Client"
            amount: 1000
```

### Frontend Performance Testing

```typescript
// performance.test.ts
import { render } from '@testing-library/react'
import { Dashboard } from '@/app/dashboard/page'

describe('Performance Tests', () => {
  it('should render dashboard within acceptable time', async () => {
    const startTime = performance.now()
    
    render(<Dashboard />)
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    // Should render within 100ms
    expect(renderTime).toBeLessThan(100)
  })
})
```

## Quality Metrics

### Coverage Requirements

- **Unit Tests**: 90% coverage
- **Integration Tests**: 80% coverage
- **Critical Paths**: 100% coverage

### Performance Benchmarks

- **Page Load Time**: < 2 seconds
- **API Response Time**: < 500ms
- **Component Render Time**: < 100ms

### Quality Gates

Tests must pass the following gates:

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Critical E2E tests pass
- [ ] Coverage thresholds met
- [ ] No high-severity accessibility issues
- [ ] Performance benchmarks met

### Reporting

Generate comprehensive test reports:

```bash
# Generate coverage report
npm run test:coverage

# Generate E2E test report
npm run test:e2e -- --reporter=html

# Generate accessibility report
npm run test:a11y
```

## Maintenance and Updates

### Regular Tasks

- **Weekly**: Review and update flaky tests
- **Monthly**: Update test data and scenarios
- **Quarterly**: Review and optimize test suite performance
- **Before Releases**: Full test suite execution and validation

### Test Review Process

1. **Code Review**: Include test review in PR process
2. **Test Maintenance**: Regular cleanup of obsolete tests
3. **Performance Monitoring**: Track test execution times
4. **Coverage Analysis**: Monitor coverage trends

---

*Last updated: July 3, 2025*
*Version: 1.0.0*
