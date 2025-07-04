# Security Documentation

## Table of Contents

- [Overview](#overview)
- [Security Architecture](#security-architecture)
- [Authentication and Authorization](#authentication-and-authorization)
- [Data Protection](#data-protection)
- [Network Security](#network-security)
- [Application Security](#application-security)
- [Compliance and Standards](#compliance-and-standards)
- [Security Monitoring](#security-monitoring)
- [Incident Response](#incident-response)
- [Security Best Practices](#security-best-practices)

## Overview

This document outlines the comprehensive security measures implemented in the Sebenza Logistics Suite to protect user data, prevent unauthorized access, and maintain system integrity. Our security approach follows industry best practices and compliance requirements.

### Security Principles

- **Defense in Depth**: Multiple layers of security controls
- **Least Privilege**: Minimum necessary access rights
- **Zero Trust**: Never trust, always verify
- **Data Privacy**: Protection of sensitive information
- **Continuous Monitoring**: Real-time threat detection
- **Regular Updates**: Proactive security maintenance

### Security Scope

- **Application Security**: Frontend and backend protection
- **Data Security**: Encryption, backup, and access controls
- **Infrastructure Security**: Server and network protection
- **User Security**: Authentication and authorization
- **API Security**: Secure communication and rate limiting
- **Compliance**: GDPR, SOC 2, and industry standards

## Security Architecture

### Multi-Layer Security Model

```text
┌─────────────────────────────────────────────────────────┐
│                    User Layer                           │
│  - Multi-Factor Authentication                          │
│  - Role-Based Access Control                           │
│  - Session Management                                   │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                Application Layer                        │
│  - Input Validation                                     │
│  - Output Encoding                                      │
│  - CSRF Protection                                      │
│  - Security Headers                                     │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                   API Layer                             │
│  - JWT Authentication                                   │
│  - Rate Limiting                                        │
│  - Input Sanitization                                   │
│  - Request Logging                                      │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  Data Layer                             │
│  - Encryption at Rest                                   │
│  - Encryption in Transit                                │
│  - Database Access Controls                             │
│  - Audit Logging                                        │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│               Infrastructure Layer                      │
│  - Firewall Protection                                  │
│  - DDoS Mitigation                                      │
│  - Intrusion Detection                                  │
│  - Security Monitoring                                  │
└─────────────────────────────────────────────────────────┘
```

### Security Components

#### Frontend Security

- **Content Security Policy (CSP)**: Prevents XSS attacks
- **HTTPS Enforcement**: All traffic encrypted
- **Input Validation**: Client-side validation with server-side verification
- **Secure Headers**: HSTS, X-Frame-Options, X-Content-Type-Options

#### Backend Security

- **Authentication Middleware**: JWT token validation
- **Authorization Checks**: Role-based permissions
- **Input Sanitization**: SQL injection prevention
- **Error Handling**: Secure error messages

#### Database Security

- **Encryption**: AES-256 encryption for sensitive data
- **Access Controls**: Database-level permissions
- **Audit Trails**: Complete data access logging
- **Backup Security**: Encrypted backups with retention policies

## Authentication and Authorization

### Authentication Methods

#### 1. Multi-Factor Authentication (MFA)

**Primary Authentication**: Email and password
**Secondary Factor**: One of the following:

- SMS verification code
- Email verification code
- Time-based One-Time Password (TOTP) using authenticator apps
- Hardware security keys (FIDO2/WebAuthn)

**Implementation**:

```typescript
// MFA verification process
interface MFAVerification {
  userId: string
  method: 'sms' | 'email' | 'totp' | 'fido2'
  code?: string
  challenge?: string
}

async function verifyMFA(verification: MFAVerification): Promise<boolean> {
  switch (verification.method) {
    case 'totp':
      return verifyTOTP(verification.userId, verification.code)
    case 'sms':
      return verifySMS(verification.userId, verification.code)
    case 'email':
      return verifyEmail(verification.userId, verification.code)
    case 'fido2':
      return verifyFIDO2(verification.userId, verification.challenge)
  }
}
```

#### 2. JSON Web Tokens (JWT)

**Token Structure**:

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-123",
    "email": "user@example.com",
    "role": "admin",
    "permissions": ["read:projects", "write:invoices"],
    "iat": 1625140800,
    "exp": 1625144400,
    "jti": "unique-token-id"
  }
}
```

**Token Security**:

- **Short Expiry**: Access tokens expire in 15 minutes
- **Refresh Tokens**: Long-lived tokens for renewal
- **Token Rotation**: New tokens issued on refresh
- **Revocation**: Blacklist for compromised tokens

#### 3. Session Management

**Session Security**:

```typescript
interface SessionConfig {
  httpOnly: true        // Prevent XSS access
  secure: true         // HTTPS only
  sameSite: 'strict'   // CSRF protection
  maxAge: 900000       // 15 minutes
  rolling: true        // Extend on activity
}
```

### Authorization Framework

#### Role-Based Access Control (RBAC)

**User Roles**:

- **Super Admin**: Full system access
- **Admin**: Organization management
- **Manager**: Department management
- **Employee**: Limited operational access
- **Client**: External read-only access

**Permission Matrix**:

| Resource | Super Admin | Admin | Manager | Employee | Client |
|----------|-------------|-------|---------|----------|--------|
| Users | CRUD | CRUD | R | R (self) | - |
| Projects | CRUD | CRUD | CRUD (assigned) | R (assigned) | R (own) |
| Clients | CRUD | CRUD | CRUD | R | R (self) |
| Invoices | CRUD | CRUD | CRUD | R | R (own) |
| Reports | CRUD | CRUD | R | R (limited) | R (own) |
| Settings | CRUD | CRUD | R | - | - |

#### Dynamic Permissions

```typescript
interface Permission {
  resource: string
  action: 'create' | 'read' | 'update' | 'delete'
  conditions?: {
    field: string
    operator: 'equals' | 'in' | 'contains'
    value: any
  }[]
}

// Example: Manager can only edit projects they are assigned to
const managerProjectPermission: Permission = {
  resource: 'projects',
  action: 'update',
  conditions: [
    {
      field: 'teamMembers',
      operator: 'contains',
      value: '${user.id}'
    }
  ]
}
```

### Password Security

#### Password Requirements

- **Minimum Length**: 12 characters
- **Complexity**: Mix of uppercase, lowercase, numbers, symbols
- **History**: Cannot reuse last 12 passwords
- **Expiry**: Required change every 90 days (configurable)
- **Breach Detection**: Check against known compromised passwords

#### Password Storage

```typescript
import bcrypt from 'bcrypt'
import crypto from 'crypto'

// Password hashing with salt
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Password verification
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

// Generate secure random passwords
function generateSecurePassword(length: number = 16): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  return Array.from(crypto.randomFillSync(new Uint8Array(length)))
    .map(x => charset[x % charset.length])
    .join('')
}
```

## Data Protection

### Encryption

#### Encryption at Rest

**Database Encryption**:

- **Algorithm**: AES-256-GCM
- **Key Management**: Hardware Security Module (HSM) or Azure Key Vault
- **Scope**: All personally identifiable information (PII) and sensitive business data

**File Storage Encryption**:

```typescript
import crypto from 'crypto'

class FileEncryption {
  private algorithm = 'aes-256-gcm'
  private keyLength = 32
  
  async encryptFile(buffer: Buffer, key: Buffer): Promise<EncryptedFile> {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher(this.algorithm, key, { iv })
    
    const encrypted = Buffer.concat([
      cipher.update(buffer),
      cipher.final()
    ])
    
    const authTag = cipher.getAuthTag()
    
    return {
      data: encrypted,
      iv: iv,
      authTag: authTag
    }
  }
  
  async decryptFile(encryptedFile: EncryptedFile, key: Buffer): Promise<Buffer> {
    const decipher = crypto.createDecipher(this.algorithm, key, {
      iv: encryptedFile.iv,
      authTag: encryptedFile.authTag
    })
    
    return Buffer.concat([
      decipher.update(encryptedFile.data),
      decipher.final()
    ])
  }
}
```

#### Encryption in Transit

**TLS Configuration**:

```nginx
# Nginx SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# HSTS header
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### Data Classification

#### Sensitivity Levels

**Public**: Marketing materials, public documentation
**Internal**: Business processes, non-sensitive operational data
**Confidential**: Client information, financial data, employee records
**Restricted**: Authentication credentials, encryption keys, compliance data

#### Data Handling Matrix

| Classification | Storage | Transmission | Access | Retention |
|----------------|---------|--------------|--------|-----------|
| Public | Standard | HTTPS | All users | Indefinite |
| Internal | Standard | HTTPS | Authenticated | 7 years |
| Confidential | Encrypted | TLS 1.2+ | Authorized | 7 years |
| Restricted | HSM/Vault | TLS 1.3 | Admin only | 3 years |

### Data Loss Prevention (DLP)

#### Monitoring Controls

```typescript
interface DLPRule {
  name: string
  pattern: RegExp
  sensitivity: 'low' | 'medium' | 'high'
  action: 'log' | 'block' | 'encrypt'
}

const dlpRules: DLPRule[] = [
  {
    name: 'Credit Card Numbers',
    pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/,
    sensitivity: 'high',
    action: 'block'
  },
  {
    name: 'Social Security Numbers',
    pattern: /\b\d{3}-\d{2}-\d{4}\b/,
    sensitivity: 'high',
    action: 'encrypt'
  },
  {
    name: 'Email Addresses',
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
    sensitivity: 'medium',
    action: 'log'
  }
]
```

## Network Security

### Firewall Configuration

#### Web Application Firewall (WAF)

**Protection Rules**:

- SQL injection prevention
- Cross-site scripting (XSS) protection
- CSRF token validation
- Rate limiting and DDoS protection
- Geographic IP filtering
- Malicious bot detection

#### Network Segmentation

```text
┌─────────────────────────────────────────────────────────┐
│                 Internet                                │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│              DMZ (Load Balancer)                        │
│  - Public-facing services                               │
│  - SSL termination                                      │
│  - DDoS protection                                      │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│           Application Tier                              │
│  - Web servers                                          │
│  - Application servers                                  │
│  - API gateways                                         │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│             Database Tier                               │
│  - Database servers                                     │
│  - Backup systems                                       │
│  - Restricted access                                    │
└─────────────────────────────────────────────────────────┘
```

### API Security

#### Rate Limiting

```typescript
interface RateLimitConfig {
  windowMs: number     // Time window in milliseconds
  max: number         // Maximum requests per window
  message: string     // Error message when limit exceeded
  standardHeaders: boolean
  legacyHeaders: boolean
}

const rateLimitConfigs = {
  public: { windowMs: 15 * 60 * 1000, max: 100 },      // 100 per 15 minutes
  authenticated: { windowMs: 15 * 60 * 1000, max: 1000 }, // 1000 per 15 minutes
  admin: { windowMs: 15 * 60 * 1000, max: 5000 }       // 5000 per 15 minutes
}
```

#### Input Validation

```typescript
import { z } from 'zod'

// Schema validation for user input
const createProjectSchema = z.object({
  name: z.string().min(1).max(100).regex(/^[a-zA-Z0-9\s\-_]+$/),
  description: z.string().max(1000).optional(),
  budget: z.number().min(0).max(10000000),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  clientId: z.string().uuid()
})

// Sanitization middleware
function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeInput)
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value)
    }
    return sanitized
  }
  return input
}
```

## Application Security

### Secure Development Lifecycle (SDLC)

#### Security Requirements

1. **Planning Phase**
   - Threat modeling
   - Security requirements definition
   - Risk assessment

2. **Development Phase**
   - Secure coding standards
   - Static code analysis
   - Dependency vulnerability scanning

3. **Testing Phase**
   - Dynamic application security testing (DAST)
   - Penetration testing
   - Security code review

4. **Deployment Phase**
   - Security configuration verification
   - Infrastructure security assessment
   - Production security testing

### Code Security Standards

#### Input Validation

```typescript
// Always validate and sanitize user input
function validateUserInput(input: any, schema: z.ZodSchema): ValidationResult {
  try {
    const validated = schema.parse(input)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }
    }
    throw error
  }
}

// SQL injection prevention with parameterized queries
async function getUser(id: string): Promise<User | null> {
  const query = 'SELECT * FROM users WHERE id = $1'
  const result = await db.query(query, [id])
  return result.rows[0] || null
}
```

#### Output Encoding

```typescript
import DOMPurify from 'dompurify'

// HTML encoding for display
function encodeHTML(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// Sanitize HTML content
function sanitizeHTML(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em', 'p', 'br'],
    ALLOWED_ATTR: []
  })
}
```

### Security Headers

```typescript
// Security headers middleware
export function securityHeaders() {
  return {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'"
    ].join('; ')
  }
}
```

## Compliance and Standards

### Regulatory Compliance

#### GDPR Compliance

**Data Subject Rights**:

- Right to Access
- Right to Rectification
- Right to Erasure ("Right to be Forgotten")
- Right to Restrict Processing
- Right to Data Portability
- Right to Object

**Implementation**:

```typescript
interface DataSubjectRequest {
  type: 'access' | 'rectification' | 'erasure' | 'portability'
  subjectId: string
  requestDate: Date
  status: 'pending' | 'processing' | 'completed' | 'denied'
}

class GDPRCompliance {
  async handleDataSubjectRequest(request: DataSubjectRequest): Promise<void> {
    switch (request.type) {
      case 'access':
        return this.generateDataExport(request.subjectId)
      case 'erasure':
        return this.anonymizeUserData(request.subjectId)
      case 'portability':
        return this.exportUserData(request.subjectId)
    }
  }
  
  async anonymizeUserData(userId: string): Promise<void> {
    // Replace PII with anonymous identifiers
    const anonymousId = generateAnonymousId()
    await db.query(
      'UPDATE users SET email = $1, name = $2 WHERE id = $3',
      [`anonymous-${anonymousId}@example.com`, `Anonymous User ${anonymousId}`, userId]
    )
  }
}
```

#### SOC 2 Type II

**Control Objectives**:

- **Security**: Protection against unauthorized access
- **Availability**: System availability for operation and use
- **Processing Integrity**: System processing completeness and accuracy
- **Confidentiality**: Protection of confidential information
- **Privacy**: Protection of personal information

### Industry Standards

#### ISO 27001

**Information Security Management System (ISMS)**:

- Risk assessment and treatment
- Security policy and procedures
- Asset management
- Access control
- Cryptography
- Physical and environmental security
- Operations security
- Communications security
- System acquisition, development, and maintenance
- Supplier relationships
- Information security incident management
- Business continuity management
- Compliance

## Security Monitoring

### Logging and Auditing

#### Security Event Logging

```typescript
interface SecurityEvent {
  timestamp: Date
  eventType: 'authentication' | 'authorization' | 'data_access' | 'configuration_change'
  severity: 'low' | 'medium' | 'high' | 'critical'
  userId?: string
  ipAddress: string
  userAgent: string
  resource: string
  action: string
  outcome: 'success' | 'failure'
  details: Record<string, any>
}

class SecurityLogger {
  async logEvent(event: SecurityEvent): Promise<void> {
    // Log to secure audit trail
    await auditLog.write(event)
    
    // Alert on critical events
    if (event.severity === 'critical') {
      await this.sendSecurityAlert(event)
    }
    
    // Update security metrics
    await this.updateSecurityMetrics(event)
  }
  
  async detectAnomalies(): Promise<SecurityAnomaly[]> {
    // Machine learning-based anomaly detection
    const patterns = await this.analyzeLoginPatterns()
    return this.identifyAnomalousActivity(patterns)
  }
}
```

#### Audit Trail Requirements

**Logged Events**:

- User authentication (success/failure)
- Authorization decisions
- Data access and modifications
- Administrative actions
- System configuration changes
- Security policy violations

**Log Retention**:

- Security logs: 7 years
- Access logs: 1 year
- Error logs: 6 months
- Debug logs: 30 days

### Intrusion Detection

#### Real-time Monitoring

```typescript
interface SecurityRule {
  name: string
  description: string
  condition: (event: SecurityEvent) => boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
  action: 'log' | 'alert' | 'block'
}

const securityRules: SecurityRule[] = [
  {
    name: 'Multiple Failed Logins',
    description: 'Detect brute force attacks',
    condition: (event) => {
      const failedLogins = getFailedLoginCount(event.ipAddress, '5 minutes')
      return failedLogins >= 5
    },
    severity: 'high',
    action: 'block'
  },
  {
    name: 'Unusual Login Location',
    description: 'Detect logins from unusual locations',
    condition: (event) => {
      const userLocation = getUserTypicalLocation(event.userId)
      const currentLocation = getLocationFromIP(event.ipAddress)
      return calculateDistance(userLocation, currentLocation) > 1000 // km
    },
    severity: 'medium',
    action: 'alert'
  }
]
```

## Incident Response

### Incident Response Plan

#### Response Team

- **Incident Commander**: Overall response coordination
- **Security Analyst**: Technical investigation and containment
- **Communications Lead**: Internal and external communications
- **Legal Counsel**: Regulatory and legal implications
- **IT Operations**: System restoration and recovery

#### Response Phases

1. **Preparation**: Tools, procedures, and team readiness
2. **Identification**: Detect and analyze potential incidents
3. **Containment**: Prevent further damage
4. **Eradication**: Remove the threat
5. **Recovery**: Restore normal operations
6. **Lessons Learned**: Post-incident review and improvement

### Incident Classification

#### Severity Levels

**Critical (P1)**:

- Complete system compromise
- Large-scale data breach
- Ransomware attack
- **Response Time**: 15 minutes
- **Resolution Target**: 4 hours

**High (P2)**:

- Partial system compromise
- Unauthorized data access
- Service disruption
- **Response Time**: 30 minutes
- **Resolution Target**: 8 hours

**Medium (P3)**:

- Security policy violations
- Failed security controls
- Suspicious activities
- **Response Time**: 2 hours
- **Resolution Target**: 24 hours

**Low (P4)**:

- Minor security issues
- Informational alerts
- **Response Time**: 8 hours
- **Resolution Target**: 72 hours

### Communication Plan

#### Internal Communications

```typescript
interface IncidentNotification {
  incidentId: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  affectedSystems: string[]
  estimatedImpact: string
  currentStatus: string
  nextUpdate: Date
}

class IncidentCommunication {
  async notifyStakeholders(incident: IncidentNotification): Promise<void> {
    // Notify executive team for critical incidents
    if (incident.severity === 'critical') {
      await this.notifyExecutiveTeam(incident)
    }
    
    // Notify affected team members
    await this.notifyResponseTeam(incident)
    
    // Update status page
    await this.updateStatusPage(incident)
  }
}
```

#### External Communications

**Customer Notification Template**:

```text
Subject: Security Incident Notification - [Incident ID]

Dear Valued Customer,

We are writing to inform you of a security incident that may have affected your account. We take the security of your information very seriously and want to provide you with the facts about what happened and what we are doing about it.

What Happened:
[Brief description of the incident]

What Information Was Involved:
[Specific data types that may have been affected]

What We Are Doing:
[Steps taken to address the incident]

What You Can Do:
[Recommended actions for customers]

For More Information:
[Contact information and resources]

Sincerely,
The Sebenza Security Team
```

## Security Best Practices

### Development Security

#### Secure Coding Checklist

- [ ] Input validation on all user inputs
- [ ] Output encoding for all dynamic content
- [ ] Parameterized queries for database access
- [ ] Proper error handling without information disclosure
- [ ] Authentication checks on all protected resources
- [ ] Authorization verification for sensitive operations
- [ ] Secure session management
- [ ] CSRF protection on state-changing operations
- [ ] XSS prevention measures
- [ ] SQL injection prevention
- [ ] Dependency vulnerability scanning
- [ ] Security header implementation

#### Code Review Security Guidelines

**Focus Areas**:

1. **Authentication and Authorization**
2. **Input Validation and Sanitization**
3. **Error Handling and Logging**
4. **Cryptographic Operations**
5. **Session Management**
6. **Data Access Patterns**

### Operational Security

#### Security Hardening

**Server Hardening**:

```bash
# Disable unnecessary services
systemctl disable telnet
systemctl disable ftp
systemctl disable rsh

# Configure fail2ban
fail2ban-client set sshd bantime 3600
fail2ban-client set sshd maxretry 3

# Set proper file permissions
chmod 600 /etc/ssh/ssh_host_rsa_key
chmod 644 /etc/ssh/ssh_host_rsa_key.pub
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# Regular security updates
apt update && apt upgrade -y
yum update -y
```

#### Access Control

**Principle of Least Privilege**:

```typescript
interface AccessPolicy {
  userId: string
  role: string
  permissions: Permission[]
  resources: string[]
  restrictions: {
    timeRestriction?: TimeWindow
    ipRestriction?: string[]
    mfaRequired?: boolean
  }
}

class AccessControl {
  async validateAccess(
    userId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    const policy = await this.getUserPolicy(userId)
    
    // Check basic permission
    const hasPermission = policy.permissions.some(p => 
      p.resource === resource && p.action === action
    )
    
    if (!hasPermission) return false
    
    // Check restrictions
    if (policy.restrictions.timeRestriction) {
      if (!this.isWithinTimeWindow(policy.restrictions.timeRestriction)) {
        return false
      }
    }
    
    if (policy.restrictions.ipRestriction) {
      const userIP = this.getCurrentUserIP(userId)
      if (!policy.restrictions.ipRestriction.includes(userIP)) {
        return false
      }
    }
    
    return true
  }
}
```

### User Security Training

#### Security Awareness Topics

1. **Password Security**
   - Strong password creation
   - Password manager usage
   - Multi-factor authentication

2. **Phishing Prevention**
   - Email security awareness
   - Social engineering tactics
   - Verification procedures

3. **Data Handling**
   - Data classification
   - Secure sharing practices
   - Privacy requirements

4. **Incident Reporting**
   - How to report security incidents
   - What constitutes a security incident
   - Emergency contact procedures

#### Training Schedule

- **New Employee**: Security orientation within first week
- **All Staff**: Annual security awareness training
- **Technical Staff**: Quarterly security updates
- **Managers**: Bi-annual leadership security briefing

---

*Last updated: July 3, 2025*
*Version: 1.0.0*

For security concerns or to report incidents, contact our Security Team at <security@sebenza.com>
