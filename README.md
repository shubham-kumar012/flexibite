# FlexiBite

## Overview

FlexiBite is a full-stack nutrition tracking application designed specifically to simplify diet management for Indian dietary habits. 

Traditional nutrition tracking platforms rely heavily on raw ingredient weighing in exact grams or ounces, which creates friction for users consuming cooked Indian meals (*sabzis, dals, rotis, rice, katoris*). FlexiBite bridges this gap by providing an extensive database of 250+ Indian dishes paired with practical, standard Indian serving sizes (e.g., *1 medium katori*, *1 piece*, *1 glass*, *1 bowl*). 

The application calculates personalized daily calorie and macronutrient targets based on physical metrics, activity levels, and fitness goals, allowing users to search foods, choose familiar serving portions, and track their daily intake in real time.

---

## 🌐 Live Application & Demo Credentials

- **Live Web Application**: [https://flexibite.vercel.app](https://flexibite.vercel.app)
- **API Server Endpoint**: `https://unselect-dictation-skylight.ngrok-free.dev/api`

### Test Account Credentials
You can quickly explore the application using the test account below, or log in instantly via **Continue with Google**:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Demo User** | `demo@flexibite.com` | `Flexibite@123` |

---

## Why I Built This

FlexiBite was developed as a comprehensive full-stack software project to explore and solve real-world architectural and technical challenges beyond basic CRUD applications. 

The project addresses core software engineering patterns including:
- **Stateless Authentication & Social OAuth**: Implementing JWT authentication alongside native Google OAuth 2.0 without third-party abstraction frameworks like Passport.js.
- **Scientific Nutrition Target Calculation**: Dynamically computing BMR, TDEE, calorie targets, and macro splits using established physiological formulas.
- **Data Modeling & Immutability**: Designing MongoDB schemas that preserve historical nutrition data via snapshots rather than relying strictly on mutating reference documents.
- **Search & Filtering Performance**: Indexing and filtering food items by dietary preference (*Vegetarian, Vegan, Eggetarian, Non-Vegetarian*) and dish categories.
- **Cloud Infrastructure Integration**: Uploading and serving food media via Amazon Web Services (AWS) S3.
- **Role-Based Access Control (RBAC)**: Enforcing strict administrative control boundaries for food database management.

---

## Features

### Authentication
- Email and password registration with client and server validation.
- Secure password hashing using bcrypt.
- Stateless JWT-based authentication for private endpoints.
- Native Google OAuth 2.0 ("Continue with Google") authentication flow.
- Token storage in client local storage with automatic authorization header attachment.

### Onboarding
- Multi-step profile setup capturing age, gender, height, weight, activity level, health goals, dietary preferences, and allergies.
- Automatic completion tracking to route users appropriately on login.

### Nutrition Computation
- Automatic calculation of Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation.
- Total Daily Energy Expenditure (TDEE) calculation based on activity multipliers.
- Goal-adjusted daily calorie targets (weight loss deficit, maintenance, or weight gain surplus).
- Automated macro distribution (protein based on body weight, fats allocated by calorie percentage, remaining calories allocated to carbohydrates).

### Food Database & Search
- Database of 250+ Indian dishes with accurate per-100g nutritional metrics.
- Instant search with category filters (*Breads, Rice, Dals, Sabzis, Snacks, Desserts*) and dietary filters (*Veg, Non-Veg, Egg, Vegan*).
- Support for multiple practical Indian serving sizes per dish.

### Diet Logging & Daily Tracking
- Meal-based diet logging categorized into *Breakfast*, *Lunch*, *Dinner*, and *Snacks*.
- Live dashboard rendering remaining daily calories, consumed calories, and macro progress bars.
- Inline editing of serving portions and dish quantities.
- Deletion of logged diet entries with immediate total recalculation.

### Admin Functionality & Cloud Storage
- Dedicated administrative route for viewing, creating, updating, and deactivating food entries.
- Image file uploads routed through Multer and stored in AWS S3 buckets.
- Strict backend role authorization ensuring normal users cannot mutate food records.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React** | Frontend UI library |
| **Node.js** | Backend JavaScript runtime environment |
| **Express** | Web framework for Node.js REST API |
| **MongoDB** | NoSQL database for application data persistence |
| **Mongoose** | Object Data Modeling (ODM) library for MongoDB |
| **JWT (jsonwebtoken)** | Stateless user session tokens |
| **bcryptjs** | Password hashing algorithm |
| **googleapis** | Official Node.js library for Google OAuth 2.0 verification |
| **AWS SDK (S3Client)** | File upload management to Amazon Web Services S3 |
| **Multer** | Middleware for handling multipart/form-data image uploads |
| **Tailwind CSS** | Utility-first CSS framework for UI styling |
| **Vite** | Frontend build tool and development server |

---

## Project Structure

```text
FlexiBite/
├── client/                  # React Frontend Application
│   ├── src/
│   │   ├── components/      # UI components (Layout, Modals, Filters, Cards)
│   │   ├── context/         # AuthContext for session management
│   │   ├── pages/           # Application views and pages
│   │   ├── services/        # Client API request helpers
│   │   ├── utils/           # Formatters and calculators
│   │   └── config/          # Environment configuration
│   └── package.json
│
├── server/                  # Node.js Express REST API
│   ├── config/              # Database & S3 Client connections
│   ├── controllers/         # Endpoint business logic handlers
│   ├── middleware/          # JWT auth, Admin authorization, Multer upload
│   ├── models/              # Mongoose database schemas
│   ├── routes/              # Express API route endpoints
│   ├── utils/               # Nutrition formulas & Google OAuth helpers
│   ├── scripts/             # Database seed & migration utilities
│   └── package.json
│
└── README.md                # Root project documentation
```

---

## Application Flow

```text
User
 ↓
Authentication (Email/Password OR Google OAuth)
 ↓
JWT Token Issued
 ↓
Onboarding Check (If Profile Incomplete → Complete Profile Setup)
 ↓
Nutrition Target Calculation (BMR / TDEE / Calorie & Macro Targets Generated)
 ↓
Dashboard (Daily Calorie Summary & Macro Progress)
 ↓
Foods Page (Search, Filter by Category/Dietary Type, Select Dish)
 ↓
Select Serving (Choose Indian Portion e.g. 1 medium katori, Adjust Quantity)
 ↓
Add to Today's Diet (Categorize into Breakfast / Lunch / Dinner / Snacks)
 ↓
Today's Diet Page (View Daily Log, Edit Serving Quantities, Delete Entries)
 ↓
Live Dashboard Progress Updated
```

---

## Important Technical Decisions

### JWT Authentication
Stateless authentication is implemented using JSON Web Tokens. Upon successful authentication (via login or Google OAuth), the server issues a signed JWT containing the user ID. The client stores this token in `localStorage` and includes it in the `Authorization: Bearer <token>` header for all protected API calls. `authMiddleware` verifies the token signature on the server and attaches `req.userId` to the request lifecycle.

### bcrypt Password Hashing
User passwords for local accounts are never stored in plain text. Passwords are salted and hashed using `bcryptjs` with a salt factor of 10 during user registration. During login, `bcrypt.compare()` verifies the candidate password against the stored hash.

### Google OAuth Flow
Google authentication uses the official `googleapis` library. When a user clicks "Continue with Google", the server generates an authorization URL and redirects the browser. Upon consent, Google returns an authorization code to `/api/auth/google/callback`. The server exchanges this code for the user's Google profile, searches for or creates a corresponding user record in MongoDB, issues a standard FlexiBite JWT token, and redirects back to the React client (`/auth/callback`).

### Nutrition Snapshot Pattern
When a user logs a food dish into their diet, the server computes the nutritional output for the chosen serving and stores a complete `nutrition` snapshot object directly inside the `DietEntry` document. This design pattern ensures that historical diet logs remain accurate even if an admin later updates the base food item's nutrition profile per 100g.

### Serving Calculation Formula
All base food items store nutritional values normalized per 100g. When a user selects a serving option (which includes a pre-configured weight in grams), the calculation is performed as:

$$\text{Nutrition per Serving} = \frac{\text{Nutrition per 100g} \times \text{Serving Weight in Grams}}{100} \times \text{Quantity}$$

*Example*: If a dish contains 12g of protein per 100g, and a "1 medium katori" serving is defined as 150g, logging 1 quantity yields:
$$\text{Protein} = \frac{12 \times 150}{100} \times 1 = 18\text{g}$$

### AWS S3 Storage
Admin food image uploads pass through `multer` memory storage before being transferred to an Amazon S3 bucket via `@aws-sdk/client-s3`. The server stores the resulting public S3 URL and image key in the food document, allowing rapid image delivery without overloading the API server.

---

## Local Development

### 1. Clone the Repository
```bash
git clone https://github.com/shubham-kumar012/flexibite.git
cd flexibite
```

### 2. Set Up the Server
```bash
cd server
npm install
```

Create a `.env` file inside `server/` using the template below.

Start the backend development server:
```bash
npm run dev
```

### 3. Set Up the Client
In a separate terminal window:
```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The application will run locally with the frontend on `http://localhost:3000` and the backend on `http://localhost:5002`.

---

## Environment Variables

Configure the following variables in `server/.env`:

```env
# Application Config
PORT=5002
MONGO_URI=mongodb://localhost:27017/flexibite
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:3000

# AWS S3 Config
AWS_REGION=ap-south-1
AWS_ACCESS_KEY=your_aws_access_key_here
AWS_SECRET_KEY=your_aws_secret_key_here
AWS_S3_BUCKET=your_s3_bucket_name_here

# Google OAuth Config
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5002/api/auth/google/callback
```

---

## Backend Deployment (AWS EC2 + Nginx + ngrok)

The FlexiBite backend is deployed on an **AWS EC2 Ubuntu instance**, managed as a persistent background process via **PM2**, reverse-proxied through **Nginx**, and exposed securely over HTTPS via **ngrok** running as an automated system service.

- **Live API Base URL**: `https://unselect-dictation-skylight.ngrok-free.dev/api`
- **Health Check**: `https://unselect-dictation-skylight.ngrok-free.dev/api/health`

### Architecture Flow
```text
Client (Vercel Frontend)
   ↓ (HTTPS request with 'ngrok-skip-browser-warning: 1')
ngrok Cloud Tunnel (https://unselect-dictation-skylight.ngrok-free.dev)
   ↓
AWS EC2 Instance (Port 80 Inbound)
   ↓
Nginx Reverse Proxy (Port 80 → 127.0.0.1:5002)
   ↓
Node.js Express API (Port 5002 managed by PM2)
```

---

### Step-by-Step Deployment Guide

#### 1. Connect to EC2 Instance & Install Node.js
Connect via SSH using your key pair:
```bash
ssh -i "flexibite-key.pem" ubuntu@<EC2-PUBLIC-DNS>

# Update system packages
sudo apt update && sudo apt upgrade -y

# Add NodeSource repository & install Node.js 26
curl -fsSL https://deb.nodesource.com/setup_26.x | sudo -E bash -
sudo apt install nodejs -y

# Verify installation
node -v && npm -v
```

#### 2. Clone Repository & Setup Environment
```bash
git clone https://github.com/shubham-kumar012/flexibite.git
cd flexibite/server
npm install

# Create production environment variables
nano .env
```

#### 3. Run Backend via PM2
Use PM2 to ensure the backend runs continuously in the background and auto-restarts on unexpected crashes or instance reboots:
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the server process
pm2 start server.js --name "flexibite-api"

# Save process list and generate startup script
pm2 save
pm2 startup
```

#### 4. Configure Nginx Reverse Proxy
Install Nginx to receive incoming HTTP traffic on port 80 and forward it internally to `http://127.0.0.1:5002`:
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

Edit the default Nginx configuration (`sudo nano /etc/nginx/sites-available/default`):
```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:5002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Test and reload Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```
> **EC2 Security Group**: Ensure your AWS EC2 instance has an Inbound Rule allowing **HTTP (Port 80)** from `0.0.0.0/0`.

#### 5. Secure HTTPS Tunnel with ngrok
To expose the backend over trusted HTTPS without needing a custom domain or manual SSL certificate management:

1. **Install ngrok Agent**:
   ```bash
   curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
   echo "deb https://ngrok-agent.s3.amazonaws.com bookworm main" | sudo tee /etc/apt/sources.list.d/ngrok.list
   sudo apt update && sudo apt install ngrok -y
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

2. **Configure Persistent ngrok Endpoints**:
   Create the config directory and file at `/home/ubuntu/.config/ngrok/ngrok.yml`:
   ```bash
   mkdir -p /home/ubuntu/.config/ngrok
   nano /home/ubuntu/.config/ngrok/ngrok.yml
   ```
   Add your tunnel definition:
   ```yaml
   version: "3"
   agent:
     authtoken: YOUR_AUTH_TOKEN
   endpoints:
     - name: flexibite-api
       url: https://unselect-dictation-skylight.ngrok-free.dev
       upstream:
         url: 80
   ```
   Secure the config file:
   ```bash
   chmod 600 /home/ubuntu/.config/ngrok/ngrok.yml
   ngrok config check --config /home/ubuntu/.config/ngrok/ngrok.yml
   ```

3. **Install & Start ngrok as a System Service**:
   ```bash
   sudo ngrok service install --config /home/ubuntu/.config/ngrok/ngrok.yml
   sudo ngrok service start
   sudo systemctl status ngrok
   ```

This registers ngrok as an OS service so the tunnel recovers automatically across machine reboots.

> **Frontend Integration Note**: To prevent ngrok's browser warning interstitial from blocking client CORS requests, all frontend `fetch` calls include the header:
> ```json
> { "ngrok-skip-browser-warning": "1" }
> ```

---

## Current Project Scope

FlexiBite currently implements:
- Full authentication cycle (Email/Password & Google OAuth).
- Complete user profile onboarding & Mifflin-St Jeor target generation.
- Real-time nutrition dashboard and today's meal tracking.
- Indian serving-based meal calculations.
- Comprehensive food search, filtering, and admin database management.

*Future Enhancements (Deferred Scope)*:
- Historical weekly and monthly diet analytics charts.
- Custom user-created recipe builders.
- Exporting diet logs to PDF/CSV reports.

---

## What I Learned

Building FlexiBite provided practical experience in:
- Structuring a decoupled MERN stack application with clean API boundaries.
- Designing schema models in Mongoose with dynamic validations and reference relationships.
- Building custom stateless authentication using JWT and OAuth 2.0 authorization codes.
- Managing AWS S3 cloud uploads programmatically from Node.js servers.
- Handling responsive UI state and modal interactions in React with Vite and Tailwind CSS.

---

## Author

**Shubham Kumar**

- **Live Application**: [https://flexibite.vercel.app](https://flexibite.vercel.app)
- **GitHub**: [github.com/shubham-kumar012](https://github.com/shubham-kumar012)
- **Portfolio**: [https://itshubham.me](https://itshubham.me)

