# Yayo API Endpoints

## Authentication

### POST /api/auth/register
Register a new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

### POST /api/auth/login
Login user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### POST /api/auth/logout
Logout user

### POST /api/auth/forgot-password
Request password reset
```json
{
  "email": "user@example.com"
}
```

### POST /api/auth/reset-password
Reset password with token
```json
{
  "token": "reset_token",
  "new_password": "newpassword123"
}
```

---

## Users

### GET /api/users/:id
Get user profile

### PUT /api/users/:id
Update user profile

### GET /api/users/:id/listings
Get user's listings

### GET /api/users/:id/reviews
Get reviews for a user

---

## Listings

### GET /api/listings
Get all listings with filters
```
Query params: category, city, min_price, max_price, search, sort, page, limit
```

### POST /api/listings
Create new listing
```json
{
  "title": "Apartment in Kinshasa",
  "description": "Beautiful 2-bedroom apartment",
  "category_id": 1,
  "price": 500,
  "city": "Kinshasa",
  "neighborhood": "Gombe",
  "address": "123 Main Street"
}
```

### GET /api/listings/:id
Get listing details

### PUT /api/listings/:id
Update listing

### DELETE /api/listings/:id
Delete listing

### POST /api/listings/:id/photos
Upload photos for listing

### POST /api/listings/:id/favorite
Add listing to favorites

### DELETE /api/listings/:id/favorite
Remove listing from favorites

---

## Messages

### GET /api/messages
Get user's messages

### GET /api/messages/:conversationId
Get messages in a conversation

### POST /api/messages
Send a message
```json
{
  "recipient_id": "user-id",
  "listing_id": "listing-id",
  "content": "Hi, I'm interested in this listing"
}
```

### PUT /api/messages/:id/read
Mark message as read

---

## Reviews

### GET /api/users/:id/reviews
Get reviews for a user

### POST /api/reviews
Create a review
```json
{
  "reviewed_user_id": "user-id",
  "listing_id": "listing-id",
  "rating": 5,
  "comment": "Great experience!"
}
```

---

## Categories

### GET /api/categories
Get all categories

### GET /api/categories/:id
Get category details

---

## Admin

### GET /api/admin/dashboard
Admin dashboard statistics

### GET /api/admin/users
Manage users

### GET /api/admin/listings
Manage listings

### GET /api/admin/reports
View user reports

### PUT /api/admin/reports/:id
Resolve report
