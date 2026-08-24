# FlexiBite Server

## Overview

This directory contains the Node.js and Express REST API backend for **FlexiBite**. The server handles authentication, user profile management, Mifflin-St Jeor nutrition target calculations, public food catalog queries, daily diet logging, administrative food database operations, and AWS S3 media uploads.

---

## Tech Stack

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web server framework for defining REST API routes and controller handlers.
- **MongoDB & Mongoose**: NoSQL database and Object Data Modeling (ODM) library.
- **JSON Web Token (`jsonwebtoken`)**: Stateless user session authentication.
- **`bcryptjs`**: Password hashing and verification.
- **`googleapis`**: Official Google APIs Node.js client for OAuth 2.0.
- **AWS SDK (`@aws-sdk/client-s3`)**: AWS S3 Client for managing cloud food image storage.
- **Multer**: Node.js middleware for handling `multipart/form-data` image uploads.

---

## Backend Structure

```text
server/
├── config/
│   ├── db.js                 # MongoDB connection initialization
│   └── s3.js                 # AWS S3 Client initialization & credential validation
├── controllers/
│   ├── authController.js     # Signup, Login, Me, Logout, Google OAuth handlers
│   ├── profileController.js  # Profile creation, retrieval, and updates
│   ├── nutritionTargetController.js # Calculation and storage of calorie/macro targets
│   ├── userFoodController.js # Public food database search, filter, and details
│   ├── dietController.js     # Diet entry CRUD operations and daily totals
│   └── adminFoodController.js# Admin food management and AWS S3 media actions
├── middleware/
│   ├── authMiddleware.js     # JWT Bearer token authentication guard
│   ├── adminMiddleware.js    # Role authorization guard (user.role === 'admin')
│   └── uploadMiddleware.js   # Multer single-file memory storage upload middleware
├── models/
│   ├── User.js               # User schema (local & Google credentials, role)
│   ├── Profile.js            # User physical profile schema
│   ├── Food.js               # Food item schema (per-100g metrics, servings, S3 image)
│   ├── DietEntry.js          # Logged diet entry schema with nutrition snapshot
│   └── NutritionTarget.js    # BMR, TDEE, calorie, and macro target schema
├── routes/
│   ├── authRoutes.js         # /api/auth endpoints
│   ├── profileRoutes.js      # /api/profile endpoints
│   ├── nutritionTargetRoutes.js # /api/nutrition-targets endpoints
│   ├── userFoodRoutes.js     # /api/foods endpoints
│   ├── dietRoutes.js         # /api/diet endpoints
│   └── adminFoodRoutes.js    # /api/admin/foods endpoints
├── utils/
│   ├── nutritionCalculator.js# Mifflin-St Jeor BMR & macro distribution algorithms
│   └── googleAuth.js         # OAuth2Client, auth URL generator & token exchanger
├── scripts/                  # Seed scripts (import, update, validate, S3 migration)
└── server.js                 # Server entry point & Express application initialization
```

---

## Authentication

### Email & Password
- **Registration (`POST /api/auth/signup`)**: Validates name, email, and password (min 6 chars). Hashes password with `bcrypt.genSalt(10)` and creates a user with `authProvider: 'local'`.
- **Login (`POST /api/auth/login`)**: Finds user by email, verifies password using `bcrypt.compare()`, and returns a signed JWT token.

### JWT Token Management
- **Token Generation**: Uses `jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })`.
- **Verification (`authMiddleware.js`)**: Extracts `Bearer <token>` from the `Authorization` header, verifies signature using `jwt.verify()`, and attaches `req.userId` to request objects.

### Google OAuth 2.0
- **Initiation (`GET /api/auth/google`)**: Generates authorization URL requesting `openid`, `profile`, and `email` scopes using `googleapis.google.auth.OAuth2`.
- **Callback (`GET /api/auth/google/callback`)**:
  1. Receives authorization code from Google.
  2. Exchanges code for Google access tokens and fetches user profile.
  3. Checks MongoDB for existing `googleId`, or links Google identity to existing local account by email.
  4. If user does not exist, creates a user with `authProvider: 'google'` (no password required).
  5. Generates standard FlexiBite JWT token and redirects browser to React client (`/auth/callback?token=...&redirectTo=...`).

---

## API Routes Summary

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Public | Register new local user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `POST` | `/api/auth/logout` | Public | Stateless logout response |
| `GET` | `/api/auth/google` | Public | Redirect browser to Google login screen |
| `GET` | `/api/auth/google/callback` | Public | Handle OAuth callback & issue JWT |
| `GET` | `/api/auth/me` | Private | Fetch currently authenticated user profile |

### Profile Routes (`/api/profile`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/profile` | Private | Fetch physical profile & onboarding status |
| `POST` | `/api/profile` | Private | Save onboarding profile & calculate targets |
| `PUT` | `/api/profile` | Private | Update user physical profile |

### Nutrition Target Routes (`/api/nutrition-targets`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/nutrition-targets` | Private | Fetch user's calculated nutrition targets |
| `POST` | `/api/nutrition-targets/generate` | Private | Force target recalculation |

### Public Food Routes (`/api/foods`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/foods` | Public | Search, filter, and paginate active foods |
| `GET` | `/api/foods/categories` | Public | Fetch list of distinct food categories |
| `GET` | `/api/foods/:id` | Public | Fetch food dish details & serving sizes |

### Diet Routes (`/api/diet`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/diet/today` | Private | Fetch current day's diet entries & totals |
| `GET` | `/api/diet` | Private | Fetch diet entries by date (`?date=YYYY-MM-DD`) |
| `POST` | `/api/diet` | Private | Log a dish serving to today's diet |
| `PUT` | `/api/diet/:id` | Private | Edit portion quantity or serving size of logged entry |
| `DELETE` | `/api/diet/:id` | Private | Delete a logged diet entry |

### Admin Food Routes (`/api/admin/foods`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/foods` | Admin Only | Fetch all foods including inactive ones |
| `POST` | `/api/admin/foods` | Admin Only | Create new food item in database |
| `PUT` | `/api/admin/foods/:id` | Admin Only | Update food dish details & serving options |
| `PATCH` | `/api/admin/foods/:id/status` | Admin Only | Toggle active status of a food item |
| `DELETE` | `/api/admin/foods/:id` | Admin Only | Delete food item from database |
| `POST` | `/api/admin/foods/:id/image` | Admin Only | Upload image for food item to AWS S3 |
| `DELETE` | `/api/admin/foods/:id/image` | Admin Only | Remove image from AWS S3 |

---

## MongoDB Models

- **`User`**: Stores user identity, hashed passwords, role (`user`/`admin`), and Google OAuth fields (`googleId`, `authProvider`, `profileImage`).
- **`Profile`**: Stores user body parameters (`age`, `gender`, `height`, `weight`), `activityLevel`, `goal`, `dietaryPreference`, `allergies`, and `profileCompleted` boolean.
- **`Food`**: Base food dish items with `nutritionPer100g` (`calories`, `protein`, `carbohydrates`, `fats`, `fibre`), `servings` array (`servingName`, `servingWeightGrams`, `isDefault`), and `image` object (`url`, `key`).
- **`DietEntry`**: Logged user meal records containing `userId`, `foodId`, `mealType` (`breakfast`, `lunch`, `dinner`, `snacks`), `date`, `selectedServing`, `quantity`, `calculatedWeightGrams`, and a calculated `nutrition` snapshot object.
- **`NutritionTarget`**: Persisted targets including `bmr`, `activityMultiplier`, `tdee`, `calories`, `protein`, `carbohydrates`, and `fat`.

---

## Nutrition Calculation Formulas

The backend implements the **Mifflin-St Jeor** formula in `utils/nutritionCalculator.js`:

1. **Basal Metabolic Rate (BMR)**:
   - Male: $BMR = (10 \times \text{weight}_{kg}) + (6.25 \times \text{height}_{cm}) - (5 \times \text{age}) + 5$
   - Female: $BMR = (10 \times \text{weight}_{kg}) + (6.25 \times \text{height}_{cm}) - (5 \times \text{age}) - 161$
   - Other / Unspecified: $BMR = (10 \times \text{weight}_{kg}) + (6.25 \times \text{height}_{cm}) - (5 \times \text{age}) - 78$

2. **Total Daily Energy Expenditure (TDEE)**:
   - Multiplier based on activity level:
     - `sedentary`: 1.2
     - `lightly_active`: 1.375
     - `moderately_active`: 1.55
     - `very_active`: 1.725
   - $TDEE = BMR \times \text{activityMultiplier}$

3. **Goal-Adjusted Calorie Target**:
   - `lose_weight`: $TDEE \times 0.85$ (~15% deficit)
   - `maintain_weight`: $TDEE$
   - `gain_weight`: $TDEE \times 1.10$ (~10% surplus)

4. **Macronutrient Split**:
   - **Protein**: $1.6\text{g}$ per kg of body weight ($4\text{ kcal/g}$)
   - **Fat**: $25\%$ of total daily calorie target ($9\text{ kcal/g}$)
   - **Carbohydrates**: Remaining calories allocated to carbs ($4\text{ kcal/g}$)

---

## Food Serving Calculation & Nutrition Snapshot

When a diet entry is logged or updated, the server calculates serving nutrition from the base food's per-100g metrics:

$$\text{Calculated Grams} = \text{Serving Weight Grams} \times \text{Quantity}$$

$$\text{Nutrition Value} = \frac{\text{Per-100g Value} \times \text{Calculated Grams}}{100}$$

**Snapshot Pattern**: The resulting calculated calories, protein, carbs, fat, and fiber are saved directly inside `DietEntry.nutrition`. This guarantees that historical diet logs remain immutable even if the base food item's per-100g values are updated by an admin later.

---

## Authorization & Ownership Protection

- **User Data Isolation**: Every `DietEntry` and `Profile` query filters explicitly by `userId: req.userId` extracted from the verified JWT. Users cannot view, modify, or delete another user's diet entries.
- **Admin Endpoints Guard**: `adminMiddleware.js` (`adminOnly`) checks `req.user.role === 'admin'`. Unauthorized non-admin users attempting to access `/api/admin/*` receive HTTP `403 Forbidden`.

---

## AWS S3 Cloud Image Storage

- **Upload Pipeline**: Image uploads use Multer memory storage (`uploadMiddleware.js`). Image buffers are uploaded to AWS S3 using `@aws-sdk/client-s3` (`PutObjectCommand`).
- **Media Object**: The server saves `https://<bucket>.s3.<region>.amazonaws.com/<key>` to the food document.
- **Media Removal**: Deleting an image triggers `DeleteObjectCommand` to clean up media files from the S3 bucket.

---

## Environment Variables

Configured in `server/.env`:

```env
PORT=5002
MONGO_URI=mongodb://localhost:27017/flexibite
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:3000

AWS_REGION=ap-south-1
AWS_ACCESS_KEY=your_aws_access_key_here
AWS_SECRET_KEY=your_aws_secret_key_here
AWS_S3_BUCKET=your_s3_bucket_name_here

GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5002/api/auth/google/callback
```

---

## Running the Server

### Install Dependencies
```bash
npm install
```

### Start Development Server (Nodemon)
```bash
npm run dev
```

### Start Production Server
```bash
npm start
```

### Seed & Maintenance Scripts
- **Import Seed Foods**: `npm run import:foods`
- **Update Food Metrics**: `npm run update:foods`
- **Validate Food Schema**: `npm run validate:foods`
- **Migrate Images to AWS S3**: `npm run migrate:images`
