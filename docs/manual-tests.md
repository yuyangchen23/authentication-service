# Manual Tests

Base URL: `http://localhost:3000`

These checks assume local development uses Docker Postgres on host port `5433`.

## 1. Environment File

Check `.env` has a database URL that matches `compose.yaml`:

```env
DATABASE_URL="postgresql://auth-user:auth_password@localhost:5433/authentication?schema=public"
PORT=3000
NODE_ENV=development
```

Expected result:

- `DATABASE_URL` starts with `postgresql://`
- host port is `5433`
- database name is `authentication`
- user/password match `compose.yaml`

## 2. Database Container Starts

Start Postgres:

```sh
docker compose up -d
```

Check status:

```sh
docker compose ps
```

Expected result:

- service `postgres` is `Up`
- container name is `authentication-postgres`
- ports include `5433->5432`

Example:

```txt
authentication-postgres   postgres:17   Up   0.0.0.0:5433->5432/tcp
```

## 3. Prisma Schema Validates

Request:

```sh
npx prisma validate
```

Expected result:

```txt
The schema at prisma/schema.prisma is valid
```

## 4. Migration Applies

Run migrations:

```sh
npx prisma migrate dev
```

Expected result:

- Prisma connects to database `authentication`
- migrations apply successfully
- Prisma Client is generated

Check migration status:

```sh
npx prisma migrate status
```

Expected result:

```txt
Database schema is up to date
```

## 5. Typecheck

Request:

```sh
npm run typecheck
```

Expected result:

- exits successfully
- no TypeScript errors

## 6. Production Build

Request:

```sh
npm run build
```

Expected result:

- exits successfully
- compiled files are created in `dist`

## 7. Development Server Starts

Start the API:

```sh
npm run dev
```

Expected result:

```txt
Server is running at http://localhost:3000
```

Keep this process running while testing the API endpoints below.

## 8. Health Check

Request:

```sh
curl -i http://localhost:3000/health
```

Expected status: `200`

Expected response:

```json
{
  "status": "ok"
}
```

## 9. Register User

Request:

```sh
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Expected status: `201`

Expected response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "generated-user-id",
    "email": "test@example.com",
    "createdAt": "generated-timestamp"
  }
}
```

## 10. Register Duplicate Email

Run the same request again:

```sh
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Expected status: `409`

Expected response:

```json
{
  "success": false,
  "message": "A user with this email already exists"
}
```

## 11. Register Invalid Email

Request:

```sh
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"not-an-email","password":"password123"}'
```

Expected status: `400`

Expected response:

```json
{
  "success": false,
  "message": "Email must be a valid email address"
}
```

## 12. Register Missing Fields

Request:

```sh
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{}'
```

Expected status: `400`

Expected response:

```json
{
  "success": false,
  "message": "Email and password are required"
}
```

## 13. Register Short Password

Request:

```sh
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"short@example.com","password":"short"}'
```

Expected status: `400`

Expected response:

```json
{
  "success": false,
  "message": "Password must contain at least 8 characters"
}
```

## 14. Login User

Use an email and password that were registered successfully.

Request:

```sh
curl -i -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Expected status: `200`

Expected response:

```json
{
  "success": true,
  "message": "Login endpoint reached",
  "data": {
    "id": "generated-user-id",
    "email": "test@example.com"
  }
}
```

## 15. Login Invalid Credentials

Request:

```sh
curl -i -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrongpassword"}'
```

Expected status: `401`

Expected response:

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## 16. List Users

Request:

```sh
curl -i http://localhost:3000/auth/users
```

Expected status: `200`

Expected response:

```json
{
  "users": [
    {
      "id": "generated-user-id",
      "email": "test@example.com",
      "createdAt": "generated-timestamp",
      "updatedAt": "generated-timestamp"
    }
  ]
}
```

## 17. Delete Development Users

This endpoint is development-only.

Request:

```sh
curl -i -X DELETE http://localhost:3000/auth/users
```

Expected status in development: `200`

Expected response:

```json
{
  "success": true,
  "message": "All temporary users were removed"
}
```

Confirm the users were removed:

```sh
curl -i http://localhost:3000/auth/users
```

Expected status: `200`

Expected response:

```json
{
  "users": []
}
```

## 18. Unknown Route

Request:

```sh
curl -i http://localhost:3000/does-not-exist
```

Expected status: `404`

Expected response:

```json
{
  "success": false,
  "message": "Route GET /does-not-exist was not found"
}
```

## 19. Production Server Smoke Test

Stop the development server, then build and start the compiled app with production mode:

```sh
npm run build
NODE_ENV=production npm start
```

Expected result:

```txt
Server is running at http://localhost:3000
```

Check health:

```sh
curl -i http://localhost:3000/health
```

Expected status: `200`

Expected response:

```json
{
  "status": "ok"
}
```

Check the development-only delete endpoint is not available when `NODE_ENV` is not `development`:

```sh
curl -i -X DELETE http://localhost:3000/auth/users
```

Expected status: `404`

Expected response:

```json
{
  "success": false,
  "message": "Route not found"
}
```
