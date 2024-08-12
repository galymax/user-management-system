# User Management System
A full-stack application for managing users, roles, and permissions.

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Prerequisites](#prerequisites)
5. [Installation and Running with Docker](#installation-and-running-with-docker)
6. [Manual Installation](#manual-installation)
7. [API Endpoints](#api-endpoints)

## Overview

This User Management System is a full-stack application that allows for the creation and management of user accounts, roles, and permissions. It provides a RESTful API backend built with Node.js and Express, and a frontend built with Vue.js.

## Features

- User account management (create, read, update, delete)
- Role management (create, read, update, delete)
- Permission management (create, read, delete)
- Assign roles to users
- Assign permissions to roles
- RESTful API
- Frontend interface

## Tech Stack

- Backend:
  - Node.js
  - Express.js
  - MongoDB (with Mongoose ORM)
- Frontend:
  - Vue.js
  - Vuetify
- DevOps:
  - Docker
  - Docker Compose

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Docker
- Docker Compose

## Installation and Running with Docker

1. Clone the repository:
   ```
   git clone git@github.com:galymax/user-management-system.git
   cd user-management-system
   ```

2. Build and run the Docker containers:
   ```
   docker-compose up --build
   ```

3. Open your browser and navigate to `http://localhost:8080` to access the application.

The backend API will be available at `http://localhost:3000`.

To stop the application, use:
```
docker-compose down
```

## Manual Installation

If you prefer to run the application without Docker, follow these steps:

1. Ensure you have Node.js (v14.0.0 or later) and MongoDB (v4.0 or later) installed.

2. Clone the repository:
   ```
   git clone git@github.com:galymax/user-management-system.git
   cd user-management-system
   ```

3. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

4. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/user_management
   ```

5. Start the backend server:
   ```
   npm start
   ```

6. In a new terminal, install and run the frontend:
   ```
   cd ../frontend
   npm install
   npm run serve
   ```

7. Open your browser and navigate to `http://localhost:8080` to access the application.

## API Endpoints

- Users:
  - GET /api/users - List all users
  - POST /api/users - Create a new user
  - GET /api/users/:id - Get a specific user
  - PUT /api/users/:id - Update a user
  - DELETE /api/users/:id - Delete a user
  - POST /api/users/:id/roles - Assign roles to a user

- Roles:
  - GET /api/roles - List all roles
  - POST /api/roles - Create a new role
  - DELETE /api/roles/:id - Delete a role
  - POST /api/roles/:id/permissions - Assign permissions to a role

- Permissions:
  - GET /api/permissions - List all permissions
  - POST /api/permissions - Create a new permission
  - DELETE /api/permissions/:id - Delete a permission
