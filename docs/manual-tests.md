# Manual API Tests

Base URL: `http://localhost:3000`

Start the server before running these:

```sh
npm run dev
```

The `id` values in responses are generated UUIDs, so they will be different each time.

## 1. Health Check

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

## 2. Register User

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
    "email": "test@example.com"
  }
}
```

## 3. Register Duplicate Email

Request:

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

## 4. Register Email With Uppercase Letters

Request:

```sh
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"Test@example.com","password":"password123"}'
```

Expected status: `201`

Expected response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "generated-user-id",
    "email": "test@example.com"
  }
}
```

## 5. Register Duplicate User

Run the same register request again:

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

## 6. Register Invalid Email

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

## 7. Register Missing Email

Request:

```sh
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"","password":"password123"}'
```

Expected status: `400`

Expected response:

```json
{
  "success": false,
  "message": "Email must be a valid email address"
}
```

## 8. Register Short Password

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

## 9. Login User

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

## 10. Login Invalid Credentials

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

## 11. List Users

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
      "email": "test@example.com"
    }
  ]
}
```

## 12. Delete Temporary Users

Request:

```sh
curl -i -X DELETE http://localhost:3000/auth/users
```

Expected status: `200`

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

## 13. Unknown Route

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
