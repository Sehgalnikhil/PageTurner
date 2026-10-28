# 📚 PageTurner — Modern Book Management System (MERN Stack)

A production-grade, full-stack MERN (MongoDB, Express.js, React 18, Node.js) book management application with a professional matte UI/UX design. Catalog, search, filter, preview, bookmark, review, and manage book collections with real-time UI synchronization.

---

## ✨ Key Features & Functionality

### 1. Catalog & Discovery
- **📖 Complete CRUD Operations**: Create, read, update, and delete books with real-time UI synchronization and feedback alerts.
- **🔍 Instant Search**: Multi-field search across titles, author names, and ISBN identifiers.
- **⚡ Advanced Sorting**: Sort records by *Recently Added*, *Title (A-Z / Z-A)*, *Publication Year (Newest / Oldest)*, or *Highest Rated*.
- **🎛️ Dual View Modes**:
  - **Card Grid View**: Responsive matte cards with quick preview modal triggers and publication badges.
  - **Data Table View**: Spacious modern table layout with hover states, creator attribution, and inline actions.
- **📑 Server-Side Pagination**: Efficient limit & skip pagination querying MongoDB directly.
- **🔍 Detailed Quick Preview Modal**: Backdrop blur modal displaying structured book metadata without leaving the main page.

### 2. Reading List & Bookmarks (Global State)
- **🔖 Global Reading List Drawer**: Users can bookmark books from anywhere in the app (cards, table, or details page).
- **💾 LocalStorage Persistence**: Reading list state persists across browser reloads via React Context API.

### 3. Authentication & Role-Based Access Control
- **🔐 User Registration & Authentication**: Secure account creation and login with `bcrypt` password hashing.
- **🛡️ JWT Session Management**: JSON Web Tokens stored securely in localStorage with automatic Axios request interceptors.
- **👑 Role-Based Authorization**: Distinct **Admin** and **Member** permissions. Administrative routes (`/books/create`, `/books/edit/:id`, `/books/delete/:id`) are strictly guarded on both frontend (`ProtectedRoute`) and backend (`protect`, `admin` middleware).
- **⚡ 1-Click Demo Logins**: Dedicated **Admin Demo** and **Student Demo** autofill triggers on the login page for rapid testing.

### 4. Community Reviews & Ratings
- **⭐ Interactive Reviews**: Authenticated members can leave 1–5 star ratings and detailed written feedback on any book.
- **📊 Automatic Average Rating Calculation**: Book schemas dynamically recalculate and store the overall rating score.
- **👤 Mongoose Population**: Reviews and book creator details automatically populate user records (`username`, `email`).

### 5. Media & File Handling
- **🖼️ Multer Image Uploads**: Upload book cover images directly to the server with diskStorage and mime-type safety validation (JPG, JPEG, PNG, WEBP).
- **📁 Static Asset Serving**: Express static route serving `/uploads` with fallback cover art.

### 6. Streaming & System Utilities
- **🌊 Node.js Chunked Stream CSV Export**: Stream the entire book catalog as a downloadable CSV file (`GET /books/export/csv`) using binary Buffers and Node.js `Readable` streams without memory bottlenecks.
- **📡 Real-Time EventEmitter Audit Bus**: Custom Node.js `EventEmitter` instance logging audit trail records for book creation, updates, deletions, and user actions.
- **⏱️ HTTP Request Lifecycle Timing**: Middleware calculating and logging request durations (`res.on('finish')`).
- **🩺 Server Health Check**: Dedicated `/health` endpoint returning server uptime, timestamp, and database connectivity.
- **📮 Postman Collection**: Importable API collection file (`PageTurner-API.postman_collection.json`) containing all pre-configured endpoints.

---

## 🛠️ Tech Stack & Architecture

```
PageTurner/
├── backend/
│   ├── models/
│   │   ├── bookModel.js           # Mongoose schema for Book entity & reviews
│   │   └── userModel.js           # Mongoose schema for User entity (roles: user/admin)
│   ├── routes/
│   │   ├── booksRoute.js          # REST CRUD, Multer image upload, Stream CSV export
│   │   ├── authRoute.js           # User registration, login, and profile verification
│   │   └── systemRoute.js         # Runtime diagnostics, audit events, fs/stream demos
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT token verification & admin role guard
│   │   └── errorMiddleware.js     # Centralized 404 & error handling middleware
│   ├── utils/
│   │   └── eventBus.js            # Node.js EventEmitter audit logging
│   ├── config.js                  # Environment configuration & dotenv
│   ├── index.js                   # Express application entrypoint
│   └── PageTurner-API.postman_collection.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   └── ProtectedRoute.jsx   # Client-side auth & role route guard
│   │   │   ├── home/
│   │   │   │   ├── BookModal.jsx        # Quick preview modal
│   │   │   │   ├── BookSingleCard.jsx   # Single book card with bookmarking
│   │   │   │   ├── BooksCard.jsx        # Card grid container
│   │   │   │   └── BooksTable.jsx       # Data table container
│   │   │   ├── layout/
│   │   │   │   └── Footer.jsx           # Modern application footer
│   │   │   ├── Navbar.jsx               # Sticky navigation with reading list trigger
│   │   │   ├── ReadingListModal.jsx     # Slide-over reading list drawer
│   │   │   └── Spinner.jsx              # Loading spinner
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # Global authentication state
│   │   │   └── ReadingListContext.jsx   # Global bookmarks state
│   │   ├── pages/
│   │   │   ├── CreateBooks.jsx          # Add book form (Admin)
│   │   │   ├── DeleteBook.jsx           # Delete confirmation (Admin)
│   │   │   ├── EditBook.jsx             # Edit book metadata (Admin)
│   │   │   ├── Home.jsx                 # Catalog, search, filters & sort
│   │   │   ├── login.jsx                # Login form with validation & autofill
│   │   │   ├── Register.jsx             # User registration form with validation
│   │   │   └── ShowBook.jsx             # Detailed book overview & reviews
│   │   ├── services/
│   │   │   └── api.js                   # Centralized Axios instance with JWT interceptors
│   │   ├── App.jsx                      # React Router v6 route configuration
│   │   └── main.jsx                     # Root entrypoint with Context Providers
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally on port `27017` (or MongoDB Atlas URI)

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
# Express server starts on http://localhost:5555
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Vite dev server starts on http://localhost:5173
```

---

## 🔌 API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/books` | Public | Retrieve books with pagination, search, category filter, and sorting |
| `GET` | `/books/:id` | Public | Retrieve single book by ID with populated creator and reviews |
| `POST` | `/books` | Admin (JWT) | Create new book record with Multer image upload |
| `PUT` | `/books/:id` | Admin (JWT) | Update existing book metadata and cover image |
| `DELETE` | `/books/:id` | Admin (JWT) | Delete book from database |
| `GET` | `/books/export/csv` | Public | Stream CSV file download via Node.js Readable stream |
| `POST` | `/books/:id/reviews` | Private (JWT) | Post a review and star rating for a book |
| `POST` | `/auth/register` | Public | Register a new user account |
| `POST` | `/auth/login` | Public | Authenticate user and receive JWT token |
| `GET` | `/auth/me` | Private (JWT) | Retrieve current user profile and role |
| `GET` | `/health` | Public | Server health check and database status |

---

## 👤 Author

**Nikhil Sehgal** &bull; [GitHub: @Sehgalnikhil](https://github.com/Sehgalnikhil)