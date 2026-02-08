# Hospital Website - Quick Setup Guide

**Complete step-by-step guide for Windows using pgAdmin**

---

## 📋 Prerequisites

Before starting, make sure you have:

- ✅ **PostgreSQL 15+** installed with **pgAdmin 4**
  - Download: https://www.postgresql.org/download/windows/
  - Remember your PostgreSQL password!

- ✅ **Node.js 20+** and npm 10+
  - Download: https://nodejs.org/ (LTS version)

---

## 🚀 Setup Steps

### Step 1: Create Database Using pgAdmin

1. **Open pgAdmin 4**
   - Press `Win` key → Type "pgAdmin" → Open it
   - Enter master password (if first time, create one)

2. **Connect to PostgreSQL Server**
   - Left sidebar: Click arrow (▶) next to **"Servers"**
   - Click on **"PostgreSQL 15"** or **"PostgreSQL 16"**
   - Enter your PostgreSQL password
   - ✅ Check "Save password"
   - Click "OK"

3. **Create Database**
   - Expand **PostgreSQL 15** in left sidebar
   - **Right-click** on **"Databases"**
   - Hover **"Create"** → Click **"Database..."**
   - **Database name:** `hospital_website`
   - Click **"Save"**

✅ **Success!** You should see `hospital_website` in the Databases list.

---

### Step 2: Configure Environment Variables

1. **Navigate to project folder**
   - Open File Explorer
   - Go to: `D:\hospital_website`

2. **Copy .env.example to .env**
   - Right-click `.env.example`
   - Click "Copy"
   - Right-click in folder → "Paste"
   - Rename the copy to `.env`

3. **Edit .env file**
   - Right-click `.env` → "Open with" → "Notepad" (or VS Code)

4. **Update DATABASE_URL**

Find this line:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/hospital_website?schema=public"
```

Replace with:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/hospital_website?schema=public"
```

**⚠️ IMPORTANT: Special Characters in Password**

If your password contains special characters, you MUST encode them:

| Character | Replace With | Example |
|-----------|--------------|---------|
| `@` | `%40` | `p@ss` → `p%40ss` |
| `#` | `%23` | `p#ss` → `p%23ss` |
| `!` | `%21` | `pass!` → `pass%21` |
| `$` | `%24` | `p$ss` → `p%24ss` |
| `%` | `%25` | `p%ss` → `p%25ss` |
| `&` | `%26` | `p&ss` → `p%26ss` |
| `:` | `%3A` | `p:ss` → `p%3Ass` |
| `/` | `%2F` | `p/ss` → `p%2Fss` |
| `?` | `%3F` | `p?ss` → `p%3Fss` |
| `=` | `%3D` | `p=ss` → `p%3Dss` |
| ` ` (space) | `%20` | `p ss` → `p%20ss` |

**Examples:**

Password: `Hospital#2024`
```env
DATABASE_URL="postgresql://postgres:Hospital%232024@localhost:5432/hospital_website?schema=public"
```

Password: `Admin@123!`
```env
DATABASE_URL="postgresql://postgres:Admin%40123%21@localhost:5432/hospital_website?schema=public"
```

Password: `Pass#word@2024`
```env
DATABASE_URL="postgresql://postgres:Pass%23word%402024@localhost:5432/hospital_website?schema=public"
```

5. **Save the file** (Ctrl + S)

---

### Step 3: Open PowerShell in Project Folder

**Method 1: Using File Explorer (Easiest)**
1. In File Explorer, you should already be in `D:\hospital_website`
2. Click in the **address bar** (where the path is shown)
3. Type: `powershell`
4. Press **Enter**

**Method 2: Using PowerShell**
1. Press `Win + X`
2. Select "Windows PowerShell" or "Terminal"
3. Type: `cd D:\hospital_website`
4. Press Enter

**Verify you're in the right folder:**
```powershell
pwd
```
Should show: `D:\hospital_website`

---

### Step 4: Install Dependencies

Run this command:

```powershell
npm install
```

**Expected output:**
```
added XXX packages in XXs
```

**Wait time:** 1-3 minutes

---

### Step 5: Generate Prisma Client

```powershell
npm run prisma:generate
```

**Expected output:**
```
✔ Generated Prisma Client (5.20.0) to .\node_modules\@prisma\client
```

**Wait time:** 10-30 seconds

---

### Step 6: Create Database Schema (Migration)

```powershell
npm run prisma:migrate
```

**You'll be prompted:**
```
Enter a name for the new migration:
```

**Type:** `init_hospital_schema`

**Press Enter**

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

### Step 8: Verify Database Setup

**Open Prisma Studio:**

```powershell
npm run prisma:studio
```

**Browser automatically opens to:** http://localhost:5555

**What you'll see:**
- Left sidebar with all tables (Hospital, Doctor, Department, etc.)
- Click any table to view data

**Explore the data:**
- **Hospital** → ABC General Hospital
- **Department** → 5 departments (Cardiology, Emergency, Maternity, Surgical, Pediatrics)
- **MedicalSpecialty** → 13 specialties (ENT, Cardiology, Pediatrics, etc.)
- **ServiceCategory** → 8 categories (Laboratory, Pharmacy, Radiology, etc.)
- **Branch** → 2 locations (Main Campus, North Branch)
- **Facility** → 4 facilities (ICU, MRI Scanner, Operation Theaters, Emergency Ward)
- **Testimonial** → 3 patient testimonials
- **Certification** → 3 certifications (ISO, JCI, Awards)
- **JobPosting** → 2 job openings
- **FAQ** → 5 frequently asked questions

**To close Prisma Studio:**
- Go back to PowerShell
- Press `Ctrl + C`

---

## ✅ Setup Complete!

Your database is now ready with:
- ✅ 1 Hospital (ABC General Hospital)
- ✅ 13 Medical Specialties
- ✅ 8 Service Categories
- ✅ 5 Departments
- ✅ 2 Branches
- ✅ 4 Facilities
- ✅ 3 Testimonials
- ✅ 3 Certifications
- ✅ 2 Job Postings
- ✅ 5 FAQs

---

## 🎯 Next Steps

### Start Development Server

```powershell
npm run dev
```

**Visit:** http://localhost:3000

### Run Tests

```powershell
npm run test:unit
```

### Check Code Quality

```powershell
npm run lint
npm run type-check
```

---

## 🆘 Troubleshooting

### Error: "invalid port number in database URL"

**Cause:** Special characters in password not encoded OR syntax error in .env

**Solution:**
1. Check your `.env` file
2. Encode special characters (see table in Step 2)
3. Make sure no spaces around `=` sign
4. Make sure DATABASE_URL is in quotes

**Example of WRONG format:**
```env
DATABASE_URL = "postgresql://postgres:my@pass@localhost:5432/hospital_website?schema=public"
```

**Example of CORRECT format:**
```env
DATABASE_URL="postgresql://postgres:my%40pass@localhost:5432/hospital_website?schema=public"
```

---

### Error: "password authentication failed"

**Cause:** Wrong password in .env file

**Solution:**
1. Check your PostgreSQL password
2. Update `.env` file with correct password
3. Remember to encode special characters
4. Save the file
5. Run commands again from Step 5

---

### Error: "database hospital_website does not exist"

**Cause:** Database not created in pgAdmin

**Solution:**
1. Open pgAdmin
2. Follow Step 1 again to create database
3. Continue from Step 5

---

### Error: "relation already exists"

**Cause:** Tables already exist in database

**Solution - Reset database (⚠️ deletes all data):**
```powershell
npx prisma migrate reset
npm run prisma:migrate
npm run prisma:seed
```

---

### Error: "npm: command not found"

**Cause:** Node.js not installed

**Solution:**
1. Download from: https://nodejs.org/
2. Install LTS version
3. Restart PowerShell
4. Verify: `node --version`

---

## 📚 Useful Commands

**All commands run from:** `D:\hospital_website\`

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Check code quality |
| `npm run type-check` | TypeScript type checking |
| `npm run test:unit` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run prisma:studio` | Open database browser |
| `npm run prisma:generate` | Regenerate Prisma Client |
| `npm run prisma:migrate` | Create/apply migrations |
| `npm run prisma:seed` | Seed database with sample data |
| `npx prisma migrate reset` | Reset database (⚠️ destructive) |

---

## 🔐 Environment Variables Reference

**Required for development:**
- `DATABASE_URL` - PostgreSQL connection string

**Optional (for production features):**
- `TWILIO_ACCOUNT_SID` - SMS notifications
- `TWILIO_AUTH_TOKEN` - SMS notifications
- `SENDGRID_API_KEY` - Email notifications
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps
- `RECAPTCHA_SECRET_KEY` - Form spam protection
- `HMS_API_URL` - Hospital Management System integration
- `NEXT_PUBLIC_GA_ID` - Google Analytics

---

## 📖 Additional Documentation

- **DATABASE_SETUP.md** - Detailed database guide
- **DATABASE_SCHEMA.md** - Complete schema reference
- **SETUP_WINDOWS.md** - Windows-specific setup guide
- **hospital_website_specs.md** - Product specifications

---

## 🤝 Need Help?

**Common issues:**
1. Check `.env` file for syntax errors
2. Verify PostgreSQL is running
3. Ensure database exists in pgAdmin
4. Check password encoding for special characters

**Still stuck?**
- Review error message carefully
- Check which step failed
- Verify all prerequisites are installed
- Try resetting database with `npx prisma migrate reset`

---

**Setup Guide Version:** 1.0
**Last Updated:** 2026-02-07
**Platform:** Windows 10/11
**Terminal:** PowerShell (recommended)
**Database:** PostgreSQL 15+

---

## 🎉 Success Checklist

- [ ] PostgreSQL installed with pgAdmin
- [ ] Node.js installed
- [ ] Database `hospital_website` created in pgAdmin
- [ ] `.env` file created and configured
- [ ] Special characters in password encoded
- [ ] `npm install` completed successfully
- [ ] `npm run prisma:generate` completed
- [ ] `npm run prisma:migrate` completed
- [ ] `npm run prisma:seed` completed
- [ ] Data visible in Prisma Studio
- [ ] Development server starts with `npm run dev`

**All checked?** You're ready to build! 🚀
