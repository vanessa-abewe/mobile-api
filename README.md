# Mobile API Backend

A comprehensive RESTful API backend for murakoze-api built with Express.js, TypeScript, and MySQL. This API provides complete functionality for business management, user authentication, reviews, recommendations, location services, and analytics.

## 🚀 Features

### Core APIs
- **Authentication System** - JWT-based auth 
- **Business Management** - CRUD operations with advanced filtering
- **Reviews &amp; Ratings** - review management
- **User Management** - Profile management
- **Recommendations Engine** - business recommendations
- **Location Services** - Nearby search and directions
- **Search &amp; Analytics** - Universal search with analytics
- **Notifications** - Real-time notification system

### Technical Features
- **TypeScript** - Full type safety and modern JavaScript features
- **Express.js** - Fast and minimal web framework
- **MySQL** - Reliable relational database with Knex.js ORM
- **JWT Authentication** - Secure token-based authentication
- **Swagger Documentation** - Interactive API documentation
- **Hot Reload** - Development server with automatic restart

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **pnpm** (package manager)
- **MySQL** (v8.0 or higher)
- **Git** (for cloning the repository)

## 🛠️ Installation

### 1. Clone the Repository

'''bash
git clone <This-repository-url>
cd mobile-api
'''

### 2. Install Dependencies

Using npm:
'''bash
npm install
'''

Using pnpm:
'''bash
pnpm install
'''

### 3. Environment Setup

Create a `.env` file in the root directory and configure the following variables:

'''env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=mobileapi_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=3001
NODE_ENV=development
'''

### 4. Database Setup

1. **Create Database:**
'''sql
CREATE DATABASE murakoze;
'''

## 🚀 Running the Project

### Development Mode

Start the development server with hot reload:

'''bash
npm run dev
'''

The API will be available at: `http://localhost:3001`

### Production Mode

'''bash
npm start
'''

## 📚 API Documentation

Once the server is running, you can access the interactive Swagger documentation at:

'''
http://localhost:3001/api-docs
'''

### Quick API Overview

| Endpoint Category | Base URL | Description |
|------------------|----------|-------------|
| Authentication | `/api/auth` | User signup, login |
| Businesses | `/api/businesses` | Business CRUD operations |
| Reviews | `/api/reviews` | Review and rating management |
| Users | `/api/users` | User profile management |
| Recommendations | `/api/recommendations` | AI-powered recommendations |
| Search | `/api/search` | Universal search functionality |
| Locations | `/api/locations` | Location and mapping services |
| Notifications | `/api/notifications` | Notification management |
| Analytics | `/api/analytics` | Platform analytics |

### Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

'''bash
Authorization: Bearer <your_jwt_token>
'''

Get a token by calling the login endpoint:
'''bash
POST /api/auth/login
{
  "email": "userexample.com",
  "password": "password123"
}
'''

## 🏗️ Project Structure

'''
mobile-api/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── AuthController.ts
│   │   ├── BusinessController.ts
│   │   ├── ReviewController.ts
│   │   └── ...
│   ├── routes/              # API route definitions
│   │   ├── auth.ts
│   │   ├── businesses.ts
│   │   └── ...
│   ├── middleware/          # Custom middleware
│   │   └── auth.ts
│   ├── config/             # Configuration files
│   │   └── db.ts
│   └── app.ts              # Express app setup
├── server.ts              # Server entry point
├── package.json
├── tsconfig.server.json   # TypeScript config for backend
└── README.md
'''

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server