# Nalanda Library Management System Backend

## Overview
This is a backend system for the Nalanda Library Management System, developed using Node.js, Express, MongoDB, and GraphQL. The application provides a RESTful API and a GraphQL API to manage users, books, borrowing operations, and generate reports. It implements JWT-based authentication with JWE encryption and enforces role-based access control for Admin and Member roles.

## Setup Instructions
Follow these steps to set up and run the application locally:
```
1. ###Clone the Repository:
   git clone <https://github.com/Dinesh0007000/Nalanda-library-system>
   cd Nalanda-library-system

2. ###Install Dependencies:
   npm install

3.###Configure Environment Variables:

Create a .env file in the root directory.
Add the following variables:
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret-key>
JWE_ENCRYPTION_KEY=<32-byte-base64-encryption-key>

Generate a JWE_ENCRYPTION_KEY using:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

Example .env:
PORT=5000
MONGO_URI=mongodb://localhost:27017/nalanda
JWT_SECRET=mysecretkey123
JWE_ENCRYPTION_KEY=randombase64keyexample



4.###Run the Application:
npm run dev

The server will start on http://localhost:5000, with GraphQL available at http://localhost:5000/graphql.

```

```
##Test the API:

Import the included Postman collection (tests/nalanda-tests.json) and environment (tests/nalanda-env.json) into Postman.
Run the 24 test cases to verify functionality.
```

```
##API Documentation

Postman API Documentation

Covers REST endpoints (e.g., /api/users, /api/books) and GraphQL operations (e.g., listBooks, borrowBook).
Includes request parameters, authentication details, and example responses.
```

```
##Features

1.###User Management:

Register users with name, email, and password.
Login with email and password, returning a JWT token.
Roles: Admin (single instance) and Member with role-based access.


2.###Book Management:

Add, update, and delete books (Admin only).
List books with pagination and filtering (all users).


3.###Borrowing System:

Borrow and return books (Member only).
View borrow history (Member only).


4.###Reports and Aggregations:

Most borrowed books (Admin only).
Active members (Admin only, excludes Admins).
Book availability summary (Admin only).


5.###Authentication and Authorization:

JWT with JWE encryption for secure token handling.
Role-based access control using middleware and resolvers.


```
All 24 Postman tests have been successfully completed, covering CRUD operations, authentication, and reports.
The single Admin constraint is enforced during registration.
Optional tasks (deployment on AWS and version control with BitBucket) have not been implemented.
The codebase includes MongoDB schemas (Users, Books, Borrows) with relationships and aggregation queries for reports.
```
```
##Submission Details

GitHub Repository: [git repo](https://github.com/Dinesh0007000/Nalanda-library-system)
Postman Collection: Included in tests/nalanda-tests.json
Postman Environment: Included in tests/nalanda-env.json
Additional Notes: API documentation is publicly accessible via the provided link. No optional bonus tasks were implemented due to time constraints.
```

```
##Acknowledgments
Thank you to Huemn Interactive Private Limited for this opportunity.
```
