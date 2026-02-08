# Windows Setup Guide - Step by Step

## Prerequisites Check

### Step 1: Check if PostgreSQL is installed

Open **PowerShell** (recommended) or **Command Prompt** and run:

```powershell
psql --version
```

**Expected output:** `psql (PostgreSQL) 15.x` or higher

**If NOT installed:**
- Download from: https://www.postgresql.org/download/windows/
- Or use installer: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
- During installation, remember your PostgreSQL password!

### Step 2: Check Node.js version

```powershell
node --version
```

**Expected output:** `v20.x.x` or higher

```powershell
npm --version
```

**Expected output:** `10.x.x` or higher

**If NOT installed:**
- Download from: https://nodejs.org/ (LTS version)

---

## Database Setup - Complete Guide

### Step 1: Open Terminal in Project Folder

**Option A: Using File Explorer**
1. Open File Explorer
2. Navigate to: `D:\hospital_website`
3. Click on the address bar and type: `powershell`
4. Press Enter

**Option B: Using PowerShell**
1. Press `Win + X`, select "Windows PowerShell" or "Terminal"
2. Navigate to project:
```powershell
cd D:\hospital_website
```

**Verify you're in the right folder:**
```powershell
pwd
```
Should show: `D:\hospital_website`

```powershell
ls
```
Should show files like: `package.json`, `prisma/`, `src/`, etc.

---

### Step 2: Install Project Dependencies

```powershell
npm install
```

**What this does:** Installs all required packages including Prisma

**Expected output:**
```
added XXX packages in XXs
```

**Wait time:** 1-3 minutes depending on internet speed

---

### Step 3: Create PostgreSQL Database

**Option A: Using psql command (Recommended)**

```powershell
# Connect to PostgreSQL (you'll be prompted for password)
psql -U postgres
```

**Enter the password you set during PostgreSQL installation**

**Inside psql prompt (postgres=#), run:**
```sql
CREATE DATABASE hospital_website;
```

**Expected output:** `CREATE DATABASE`

**List databases to verify:**
```sql
\l
```

You should see `hospital_website` in the list.

**Exit psql:**
```sql
\q
```

**Option B: Using pgAdmin (GUI)**
1. Open pgAdmin 4
2. Connect to PostgreSQL server (enter password)
3. Right-click "Databases" → "Create" → "Database"
4. Name: `hospital_website`
5. Click "Save"

---

### Step 4: Configure Database Connection

**Create .env file:**

```powershell
# Copy example env file
cp .env.example .env
```

**Edit .env file:**
1. Open `.env` file in VS Code or Notepad
2. Find the line:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/hospital_website?schema=public"
   ```
3. Replace with YOUR PostgreSQL credentials:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/hospital_website?schema=public"
   ```

   **Replace:**
   - `postgres` - Your PostgreSQL username (usually "postgres")
   - `YOUR_PASSWORD` - Your PostgreSQL password

4. Save the file

**Example:**
If your password is `mypass123`, the line should be:
```
DATABASE_URL="postgresql://postgres:mypass123@localhost:5432/hospital_website?schema=public"
```

---

### Step 5: Generate Prisma Client

```powershell
npm run prisma:generate
```

**What this does:** Generates TypeScript types and Prisma Client based on your schema

**Expected output:**
```
✔ Generated Prisma Client (5.20.0) to .\node_modules\@prisma\client
```

**Wait time:** 10-30 seconds

---

### Step 6: Create Database Tables (Migration)

```powershell
npm run prisma:migrate
```

**You'll be prompted:**
```
Enter a name for the new migration:
```

**Type:** `init_hospital_schema` and press Enter

**What this does:** Creates all tables in your database based on schema.prisma

**Expected output:**
```
Applying migration `20260207XXXXXX_init_hospital_schema`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20260207XXXXXX_init_hospital_schema/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (5.20.0)
```

**Wait time:** 30-60 seconds

---

### Step 7: Seed Database with Sample Data

```powershell
npm run prisma:seed
```

**What this does:** Populates your database with sample hospital data

**Expected output:**
```
🌱 Starting database seed...
🏥 Seeding hospital...
✅ Seeded hospital: ABC General Hospital
📋 Seeding medical specialties...
✅ Seeded 13 medical specialties
🏥 Seeding service categories...
✅ Seeded 8 service categories
🏢 Seeding departments...
✅ Seeded 5 departments
🌍 Seeding branches...
✅ Seeded 2 branches
🏥 Seeding facilities...
✅ Seeded 4 facilities
💬 Seeding testimonials...
✅ Seeded 3 testimonials
🏆 Seeding certifications...
✅ Seeded 3 certifications
💼 Seeding job postings...
✅ Seeded 2 job postings
❓ Seeding FAQs...
✅ Seeded 5 FAQs
✅ Database seed completed successfully!
```

**Wait time:** 5-15 seconds

---

### Step 8: Verify Setup - Open Prisma Studio

```powershell
npm run prisma:studio
```

**What this does:** Opens a web-based database browser

**Expected output:**
```
Environment variables loaded from .env
Prisma Studio is up on http://localhost:5555
```

**Your browser should automatically open to:** http://localhost:5555

**What you'll see:**
- Left sidebar: List of all tables (Hospital, Doctor, Department, etc.)
- Click any table to view data
- You should see the seeded sample data

**To explore:**
1. Click "Hospital" → See "ABC General Hospital"
2. Click "Department" → See 5 departments
3. Click "MedicalSpecialty" → See 13 specialties
4. Click "Branch" → See 2 branches
5. Click "Facility" → See 4 facilities

**To close Prisma Studio:**
- Go back to PowerShell
- Press `Ctrl + C`

---

## Verification Checklist

✅ **PostgreSQL installed** - `psql --version` works
✅ **Node.js installed** - `node --version` shows v20+
✅ **Dependencies installed** - `node_modules/` folder exists
✅ **Database created** - `hospital_website` database exists
✅ **.env configured** - DATABASE_URL has correct credentials
✅ **Prisma Client generated** - No errors in Step 5
✅ **Migration applied** - Tables created successfully
✅ **Data seeded** - Sample data visible in Prisma Studio

---

## Common Issues & Solutions

### Issue 1: "psql: command not found"

**Solution:**
PostgreSQL is not installed or not in PATH.

1. Install PostgreSQL from: https://www.postgresql.org/download/windows/
2. During installation, check "Add to PATH"
3. Restart PowerShell after installation

**Alternative:**
Use pgAdmin GUI instead of psql commands.

---

### Issue 2: "password authentication failed"

**Solution:**
Incorrect password in .env file.

1. Open `.env` file
2. Check DATABASE_URL has correct PostgreSQL password
3. Test connection:
   ```powershell
   psql -U postgres -d hospital_website
   ```
   Enter password when prompted

---

### Issue 3: "database hospital_website does not exist"

**Solution:**
Database not created yet.

```powershell
# Connect to PostgreSQL
psql -U postgres

# Inside psql prompt:
CREATE DATABASE hospital_website;
\q
```

---

### Issue 4: "npm: command not found"

**Solution:**
Node.js not installed.

1. Download from: https://nodejs.org/
2. Install LTS version
3. Restart PowerShell
4. Verify: `node --version`

---

### Issue 5: Migration fails with "relation already exists"

**Solution:**
Tables already exist. Reset database (⚠️ deletes all data):

```powershell
npx prisma migrate reset
npm run prisma:migrate
npm run prisma:seed
```

---

### Issue 6: "Environment variable not found: DATABASE_URL"

**Solution:**
.env file missing or not in project root.

1. Verify `.env` file exists in `D:\hospital_website\`
2. Check it contains DATABASE_URL line
3. No spaces around `=` sign

---

## Next Steps After Setup

### 1. Start Development Server

```powershell
npm run dev
```

Visit: http://localhost:3000

### 2. Run Tests

```powershell
npm run test:unit
```

### 3. Check Code Quality

```powershell
npm run lint
npm run type-check
```

---

## Quick Reference Commands

**All commands run from:** `D:\hospital_website\`

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm run prisma:studio` | Open database browser |
| `npm run prisma:generate` | Regenerate Prisma Client |
| `npm run prisma:migrate` | Create new migration |
| `npm run prisma:seed` | Seed database |
| `npx prisma migrate reset` | Reset database (⚠️ destructive) |

---

## Need More Help?

**Check:**
- `DATABASE_SETUP.md` - Detailed database guide
- `DATABASE_SCHEMA.md` - Schema reference
- Prisma docs: https://www.prisma.io/docs

**Still stuck?** Share the exact error message and I'll help debug!

---

**Setup Guide Version:** 1.0
**Last Updated:** 2026-02-07
**Platform:** Windows 10/11
**Terminal:** PowerShell (recommended) or CMD
