# Azerbaijan Tourism Platform - Backend

## Overview

This is the backend service for the Azerbaijan Tourism Platform.

The backend provides API endpoints for destinations, tours, hotels, restaurants, events, bookings, reviews, favorites, users, authentication, and admin management.

The system is designed to support a scalable tourism platform where users can explore Azerbaijan, make reservations, write reviews, save favorites, and manage their travel activity.

---

# Tech Stack

* Node.js
* Express.js / NestJS
* TypeScript
* PostgreSQL
* Prisma ORM
* JWT Authentication
* Bcrypt
* Zod / Joi Validation
* Multer / Cloudinary for image upload
* Swagger / OpenAPI
* Docker
* Redis optional
* Nodemailer optional

---

# Core Features

## Authentication

* User registration
* User login
* JWT access token
* Refresh token support
* Password hashing
* Role-based access control
* User roles:

  * USER
  * ADMIN

---

## User Features

* View destinations
* View tours
* View hotels
* View restaurants
* View events
* Search and filter content
* Add items to favorites
* Create bookings
* Write reviews
* Manage profile
* View booking history

---

## Admin Features

* Admin dashboard statistics
* Manage users
* Manage destinations
* Manage tours
* Manage hotels
* Manage restaurants
* Manage events
* Manage blog posts
* Manage bookings
* Manage reviews
* Upload and manage images
* Change booking status
* Delete inappropriate reviews

---

# Database

Database system: PostgreSQL

ORM: Prisma

Main tables:

* users
* destinations
* tours
* hotels
* restaurants
* events
* bookings
* reviews
* favorites
* blog_posts
* categories
* images

---

# Database Relations

* One user can have many bookings
* One user can write many reviews
* One user can save many favorites
* One destination can have many tours
* One destination can have many hotels
* One destination can have many restaurants
* One destination can have many events
* One tour can have many bookings
* One hotel can have many bookings
* One restaurant can have many bookings
* One destination can have many images
* One tour, hotel, restaurant, and event can have many images
* Reviews can belong to tours, hotels, restaurants, or destinations

---

# Project Structure

```text
backend
│
├── prisma
│   ├── schema.prisma
│   └── seed.ts
│
├── src
│   ├── config
│   ├── controllers
│   ├── routes
│   ├── services
│   ├── repositories
│   ├── middlewares
│   ├── validators
│   ├── utils
│   ├── types
│   ├── constants
│   ├── uploads
│   └── server.ts
│
├── .env.example
├── package.json
├── tsconfig.json
├── docker-compose.yml
└── README.md
```

---

# Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/azerbaijan_tourism"

PORT=5000

JWT_SECRET="your_jwt_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="7d"

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
```

---

# Installation

```bash
npm install
```

---

# Run PostgreSQL with Docker

```bash
docker-compose up -d
```

---

# Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

---

# Start Development Server

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

# API Endpoints

## Auth

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/logout
GET  /api/auth/me
```

---

## Users

```text
GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

Admin only:

```text
PATCH /api/users/:id/role
PATCH /api/users/:id/status
```

---

## Destinations

```text
GET    /api/destinations
GET    /api/destinations/:slug
POST   /api/destinations
PATCH  /api/destinations/:id
DELETE /api/destinations/:id
```

Filters:

```text
/api/destinations?region=Gabala&season=winter&category=mountain&page=1&limit=12
```

---

## Tours

```text
GET    /api/tours
GET    /api/tours/:slug
POST   /api/tours
PATCH  /api/tours/:id
DELETE /api/tours/:id
```

Filters:

```text
/api/tours?destination=Sheki&minPrice=50&maxPrice=300&duration=2&category=culture
```

---

## Hotels

```text
GET    /api/hotels
GET    /api/hotels/:slug
POST   /api/hotels
PATCH  /api/hotels/:id
DELETE /api/hotels/:id
```

Filters:

```text
/api/hotels?city=Baku&stars=5&minPrice=100&maxPrice=500
```

---

## Restaurants

```text
GET    /api/restaurants
GET    /api/restaurants/:slug
POST   /api/restaurants
PATCH  /api/restaurants/:id
DELETE /api/restaurants/:id
```

---

## Events

```text
GET    /api/events
GET    /api/events/:slug
POST   /api/events
PATCH  /api/events/:id
DELETE /api/events/:id
```

---

## Bookings

```text
GET    /api/bookings
GET    /api/bookings/:id
POST   /api/bookings
PATCH  /api/bookings/:id/status
DELETE /api/bookings/:id
```

Booking status:

```text
PENDING
CONFIRMED
CANCELLED
COMPLETED
```

---

## Reviews

```text
GET    /api/reviews
POST   /api/reviews
PATCH  /api/reviews/:id
DELETE /api/reviews/:id
```

---

## Favorites

```text
GET    /api/favorites
POST   /api/favorites
DELETE /api/favorites/:id
```

---

## Blog

```text
GET    /api/blog
GET    /api/blog/:slug
POST   /api/blog
PATCH  /api/blog/:id
DELETE /api/blog/:id
```

---

## Images

```text
POST   /api/images/upload
DELETE /api/images/:id
```

---

## Admin Dashboard

```text
GET /api/admin/stats
GET /api/admin/recent-bookings
GET /api/admin/popular-destinations
GET /api/admin/revenue
```

---

# Response Format

Successful response:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Something went wrong",
  "errors": []
}
```

---

# Validation

Use validation for all incoming requests.

Examples:

* Email format
* Password minimum length
* Required fields
* Price must be positive
* Rating must be between 1 and 5
* Date must be valid
* Booking date cannot be in the past

---

# Security

* Hash passwords with bcrypt
* Use JWT authentication
* Protect admin routes
* Validate all inputs
* Use rate limiting
* Use CORS
* Use helmet
* Sanitize user input
* Store secrets in `.env`
* Never expose database credentials

---

# Pagination Format

Example request:

```text
GET /api/tours?page=1&limit=12
```

Example response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 120,
    "totalPages": 10
  }
}
```

---

# Search

Global search endpoint:

```text
GET /api/search?q=gabala
```

Search should return matching:

* destinations
* tours
* hotels
* restaurants
* events
* blog posts

---

# Seed Data

Seed script should create:

* Admin user
* Sample users
* Azerbaijan destinations
* Tour packages
* Hotels
* Restaurants
* Events
* Blog posts
* Reviews
* Bookings

Example destinations:

* Baku
* Gabala
* Sheki
* Guba
* Ganja
* Shamakhi
* Lankaran
* Nakhchivan
* Khinalig
* Lahij
* Gobustan
* Shahdag

---

# Scripts

```json
{
  "dev": "nodemon src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:seed": "prisma db seed"
}
```

---

# Testing

Recommended tests:

* Auth tests
* CRUD tests
* Booking tests
* Review tests
* Admin permission tests
* Search and filter tests

Use:

* Jest
* Supertest

---

# Future Improvements

* Payment system
* Email notifications
* SMS notifications
* AI trip planner
* Multi-language support
* Currency converter
* Weather API
* Recommendation system
* Analytics dashboard
* Public API documentation

---

# Goal

The backend should be clean, secure, scalable, and production-ready.

It must support both the public tourism website and the admin panel without messy code, because future developers also deserve a life.
