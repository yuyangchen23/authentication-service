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

## Current limitations

- Data disappears when the server restarts
- Passwords are not hashed yet
- There is no database
- There are no authentication tokens
