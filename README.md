# Echo API

A NestJS-based API for managing reviews, tags, map markers, and user authentication.

## 🚀 Tech Stack

- [NestJS](https://nestjs.com/) v11.1.0
- [MongoDB](https://www.mongodb.com/) with Mongoose v8.14.2
- [TypeScript](https://www.typescriptlang.org/) v5.8.3
- JWT Authentication
- Class Validation

## 📁 Project Structure

```
src/
├── api/
│   ├── auth/             # Authentication module
│   ├── map-markers/      # Map markers feature
│   ├── reviews/          # Reviews feature
│   ├── tags/            # Tags feature
│   ├── users/           # Users feature
│   └── module-exporter.ts
├── infra/
│   └── env/             # Environment configurations
├── models/
│   └── roles.ts         # Role definitions
├── schemas/             # MongoDB schemas
│   ├── map-markers.schema.ts
│   ├── reviews.schema.ts
│   ├── reviews-tagged.schema.ts
│   ├── tags.schema.ts
│   └── users.schema.ts
├── utils/               # Utility functions
├── app.module.ts        # Main application module
└── main.ts             # Application entry point
```

## 🛣️ API Routes

### Auth
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Users
- `POST /api/users` - Create user (Admin)
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user

### Reviews
- `POST /api/reviews` - Create review (Admin)
- `GET /api/reviews` - List all reviews
- `GET /api/reviews/:key` - Get review by key
- `PATCH /api/reviews/:key` - Update review (Admin)
- `DELETE /api/reviews/:key` - Soft delete review (Admin)

### Tags
- `POST /api/tags` - Create tag (Admin)
- `GET /api/tags` - List all tags
- `PATCH /api/tags/:id` - Update tag (Admin)

### Map Markers
- `POST /api/map-markers` - Create map marker (Admin)
- `GET /api/map-markers` - List all map markers
- `GET /api/map-markers/:id` - Get map marker by ID
- `PATCH /api/map-markers/:id` - Update map marker (Admin)
- `DELETE /api/map-markers/:id` - Delete map marker (Admin)

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Project
ENVIRONMENT='development'
NODE_ENV_MESSAGE='Development Environment'
PORT=3001

# Database
MONGODB_URI='mongodb://username:password@host:port/database'
MONGODB_DATABASE='echo'

# Auth
JWT_ISSUER='your-issuer'
JWT_EXPIRES_IN_SECONDS='3600'
JWT_SECRET_PUBLIC='your-public-key'
JWT_SECRET_PRIVATE='your-private-key'
```

## 📦 Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run start:dev
```

## 🛠️ Available Scripts

```bash
# Build
npm run build

# Development
npm run start:dev

# Production
npm run start:prod

# Tests
npm run test
npm run test:e2e
npm run test:cov

# Code formatting
npm run format
npm run lint
```

## 📝 Features

- JWT-based authentication
- Role-based access control (Admin/User)
- MongoDB integration with Mongoose
- CRUD operations for reviews, tags, and map markers
- Soft delete functionality
- Input validation using class-validator
- Environment-based configuration
- Error handling middleware
- Code formatting with Prettier
- ESLint for code quality

## 🔐 Authentication

The API uses JWT tokens for authentication. Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## 👥 Role-Based Access

Two main roles are supported:
- `admin`: Full access to all endpoints
- `user`: Limited access to public endpoints

## 🧪 Testing

The project includes unit tests and e2e tests:

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Generate test coverage
npm run test:cov
```

📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
