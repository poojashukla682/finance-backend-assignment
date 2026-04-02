# Finance Data Processing and Access Control Backend

## Overview
This is a comprehensive, logically structured backend for a finance dashboard application. It provides user and role management, financial record keeping, analytics generation, and robust role-based access control (RBAC).

This project was built to demonstrate clean architecture, robust access control, request validation, and an understanding of modern backend engineering practices.

## Design Philosophy & Assumptions
1. **Zero-Setup Database (In-Memory)**: To make the application incredibly easy to review and run, the data persistence layer is implemented as an async mock database class (`src/models/db.js`) wrapping arrays. The interface is entirely asynchronous (using `Promise`s) which precisely mimics how a real database adapter (like Prisma or Mongoose) would operate. Dropping in a real DB would only require modifying `db.js`.
2. **Layered Architecture**: The application is separated into:
   - **Routes**: Request mapping.
   - **Controllers**: Request/response handling.
   - **Services**: Pure business logic and data aggregation.
   - **Mock Models**: Data access layer.
   - **Middlewares**: Unified error handling and reusable authentication/authorization pipelines.
3. **Role-Based Access Control (RBAC)**:
   - `Viewer`: Can view dashboard summaries.
   - `Analyst`: Can view records and dashboard summaries.
   - `Admin`: Can create/update users and records, as well as everything an Analyst can do.
4. **Validation**: Requests are validated at the route level using `express-validator` to ensure malformed data never reaches the business logic layer.
5. **Standardized Responses**: Responses use a standardized shape (`ApiResponse` utility) and custom error class (`ApiError`), funneling through a global error handler to prevent stack traces from leaking to the frontend.

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the server:**
   ```bash
   npm start
   ```
   Or for development mode (with auto-restart via nodemon):
   ```bash
   npm run dev
   ```

## Default Admin Credentials
When the server starts, it automatically seeds an initial Admin user so you can log in immediately and test the endpoints:
- **Email**: admin@finance.com
- **Password**: admin123

## API Documentation

### 1. Authentication (`/api/v1/auth`)
- `POST /login` - Login with email/password. Returns JWT token.
- `GET /me` - Get current logged-in user profile (Requires Auth).

### 2. User Management (`/api/v1/users`) - *Requires Admin Role*
- `GET /` - List all users.
- `GET /:id` - Get specific user.
- `POST /` - Create a new user (Viewer, Analyst, or Admin).
- `PUT /:id` - Update user role or status (active/inactive).

### 3. Financial Records (`/api/v1/records`)
- `GET /` - List all records. Allows query filtering `?type=income&category=salary` (Roles: Viewer, Analyst, Admin)
- `GET /:id` - Get a specific record (Roles: Viewer, Analyst, Admin)
- `POST /` - Create financial record (Role: Admin)
- `PUT /:id` - Update record (Role: Admin)
- `DELETE /:id` - Delete record (Role: Admin)

### 4. Dashboard Summary (`/api/v1/dashboard`)
- `GET /` - Generates high-level analytic summaries including net balance, total income/expenses, category-wise breakdown, and recent transactions (Roles: Viewer, Analyst, Admin).

## Technologies Used
- Node.js & Express.js
- JSON Web Tokens (JWT) for stateless authentication
- bcryptjs for password hashing
- express-validator for robust request body validation
- uuid for generating secure fake PKs
