# BlogHub 📝

A modern full-stack MERN blogging platform featuring secure JWT cookie authentication, ImageKit media uploads, interactive post engagement (likes, comments, bookmarks), and rich author profiles with a social follow network.

🔗 **Live Demo:** [https://bloghub-sandy.vercel.app](https://bloghub-sandy.vercel.app)

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion, Lucide React, Axios |
| **Backend** | Node.js, Express.js, MongoDB Atlas, Mongoose ODM |
| **Auth & Media** | JWT (HTTP-only cookies), bcrypt, ImageKit SDK, Multer |
| **Deployment** | Vercel (Frontend SPA), Render (Backend API) |

---

## ✨ Key Features

- **Secure Authentication**: User registration, login, and logout using JWT stored in HTTP-only cross-site cookies with production `SameSite` & `secure` flags.
- **Post Authoring & Discovery**: Create, edit, and delete blog posts with image uploads, tag filtering, global search, pagination, and sorting.
- **Interactive Engagement**: Instant post likes with counter tracking, threaded comments with author management, and a dedicated bookmarks library.
- **Author Profiles & Social Graph**: Public user profiles, bio updates, custom avatar & cover image uploads, and follow/unfollow capability.
- **Robust Architecture**: Transaction-backed cascade deletions, MongoDB ObjectId validation middleware, idempotency support, and optional auth for public feeds.

---

## 📂 Complete Project Structure

```text
BlogHub/
├── BlogHub-backend/
│   ├── server.js                        # Server entry point & database connection
│   ├── package.json
│   └── src/
│       ├── app.js                       # Express app configuration & middleware setup
│       ├── database/
│       │   └── db.js                    # MongoDB connection logic
│       ├── controler/
│       │   ├── auth.controller.js       # Register, login, logout, current user
│       │   ├── bookmark.controller.js   # Bookmark & unbookmark actions
│       │   ├── comment.controller.js    # Create, update, delete & fetch comments
│       │   ├── like.controller.js       # Like & unlike handling
│       │   ├── post.controller.js       # CRUD operations, search, pagination
│       │   └── profile.controller.js    # Profile data, uploads, follow/unfollow
│       ├── middlewares/
│       │   ├── auth.middleware.js       # JWT cookie verification
│       │   ├── optionalAuth.middleware.js # Optional user identification for public feeds
│       │   ├── idempotency.middleware.js# Duplicate mutation prevention
│       │   ├── upload.middleware.js     # Multer file parsing for ImageKit
│       │   └── validateObjectId.middleware.js # MongoDB ObjectId validation
│       ├── models/
│       │   ├── bookmark.model.js
│       │   ├── comment.model.js
│       │   ├── follow.model.js
│       │   ├── idempotencyKey.model.js
│       │   ├── like.model.js
│       │   ├── post.model.js
│       │   └── user.model.js
│       ├── routes/
│       │   ├── auth.routes.js           # /api/auth routes
│       │   ├── bookmark.routes.js       # /api/bookmarks routes
│       │   ├── comment.routes.js        # /api/comment routes
│       │   ├── post.routes.js           # /api/post routes
│       │   └── profile.routes.js        # /api/profile routes
│       └── services/
│           ├── idempotency.service.js   # Idempotency cache handler
│           └── imagekit.service.js      # ImageKit upload integration
│
├── BlogHub-frontend/
│   ├── index.html                       # HTML template
│   ├── package.json
│   ├── tailwind.config.js               # Tailwind CSS styling setup
│   ├── vite.config.js                   # Vite build configuration
│   ├── vercel.json                      # Vercel SPA client routing rewrites
│   └── src/
│       ├── App.jsx                      # Route definitions & app layout
│       ├── main.jsx                     # React DOM entry point
│       ├── index.css                    # Global Tailwind styles
│       ├── assets/                      # Static brand assets & images
│       ├── components/
│       │   ├── auth/                    # Protected route wrapper
│       │   ├── landing/                 # Landing page sections & marketing UI
│       │   ├── layout/                  # Main AppLayout & navigation bar
│       │   └── ui/                      # Skeletons, text gradients & effects
│       ├── config/
│       │   └── api.js                   # Centralized API base URL config
│       ├── context/
│       │   └── AuthContext.jsx          # User auth state provider & methods
│       ├── lib/
│       │   └── utils.ts                 # Styling utilities (cn / clsx / twMerge)
│       └── pages/
│           ├── AuthPage.jsx             # Sign in / Sign up page
│           ├── BookmarksPage.jsx        # Saved posts page
│           ├── ExplorePage.jsx          # Public feed, search & tag filter page
│           ├── LandingPage.jsx          # Homepage for visitors
│           ├── PostDetailPage.jsx       # Single article, comments & likes page
│           ├── ProfilePage.jsx          # User profile, authored posts & followers
│           └── WritePage.jsx            # Create & publish blog post page
│
└── README.md                            # Project documentation
```

---

## 📡 API Endpoints

All backend routes are mounted under `/api`.

| Module | Method | Endpoint | Access | Description |
|---|---|---|---|---|
| **Auth** | `POST` | `/api/auth/register` | Public | Register a new user |
| | `POST` | `/api/auth/login` | Public | Authenticate user & issue HTTP-only JWT cookie |
| | `POST` | `/api/auth/logout` | Public | Clear authentication cookie |
| | `GET` | `/api/auth/me` | Protected | Fetch current logged-in user profile |
| **Posts** | `POST` | `/api/post` | Protected | Publish a new blog post |
| | `GET` | `/api/post` | Public / Optional | Get all posts with search, pagination & sorting |
| | `GET` | `/api/post/:id` | Public / Optional | Get single post by ID |
| | `GET` | `/api/post/user/:userId` | Public / Optional | Get all posts created by a specific user |
| | `PATCH` | `/api/post/:id` | Protected | Update post title, content, or cover image |
| | `DELETE` | `/api/post/:id` | Protected | Delete post and cascade delete comments/likes |
| **Likes** | `POST` | `/api/post/:postId/like` | Protected | Like a post |
| | `DELETE` | `/api/post/:postId/like` | Protected | Remove like from a post |
| **Comments** | `POST` | `/api/comment/:postId/comments` | Protected | Add a comment to a post |
| | `GET` | `/api/comment/:postId/comments` | Public | List comments on a post |
| | `PATCH` | `/api/comment/:commentId` | Protected | Edit comment content |
| | `DELETE` | `/api/comment/:commentId` | Protected | Delete a comment |
| **Bookmarks** | `GET` | `/api/bookmarks` | Protected | Retrieve all saved bookmarks for user |
| | `POST` | `/api/bookmarks/:postId` | Protected | Bookmark a post |
| | `DELETE` | `/api/bookmarks/:postId` | Protected | Remove a post from bookmarks |
| **Profile** | `GET` | `/api/profile/me` | Protected | Fetch private profile & user statistics |
| | `PATCH` | `/api/profile/me` | Protected | Update personal bio |
| | `POST` | `/api/profile/me/profile-photo` | Protected | Upload profile photo (ImageKit) |
| | `POST` | `/api/profile/me/cover-photo` | Protected | Upload cover banner photo (ImageKit) |
| | `GET` | `/api/profile/:userId` | Public / Optional | View public profile by username or user ID |
| | `POST` | `/api/profile/:userId/follow` | Protected | Follow a user |
| | `DELETE` | `/api/profile/:userId/follow` | Protected | Unfollow a user |
| | `GET` | `/api/profile/:userId/followers`| Public / Optional | View user followers list |
| | `GET` | `/api/profile/:userId/following`| Public / Optional | View user following list |

---

## ⚡ Local Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/sajal-jain-02/Bloghub.git
cd Bloghub
```

### 2. Backend Setup

```bash
cd BlogHub-backend
npm install
```

Create `.env` inside `BlogHub-backend/`:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

Start the backend:
```bash
npm run dev
# or
node server.js
```

### 3. Frontend Setup

```bash
cd ../BlogHub-frontend
npm install
```

Create `.env` inside `BlogHub-frontend/`:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the frontend:
```bash
npm run dev
```

The application will be live at `http://localhost:5173`.

---

## 👨‍💻 Author

**Sajal Jain**
- GitHub: [@sajal-jain-02](https://github.com/sajal-jain-02)
