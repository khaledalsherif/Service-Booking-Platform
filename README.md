# Service Booking Platform – Backend API

## Overview

A production-ready RESTful API built with **Node.js, Express, and MongoDB**.  
Features include **JWT authentication**, **role-based authorization**, **service management (admin)**, and **booking workflows (users)**.  
No frontend, payments, or email in MVP.

---

## Tech Stack

- Node.js, Express
- MongoDB + Mongoose
- JWT + bcrypt
- Helmet, Rate Limiting, HPP, Sanitizer
- ESLint + Prettier

---

## Getting Started

### Prerequisites

- Node.js >= 16
- MongoDB (local or Atlas)
- Postman for testing

### Environment Variables (`config.env`)

```env
PORT=3000
DATABASE_LOCAL=mongodb://localhost:27017/service-booking
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
NODE_ENV=development
```
