# Nalanda Library Management System – Backend

## Overview
The **Nalanda Library Management System** is a backend application built with **Node.js, Express, MongoDB, and GraphQL**.  
It provides both **RESTful APIs** and **GraphQL APIs** to manage users, books, borrowing operations, and generate reports.

**Highlights**
- **JWT-based authentication with JWE encryption**
- **Role-based access control** (Admin & Member)
- **Comprehensive Postman test suite** (24 test cases)

---

##  Setup Instructions


```
1.Clone the Repository
git clone https://github.com/Dinesh0007000/Nalanda-library-system
cd Nalanda-library-system

2.Install Dependencies
npm install

3.Configure Environment Variables
Create a .env file in the project root with the following values:
env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret-key>
JWE_ENCRYPTION_KEY=<32-byte-base64-encryption-key>

Generate a secure 32-byte Base64 key for JWE_ENCRYPTION_KEY:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

Example .env:
env
PORT=5000
MONGO_URI=mongodb://localhost:27017/nalanda
JWT_SECRET=mysecretkey123
JWE_ENCRYPTION_KEY=randombase64keyexample

4.Run the Application
npm run dev
Server: http://localhost:5000
GraphQL: http://localhost:5000/graphql
```

## Testing the API
API Documentation link::[link](https://documenter.getpostman.com/view/47838217/2sB3BLjnLJ)

## API Documentation
```
REST Endpoints: /api/users, /api/books, etc.

GraphQL Operations: listBooks, borrowBook, etc.

Includes authentication details, request parameters, and example responses.

Documentation is publicly accessible via the provided Postman link.
```

## Features
### User Management
```
Register users with name, email, password

Login with JWT token generation

Roles: Admin (only one allowed) & Member
```

### Book Management
```
Add, update, delete books (Admin only)

List books with pagination & filtering (all users)
```

### Borrowing System
```
Borrow & return books (Members only)

View borrow history (Members only)
```

### Reports & Aggregations

```
Most borrowed books (Admin)

Active members (excluding Admins) (Admin)

Book availability summary (Admin)
```

### Authentication & Authorization
```
JWT with JWE encryption

Role-based access control via middleware & resolvers
```

## Project Status
```
All 24 Postman tests completed successfully
Single Admin constraint enforced
CRUD operations, authentication, and reports implemented
Optional tasks (AWS deployment, BitBucket version control) not implemented
MongoDB schemas with relationships & aggregation queries included
```

## Submission Details
```
GitHub Repository:[Git repo](https://github.com/Dinesh0007000/Nalanda-library-system

Postman API Document link :[link](https://documenter.getpostman.com/view/47838217/2sB3BLjnLJ)

Notes: API docs are publicly accessible. Optional bonus tasks not implemented due to time constraints.
```

## Acknowledgments
Special thanks to Huemn Interactive Private Limited for this opportunity.
