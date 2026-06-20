# Azerbaijan Tourism Platform - Frontend

## Overview

This project is a modern, responsive tourism platform for Azerbaijan. It allows users to discover destinations, explore tour packages, hotels, restaurants, events, and manage travel plans through an intuitive interface.

The application is designed with scalability, performance, accessibility, and modern UI/UX principles in mind.

---

# Tech Stack

* Next.js 15 (App Router)
* React
* TypeScript
* Tailwind CSS
* Shadcn/UI
* Framer Motion
* TanStack Query
* React Hook Form
* Zod
* Axios
* NextAuth (Authentication)
* PostgreSQL (Backend)
* Prisma ORM
* Leaflet / Mapbox (Maps)

---

# Features

## Public

* Beautiful Landing Page
* Destination Explorer
* Tour Packages
* Hotels
* Restaurants
* Events
* Travel Blog
* Global Search
* Advanced Filtering
* Responsive Design
* Dark / Light Mode
* SEO Optimized

---

## Authentication

* Sign Up
* Login
* Forgot Password
* Social Login (optional)
* Profile Management

---

## User Dashboard

* My Profile
* My Bookings
* Favorite Places
* Saved Tours
* Reviews
* Account Settings

---

## Booking

* Tour Booking
* Hotel Booking
* Reservation Status
* Booking History

---

## UI Components

* Navbar
* Footer
* Hero Section
* Search Bar
* Destination Cards
* Tour Cards
* Hotel Cards
* Restaurant Cards
* Event Cards
* Blog Cards
* Image Gallery
* Reviews
* Rating
* Pagination
* Filters
* Map Section
* Breadcrumb
* Modal
* Drawer
* Toast Notifications
* Skeleton Loading
* Empty State
* Error State

---

# Folder Structure

```
src
│
├── app
│   ├── (public)
│   ├── dashboard
│   ├── auth
│   ├── destinations
│   ├── tours
│   ├── hotels
│   ├── restaurants
│   ├── events
│   ├── blog
│   └── api
│
├── components
│   ├── ui
│   ├── layout
│   ├── cards
│   ├── forms
│   ├── filters
│   ├── maps
│   ├── sections
│   └── common
│
├── hooks
├── lib
├── services
├── context
├── store
├── types
├── utils
├── constants
├── styles
├── assets
└── middleware.ts
```

---

# Main Pages

* Home
* Destinations
* Destination Details
* Tours
* Tour Details
* Hotels
* Hotel Details
* Restaurants
* Restaurant Details
* Events
* Event Details
* Blog
* Blog Details
* About
* Contact
* Login
* Register
* User Dashboard
* Favorites
* Bookings
* Profile
* Settings

---

# Design Principles

* Minimal
* Premium
* Modern
* Clean
* Mobile First
* Accessible
* Fast
* Smooth Animations

---

# Color Palette

Primary

```
#0A8F6A
```

Secondary

```
#0F4C81
```

Accent

```
#F6B73C
```

Background

```
#F8FAFC
```

Text

```
#1E293B
```

---

# Responsive Breakpoints

* Mobile
* Tablet
* Laptop
* Desktop
* Wide Screen

---

# Performance Goals

* Lighthouse Score 95+
* Optimized Images
* Lazy Loading
* Code Splitting
* Dynamic Imports
* Metadata Optimization

---

# API Communication

Frontend communicates with a REST API.

Features include:

* Authentication
* CRUD Operations
* Booking
* Reviews
* Favorites
* Search
* Pagination
* Filtering

---

# State Management

* TanStack Query (Server State)
* Context API (Theme/Auth)
* Local Storage (Preferences)

---

# Authentication Flow

User Login

↓

JWT / Session

↓

Protected Routes

↓

Dashboard

---

# Future Enhancements

* AI Travel Assistant
* AI Trip Planner
* Multi-language Support
* Currency Converter
* Weather Integration
* Google Maps Integration
* Payment Gateway
* Notifications
* Chat Support
* Offline Mode (PWA)

---

# UI Style

The interface should resemble modern platforms such as Airbnb, Booking.com, and GetYourGuide while maintaining a unique Azerbaijani identity.

Focus on:

* Large hero images
* Elegant typography
* Spacious layouts
* Rounded cards
* Soft shadows
* Smooth micro-interactions
* Clean navigation
* Excellent user experience

---

# Goal

Build a production-ready tourism platform that showcases Azerbaijan's destinations, culture, hospitality, cuisine, and travel experiences through a fast, modern, and visually engaging interface that can be easily extended in the future.
