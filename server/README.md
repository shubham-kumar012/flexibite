# FlexiBite Backend — Phase 1 Documentation

Welcome to the **FlexiBite Backend API**. This backend is built with **Node.js**, **Express.js**, and **MongoDB with Mongoose**. It provides user authentication functionality using **JWT (JSON Web Tokens)** and **bcrypt** password hashing.

---

## 📁 Directory Structure

```text
server/
├── config/
│   └── db.js            # MongoDB connection logic
├── controllers/
│   └── authController.js# Request logic for signup, login, getMe, logout
├── middleware/
│   └── authMiddleware.js# Middleware to verify JWT tokens on protected routes
├── models/
│   └── User.js          # Mongoose model for User collection
├── routes/
│   └── authRoutes.js    # Express route definitions for /api/auth
├── .env                 # Local environment variables (DO NOT COMMIT)
├── .env.example         # Example environment template
├── .gitignore           # Git ignore settings
├── package.json         # Project dependencies & scripts
├── README.md            # Backend documentation
└── server.js            # Main server entry file
```

---

## 🚀 Getting Started

### 1. Install Dependencies

In the `server` directory, run:

```bash
npm install
```

This installs required packages: `express`, `mongoose`, `cors`, `dotenv`, `bcryptjs`, and `jsonwebtoken`.

### 2. Configure Environment Variables

Create a `.env` file inside the `server/` directory based on `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/flexibite
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

- **`PORT`**: Port number for Express server.
- **`MONGO_URI`**: Connection URI for MongoDB database.
- **`JWT_SECRET`**: Secret key used to sign and verify JWT tokens.
- **`CLIENT_URL`**: Allowed origin for CORS (React Frontend URL).

### 3. Ensure MongoDB is Running

Make sure MongoDB service is running locally or provide a remote MongoDB Atlas URI in `MONGO_URI`.

### 4. Run the Backend Server

Start in development mode (with nodemon):

```bash
npm run dev
```

Start in production mode:

```bash
npm start
```

---

## 🛠️ API Endpoints

| Method | Endpoint            | Description                   | Access    |
| ------ | ------------------- | ----------------------------- | --------- |
| GET    | `/api/health`       | Check if server is running    | Public    |
| POST   | `/api/auth/signup`  | Register a new user           | Public    |
| POST   | `/api/auth/login`   | Authenticate user & get JWT   | Public    |
| POST   | `/api/auth/logout`  | Log out user                  | Public    |
| GET    | `/api/auth/me`      | Get current user profile      | Protected |

---

## 🔄 Request Flow Diagram

Here is how data flows through the server layers:

```text
React (Client)
  │
  ↓  HTTP Request (e.g., POST /api/auth/signup)
Express Route (routes/authRoutes.js)
  │
  ↓  Passes control to
Controller (controllers/authController.js)
  │
  ↓  Interacts with database
MongoDB (models/User.js)
  │
  ↓  Returns data / token
JSON Response (sent back to React)
```

---

## 🔑 Authentication Flow & JWT Explanation

### How Authentication Works:

```text
Login Step:
React Form  ──►  POST /api/auth/login  ──►  Verify Password with bcrypt  ──►  Generate JWT Token  ──►  Store Token in localStorage

Protected Request Step:
React Request (with Authorization Header: Bearer <token>)
  │
  ↓
authMiddleware (Verifies token using JWT_SECRET)
  │
  ├─► Invalid / Missing Token: Return HTTP 401 Unauthorized
  │
  └─► Valid Token: Attaches req.userId and calls next() ──► Returns Profile Data
```

### Key Security Practices Used:
1. **Password Hashing**: Plaintext passwords are never saved. `bcryptjs` generates a secure salted hash before saving to MongoDB.
2. **Stateless JWT**: No session state stored on server; JWT is decoded and verified on each protected request.
3. **CORS Protection**: Access restricted to specified `CLIENT_URL`.
