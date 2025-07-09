# ✈️ Flight Booking System

A full-stack MERN application for booking and managing flights with role-based access (Admin/User).  
This project is organized into two folders:

- `client/` – Frontend (React + TypeScript)
- `server/` – Backend (Express + MongoDB)

---

## 🔗 Live Links

- **Frontend (Vercel):** [https://flight-booking-system-client-lemon.vercel.app/](https://flight-booking-system-client-lemon.vercel.app/)
- **Backend (Vercel):** [https://flight-booking-system-server-delta.vercel.app/](https://flight-booking-system-server-delta.vercel.app/)

---

## 👤 Test Admin Credentials

To access the **Admin Dashboard**, log in with:

- **Email:** `admin@gmail.com`
- **Password:** `123456`

> You must use this account to test admin-specific routes like flight management and booking approvals.

---

## 📦 Tech Stack

**Frontend**

- React + Vite + TypeScript.
- Tailwind CSS + HeadlessUi + DaisyUI.
- Redux Toolkit + RTK Query.
- React Hook Form.
- imgBB API for image uploads.

**Backend**

- Node.js + Express.
- MongoDB + Mongoose.
- JWT Authentication.
- Bcrypt for password hashing.
- Nodemailer for email notifications.

---

## 🔧 Features

### User

- Register / Login / Logout with hashed passwords.
- JWT-based authentication (access & refresh token).
- Search and filter flights.
- Book available flights.
- Cancel booking within 2 hours.
- View booking history.

### Admin

- Add / Update / Delete flights.
- View all bookings.
- Approve or cancel bookings
- Send confirmation emails

---

## 🗂️ Project Structure

    flight-booking-system/
    ├── client/ # Frontend (React + Vite)
    ├── server/ # Backend (Express + MongoDB)
    ├── README.md

---

## 🧪 Environment Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/JiJetu/Flight-Booking-System.git
cd flight-booking-system
```

### Step 2: Setup Frontend

```bash
cd client
cp .env.local
npm install
npm run dev
```

### Step 3: Setup Backend

```bash
cd ../server
cp .env
npm install
npm run dev
```

    💡 Make sure MongoDB is running and the .env contains valid values

---

### Environment Variables

#### Frontend (client/.env.local)

| Key                | Description          |
| ------------------ | -------------------- |
| VITE_API_URL       | Backend API endpoint |
| VITE_IMGBB_API_KEY | Your imgBB API key   |

#### Backend (server/.env)

| Key                    | Description                  |
| ---------------------- | ---------------------------- |
| DB_URI                 | MongoDB connection URI       |
| BCRYPT_SALT_ROUNDS     | Bcrypt salt rounds           |
| JWT_ACCESS_SECRET      | Access token secret          |
| JWT_REFRESH_SECRET     | Refresh token secret         |
| JWT_ACCESS_EXPIRES_IN  | e.g., 10d                    |
| JWT_REFRESH_EXPIRES_IN | e.g., 365d                   |
| TRANSPORTER_EMAIL      | Gmail address for nodemailer |
| TRANSPORTER_PASSWORD   | Gmail app password           |

---

## 📦 API Endpoints

### 🔐 Auth

- `POST /api/register` — Register a new user
- `POST /api/login` — Log in and receive access & refresh tokens
- `POST /api/logout` — Logout and clear refresh token
- `POST /api/refresh-token` — Get new access token using refresh token

---

### ✈️ Flights

- `GET /api/flights` — Get all flights (with pagination)
- `GET /api/flights/search` — Search flights with filters (origin, destination, price, etc.)
- `GET /api/flights/:id` — Get a single flight by ID
- `POST /api/flights` — Add new flight _(Admin only)_
- `PUT /api/flights/:id` — Update flight _(Admin only)_
- `DELETE /api/flights/:id` — Delete flight _(Admin only)_

---

### 📑 Bookings

- `GET /api/bookings` — Get all bookings _(Admin only)_
- `GET /api/bookings/user/:id` — Get bookings for a specific user
- `POST /api/bookings` — Book a flight
- `PUT /api/bookings/:id` — Update a booking (admin approval or user cancel within 2 hours)
- `DELETE /api/bookings/:id` — Delete booking _(Admin only)_

## 🚀 Application Overview

The Flight Booking System is a full-stack application that allows users to search, view, and book flights with a modern UI and powerful filtering options.

### 🏠 Home Page Functionality

- The **Home Page** displays a hero/banner section that includes a **search form**.
- This form collects three fields:
  - **Origin**
  - **Destination**
  - **Date**
- On form submission, the input values are serialized using [`query-string`](https://www.npmjs.com/package/query-string) and passed as URL query parameters to the `/all-flights` route.

```ts
// Example: using queryString
const query = {
  origin: "Dhaka, Bangladesh",
  destination: "Bangkok, Thailand",
  date: "2025-07-07",
};

const queryUrl = queryString.stringify(query);
navigate(`/all-flights?${queryUrl}`);
```

- The All Flights page then uses those query parameters to fetch available flights from the backend API:

```bash
GET /api/flights/search?origin=...&destination=...&date=...
```

### ✈️ Flights Page Functionality

The **Flights Page** (`/all-flights`) is a dynamic and filterable listing page that displays all available flights fetched from the backend.

#### 🔎 Search & Filters

- Flights are initially fetched using the default endpoint:

```ts
GET /api/flights?page=1&limit=6

- If there are query parameters in the URL (e.g., from the homepage search), it uses:
```

```ts
GET /api/flights/search?origin=...&destination=...&date=...&page=1&limit=6


- Users can apply additional filters using the filter bar:
- Origin
- Destination
- Date
- Minimum & Maximum Price
- Minimum Available Seats

- These filters are managed via React Hook Form and sent to the backend using lazy queries powered by RTK Query.
```

#### 📄 Pagination

- Pagination is calculated using a helper function:

```ts
const pages = calculatePagination(total, itemsPerPage);
```

### 🧑‍💼 Dashboard Page Functionality

The **Dashboard Page** provides a role-based interface for both regular users and admin users after login.

---

#### 👤 User Dashboard

Accessible by users with the role `user`.

##### 📋 My Bookings

- Route: `/dashboard/my-bookings`
- Shows a paginated list of all flight bookings made by the logged-in user.
- Each row includes:
  - Flight info (airline, flight number)
  - Number of booked seats
  - Total price
  - Current status: `Pending`, `Confirm`, or `Cancel`
  - Cancel button (only available if status is `Pending` and within 2 hours)

---

#### 🛠️ Admin Dashboard

Accessible by users with the role `admin`.

##### ✈️ Manage Flights

- Route: `/dashboard/add-flight`
- Admin can:
  - Create a flight via react-hook-form and image hosting server ImgBB.
- Route: `/dashboard/manage-flights`
- Admin can:
  - View all flights with pagination
  - Update existing flights
  - Delete flights

##### 📑 Manage Bookings

- Route: `/dashboard/manage-bookings`
- Admin can:
  - View all bookings with user and flight details (using `populate`)
  - Confirm or Cancel bookings
  - Delete bookings
  - Automatically restores seats if booking is cancelled

---

#### 🔐 Role-Based Access

- Admin and user routes are protected via backend token middleware and frontend route guards.
- Role info is extracted from the decoded JWT token and managed globally with Redux Toolkit.

---

## ✅ To Do / Future Improvements

- Payment integration (e.g., SSLCOMMERZ).

- Admin dashboard analytics.

- Profile update facture (e.g, name, photo, email, password)

- Update role and delete user _(Admin only)_

---

## 🧑‍💻 Author

Md Jaoadul Islam
GitHub: @[Jijetu](https://github.com/JiJetu)
