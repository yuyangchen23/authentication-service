# Authentication Service

A backend authentication API built with Typescript, Node.js and Express

## Current Features

- Health endpoint
- User registration
- User login
- Basic request validation
- Temporary in-memory user storage

## Run locally

npm install
npm run dev

## Endpoints

GET /health
POST /auth/register
POST /auth/login
GET /auth/users

## Password security

- Passwords are hashed using bcrypt before being written to PostgreSQL.
- The API never returns password hashes in user responses.
- Login uses bcrypt comparison rather than plain-text password comparison.

## Current limitations

- JWT authentication has not been implemented
- Login does not yet issue access tokens
- Email verification is not implemented
- Password reset is not implemented
- Rate limiting is not implemented

