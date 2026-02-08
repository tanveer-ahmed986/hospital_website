# Security Guide

## Current Security Status: ⚠️ Basic Protection

### ✅ Current Security Measures

1. **React/Next.js Built-in Protection**
   - XSS protection (auto-escaping)
   - CSRF protection (SameSite cookies)
   - SQL injection prevention (no direct SQL)

2. **Environment Variables**
   - Sensitive data in .env (excluded from git)
   - .env.example with placeholders only

3. **Static Site Security**
   - No authentication endpoints exposed
   - No direct database access from client

### ❌ Missing Security Features (Need Implementation)

## 1. HTTPS Enforcement

### Add Security Headers in next.config.js

```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // HTTPS enforcement
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          // XSS Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  }
}

// Content Security Policy
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://api.example.com;
  frame-src 'self' https://www.google.com;
`

module.exports = nextConfig
```

## 2. Rate Limiting

### Implement API Rate Limiting

```typescript
// lib/utils/rate-limit.ts
import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  })

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0]
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount)
        }
        tokenCount[0] += 1

        const currentUsage = tokenCount[0]
        const isRateLimited = currentUsage >= limit

        if (isRateLimited) {
          reject(new Error('Rate limit exceeded'))
        } else {
          resolve()
        }
      }),
  }
}

// Usage in API routes
import rateLimit from '@/lib/utils/rate-limit'

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500,
})

export async function POST(request: Request) {
  try {
    await limiter.check(10, request.headers.get('x-forwarded-for') || 'anonymous')
    // Process request...
  } catch {
    return new Response('Rate limit exceeded', { status: 429 })
  }
}
```

## 3. Form Validation & Sanitization

### Server-side Validation

```typescript
// lib/utils/validation.ts
import validator from 'validator'

export function validateAppointmentData(data: any) {
  const errors: string[] = []

  // Name validation
  if (!data.name || data.name.length < 2 || data.name.length > 100) {
    errors.push('Name must be between 2 and 100 characters')
  }

  // Email validation
  if (!validator.isEmail(data.email)) {
    errors.push('Invalid email address')
  }

  // Phone validation
  if (!validator.isMobilePhone(data.phone)) {
    errors.push('Invalid phone number')
  }

  // Sanitize inputs
  const sanitized = {
    name: validator.escape(data.name),
    email: validator.normalizeEmail(data.email),
    phone: validator.escape(data.phone),
    message: validator.escape(data.message)
  }

  return { errors, sanitized }
}
```

## 4. CORS Configuration

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // CORS headers
  response.headers.set('Access-Control-Allow-Origin', 'https://your-domain.com')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  return response
}
```

## 5. Environment Variables Security

### Best Practices

```bash
# .env (NEVER commit this file)
DATABASE_URL="postgresql://user:password@localhost:5432/hospital"
TWILIO_ACCOUNT_SID="your_actual_sid"
TWILIO_AUTH_TOKEN="your_actual_token"
SENDGRID_API_KEY="your_actual_key"

# Use strong, unique passwords
# Rotate keys regularly
# Use different credentials for dev/staging/production
```

## 6. Input Sanitization

```typescript
// lib/utils/sanitize.ts
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHTML(dirty: string) {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  })
}

export function sanitizeInput(input: string) {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .slice(0, 1000) // Limit length
}
```

## 7. SQL Injection Prevention (for future database implementation)

```typescript
// GOOD - Using Prisma ORM (parameterized queries)
const doctor = await prisma.doctor.findUnique({
  where: { id: doctorId }
})

// BAD - Never do this
// const query = `SELECT * FROM doctors WHERE id = ${doctorId}`
```

## 8. Authentication (for future admin panel)

```typescript
// Use NextAuth.js or similar
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        // Verify credentials with bcrypt
        const user = await verifyUser(credentials)
        return user
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60 // 30 minutes
  },
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  }
})
```

## 9. File Upload Security (if implemented)

```typescript
// Validate file types and sizes
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxSize = 5 * 1024 * 1024 // 5MB

if (!allowedTypes.includes(file.type)) {
  throw new Error('Invalid file type')
}

if (file.size > maxSize) {
  throw new Error('File too large')
}

// Sanitize filename
const sanitizedFilename = file.name
  .replace(/[^a-zA-Z0-9.-]/g, '_')
  .toLowerCase()
```

## 10. Error Handling

```typescript
// Don't expose sensitive information in errors
try {
  // Operation
} catch (error) {
  console.error('Internal error:', error) // Log full error
  return new Response('An error occurred', { status: 500 }) // Generic message to client
}
```

## Security Checklist

### Essential (Implement Now)
- [ ] Add security headers in next.config.js
- [ ] Implement rate limiting on forms
- [ ] Add server-side form validation
- [ ] Configure CORS properly
- [ ] Sanitize all user inputs
- [ ] Use HTTPS in production
- [ ] Implement CSP headers

### Important (Implement Soon)
- [ ] Add reCAPTCHA to forms
- [ ] Implement session management
- [ ] Add audit logging
- [ ] Set up error monitoring (Sentry)
- [ ] Implement backup strategy
- [ ] Add API authentication
- [ ] Configure firewall rules

### Advanced (Future)
- [ ] Penetration testing
- [ ] Security audit
- [ ] Implement WAF (Web Application Firewall)
- [ ] Add DDoS protection
- [ ] Implement IP whitelisting for admin
- [ ] Add two-factor authentication
- [ ] Regular security updates

## Deployment Security

### Vercel/Netlify Configuration

```bash
# Environment variables in production
- Use platform's secret management
- Never commit production .env
- Enable automatic HTTPS
- Configure custom domain with SSL
- Enable DDoS protection
- Set up monitoring and alerts
```

## Testing Security

### Tools
1. **OWASP ZAP** - Automated security scanner
2. **Burp Suite** - Web vulnerability scanner
3. **npm audit** - Check for vulnerable dependencies
4. **Snyk** - Continuous security monitoring
5. **SSL Labs** - Test SSL configuration

### Regular Audits

```bash
# Check for vulnerable dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

## Incident Response Plan

1. **Detection** - Monitor logs and alerts
2. **Containment** - Isolate affected systems
3. **Investigation** - Identify root cause
4. **Recovery** - Restore from backups
5. **Documentation** - Record incident details
6. **Prevention** - Update security measures

## Compliance

### HIPAA Compliance (if handling patient data)
- Encrypt data at rest and in transit
- Implement access controls
- Audit logs
- Data backup and recovery
- Business Associate Agreements (BAA)

### GDPR Compliance (if serving EU users)
- Cookie consent
- Privacy policy
- Right to be forgotten
- Data portability
- Data breach notification

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Web Security Checklist](https://github.com/security/web-security-checklist)
