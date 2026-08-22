# 📚 PageTurner — Modern Book Management System (MERN Stack)

A full-stack MERN (MongoDB, Express.js, React, Node.js) book management application with a professional, matte UI/UX design. Easily catalog, search, filter, preview, and manage book collections.

---

## ✨ Features

- **📖 Complete CRUD Operations**: Create, read, update, and delete books with real-time UI synchronization and feedback alerts.
- **🔍 Instant Real-Time Search**: Search through book collections by title, author name, or publication year dynamically.
- **⚡ Advanced Sorting**: Sort records by *Recently Added*, *First Added*, *Title (A-Z / Z-A)*, or *Publication Year (Newest / Oldest)*.
- **🎛️ Dual View Modes**:
  - **Card Grid View**: Clean matte cards with quick preview modal triggers and publication badges.
  - **Data Table View**: Spacious modern table layout with hover states and formatted identifiers.
- **🔍 Detailed Quick Preview Modal**: Backdrop blur modal displaying structured book metadata without leaving the main page.
- **📊 Library Metrics**: Real-time counter of total books and distinct authors in the library.
- **🎨 Modern Matte UI/UX**: Built with Tailwind CSS, Plus Jakarta Sans typography, and a refined warm neutral aesthetic (no dark mode / no harsh purple tones).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) (Phosphor Icons)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Notifications**: [Notistack](https://notistack.com/)

### Backend & Database
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- **CORS**: `cors` middleware configured for cross-origin client access
- **Dev Tooling**: `nodemon`

---

## 📁 Project Structure

```
Book-Store-MERN-Stack/
├── backend/
│   ├── models/
│   │   └── bookModel.js       # Mongoose schema for Book entity
│   ├── routes/
│   │   └── booksRoute.js      # REST API endpoints for books
│   ├── config.js              # Server PORT & MongoDB connection URL
│   ├── index.js               # Express application entrypoint
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── home/
│   │   │   │   ├── BookModal.jsx       # Quick preview modal
│   │   │   │   ├── BookSingleCard.jsx  # Single card component
│   │   │   │   ├── BooksCard.jsx       # Grid container
│   │   │   │   └── BooksTable.jsx      # Data table container
│   │   │   ├── BackButton.jsx          # Reusable back navigation
│   │   │   ├── Navbar.jsx              # Sticky header with metrics & CTA
│   │   │   └── Spinner.jsx             # Dual-ring loader
│   │   ├── pages/
│   │   │   ├── CreateBooks.jsx         # Add new book form
│   │   │   ├── DeleteBook.jsx          # Deletion confirmation
│   │   │   ├── EditBook.jsx            # Edit book metadata
│   │   │   ├── Home.jsx                # Main catalog page
│   │   │   └── ShowBook.jsx            # Detailed book overview
│   │   ├── App.jsx                     # Application routes
│   │   ├── index.css                   # Global styles & scrollbar
│   │   └── main.jsx                    # Root entrypoint with Notistack
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone https://github.com/Sehgalnikhil/back.git
cd back
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Configure your MongoDB URI in `backend/config.js` or via environment variable:
```bash
export MONGODB_URI="mongodb://127.0.0.1:27017/books-collection"
```

Start the backend server:
```bash
npm run dev
# Server will start on http://localhost:5555
```

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
# Vite dev server will start on http://localhost:5174 (or 5173)
```

---

## 🔌 API Reference

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/books` | Retrieve all books | N/A |
| `GET` | `/books/:id` | Retrieve single book by ID | N/A |
| `POST` | `/books` | Create a new book | `{ "title": "...", "author": "...", "publishYear": 2024 }` |
| `PUT` | `/books/:id` | Update an existing book | `{ "title": "...", "author": "...", "publishYear": 2024 }` |
| `DELETE` | `/books/:id` | Delete a book by ID | N/A |

---

## 👤 Author

**Nikhil Sehgal**
- GitHub: [@Sehgalnikhil](https://github.com/Sehgalnikhil)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).