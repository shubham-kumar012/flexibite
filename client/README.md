# FlexiBite Client

## Overview

This directory contains the React single-page application (SPA) for **FlexiBite**, built using Vite, Tailwind CSS, and React Router. The frontend provides a responsive interface for user onboarding, nutrition target display, Indian food exploration, portion selection, and daily diet tracking.

---

## Tech Stack

- **React 18**: UI rendering library.
- **Vite**: Next-generation frontend build tool and dev server.
- **Tailwind CSS**: Utility-first styling framework.
- **React Router v6**: Client-side routing and protected route management.
- **Lucide React**: Icon library for consistent UI symbols.
- **Framer Motion**: Micro-animation library for smooth UI transitions.

---

## Main Pages

- **Landing Page (`/`)**: Public overview of FlexiBite features, problem statement, and meal tracking workflow.
- **Login (`/login`)**: Account authentication via email/password or Google OAuth.
- **Signup (`/signup`)**: New user account creation.
- **Auth Callback (`/auth/callback`)**: OAuth handler page that processes backend JWT tokens after Google authentication and routes users to `/dashboard` or `/onboarding`.
- **Onboarding (`/onboarding`)**: Multi-step setup form capturing physical metrics, activity levels, health goals, dietary preferences, and allergies.
- **Dashboard (`/dashboard`)**: Main hub displaying today's calorie budget, remaining calories, macro progress bars, and meal log entry counts.
- **Nutrition Plan (`/nutrition-plan`)**: Transparent breakdown of calculated BMR, TDEE, goal adjustments, and macro split algorithms.
- **Foods (`/foods`)**: Searchable, filterable catalog of 250+ Indian dishes with category and dietary tags.
- **Food Details (`/foods/:id`)**: Comprehensive view of per-100g nutritional metrics, available Indian serving sizes, and portion portion calculator.
- **Today's Diet (`/todays-diet`)**: Daily food diary organized into Breakfast, Lunch, Dinner, and Snacks with inline editing and deletion.
- **Profile (`/profile`)**: User profile summary, account details, and target recalculation triggers.
- **Admin Foods (`/admin/foods`)**: Administrative management panel for searching, creating, editing, and uploading S3 media for food entries (accessible only to admin accounts).

---

## Component Structure

```text
client/src/
├── components/
│   ├── AppLayout.jsx          # Sidebar & top navigation layout wrapper
│   ├── ProtectedRoute.jsx     # Auth guard wrapping private pages
│   ├── AdminRoute.jsx         # Role guard wrapping admin pages
│   ├── Navbar.jsx             # Public landing page navigation bar
│   ├── Footer.jsx             # Footer component
│   ├── foods/
│   │   ├── FoodCard.jsx       # Individual food dish card
│   │   ├── FoodSearch.jsx     # Debounced search bar input
│   │   ├── FoodFilters.jsx    # Category and dietary pill filters
│   │   └── ServingModal.jsx   # Modal for selecting Indian serving size and quantity
│   ├── diet/
│   │   ├── DietEntryCard.jsx  # Logged meal entry card with nutrition values
│   │   └── EditDietModal.jsx  # Modal for updating portion size of logged entries
│   └── admin/
│       └── FoodForm.jsx       # Administrative form for food creation & editing
```

---

## Services

API communication is encapsulated in dedicated service modules using the native `fetch` API:

- **`services/authService.js`**: Functions for login, signup, current user verification (`/api/auth/me`), and logout.
- **`services/foodService.js`**: Functions for querying public food lists with pagination, search, category filters, and dish details.
- **`services/dietService.js`**: Functions for fetching today's diet entries (`/api/diet/today`), logging new entries, editing portions, and deleting entries.
- **`services/adminFoodService.js`**: Functions for admin CRUD operations and food image uploads to AWS S3.

---

## Routing & Protection

Client routing uses React Router v6:

- **Public Routes**: `/`, `/login`, `/signup`, `/auth/callback`
- **Protected Routes (`<ProtectedRoute>`)**: `/dashboard`, `/nutrition-plan`, `/foods`, `/foods/:id`, `/todays-diet`, `/onboarding`, `/profile`
  - Verifies presence of JWT token in `localStorage`. If missing, redirects user to `/login`.
- **Admin Routes (`<AdminRoute>`)**: `/admin/foods`, `/admin/foods/new`, `/admin/foods/:id/edit`
  - Checks if authenticated user has `user.role === 'admin'`. If not, redirects to `/dashboard`.

---

## Authentication Flow

1. **State Management**: `AuthContext.jsx` manages global `user` and `token` state.
2. **Token Storage**: Upon successful login or Google OAuth callback, the JWT token is stored in `localStorage.setItem('token', token)`.
3. **API Headers**: Service calls attach `Authorization: Bearer <token>` to request headers.
4. **Logout**: Clears `localStorage` token and resets auth state.

---

## Food & Serving Selection Flow

```text
Foods Page (/foods)
  ↓
Search query or Filter pill selected (Category / Veg / Non-Veg)
  ↓
User clicks Food Card -> Navigates to Food Details (/foods/:id)
  ↓
User selects Indian Serving (e.g. 1 medium katori = 150g) and Quantity
  ↓
Calculated Nutrition auto-updates dynamically on screen
  ↓
User selects Meal Type (Breakfast, Lunch, Dinner, Snacks) and clicks "Add to Today's Diet"
  ↓
POST request sent to /api/diet -> Redirects to Today's Diet page
```

---

## Diet Tracking Flow

- **Today's Diet (`/todays-diet`)**: Fetches logged entries for the active user for the current date.
- **Progress Tracking**: Aggregates total calories, protein, carbs, and fat consumed vs daily targets.
- **Portion Editing**: `EditDietModal` allows updating quantity or switching serving sizes, triggering immediate calculation updates.

---

## Environment Variables

Client configurations are managed via `src/config/appConfig.js`:

```javascript
export const APP_CONFIG = {
  name: "FlexiBite",
  apiBaseUrl: "http://localhost:5002/api", // Point to local Express API or deployed backend
};
```

> **Warning**: Never place secret credentials (database URIs, AWS secret keys, or JWT secrets) inside the frontend application code or client environment variables.

---

## Running the Frontend

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build Locally
```bash
npm run preview
```
