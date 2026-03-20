# ⚡ FeatureTrack — Feature Request Tracker

A full-stack web application for managing and tracking feature requests, built with React.js, Node.js/Express.js, and MySQL.

---

## 🖥️ Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React.js                |
| Backend   | Node.js + Express.js    |
| Database  | MySQL                   |
| HTTP      | Axios                   |
| Validation| express-validator       |

---

## ✨ Features

- ✅ View all feature requests in a responsive card grid
- ✅ Add a new feature request via modal form
- ✅ Edit any existing feature request
- ✅ Delete a feature request (with confirmation)
- ✅ Update feature status (Open / In Progress / Completed)
- ✅ Filter feature requests by status
- ✅ Search features by title or description
- ✅ Live stats bar (total, open, in progress, completed, high priority)
- ✅ Toast notifications for all actions
- ✅ Full input validation (frontend + backend)
- ✅ Clean REST API with proper error handling

---

## 📁 Project Structure

```
feature-tracker/
├── backend/
│   ├── config/
│   │   └── db.js              # MySQL connection pool
│   ├── middleware/
│   │   ├── validate.js        # express-validator middleware
│   │   └── errorHandler.js    # Global error handler
│   ├── routes/
│   │   └── features.js        # CRUD + status API routes
│   ├── .env.example
│   ├── package.json
│   └── server.js              # Express app entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Badge.jsx      # Priority & Status badges
│   │   │   ├── FeatureCard.jsx
│   │   │   ├── FeatureForm.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── StatsBar.jsx
│   │   ├── api.js             # Axios API service
│   │   ├── App.js             # Main app component
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example
│   └── package.json
├── database.sql               # MySQL schema + seed data
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+ and npm
- MySQL 8.0+
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/feature-tracker.git
cd feature-tracker
```

---

### 2. Database Setup

Open your MySQL client and run:

```bash
mysql -u root -p < database.sql
```

Or paste the contents of `database.sql` into MySQL Workbench / phpMyAdmin.

This will:
- Create the `feature_tracker` database
- Create the `features` table
- Insert 8 sample feature requests

---

### 3. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=feature_tracker
PORT=5000
```

Start the backend server:

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Backend will run at: **http://localhost:5000**

---

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

`.env` contents:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the React app:

```bash
npm start
```

Frontend will run at: **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | Endpoint                       | Description               |
|--------|--------------------------------|---------------------------|
| GET    | `/api/features`                | Get all features          |
| GET    | `/api/features?status=Open`    | Filter by status          |
| GET    | `/api/features/:id`            | Get single feature        |
| POST   | `/api/features`                | Create new feature        |
| PUT    | `/api/features/:id`            | Update feature            |
| PATCH  | `/api/features/:id/status`     | Update status only        |
| DELETE | `/api/features/:id`            | Delete feature            |
| GET    | `/api/health`                  | API health check          |

### Request Body (POST / PUT)

```json
{
  "title": "Feature title",
  "description": "Detailed description",
  "priority": "High",
  "status": "Open"
}
```

---

## 📌 Feature Fields

| Field       | Type    | Values                              |
|-------------|---------|-------------------------------------|
| id          | INT     | Auto-generated                      |
| title       | VARCHAR | Any text (max 255 chars)            |
| description | TEXT    | Any text                            |
| priority    | ENUM    | `Low`, `Medium`, `High`             |
| status      | ENUM    | `Open`, `In Progress`, `Completed`  |
| created_at  | TIMESTAMP | Auto-generated                    |
| updated_at  | TIMESTAMP | Auto-updated                      |

---

## 🌿 Git Workflow

This project follows a structured Git workflow:

```
main          ← stable production branch
develop       ← integration branch
feature/*     ← individual feature branches
```

Example:
```bash
git checkout -b feature/add-search-filter
# make changes
git add .
git commit -m "feat: add search and filter functionality"
git push origin feature/add-search-filter
# open pull request to develop
```

---

## 🚀 Running Both Servers

You can run both servers simultaneously from the root folder using two terminals:

**Terminal 1 — Backend:**
```bash
cd backend && npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend && npm start
```

---

## 📸 Screenshots

> Screenshots of the running application are included in the `/screenshots` folder of the repository.

---

## 👤 Author

Built as part of the Tanzanite Skills Academy technical assessment.
