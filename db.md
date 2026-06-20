# Azerbaijan Tourism Platform - Database (Neon PostgreSQL)

## Overview

This project uses **Neon PostgreSQL** as the primary cloud database.

Neon provides a scalable, serverless PostgreSQL database with automatic backups, branching, and excellent integration with modern frameworks such as Next.js, Prisma, and Docker.

ORM: **Prisma**

Database: **Neon PostgreSQL**

---

# Database Architecture

The database is designed using a relational model with PostgreSQL.

Main modules:

* Authentication
* Users
* Destinations
* Tours
* Hotels
* Restaurants
* Events
* Bookings
* Reviews
* Favorites
* Blog
* Categories
* Images

The schema should follow PostgreSQL best practices and support future scalability.

---

# Technologies

* Neon PostgreSQL
* Prisma ORM
* Prisma Migrate
* Prisma Studio
* TypeScript
* Node.js

---

# Environment Variables

Create a `.env` file.

```env
DATABASE_URL="postgresql://username:password@ep-xxxx.region.aws.neon.tech/azerbaijan_tourism?sslmode=require"

DIRECT_URL="postgresql://username:password@ep-xxxx.region.aws.neon.tech/azerbaijan_tourism?sslmode=require"
```

> `DATABASE_URL` is used by Prisma Client, while `DIRECT_URL` is used during migrations for better performance.

---

# Prisma Configuration

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

---

# Database Design

The schema should include:

* Users
* Roles
* Destinations
* Tours
* Hotels
* Restaurants
* Events
* Bookings
* Reviews
* Favorites
* Blog Posts
* Categories
* Images

All tables must use UUID as the primary key.

Every table should include:

* id
* createdAt
* updatedAt

---

# Performance

The database should be optimized with:

* Foreign Keys
* Indexes
* Unique Constraints
* Cascading Relations
* Soft Delete support (optional)
* Optimized Queries
* Pagination support

Recommended indexes:

* slug
* email
* destinationId
* categoryId
* createdAt
* region
* city
* booking status

---

# Security

* SSL Required
* UUID Primary Keys
* Passwords hashed with bcrypt
* Never expose database credentials
* Store secrets only in `.env`
* Validate all incoming data before database operations

---

# Prisma Commands

Generate Prisma Client

```bash
npx prisma generate
```

Create Migration

```bash
npx prisma migrate dev --name init
```

Deploy Migrations

```bash
npx prisma migrate deploy
```

Open Prisma Studio

```bash
npx prisma studio
```

Seed Database

```bash
npx prisma db seed
```

Reset Database

```bash
npx prisma migrate reset
```

---

# Development Workflow

1. Update `schema.prisma`
2. Create a migration
3. Apply migration to Neon
4. Generate Prisma Client
5. Seed sample data (optional)
6. Test API endpoints

---

# Seed Data

The initial seed should include:

* 1 Admin account
* Sample users
* Azerbaijan destinations
* Hotels
* Tour packages
* Restaurants
* Events
* Blog posts
* Reviews
* Bookings
* Categories
* Images

---

# Database Naming Convention

* Table names: PascalCase in Prisma models
* Database tables: snake_case
* Columns: camelCase in Prisma
* UUID primary keys
* Foreign keys with `Id` suffix
* Unique slugs for SEO

---

# Scalability

The database should be designed to support future modules such as:

* Payment Gateway
* AI Travel Assistant
* AI Trip Planner
* Multi-language support
* Currency Converter
* Notification System
* Loyalty Program
* Coupon System
* Analytics Dashboard
* Mobile Application API
* Third-party Travel APIs

---

# Goal

Build a clean, scalable, and production-ready PostgreSQL database on Neon that integrates seamlessly with Prisma and supports both the public tourism platform and the admin dashboard with high performance and maintainable architecture.
