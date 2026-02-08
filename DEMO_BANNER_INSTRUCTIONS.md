# Demo Banner Instructions

## How to Add Demo Banner (Optional)

If you want to show clients that this is a demo site, add the banner to your layout.

### Step 1: Import the Banner

Edit `src/app/layout.tsx`:

```typescript
import { DemoBanner } from '@/components/common/DemoBanner';
```

### Step 2: Add to Layout

Add it right after the `<body>` tag:

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DemoBanner />  {/* Add this line */}
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
```

### Step 3: Remove When Going to Production

When you're ready for production:
1. Remove `<DemoBanner />` from layout.tsx
2. Delete `src/components/common/DemoBanner.tsx`

## What the Banner Shows

> 🔔 **Demo Site:** This is a demonstration website. Appointment booking and contact forms will be functional after database integration.

- Orange background (attention-grabbing)
- Closeable by user (X button)
- Responsive design
- Clear message for clients

## Preview

The banner will appear at the very top of every page, above the header.

**Desktop:**
```
┌─────────────────────────────────────────────────────────┐
│ 🔔 Demo Site: This is a demonstration website... [X]    │
├─────────────────────────────────────────────────────────┤
│ [Logo] [Navigation] [Book Appointment]                  │
└─────────────────────────────────────────────────────────┘
```

**Mobile:**
```
┌──────────────────────────┐
│ 🔔 Demo Site: This is... │
│ [X]                      │
├──────────────────────────┤
│ [Logo]                   │
│ [☰]                      │
└──────────────────────────┘
```

## Alternative Messages

You can customize the message in `DemoBanner.tsx`:

### For Development Demo
```typescript
<p>🚧 Development Preview: This site is under development. Some features may not be functional yet.</p>
```

### For Client Review
```typescript
<p>👀 Client Review: This is a preview for your review. Please provide feedback!</p>
```

### For Testing
```typescript
<p>🧪 Test Site: This is a test environment. Data entered here is not saved.</p>
```

## Styling

To change colors, edit the className in DemoBanner.tsx:

```typescript
// Current: Orange
className="bg-gradient-to-r from-orange-500 to-orange-600"

// Blue (info)
className="bg-gradient-to-r from-blue-500 to-blue-600"

// Red (warning)
className="bg-gradient-to-r from-red-500 to-red-600"

// Green (success)
className="bg-gradient-to-r from-green-500 to-green-600"

// Yellow (caution)
className="bg-gradient-to-r from-yellow-500 to-yellow-600"
```

## When to Use

✅ **Use banner when:**
- Showing to clients for first time
- Presenting to stakeholders
- Getting feedback
- Testing phase

❌ **Don't use banner when:**
- Deployed to production
- Forms are fully functional
- Client has signed off
- Public launch
