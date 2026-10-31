# BlogHub Backend

A RESTful backend for **BlogHub**, a blog platform where users can create and manage posts, interact through comments, and bookmark posts.

## 🚀 Features

- **User Authentication** – User registration and login using JWT.
- **Post Management** – Create, read, update, and delete blog posts.
- **Search & Pagination** – Search posts and retrieve them with pagination and sorting.
- **Comment Management** – Create and manage comments on posts.
- **Bookmarks** – Save and remove bookmarked posts.
- **Idempotency** – Prevent duplicate processing of supported requests.
- **Data Validation** – Validate MongoDB ObjectIds.
- **Cascade Cleanup** – Delete associated comments and bookmarks when a post is deleted, using MongoDB transactions.

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt

## 📁 Project Structure

```text
BlogHub-backend/
│
├── server.js
├── package.json
│
└── src/
    ├── app.js
    │
    ├── database/
    │   └── db.js
    │
    ├── models/
    │   ├── user.model.js
    │   ├── post.model.js
    │   ├── comment.model.js
    │   ├── bookmark.model.js
    │   └── idempotencyKey.model.js
    │
    ├── routes/
    │   ├── auth.routes.js
    │   ├── post.routes.js
    │   ├── comment.routes.js
    │   └── bookmark.routes.js
    │
    ├── controler/
    │   ├── auth.controller.js
    │   ├── post.controller.js
    │   ├── comment.controller.js
    │   └── bookmark.controller.js
    │
    ├── middlewares/
    │   ├── auth.middleware.js
    │   ├── idempotency.middleware.js
    │   └── validateObjectId.middleware.js
    │
    └── services/
        └── idempotency.services.js
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sajal-jain-02/Bloghub.git
```

### 2. Navigate to the backend

```bash
cd Bloghub/BlogHub-backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the `BlogHub-backend` directory.

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

Add the JWT secret using the exact environment variable name referenced in your authentication code.

### 5. Start the server

```bash
node server.js
```

The server runs on the configured port (default: `3000`).

## 🔐 Authentication

BlogHub uses JWT-based authentication.

Protected routes require a valid authentication token. The authentication middleware verifies the token and attaches the authenticated user's information to the request.

## 📡 API Modules

| Module | Purpose |
|---|---|
| Authentication | Register, login, and user authentication |
| Posts | Create, retrieve, update, delete, search, and paginate posts |
| Comments | Manage comments on posts |
| Bookmarks | Add, retrieve, and remove bookmarks |

For exact endpoints, HTTP methods, request bodies, and response formats, refer to the route files in `src/routes/`.

## 🔒 Security Notes

- Keep `.env` private.
- Never commit JWT secrets or database credentials.
- Passwords are hashed before storage.
- Protected routes use authentication middleware.
- Duplicate bookmark entries are prevented through a unique compound index.

## 📌 Project Status

Backend development is in progress. Frontend integration will be added separately.

---

**Built as a learning project to understand backend development, REST APIs, authentication, database relationships, middleware, and real-world backend workflows.**