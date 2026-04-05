# Financial Dashboard Backend (Tradebook)

This is the backend server for the Financial Dashboard (Tradebook-Based) application.  
It provides APIs for managing trades, user authentication, and data handling.

---

## Overview

The backend is built using Node.js and Express and connects to MongoDB for data storage.

It handles:
- Trade CRUD operations (Create, Read, Update, Delete)
- User authentication (JWT-based)
- API routing and request handling

---

## 🔗 Frontend Repository
👉 [Frontend Repo](https://github.com/swatiDwived/Financial-DashboardFrontend-Tradebook-.git)

---

## 🎥 Demo Video
👉 [Watch Full Application Demo](https://drive.google.com/file/d/15XmIyeOZAEdwM-rg0CSXCnF9H1xU-XDV/view?usp=drivesdk)

---

## ⚙️ Local Setup Instructions

### 1. Clone the repository
```bash
git clone <your-backend-repo-link>
cd Financial-DashboardBackend-Tradebook-
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root directory and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Start the server
```bash
node index.js
```

Server will run on:  
http://localhost:5000
