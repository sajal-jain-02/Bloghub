# BlogHub Backend 📝

**REST API Backend for BlogHub — A Blogging Platform**

BlogHub Backend is a RESTful API built with **Node.js, Express.js, and MongoDB**. It powers the core functionality of BlogHub, including user authentication, blog post management, comments, likes, bookmarks, user profiles, and follow relationships.

The project focuses on building a structured backend with secure authentication, reusable middleware, database relationships, request validation, and reliable data handling.

---

## ✨ Features

### 1. Authentication & Authorization
- User registration and login.
- Password hashing using bcrypt.
- JWT-based authentication.
- HTTP-only cookie-based token storage.
- Protected API routes.
- Get currently authenticated user details.
- JWT token expiration.

### 2. Blog Post Management
- Create, read, update, and delete posts.
- Fetch all posts with pagination.
- Search posts.
- Sort posts by newest or oldest.
- Fetch individual posts.
- Fetch posts created by a specific user.
- Validate post and user ObjectIds.

### 3. Like System
- Like a post.
- Unlike a post.
- Display total likes using `likesCount`.
- Check whether the authenticated user liked a post using `isLiked`.
- Prevent duplicate likes using a compound unique index.

### 4. Comment System
- Create comments on posts.
- Fetch comments.
- Update comments.
- Delete comments.
- Automatically delete associated comments when a post is deleted.

### 5. Bookmark System
- Bookmark posts.
- Remove bookmarks.
- Prevent duplicate bookmarks using database-level uniqueness.

### 6. User Profile
- Fetch the authenticated user's profile.
- View public user profiles.
- Update profile bio.
- Upload profile pictures.
- Upload cover images.
- Keep private account information out of public profile responses.

### 7. Follow System
- Follow users.
- Unfollow users.
- Fetch followers.
- Fetch following.
- Display follower and following counts.
- Check whether the current user follows another user.

### 8. Image Upload
- ImageKit integration for image storage.
- Multer for handling multipart file uploads.
- File type validation.
- Maximum file size restriction.

### 9. Additional Backend Features
- Centralized authentication middleware.
- Optional authentication for public post APIs.
- Request input validation.
- MongoDB ObjectId validation middleware.
- Idempotency support for selected post mutations.
- MongoDB transactions for related deletion operations.
- Cascade cleanup of likes, comments, and bookmarks when a post is deleted.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcrypt | Password hashing |
| Multer | File upload handling |
| ImageKit | Image storage |
| Postman | API testing |
| Git & GitHub | Version control |

---

## 🏗️ Backend Architecture

BlogHub follows a **Route → Middleware → Controller → Model → Database** architecture.

```text
Client Request
      |
      v
Express Routes
      |
      v
Middlewares
(Authentication / Validation)
      |
      v
Controllers
(Business Logic)
      |
      v
Mongoose Models
      |
      v
MongoDB Database
      |
      v
JSON Response
```

### Architecture Explanation

- **Routes:** Define API endpoints and connect them to controllers.
- **Middlewares:** Handle authentication, validation, file uploads, and idempotency.
- **Controllers:** Contain the main application logic.
- **Models:** Define database schemas, relationships, and indexes.
- **Services:** Handle reusable operations such as ImageKit integration and idempotency processing.
- **Database:** MongoDB stores application data.

---

## 📂 Project Structure

```text
BlogHub-backend/
│
├── server.js
│
├── src/
│   ├── app.js
│   │
│   ├── database/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── post.model.js
│   │   ├── comment.model.js
│   │   ├── bookmark.model.js
│   │   ├── like.model.js
│   │   ├── follow.model.js
│   │   └── idempotencyKey.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── post.routes.js
│   │   ├── comment.routes.js
│   │   ├── bookmark.routes.js
│   │   └── profile.routes.js
│   │
│   ├── controler/
│   │   ├── auth.controller.js
│   │   ├── post.controller.js
│   │   ├── comment.controller.js
│   │   ├── bookmark.controller.js
│   │   └── profile.controller.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── optionalAuth.middleware.js
│   │   ├── idempotency.middleware.js
│   │   ├── validateObjectId.middleware.js
│   │   └── upload.middleware.js
│   │
│   └── services/
│       ├── idempotency.service.js
│       └── imagekit.service.js
│
└── README.md
```

---

## 🔐 Authentication Flow

BlogHub uses JWT-based authentication with HTTP-only cookies.

1. The user registers with their account details.
2. The password is hashed using bcrypt before saving it to MongoDB.
3. The user logs in with their credentials.
4. The backend verifies the credentials.
5. A JWT is generated and stored in an HTTP-only cookie.
6. Protected routes use authentication middleware to verify the JWT.
7. The authenticated user's information becomes available to the controller through `req.user`.

### Optional Authentication

Some public post APIs support both authenticated and anonymous users.

- Logged-in users receive personalized interaction data.
- Anonymous users can still access public posts.
- `isLiked` returns `false` for anonymous users.
- Invalid or expired authentication tokens are rejected.

---

## 📊 Post Interaction Fields

Post responses include two dynamically calculated fields:

| Field | Description |
|---|---|
| `likesCount` | Total number of likes on a post |
| `isLiked` | Whether the current authenticated user has liked the post |

These values are calculated using the Like collection rather than storing duplicate interaction data in the Post document.

---

## 🌐 API Modules

| Module | Functionality |
|---|---|
| Authentication | Register, login, logout, current user |
| Posts | CRUD, search, pagination, sorting |
| Comments | Create, read, update, delete |
| Likes | Like and unlike posts |
| Bookmarks | Add and remove bookmarks |
| Profiles | View and update profiles |
| Follow | Follow, unfollow, followers, following |

All endpoints use the `/api` base path.

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have installed:

- Node.js
- MongoDB or a MongoDB Atlas account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/sajal-jain-02/Bloghub.git
```

### 2. Navigate to Backend Directory

```bash
cd Bloghub/BlogHub-backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the backend root directory.

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

Replace the placeholder values with your actual credentials.

### 5. Start the Server

```bash
node server.js
```

The server runs at:

```text
http://localhost:3000
```

---

## 🔒 Security & Data Integrity

- Passwords are hashed before storage.
- JWT authentication protects private routes.
- HTTP-only cookies are used for token storage.
- Input validation prevents invalid request data.
- ObjectId validation protects resource-specific routes.
- Compound unique indexes prevent duplicate likes and bookmarks.
- MongoDB transactions maintain consistency during related deletion operations.
- Idempotency support helps prevent duplicate processing of selected mutations.
- Image uploads are restricted by file type and size.

---

## 🧪 API Testing

API endpoints can be tested using **Postman**.

Test the main workflows:

- User registration and login.
- Creating and managing posts.
- Adding and managing comments.
- Liking and unliking posts.
- Creating and removing bookmarks.
- Updating user profiles.
- Uploading profile and cover images.
- Following and unfollowing users.

---

## 🎯 Learning Objectives

This project was developed to gain practical experience with:

- RESTful API development.
- Node.js and Express.js.
- MongoDB schema design and Mongoose relationships.
- Authentication and authorization.
- Middleware-based request processing.
- Database indexing and constraints.
- Transactions and data consistency.
- File uploads and third-party integrations.
- Backend architecture and API design.

---

## 👨‍💻 Author

**Sajal Jain**

---

**BlogHub Backend — Built with Node.js, Express.js & MongoDB.**